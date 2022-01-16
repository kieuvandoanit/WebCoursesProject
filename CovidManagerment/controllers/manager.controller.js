const { query } = require('express');
const { getAllRefPatient } = require('../model/manager.model');
const managerModel = require('../model/manager.model')

module.exports = {
    homepage: async(req, res, next) => {
        let patient = await managerModel.getAllPatient();
        res.render("manager/getAllPatient", {
            title: "1712389_NguyenQuangDuy",
            patient: patient,

            layout: "manager"
        })
    },
    findPatient:async(req,res,next)=>{
        // res.send('Hello')
        let patient = await managerModel.getPatient(req.body.patientName);
        res.render("manager/getAllPatient", {
            title: "1712389_NguyenQuangDuy",
            patient: patient,

            layout: "manager"
        })
    },
    updatePatientStatus:async(req,res,next)=>{
        let userId = req.params.id;
        let patientIdStatus = req.body.status;
        let patientId = await managerModel.getPatientID(userId);
        let status = await managerModel.updatePatientStatus(patientId[0].PatientID,patientIdStatus);
        let userInfo = await managerModel.getOneUser(userId);
        let userRef = await managerModel.getUserRef(patientId[0].PatientID);
        
        let listFirst = await managerModel.listRefPatientID(patientId[0].PatientID);
        
        //Lấy Danh sách những bệnh nhân có liên quan
        let listSecond = [], listThird = [];
        let a = 0;
        for(i = 0; i < listFirst.length; i++){
            a = await managerModel.listRefPatientID(listFirst[i].PatientID)
            for(j=0; j< a.length;j++){
                listSecond.push(a[j])
            }
        }
        let b = 0;
        for(i = 0; i < listSecond.length; i++){
            b = await managerModel.listRefPatientID(listSecond[i].PatientID)
            
            for(j=0; j< b.length;j++){
                listThird.push(b[j])
            }
        }

        //Update Trạng thái những bệnh nhân có liên quan
        if(patientIdStatus === 'F0')
        {   
            if(listFirst.length != 0)
            {
                for(i=0; i<listFirst.length;i++)
                {
                    await managerModel.updatePatientStatus(listFirst[i].PatientID,'F1');
                }
            }
            if(listSecond.length != 0){
                for(j=0; j<listFirst.length;j++)
                {
                    await managerModel.updatePatientStatus(listSecond[j].PatientID,'F2');
                }
            }

            if(listThird.length != 0){
                for(k=0; k<listSecond.length;k++)
                {
                    await managerModel.updatePatientStatus(listThird[k].PatientID,'F3');
                }
            }
        }
        if(patientIdStatus === 'F1')
        {   if(listFirst.length != 0){
                for(i=0; i<listFirst.length;i++)
                {
                    await managerModel.updatePatientStatus(listFirst[i].PatientID,'F2');
                }
            }
            if(listSecond.length != 0){
                for(j=0; j<listFirst.length;j++)
                {
                    await managerModel.updatePatientStatus(listSecond[j].PatientID,'F3');
                }
            }
            if(listThird.length != 0){
                for(k=0; k<listSecond.length;k++)
                {
                    await managerModel.updatePatientStatus(listThird[k].PatientID,'F4');
                }
            }
        }

        if(patientIdStatus === 'F2')
        {   if(listFirst.length != 0){
                for(i=0; i<listFirst.length;i++)
                {
                    await managerModel.updatePatientStatus(listFirst[i].PatientID,'F3');
                }
            }
            if(listSecond.length != 0){
                for(j=0; j<listFirst.length;j++)
                {
                    await managerModel.updatePatientStatus(listSecond[j].PatientID,'F4');
                }
            }
            if(listThird.length != 0){
                for(k=0; k<listSecond.length;k++)
                {
                    await managerModel.updatePatientStatus(listThird[k].PatientID,'F5');
                }
            }
        }
        
        if(userRef !== 0 || userInfo !== 0){
            res.render("manager/detailRefPatient",{
                userInfo: userInfo,
                userID: userId,
                userRef: userRef,
                layout: "manager",
                
            })
        } else {
            res.send("Không có thông tin")
        }
    },
    createAcount: async(req, res, next) => {
        res.render("manager/createAccount", {
            layout: "manager"
        })
    },
    addAcountHandle: async(req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;
        let result = await adminModel.createAccount(username, password);

        if (result.rowCount >= 1) {
            res.redirect("/manager");
        } else {
            res.redirect("/manager/createAcount");
        }
    },
    viewDetailPatient: async(req, res, next) => {
        let userId = req.params.id;
        let patientId = await managerModel.getPatientID(userId);
        let userInfo = await managerModel.getOneUser(userId);
        let userRef = await managerModel.getUserRef(patientId[0].PatientID);
        if(userRef !== 0 || userInfo !== 0){
            res.render("manager/detailRefPatient",{
                userInfo: userInfo,
                userID: userId,
                userRef: userRef,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin")
        }
    },
    updateStatusHandle: async(req, res, next) => {
        let userID = req.params.id;
        let status = req.body.status;

        let result = await managerModel.updateStatusUser(userID, status);
        if(result.rowCount === 1){

            res.redirect('/manager')
        } else {
            res.redirect('/manager/viewHistoryAction/' + userID);
        }
    },
    listHopital: async(req, res, next) => {
        let listHopital = await adminModel.getListHopital();
        if (listHopital !== 0) {
            res.render("admin/listHopital", {
                listHopital: listHopital,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    addPatient: async(req, res, next) => {
        res.render("manager/addPatient", {
            layout: "manager"
        })
    },
    updateHopital: async(req, res, next) => {
        let hopitalID = req.params.id;
        let info = await adminModel.getHopitalInfo(hopitalID);
        if (info !== 0) {
            res.render("admin/updateHopital", {
                info: info[0],
                layout: "admin"
            })
        } else {
            res.send("Không tìm thấy thông tin");
        }

    },
    updateHopitalHandle: async(req, res, next) => {
        let hopitalName = req.body.hopitalName;
        let currentQuantity = req.body.currentQuantity;
        let capacity = req.body.capacity;
        let province = req.body.province;
        let district = req.body.district;
        let ward = req.body.ward;
        let hopitalID = req.params.id;

        let result = await adminModel.updateHopital(hopitalID, hopitalName, currentQuantity, capacity, province, district, ward);
        // res.send(result)
        if (result !== 0) {
            res.redirect("/admin/listHopital")
        } else {
            res.redirect("/admin/updateHopital/" + hopitalID);
        }
    },
    addPatientHandle: async(req, res, next) => {

        let PatientName = req.body.PatientName;
        let DOB = req.body.DOB;
        let province = req.body.province;
        let District = req.body.District;
        let ward = req.body.ward;
        let identityCard = req.body.identityCard;
        let patient_ref = req.body.patient_ref;
        let hospitalID = req.body.hospitalID;
        let Status = req.body.Status;
        let userID = req.body.userID;
        let userName = req.body.username;
        // if(patient_ref==-1){
        //     alert('hello')
        //     patient_ref=-1
        // }
        let result = await managerModel.addPatient(PatientName, DOB, province, ward, District, Status, userID, hospitalID, patient_ref, identityCard, userName);
        if (result !== 0) {
            res.redirect("/manager")
        } else {
            res.redirect("/manager/addPatient");
        }
    },
    getProduct: async(req, res, next) => {
        let lisProduct = await managerModel.getAllProduct();
        if (lisProduct !== 0) {
            res.render("manager/getProduct", {
                Product: lisProduct,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    getPackage: async(req, res, next) => {
        let Package = await managerModel.getAllPackage();
        if (Package !== 0) {
            res.render("manager/getPackage", {
                Package: Package,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    DeleteProduct: async(req, res, next) => {
        let ProductID = req.params.id;
        let result = await managerModel.DeleteProduct(ProductID);
        if (result.rowCount === 1) {
            res.redirect('/manager/getProduct')
        } else {
            res.send("Lỗi");
        }
    },
    DeletePackage: async(req, res, next) => {
        let PackageID = req.params.id;
        let result = await managerModel.DeletePackage(PackageID);
        if (result.rowCount === 1) {
            res.redirect('/manager/getPackage')
        } else {
            res.send("Lỗi");
        }
    }
}