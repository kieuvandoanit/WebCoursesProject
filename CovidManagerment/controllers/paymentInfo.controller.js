const paymentInfoModel = require('../model/paymentInfo.model');
const axios = require('axios');
const https = require('https');
const jwt = require('jsonwebtoken')
module.exports = {
    homepage: async(req, res, next) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInVzZXJuYW1lIjoidXNlcjEiLCJwZXJtaXNzaW9uIjoyLCJhY2NvdW50QmFsYW5jZSI6MTAwMDAwLCJhY2NvdW50TnVtYmVyIjoiMjIyMjIiLCJpYXQiOjE2NDIxMzAxNTB9.dfjITFQRjoEuPa4sN243veCeRaXlrW9-eHGzMw4eyi0';
        //get list user debt
        let listUsers = await axios.get('http://localhost:3001/api/getDebt',
            { headers: { Authorization: `Bearer ${token}` } }
        );
        let infoArray = await paymentInfoModel.getAll();
        let listUser = listUsers.data;
        // let arrayResult = [];
        for(let i = 0; i< listUser.length; i++){
            for(let j = 0; j < infoArray.length; j++){
                if(listUser[i].userName === infoArray[j].userName){
                    listUser[i].status = "Đã báo";
                }
            }
        }
        res.render("manager/paymentInfo",{
            layout: 'manager',
            listUser: listUser
        })
    },
    changeLimit: async(req, res, next) => {
        res.render("manager/changeLimit",{
            layout:'manager'
        })
    },
    changeLimitHandle: async(req, res, next) => {
        // res.send(req.body.limit)
        let limit = req.body.limit;
        let result = await paymentInfoModel.updateLimit(limit);
        if(result !== 0){
            res.redirect('/manager/payment');
        }else{
            res.render("manager/changeLimit",{
                layout:'manager',
                error: "Thay đổi hạn mức thanh toán thất bại. Vui lòng thực hiện lại"
            })
        }

    },
    notification: async(req, res, next) => {
        let username = req.params.username;
        // get userID 
        let user = await paymentInfoModel.getUserByUsername(username);
        let userID = user.userID;
        //add thong bao
        await paymentInfoModel.addNotification(userID, username);
        res.redirect('/manager/payment');
    },
    login: async(req, res, next)=>{
        res.render("user/loginPayment",{
            layout: 'user'
        })
    },
    loginHandle: async(req, res, next)=>{
        // res.send(req.body)
        let temp = await axios.post('http://localhost:3001/api/login',{
            username: req.body.username,
            password: req.body.password
        });
        let token = temp.data;
        if(token.error === 1){
            res.render('user/loginPayment',{
                layout:'user',
                error: 'Thông tin tài khoản mật khẩu không chính xác!'
            });
        }else{
            // req.session.token = token;
            const decoded = jwt.verify(token.accessToken, 'mysecret');
            
            userPayment = {
                token: token,
                userID : decoded.userID,
                username : decoded.username,
                permission : decoded.permission,
                accountBalance : decoded.accountBalance,
                accountNumber : decoded.accountNumber
            }
            req.session.userPayment = userPayment;
            res.redirect('/user/payment');
        }
    },
    userPayment: async(req, res, next) => {
        res.render('user/payment',{
            layout: 'user',
        })
    },
    addOrder: async(req, res, next) => {
        let totalPrice = 50000;
        let paymentFor= "Noi dung thanh toan";
        let limit = 100000;


        let token = req.session.userPayment.token;


        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        let orderDate = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;


        let order = [
            {
                packageID: 123,
                quantity: 1,
                product:[
                    {
                        productID: 1,
                        quantity: 1,
                        price: 1000,
                        unit: 'KG'
                    },
                    {
                        productID: 2,
                        quantity: 1,
                        price: 1400,
                        unit: 'KG'
                    }
                ]
            },
            {
                packageID: 1232,
                quantity: 1,
                product:[
                    {
                        productID: 3,
                        quantity: 1,
                        price: 1000,
                        unit: 'KG'
                    },
                    {
                        productID: 4,
                        quantity: 1,
                        price: 1400,
                        unit: 'KG'
                    }
                ]
            }
        ]
        //kiem tra tk co du de thanh toan khong
        let checkPayment = axios.post('http://localhost:3001/api/payment',{
                totalPrice: totalPrice,
                paymentFor: paymentFor,
                limit: limit
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if(checkPayment.data.result === 1){
            let statusPayment = "Đã thanh toán";
            //add order
            let addOrder = await paymentInfoModel.addOrder(patientID, totalPrice, orderDate, statusPayment);
            if(addOrder.rowCount === 1){
                //get orderID moi them

                //add orderPackage
                let addOrderDetail = await paymentInfoModel.addOrderDetail(orderID, packageID, quantity);
                if(addOrderDetail.rowCount === 1){
                    //get order detail id

                    // add productDetail
                    let addOrderPackageDetail = await paymentInfoModel.addOrderPackageDetail(orderDetailID, productID, quantity, price, unit);
                    
                }
            }
            

            


        }else if(checkPayment.data.result === -1){
            // Tai khoan khong du de thuc hien giao dich. Vui long nap tien
            // Chuyen den man hinh nap tien

        }else{
            // Qua trinh thanh toan bi loi. Vui long thuc hien lai


        }
        

        
    },

    userCart: async (req, res, next) => {
        res.send(req.session.cartInfo)
    },

    test: async (req, res, next) => {
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        let test = await axios.get('https://localhost:3443/', { httpsAgent: agent });
        res.send(test.data)
    }
}