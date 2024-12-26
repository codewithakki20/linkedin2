import { Router } from "express";
import {
  register,
  login,
  uploadProfilePicture,
  uploadUserPicture,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequest,
  whatAreMyConnection,
  acceptConnectionRequest,
} from "../controllers/user.controllers.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Multer storage and file filter configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer upload instance
const upload = multer({
  storage: storage,
});

// Routes
router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);

router
  .route("/user_update")
  .post(upload.single("user_picture"), uploadUserPicture);

router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequest").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(whatAreMyConnection);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);

export default router;