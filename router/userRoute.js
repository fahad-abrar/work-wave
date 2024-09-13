import express from "express";
import authValidator from "../middleware/authMidleware.js";
import multerUploader from "../utils/fileHandler.js";
import authUser from "../controller/userController.js";

const userRoute = express.Router();

userRoute.get("/user", authValidator, authUser.getUser);
userRoute.get("/user/:id", authValidator, authUser.getUserbyId);
userRoute.post("/register", multerUploader, authUser.registerUser);
userRoute.post("/login", authUser.logInUser);
userRoute.get("/logout", authValidator, authUser.logOutUser);
userRoute.put("/update/:id", authValidator, authUser.updateUser);
userRoute.delete("/delete/:id", authValidator, authUser.deleteUser);
userRoute.post("/password/change:id", authValidator, authUser.changePassword);
userRoute.post("/password/forgot", authUser.forgotPassword);
userRoute.post("/reset/:token", authUser.resetPassword);

export default userRoute;
