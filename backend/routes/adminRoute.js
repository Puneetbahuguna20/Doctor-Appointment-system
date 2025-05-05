import express from "express";

// import {
//   addDoctor,
//   adminDashboard,
//   allDoctors,
//   appointmentCancel,
//   appointmentsAdmin,
//   loginAdmin,
// } from "../controllers/adminController.js";

import {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailabilty } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.get("/test", (req, res) => {
  console.log("✅ GET /api/admin/test hit");
  res.send("Admin route is working!");
});

adminRouter.post("/add-doctors",authAdmin,upload.single('image'),addDoctor)




// adminRouter.post("/add-doctor", authAdmin, (req, res, next) => {
//     upload.single("image")(req, res, function (err) {
//       if (err) {
//         console.log("Multer error:", err);
//         return res.status(400).json({ success: false, message: "Image upload failed" });
//       }
//       next();
//     });
//   }, addDoctor);
  
  
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailabilty);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
