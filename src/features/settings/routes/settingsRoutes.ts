import express from "express";

import { protect } from "../../authentication/controllers/authController";
import { createSetting, deleteSetting, getAllSettings, getSetting, updateSetting } from "../controller/SettingsController";

const router = express.Router();

// router.use(protect);

router.route("/")
    .get(getAllSettings)
    .post(createSetting);

router
    .route("/:id")
    .get(getSetting)
    .patch(updateSetting)
    .delete(deleteSetting);

export default router;
