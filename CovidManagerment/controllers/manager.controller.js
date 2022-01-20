const { query } = require('express');
const { getAllRefPatient } = require('../model/manager.model');
const managerModel = require('../model/manager.model');
const axios = require('axios');
const https = require('https');

module.exports = {
    homepage: async(req, res, next) => {
        let patient = await managerModel.getAllPatient();
        res.render("manager/getAllPatient", {

            patient: patient,

            layout: "manager"
        })
    },
    findPatient: async(req, res, next) => {
        // res.send('Hello')
        let patient = await managerModel.getPatient(req.body.patientName);
        res.render("manager/getAllPatient", {
            patient: patient,

            layout: "manager"
        })
    },
    updatePatientStatus: async(req, res, next) => {
        let userId = req.params.id;
        let patientIdStatus = req.body.status;
        let patientId = await managerModel.getPatientID(userId);
        let status = await managerModel.updatePatientStatus(patientId[0].PatientID, patientIdStatus);
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
        let dayEnd = day + 1;
        let timeend = `${year}-${month}-${dayEnd} ${hour}:${minutes}:${second}`;

        //Them lich sư thay doi trạng thái
        await managerModel.addStatusHistoryPatient(patientIdStatus, patientId[0].PatientID, hospitalID[0].hospitalID, timenow, timeend);

        //console.log(hospitalID[0].hospitalID);

        let listFirst = await managerModel.listRefPatientID(patientId[0].PatientID);

        //Lấy Danh sách những bệnh nhân có liên quan
        let listSecond = [],
            listThird = [];
        let a = 0;
        for (i = 0; i < listFirst.length; i++) {
            a = await managerModel.listRefPatientID(listFirst[i].PatientID)
            for (j = 0; j < a.length; j++) {
                listSecond.push(a[j])
            }
        }
        let b = 0;
        for (i = 0; i < listSecond.length; i++) {
            b = await managerModel.listRefPatientID(listSecond[i].PatientID)

            for (j = 0; j < b.length; j++) {
                listThird.push(b[j])
            }
        }
        // console.log(listFirst)
        // console.log(listSecond)
        // console.log(listThird)

        //Update Trạng thái những bệnh nhân có liên quan

        if (patientIdStatus === 'F0') {
            if (listFirst.length != 0) {
                for (i = 0; i < listFirst.length; i++) {
                    let hospitalID = await managerModel.getHopital(listFirst[i].PatientID);
                    await managerModel.updatePatientStatus(listFirst[i].PatientID, 'F1');
                    await managerModel.addStatusHistoryPatient('F1', listFirst[i].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
            if (listSecond.length != 0) {
                for (j = 0; j < listFirst.length; j++) {
                    let hospitalID = await managerModel.getHopital(listFirst[j].PatientID);
                    await managerModel.updatePatientStatus(listSecond[j].PatientID, 'F2');
                    await managerModel.addStatusHistoryPatient('F2', listFirst[j].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }

            if (listThird.length != 0) {
                for (k = 0; k < listSecond.length; k++) {
                    let hospitalID = await managerModel.getHopital(listFirst[k].PatientID);
                    await managerModel.updatePatientStatus(listThird[k].PatientID, 'F3');
                    await managerModel.addStatusHistoryPatient('F3', listFirst[k].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
        }

        if (patientIdStatus === 'F1') {
            if (listFirst.length != 0) {
                for (i = 0; i < listFirst.length; i++) {
                    let hospitalID = await managerModel.getHopital(listFirst[i].PatientID);
                    await managerModel.updatePatientStatus(listFirst[i].PatientID, 'F2');
                    await managerModel.addStatusHistoryPatient('F2', listFirst[i].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
            if (listSecond.length != 0) {
                for (j = 0; j < listFirst.length; j++) {
                    let hospitalID = await managerModel.getHopital(listFirst[j].PatientID);
                    await managerModel.updatePatientStatus(listSecond[j].PatientID, 'F3');
                    await managerModel.addStatusHistoryPatient('F3', listFirst[j].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
            if (listThird.length != 0) {
                for (k = 0; k < listSecond.length; k++) {
                    let hospitalID = await managerModel.getHopital(listFirst[k].PatientID);
                    await managerModel.updatePatientStatus(listThird[k].PatientID, 'F4');
                    await managerModel.addStatusHistoryPatient('F4', listFirst[k].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
        }

        if (patientIdStatus === 'F2') {
            if (listFirst.length != 0) {
                for (i = 0; i < listFirst.length; i++) {
                    let hospitalID = await managerModel.getHopital(listFirst[i].PatientID);
                    await managerModel.updatePatientStatus(listFirst[i].PatientID, 'F3');
                    await managerModel.addStatusHistoryPatient('F3', listFirst[i].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
            if (listSecond.length != 0) {
                for (j = 0; j < listFirst.length; j++) {
                    let hospitalID = await managerModel.getHopital(listFirst[j].PatientID);
                    await managerModel.updatePatientStatus(listSecond[j].PatientID, 'F4');
                    await managerModel.addStatusHistoryPatient('F4', listFirst[j].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
            if (listThird.length != 0) {
                for (k = 0; k < listSecond.length; k++) {
                    let hospitalID = await managerModel.getHopital(listFirst[k].PatientID);
                    await managerModel.updatePatientStatus(listThird[k].PatientID, 'F5');
                    await managerModel.addStatusHistoryPatient('F5', listFirst[k].PatientID, hospitalID[0].hospitalID, timenow, timeend);
                }
            }
        }

        if (userRef !== 0 || userInfo !== 0) {
            // res.render("manager/detailRefPatient", {
            //     userInfo: userInfo,
            //     userID: userId,
            //     userRef: userRef,
            //     layout: "manager",

            // })
            res.redirect('/manager');
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
        if (userRef !== 0 || userInfo !== 0) {
            res.render("manager/detailRefPatient", {
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
        if (result.rowCount === 1) {

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
        //add user
        let userName = req.body.username;
        let password = '123456';
        let addUser = await managerModel.addUser(userName, password)
        //add user ben he thong thanh toan
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        let addUserPayment = await axios.post('https://localhost:3443/api/createAccount',{
            username: userName,
            password: password
        },{
            httpsAgent: agent
        });
        //add patient
        let user = await managerModel.getUser(userName, password);
        let userID = user.userID;
        let PatientName = req.body.PatientName;
        let DOB = req.body.DOB;
        let province = req.body.province;
        let District = req.body.District;
        let ward = req.body.ward;
        let identityCard = req.body.identityCard;
        let patient_ref = req.body.patient_ref;
        let hospitalID = req.body.hospitalID;
        let Status = req.body.Status;
        
        // let userName = req.body.username;
        let result = await managerModel.addPatient(PatientName, DOB, province, ward, District, Status, userID, hospitalID, patient_ref, identityCard, userName);
        if (result !== 0) {
            res.redirect("/manager")
        } else {
            res.redirect("/manager/addPatient");
        }
    },
    peopleEachState: async(req, res, next) => {
        let numberOfPerState = await managerModel.getNumberPerState();
        let F0 = numberOfPerState[0].count;
        let F1 = numberOfPerState[1].count;
        let F2 = numberOfPerState[2].count;
        let F3 = numberOfPerState[3].count;
        let F4 = numberOfPerState[4].count;
        let Fine = numberOfPerState[5].count;
        let sum = 0;

        sum = sum + parseInt(F0) + parseInt(F1) + parseInt(F2) + parseInt(F3) + parseInt(F4) + parseInt(Fine)
        //console.log(numberOfF0);

        if (numberOfPerState !== 0) {
            res.render("manager/peopleEachState", {
                F0: F0,
                F1: F1,
                F2: F2,
                F3: F3,
                F4: F4,
                Fine:Fine,
                sum:sum,

                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    statisticsChangeStatus: async(req, res, next) => {
        let numberOfChangeState = await managerModel.getNumberChangeState();
        let F0 = numberOfChangeState[0].count;
        let F1 = numberOfChangeState[1].count;
        let F2 = numberOfChangeState[2].count;
        let F3 = numberOfChangeState[3].count;
        let F4 = numberOfChangeState[4].count;
        let Fine = numberOfChangeState[5].count;
        let sum = 0;
        sum = sum + parseInt(F0) + parseInt(F1) + parseInt(F2) + parseInt(F3) + parseInt(F4) + parseInt(Fine)
            //console.log(numberOfF0);
        if (numberOfChangeState !== 0) {
            res.render("manager/peopleChangeState", {
                F0: F0,
                F1: F1,
                F2: F2,
                F3: F3,
                F4: F4,
                Fine: Fine,
                sum: sum,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    statisticsPackageProduct: async(req, res, next) => {
        let PackageID1,PackageID2, PackageID3, PackageID4, PackageID5;
        let Quantity1,Quantity2, Quantity3, Quantity4, Quantity5;
        let numberOfPackage = await managerModel.statisticsPackageProduct();
        if(numberOfPackage === 0){
            PackageID1 = 0
            PackageID2 = 0
            PackageID3 = 0
            PackageID4 = 0
            PackageID5 = 0
            Quantity1 = 0
            Quantity2 = 0
            Quantity3 = 0
            Quantity4 = 0
            Quantity5 = 0
        }else{
            if(numberOfPackage[0]){
                PackageID1 = numberOfPackage[0].PackageID;
                Quantity1 = numberOfPackage[0].Quantity;
            }else{
                PackageID1 = 0;
                Quantity1 = 0;
            }
            if(numberOfPackage[1]){
                PackageID2 = numberOfPackage[1].PackageID;
                Quantity2 = numberOfPackage[1].Quantity;
            }else{
                PackageID2 = 0;
                Quantity2 = 0;
            }
            if(numberOfPackage[2]){
                PackageID3 = numberOfPackage[2].PackageID;
                Quantity3 = numberOfPackage[2].Quantity;
            }else{
                PackageID3 = 0;
                Quantity3 = 0;
            }
            if(numberOfPackage[3]){
                PackageID4 = numberOfPackage[3].PackageID;
                Quantity4 = numberOfPackage[3].Quantity;
            }else{
                PackageID4 = 0;
                Quantity4 = 0;
            }
            if(numberOfPackage[4]){
                PackageID5 = numberOfPackage[4].PackageID;
                Quantity5 = numberOfPackage[4].Quantity;
            }else{
                PackageID5 = 0;
                Quantity5 = 0;
            }
        }
        if (numberOfPackage !== 0) {
            res.render("manager/statisticalsPackage", {
                PackageID1: PackageID1,
                PackageID2: PackageID2,
                PackageID3: PackageID3,
                PackageID4: PackageID4,
                PackageID5: PackageID5,
                Quantity1: Quantity1,
                Quantity2: Quantity2,
                Quantity3: Quantity3,
                Quantity4: Quantity4,
                Quantity5: Quantity5,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    statisticsUsedProduct: async(req, res, next) => {
        let numberOfProduct = await managerModel.statisticsUsedProduct();
        let Product1,Product2, Product3, Product4, Product5;
        let Quantity1,Quantity2, Quantity3, Quantity4, Quantity5;
        if(numberOfProduct === 0){
            Product1 = 0
            Product2 = 0
            Product3 = 0
            Product4 = 0
            Product5 = 0
            Quantity1 = 0
            Quantity2 = 0
            Quantity3 = 0
            Quantity4 = 0
            Quantity5 = 0
        }else{
            if(numberOfProduct[0]){
                Product1 = numberOfProduct[0].Product_name;
                Quantity1 = numberOfProduct[0].Quantity;
            }else{
                Product1 = 0;
                Quantity1 = 0;
            }
            if(numberOfProduct[1]){
                Product2 = numberOfProduct[1].Product_name;
                Quantity2 = numberOfProduct[1].Quantity;
            }else{
                Product2 = 0;
                Quantity2 = 0;
            }
            if(numberOfProduct[2]){
                Product3 = numberOfProduct[2].Product_name;
                Quantity3 = numberOfProduct[2].Quantity;
            }else{
                Product3 = 0;
                Quantity3 = 0;
            }
            if(numberOfProduct[3]){
                Product4 = numberOfProduct[3].Product_name;
                Quantity4 = numberOfProduct[3].Quantity;
            }else{
                Product4 = 0;
                Quantity4 = 0;
            }
            if(numberOfProduct[4]){
                Product5 = numberOfProduct[4].Product_name;
                Quantity5 = numberOfProduct[4].Quantity;
            }else{
                Product5 = 0;
                Quantity5 = 0;
            }
        }
        // let Product1 = numberOfProduct[0].Product_name;
        // let Product2 = numberOfProduct[1].Product_name;
        // let Product3 = numberOfProduct[2].Product_name;
        // let Product4 = numberOfProduct[3].Product_name;
        // let Product5 = numberOfProduct[4].Product_name;
        // let Quantity1 = numberOfProduct[0].Quantity;
        // let Quantity2 = numberOfProduct[1].Quantity;
        // let Quantity3 = numberOfProduct[2].Quantity;
        // let Quantity4 = numberOfProduct[3].Quantity;
        // let Quantity5 = numberOfProduct[4].Quantity;
        // console.log(numberOfProduct)
        if (numberOfProduct !== 0) {
            res.render("manager/statisticsUsedProduct", {
                Product1: Product1,
                Product2: Product2,
                Product3: Product3,
                Product4: Product4,
                Product5: Product5,
                Quantity1: Quantity1,
                Quantity2: Quantity2,
                Quantity3: Quantity3,
                Quantity4: Quantity4,
                Quantity5: Quantity5,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    sortByYOB: async(req, res, next) => {
        let patient = await managerModel.sortByYOB();
        if (patient !== 0) {
            res.render("manager/sortByYOB", {
                patient: patient,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    sortByStatus: async(req, res, next) => {
        let patient = await managerModel.sortByStatus();
        if (patient !== 0) {
            res.render("manager/sortByStatus", {
                patient: patient,
                layout: "manager"
            })
        } else {
            res.send("Không có thông tin");
        }
    },
    getProduct: async(req, res, next) => {
        let lisProduct = await managerModel.getAllProduct();
        console.log(lisProduct)
        if (lisProduct !== 0) {
            res.render("manager/getAllProduct", {
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
    },
    findProduct: async(req, res, next) => {
        // res.send('Hello')
        let Product = await managerModel.searchedProduct(req.body.productName);
        res.render("manager/getAllProduct", {
            Product: Product,
            layout: "manager"
        })
    },
    findPackage: async(req, res, next) => {
        // res.send('Hello')
        let Package = await managerModel.searchedPackage(req.body.packageName);
        res.render("manager/getSearchedPackage", {
            Package: Package,
            layout: "manager"
        })

    },
    orderProductByPriceASC: async(req, res, next) => {
        // res.send('Hello')
        let Product = await managerModel.orderProductByPriceASC();
        res.render("manager/getProductOrderByPrice", {
            Product: Product,
            layout: "manager"
        })

    },
    FilterProductByCategory: async(req, res, next) => {
        let Product = await managerModel.FilterProductByCategory();
        res.render("manager/filterProductByCategory", {
            Product: Product,
            layout: "manager"
        })
    },

    addProduct: async(req, res, next) => {
        res.render("manager/addProduct", {
            layout: "manager"
        })
    },
    addProductHandle: async(req, res, next) => {
        let productName = req.body.productName;
        console.log(productName);
        
        let price = req.body.price;
        let Unit = req.body.Unit;
        let Category = req.body.Category;
        let imageLink = req.body.Image_link;
        
        let result = await managerModel.addProductHandle(productName, price, Unit, Category, imageLink);
        let productID = await managerModel.getProductIDBy(productName);
        //console.log(productID[0].ProductID);
        //await managerModel.insertProductImage(imageLink, productID[0].ProductID);

        if (result !== 0) {
            res.redirect("/manager/getProduct")
        } else {
            res.redirect("/manager/addProduct/");
        }
    },

    editProductAction: async(req, res, next) => {
        let productName = req.body.productName;
        let price = req.body.price;
        let Unit = req.body.Unit;
        let Category = req.body.Category;
        let image1 = req.body.image1;
        let image2 = req.body.image2;
        let image3 = req.body.image3;
        let ProductID = req.params.id;
        let result = await managerModel.updateProduct(ProductID, productName, price, Unit, Category, image1,image2,image3);
        if (result !== 0) {
            res.redirect("/manager/getProduct")
        } else {
            res.redirect("/manager/updateProduct/" + ProductID);
        }
    },

    updateProduct: async(req, res, next) => {
        let ProductID = req.params.id;
        let Product = await managerModel.getProductBy(ProductID);
        //console.log(Product)
        if (Product !== 0) {
            res.render("manager/updateProduct", {
                Product: Product[0],
                layout: "manager"
            })
        } else {
            res.send("Không tìm thấy thông tin");
        }

    },
    detailProduct: async(req,res,next)=>{
        let productID = req.params.id;
        let Product = await managerModel.getProductBy(productID);

        //console.log(Product)

        if (Product !== 0) {
        res.render("manager/detailProduct", {
            Product:Product,
            layout: "manager"
        })
        } else {
            res.send("Không tìm thấy thông tin");
        }
    },
    DetailPackage: async(req, res, next) => {
        let PackageID = req.params.id;
        let Package = await managerModel.getOnePackage(PackageID);
        let listProduct = await managerModel.getListProductOfOnePackage(PackageID);

        //console.log(listProduct)
        if (listProduct !== 0) {
            res.render("manager/detailPackage", {
                listProduct: listProduct,
                layout: "manager"
            })
        } else {
            res.send("Không tìm thấy thông tin");
        }

    },
    editPackageAction: async(req, res, next) => {
        let PackageID = req.params.id;
        let listProduct = await managerModel.getListProductOfOnePackage(PackageID);
        // let packageID =listProduct[0].packageID
        console.log(listProduct)

        if (PackageID !== 0) {
            // res.send("Hi")
            res.render("manager/editPackage",{
                packageID:PackageID,
                listProduct: listProduct,
                layout: "manager"
            })
        } else {
            res.redirect("/manager/detailPackage/" + productPackageID);
        }

    },

    editInfoPackage: async(req, res, next) => {
        let PackageID = req.params.packageID;
        let Package = await managerModel.getOnePackage(PackageID);
        // let litmitedProductQuantiy = Package[0].limited_ProductQuantity
        let listProduct = await managerModel.getListProductOfOnePackage(PackageID);

        //console.log(Package)

        if (PackageID !== 0) {
            res.render("manager/editInfoPackage",{
                Package: Package,
                layout: "manager"
            })
        } else {
            res.redirect("/manager/detailPackage/" + productPackageID);
        }

    },
    //Cập nhật thông tin gói sản phẩm
    updateInfoPackage: async(req, res, next) => {
        let PackageID = req.params.packageID;
        // let Package = await managerModel.getOnePackage(PackageID);
        // let litmitedProductQuantiy = Package[0].limited_ProductQuantity
        let listProduct = await managerModel.getListProductOfOnePackage(PackageID);
        let packageName = req.body.packageName
        let limitedProductQuantity = req.body.limitedProductQuantity
        let limitedPackageQuantity = req.body.limitedPackageQuantity
        let limitedTime = req.body.limitedTime
        let image = req.body.imageLink

        await managerModel.updatePackage(PackageID, packageName, limitedProductQuantity, limitedPackageQuantity, limitedTime, image);
        // console.log(packageName)
        // console.log(limitedProductQuantity)
        // console.log(limitedPackageQuantity)
        // console.log(limitedTime)
        // console.log(image)

        if (PackageID != 0 && packageName != 0 && limitedProductQuantity != 0 && limitedPackageQuantity != 0 && limitedTime != 0 && image != 0) {
            res.redirect("/manager/viewPackageAction/" + PackageID,
            )
        } else {
            res.send("Vui lòng nhập đầy đủ các trường dữ liệu");
        }
    },

    addProductIntoPackage: async(req, res, next) => {
        let PackageID = req.params.packageID;
        let Package = await managerModel.getOnePackage(PackageID);
        let litmitedProductQuantiy = parseInt(Package[0].limited_ProductQuantity)
        
        //Lay so luong san pham hien co trong goi
        let numberProductInPackageNay = await managerModel.getNumberProductInPackage(PackageID)
        let numberProductInPackage = parseInt(numberProductInPackageNay[0].sum)

        let product = await managerModel.getAllProduct()

        //let listProduct = await managerModel.getListProductOfOnePackage(PackageID);

        //console.log(product)

        if (PackageID != 0 ) {
            res.render("manager/addProductIntoPackage",{
                layout: "manager",
                product:product,
                numberProductInPackage: numberProductInPackage,
                litmitedProductQuantiy: litmitedProductQuantiy,
            })
        } else {
            res.send("Vui lòng nhập đầy đủ các trường dữ liệu");
        }
    },

    addProductIntoPackageHandle: async(req, res, next) => {
        let PackageID = req.params.packageID;

        //Lay so luong san pham gioi han cua goi
        let Package = await managerModel.getOnePackage(PackageID);
        let litmitedProductQuantiy = parseInt(Package[0].limited_ProductQuantity)
        
        //Lay so luong san pham hien co trong goi
        let numberProductInPackageNay = await managerModel.getNumberProductInPackage(PackageID)
        let numberProductInPackage = parseInt(numberProductInPackageNay[0].sum)

        //Lay danh sach cac san pham
        let product = await managerModel.getAllProduct()

        let productID = req.body.productID
        let quantityInput = parseInt(req.body.quantity)

        
        if(numberProductInPackage + quantityInput > litmitedProductQuantiy){
            let error = 'Số lượng giới hạn sản phẩm trong gói là ' + litmitedProductQuantiy
            res.render("manager/addProductIntoPackage",{
                layout: "manager",
                product:product,
                numberProductInPackage:numberProductInPackage,
                litmitedProductQuantiy:litmitedProductQuantiy,
                error:error,
            })
        }
        else {
            let insert = await managerModel.insertProductIntoPackage(PackageID, productID, quantityInput)
            res.redirect("/manager/editPackageAction/" + PackageID,)
        } 
    },

    addPackage: async(req, res, next) => {
        res.render("manager/addPackage", {
            layout: "manager"
        })
    },

    addPackageHandle: async(req, res, next) => {
        let package_Name = req.body.package_Name;
        let limited_ProductQuantity = req.body.limited_ProductQuantity;
        let limited_PackageQuantity = req.body.limited_PackageQuantity;
        let limited_Time = req.body.limited_Time;
        let imageLink = req.body.imageLink;
        let result = await managerModel.addPackage(package_Name, limited_ProductQuantity, limited_PackageQuantity, limited_Time, imageLink);
        // res.send('Hello')
        if (result !== 0) {
            res.redirect("/manager/getPackage")
        } else {
            res.redirect("/manager/addPackage/");
        }
    },
    changeHospital: async(req, res, next)=>{
        let patientID = req.params.patientID;
        // lay benh vien hien tai 
        let getHopital = await managerModel.getHospitalNow(patientID);
        let hopitalID = getHopital.hospitalID;
        // lay danh sach benh vien 
        let listHospital = await managerModel.getHospital();
        res.render('manager/changeHospital',{
            layout: 'manager', 
            listHopital: listHospital.rows,
            hopital: hopitalID
        })
    },
    changeHospitalHandle: async(req, res, next) => {
        // res.send(req.body)
        let hopital = req.body.hopital;
        let patientID = req.params.patientID;
        let getHopital = await managerModel.getHospitalNow(patientID);
        let listHospital = await managerModel.getHospital();
        //update suc chua
        let hopitalInfo = await managerModel.getHopital1(hopital);
        let hopitalInfo1 = await managerModel.getHopital1(getHopital.hospitalID);
        if(hopitalInfo.current_Quantity + 1 > hopitalInfo.Capacity){
            let hopitalID = getHopital.hospitalID;
            res.render('manager/changeHospital',{
                layout: 'manager',
                error: 'Khu cách ly đã đạt số lượng giới hạn!',
                listHopital: listHospital.rows,
                hopital: hopitalID
            })
        }else{
            let updateHopital = await managerModel.updateHospitalQuantity(hopital, hopitalInfo.current_Quantity + 1);
            let updateHopital1 = await managerModel.updateHospitalQuantity(getHopital.hospitalID, hopitalInfo1.current_Quantity - 1);
            let result = await managerModel.updateHopitalPatient(hopital, patientID);
            res.redirect('/manager');
        }
        
    },
    deleteProductFromPackage: async(req, res, next) => {
        let productID = req.query.productID;
        let packageID = req.query.packageID;
    
        let result = await managerModel.deleteProductFromPackage(productID, packageID);
        res.redirect('/manager/editPackageAction/'+packageID);
    },
    statisticsDebtPayment: async(req, res, next) => {
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        //get du no
        let debt = await axios.get('https://localhost:3443/api/getDebt',{
            httpsAgent: agent
        });
        //get thanh toan
        let payment = await axios.get('https://localhost:3443/api/getHistoryPayment',{
            httpsAgent: agent
        });
        res.render("manager/debtPayment",{
            layout: "manager",
            debt: debt.data,
            payment: payment.data
        })
        // res.send(payment.data)
    }
}