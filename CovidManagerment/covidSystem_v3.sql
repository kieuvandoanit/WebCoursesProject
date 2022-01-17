-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public."History"
(
    "HistoryID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "timeLogin" timestamp without time zone NOT NULL,
    "timeLogout" timestamp without time zone NOT NULL,
    "userID" integer NOT NULL,
    CONSTRAINT "PK_history" PRIMARY KEY ("HistoryID")
);

CREATE TABLE IF NOT EXISTS public."Hopital"
(
    "hopitalID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "hopitalName" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "current_Quantity" integer NOT NULL,
    "Capacity" integer NOT NULL,
    province character varying(100) COLLATE pg_catalog."default" NOT NULL,
    ward character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "District" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Hopital_pkey" PRIMARY KEY ("hopitalID")
);

CREATE TABLE IF NOT EXISTS public."Image"
(
    "imageID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "image_Link" character varying(500) COLLATE pg_catalog."default" NOT NULL,
    "ProductID" integer NOT NULL,
    CONSTRAINT "PK_image" PRIMARY KEY ("imageID")
);

CREATE TABLE IF NOT EXISTS public."Order"
(
    "orderID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "patientID" integer NOT NULL,
    "TotalPrice" integer NOT NULL,
    "oderDate" timestamp without time zone NOT NULL,
    "statusPayment" integer NOT NULL,
    "productPackageID" integer NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderID")
);

CREATE TABLE IF NOT EXISTS public."OrdersDetail"
(
    "OrdersDetailID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "OrdersID" integer NOT NULL,
    "PackageID" integer NOT NULL,
    "Quantity" integer NOT NULL,
    CONSTRAINT "OrdersDetail_pkey" PRIMARY KEY ("OrdersDetailID")
);

CREATE TABLE IF NOT EXISTS public."OrdersPackageDetail"
(
    "OPDID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "OrdersDetailID" integer NOT NULL,
    "ProductID" integer NOT NULL,
    "Quantity" integer NOT NULL,
    "Price" integer NOT NULL,
    "Unit" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "OrdersPackageDetail_pkey" PRIMARY KEY ("OPDID")
);

CREATE TABLE IF NOT EXISTS public."Package_Product"
(
    "Package_ProductID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "packageID" integer NOT NULL,
    "productID" integer NOT NULL,
    "number" integer,
    CONSTRAINT "Package_Product_pkey" PRIMARY KEY ("Package_ProductID")
);

CREATE TABLE IF NOT EXISTS public."Patient"
(
    "PatientID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "PatientName" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "DOB" character varying COLLATE pg_catalog."default" NOT NULL,
    province character varying(100) COLLATE pg_catalog."default" NOT NULL,
    ward character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "District" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Status" character varying(10) COLLATE pg_catalog."default" NOT NULL,
    "userID" integer NOT NULL,
    "hospitalID" integer NOT NULL,
    patient_ref integer,
    "identityCard" character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT "Patient_pkey" PRIMARY KEY ("PatientID")
);

CREATE TABLE IF NOT EXISTS public."Product"
(
    "ProductID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Product_name" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    price integer NOT NULL,
    "Unit" character varying(50) COLLATE pg_catalog."default" NOT NULL,
	isDelete integer,
    CONSTRAINT "PK_product" PRIMARY KEY ("ProductID")
);

CREATE TABLE IF NOT EXISTS public."User"
(
    "userID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "userName" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(200) COLLATE pg_catalog."default" NOT NULL,
    permission integer NOT NULL,
    active integer,
    CONSTRAINT "PK_user" PRIMARY KEY ("userID")
);

CREATE TABLE IF NOT EXISTS public."historyPatient"
(
    "historyPatientID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    status character varying(10) COLLATE pg_catalog."default" NOT NULL,
    "patientID" integer NOT NULL,
    "hopitalID" integer NOT NULL,
    "fromDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone,
    CONSTRAINT "historyPatient_pkey" PRIMARY KEY ("historyPatientID")
);

CREATE TABLE IF NOT EXISTS public."productPackage"
(
    "productPackageID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "package_Name" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "limited_ProductQuantity" integer NOT NULL,
    "limited_PackageQuantity" integer NOT NULL,
    "limited_Time" integer NOT NULL,
	isDelete integer,
    CONSTRAINT "productPackage_pkey" PRIMARY KEY ("productPackageID")
);

CREATE TABLE IF NOT EXISTS public."PaymentLimit"
(
    "paymentLimitID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "value" integer NOT NULL,
    CONSTRAINT "PaymentLimit_pkey" PRIMARY KEY ("paymentLimitID")
);

CREATE TABLE IF NOT EXISTS public."Notification"
(
    "notificationID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "info" character varying(100) COLLATE pg_catalog."default" NOT NULL,
	"userID" integer NOT NULL,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID")
);

ALTER TABLE IF EXISTS public."Notification"
    ADD CONSTRAINT "FK_notification_user" FOREIGN KEY ("userID")
    REFERENCES public."User" ("userID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public."History"
    ADD CONSTRAINT "FK_history_user" FOREIGN KEY ("userID")
    REFERENCES public."User" ("userID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Image"
    ADD CONSTRAINT "FK_image_product" FOREIGN KEY ("ProductID")
    REFERENCES public."Product" ("ProductID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Order"
    ADD CONSTRAINT "FK_Order_package" FOREIGN KEY ("productPackageID")
    REFERENCES public."productPackage" ("productPackageID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Order"
    ADD CONSTRAINT "FK_Order_patient" FOREIGN KEY ("patientID")
    REFERENCES public."Patient" ("PatientID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."OrdersDetail"
    ADD CONSTRAINT "FK_OrdersDetail_Orders" FOREIGN KEY ("OrdersID")
    REFERENCES public."Order" ("orderID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."OrdersDetail"
    ADD CONSTRAINT "FK_OrdersDetail_Package" FOREIGN KEY ("PackageID")
    REFERENCES public."productPackage" ("productPackageID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."OrdersPackageDetail"
    ADD CONSTRAINT "FK_OrdersPackage_OrdersDetail" FOREIGN KEY ("OrdersDetailID")
    REFERENCES public."OrdersDetail" ("OrdersDetailID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."OrdersPackageDetail"
    ADD CONSTRAINT "FK_OrdersPackage_Product" FOREIGN KEY ("ProductID")
    REFERENCES public."Product" ("ProductID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."Package_Product"
    ADD CONSTRAINT "FK_package" FOREIGN KEY ("packageID")
    REFERENCES public."productPackage" ("productPackageID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Package_Product"
    ADD CONSTRAINT "FK_product" FOREIGN KEY ("productID")
    REFERENCES public."Product" ("ProductID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Patient"
    ADD CONSTRAINT "FK_patient_patient" FOREIGN KEY (patient_ref)
    REFERENCES public."Patient" ("PatientID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Patient"
    ADD CONSTRAINT "FK_patient_user" FOREIGN KEY ("userID")
    REFERENCES public."User" ("userID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."historyPatient"
    ADD CONSTRAINT "FK_historyPatient_hopital" FOREIGN KEY ("patientID")
    REFERENCES public."Patient" ("PatientID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."historyPatient"
    ADD CONSTRAINT "FK_historyPatient_patient" FOREIGN KEY ("hopitalID")
    REFERENCES public."Hopital" ("hopitalID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;