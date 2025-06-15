import { Router } from "express";
import { PersonController } from "../controllers/PersonController";

const router = Router();

const personController = new PersonController();

router.post("/search", personController.searchPeople);

router.post("/search/verified", personController.searchVerifiedPeople);

router.get("/profile/:username", personController.getProfile);

export default router;
