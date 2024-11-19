import { Router } from "express";
import customerCtrl from "../controllers/customerController.js";

const router = Router();

router.put("/updateDeliveryInfo", customerCtrl.updateCustomer);

export default router;
