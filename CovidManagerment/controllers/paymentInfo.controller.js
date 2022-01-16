const paymentInfoModel = require('../model/paymentInfo.model');
const axios = require('axios');
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
        let result = await paymentInfoModel.addNotification(userID, username);
        res.redirect('/manager/payment');
    }
}