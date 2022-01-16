const paymentInfoModel = require('../model/paymentInfo.model');

module.exports = {
    homepage: async(req, res, next) => {

        res.render("manager/paymentInfo",{
            layout: 'manager'
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

    }
}