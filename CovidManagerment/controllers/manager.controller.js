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
        let hospitalID = await managerModel.getHopital(patientId[0].PatientID);
        //Ngày hiện tại
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        let timenow = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;

        //Them lich sư thay doi trạng thái
        await managerModel.addStatusHistoryPatient(patientIdStatus,patientId[0].PatientID,hospitalID[0].hospitalID,timenow,timenow);

        //console.log(hospitalID[0].hospitalID);

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
        console.log(listFirst)
        console.log(listSecond)
        console.log(listThird)
        //Update Trạng thái những bệnh nhân có liên quan
        if(patientIdStatus === 'F0')
        {   
            if(listFirst.length != 0)
            {
                for(i=0; i<listFirst.length;i++)
                {   
                    let hospitalID = await managerModel.getHopital(listFirst[i].PatientID);
                    await managerModel.updatePatientStatus(listFirst[i].PatientID,'F1');
                    await managerModel.addStatusHistoryPatient('F1',listFirst[i].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
            if(listSecond.length != 0){
                for(j=0; j<listFirst.length;j++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[j].PatientID);
                    await managerModel.updatePatientStatus(listSecond[j].PatientID,'F2');
                    await managerModel.addStatusHistoryPatient('F2',listFirst[j].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }

            if(listThird.length != 0){
                for(k=0; k<listSecond.length;k++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[k].PatientID);
                    await managerModel.updatePatientStatus(listThird[k].PatientID,'F3');
                    await managerModel.addStatusHistoryPatient('F3',listFirst[k].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
        }

        if(patientIdStatus === 'F1')
        {   if(listFirst.length != 0){
                for(i=0; i<listFirst.length;i++)
                {   
                    let hospitalID = await managerModel.getHopital(listFirst[i].PatientID);
                    await managerModel.updatePatientStatus(listFirst[i].PatientID,'F2');
                    await managerModel.addStatusHistoryPatient('F2',listFirst[i].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
            if(listSecond.length != 0){
                for(j=0; j<listFirst.length;j++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[j].PatientID);
                    await managerModel.updatePatientStatus(listSecond[j].PatientID,'F3');
                    await managerModel.addStatusHistoryPatient('F3',listFirst[j].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
            if(listThird.length != 0){
                for(k=0; k<listSecond.length;k++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[k].PatientID);
                    await managerModel.updatePatientStatus(listThird[k].PatientID,'F4');
                    await managerModel.addStatusHistoryPatient('F4',listFirst[k].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
        }

        if(patientIdStatus === 'F2')
        {   if(listFirst.length != 0){
                for(i=0; i<listFirst.length;i++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[i].PatientID);
                    await managerModel.updatePatientStatus(listFirst[i].PatientID,'F3');
                    await managerModel.addStatusHistoryPatient('F3',listFirst[i].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
            if(listSecond.length != 0){
                for(j=0; j<listFirst.length;j++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[j].PatientID);
                    await managerModel.updatePatientStatus(listSecond[j].PatientID,'F4');
                    await managerModel.addStatusHistoryPatient('F4',listFirst[j].PatientID, hospitalID[0].hospitalID,timenow,timenow);
                }
            }
            if(listThird.length != 0){
                for(k=0; k<listSecond.length;k++)
                {
                    let hospitalID = await managerModel.getHopital(listFirst[k].PatientID);
                    await managerModel.updatePatientStatus(listThird[k].PatientID,'F5');
                    await managerModel.addStatusHistoryPatient('F5',listFirst[k].PatientID, hospitalID[0].hospitalID,timenow,timenow);
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
    peopleEachState: async(req, res, next)=>{
        let numberOfPerState = await managerModel.getNumberPerState();
        let F0 = numberOfPerState[0].count;
        let F1 = numberOfPerState[1].count;
        let F2 = numberOfPerState[2].count;
        let F3 = numberOfPerState[3].count;
        let F4 = numberOfPerState[4].count;
        let sum = 0;
        sum = sum + parseInt(F0) + parseInt(F1) + parseInt(F2) + parseInt(F3) + parseInt(F4)
        //console.log(numberOfF0);
        if (numberOfPerState !== 0) {
            res.render("manager/peopleEachState", {
                F0: F0,
                F1: F1,
                F2: F2,
                F3: F3,
                F4: F4,
                sum:sum,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
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