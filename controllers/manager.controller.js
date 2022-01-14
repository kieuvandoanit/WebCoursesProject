const { query } = require('express');
const managerModel = require('../model/manager.model')

module.exports ={
    homepage: async(req, res, next) =>{
        let patient = await managerModel.getAllPatient();
        res.render("manager/getAllPatient",{
            title:"1712389_NguyenQuangDuy",
            patient: patient,
            
            layout: "manager"
        })
    },
    createAcount: async(req, res, next) =>{
        res.render("manager/createAccount",{
            layout: "manager"
        })
    },
    addAcountHandle: async(req, res, next) =>{
        let username = req.body.username;
        let password = req.body.password;
        let result = await adminModel.createAccount(username, password);

        if(result.rowCount >= 1){
            res.redirect("/manager");
        }else{
            res.redirect("/manager/createAcount");
        }
    },
    viewHistoryAction: async(req, res, next) =>{
        let userId = req.params.id;
        let activeTime = await managerModel.getHistoryActive(userId);
        let userInfo = await managerModel.getOneUser(userId);
        if(activeTime !== 0 && userInfo !== 0){
            res.render("manager/historyAction",{
                userInfo: userInfo,
                userID: userId,
                activeTime: activeTime,
                layout: "manager"
            })
        }else{
            res.send("Không có thông tin")
        } 
    },
    updateStatusHandle: async(req, res, next) =>{
        let userID = req.params.id;
        let status = req.body.status;

        let result = await managerModel.updateStatusUser(userID, status);
        if(result.rowCount === 1){
            res.redirect('/manager')
        }else{
            res.redirect('/manager/viewHistoryAction/'+userID);
        }
    },
    listHopital: async(req, res, next) =>{
        let listHopital = await adminModel.getListHopital();
        if(listHopital !== 0){
            res.render("admin/listHopital",{
                listHopital: listHopital,
                layout: "manager"
            }) 
        }else{
            res.send("Không có thông tin");
        }
    },
    addPatient: async(req, res, next) =>{
        res.render("manager/addPatient",{
            layout: "manager"
        })
    },
    updateHopital: async(req, res, next) =>{
        let hopitalID = req.params.id;
        let info = await adminModel.getHopitalInfo(hopitalID);
        if(info !== 0){
            res.render("admin/updateHopital",{
                info: info[0],
                layout: "admin"
            })
        }else{
            res.send("Không tìm thấy thông tin");
        }
        
    },
    updateHopitalHandle: async(req, res, next) =>{
        let hopitalName = req.body.hopitalName;
        let currentQuantity = req.body.currentQuantity;
        let capacity = req.body.capacity;
        let province = req.body.province;
        let district = req.body.district;
        let ward = req.body.ward;
        let hopitalID = req.params.id;
        
        let result = await adminModel.updateHopital(hopitalID,hopitalName, currentQuantity, capacity, province, district, ward);
        // res.send(result)
        if(result !== 0){
            res.redirect("/admin/listHopital")
        }else{
            res.redirect("/admin/updateHopital/"+hopitalID);
        }
    },
    addPatientHandle: async(req, res, next) =>{
        
        let PatientName = req.body.PatientName;
        let DOB = req.body.DOB;
        let province = req.body.province;
        let District = req.body.District;
        let ward = req.body.ward;
        let identityCard = req.body.identityCard;
        let patient_ref = req.body.patient_ref;z
        let hospitalID =req.body.hospitalID;
        let Status = req.body.Status;
        let userID = req.body.userID;
        // if(patient_ref==-1){
        //     alert('hello')
        //     patient_ref=-1
        // }
        let result = await managerModel.addPatient(PatientName, DOB, province, ward, District,Status,userID,hospitalID,patient_ref,identityCard);
        if(result !== 0){
            res.redirect("/manager")
        }else{
            res.redirect("/manager/addPatient");
        }
    }

}