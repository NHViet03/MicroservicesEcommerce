import { Router } from "express";
import authCtrl from "../controllers/authController.js";

const router = Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/login/v2", authCtrl.login_v2);
router.post("/logout", authCtrl.logout);
router.post("/refresh_token", authCtrl.generateAccessToken);
router.post("/validate", authCtrl.validateAccessToken);
router.post("/verify_email", authCtrl.validateEmailVerification);
router.post("/resend_email", authCtrl.resendEmailVerification);

export default router;
