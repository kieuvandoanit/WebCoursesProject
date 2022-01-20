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
        //lay han muc thanh toan 
        let limit = await paymentInfoModel.getLimit();
        res.render("manager/paymentInfo",{
            layout: 'manager',
            listUser: listUser,
            limit: limit.value
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
        // res.send(req.session.cartInfo)
        let totalOrder = 0;

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        let timenow = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;

        let cartInfo = req.session.cartInfo;

        for(let j = 0; j < req.session.cartInfo.length; j++){
            for(let i = 0; i < req.session.cartInfo[j].product.length; i++){
                totalOrder = totalOrder + req.session.cartInfo[j].product[i].price * req.session.cartInfo[j].product[i].quantity; 
            }
        }
        
        // res.send({totalOrder})
        res.render('user/payment',{
            layout: 'user',
            totalOrder: totalOrder,
            dateOrder: timenow,
            cartInfo : cartInfo
        })
    },
    addOrder: async(req, res, next) => {
        let totalOrder = 0;

        let paymentForTemp = "";

        let cartInfo = req.session.cartInfo;

        for(let j = 0; j < req.session.cartInfo.length; j++){
            for(let i = 0; i < req.session.cartInfo[j].product.length; i++){
                totalOrder = totalOrder + req.session.cartInfo[j].product[i].price * req.session.cartInfo[j].product[i].quantity; 
            }
            paymentForTemp = paymentForTemp +', '+ cartInfo[j].packageName
        }
        
        let paymentFor= "Thanh toán cho gói " + paymentForTemp;
        //get limit

        let limitPayment = await paymentInfoModel.getLimit();
        let limit = limitPayment.value;


        let token = req.session.userPayment.token.accessToken;


        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        let orderDate = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;


        //kiem tra tk co du de thanh toan khong
        let checkPayment = await axios.post('http://localhost:3001/api/payment',{
                totalPrice: totalOrder,
                paymentFor: paymentFor,
                limit: limit
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // res.send(checkPayment.data)
        if(checkPayment.data.result === 1){
            let statusPayment = "Đã thanh toán";
            
            //lay patientID
            let userID = req.session.user.userID;
            let patient = await paymentInfoModel.getPatient(userID);
            let patientID = patient.PatientID;
            //add order

            let addOrder = await paymentInfoModel.addOrder(patientID, totalOrder, orderDate, statusPayment);
            if(addOrder === 1){
                //get orderID moi them
                let order = await paymentInfoModel.getOrder(patientID, totalOrder, orderDate, statusPayment);
                let orderID = order.orderID;
                //add orderPackage
                for(let j = 0; j < req.session.cartInfo.length; j++){
                    let packageID = req.session.cartInfo[j].packageID;
                    let quantity = req.session.cartInfo[j].quantity;
                    let addOrderDetail = await paymentInfoModel.addOrderDetail(orderID, packageID, quantity);

                    for(let i = 0; i < req.session.cartInfo[j].product.length; i++){
                        //get order detail id
                        let orderDetail = await paymentInfoModel.getOrderDetail(orderID, packageID, quantity);
                        if(orderDetail != 0){
                            let orderDetailID = orderDetail.OrdersDetailID;
                            // add productDetail
                            let productID = req.session.cartInfo[j].product[i].ProductID;
                            let quantity = req.session.cartInfo[j].product[i].quantity;
                            let price = req.session.cartInfo[j].product[i].price;
                            let unit = req.session.cartInfo[j].product[i].unit;
                            let addOrderPackageDetail = await paymentInfoModel.addOrderPackageDetail(orderDetailID, productID, quantity, price, unit);
                        }
                    }
                }
                res.redirect(`/user/userInfo?userID=${req.session.user.userID}&info=kitHistory`)    
            }
        }else if(checkPayment.data.result === -1){
            // Tai khoan khong du de thuc hien giao dich. Vui long nap tien
            
            // Chuyen den man hinh nap tien
            res.redirect('/user/addMoney');

        }else{
            // Qua trinh thanh toan bi loi. Vui long thuc hien lai
            res.redirect('/user/payment');

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