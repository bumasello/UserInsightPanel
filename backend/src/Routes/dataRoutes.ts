import { Router } from "express";
import { DataController } from "../controllers/DataController";

const router = Router();
const dataController = new DataController();

router.post("/collect/people", dataController.collectPeople);

router.post("/collect/profiles", dataController.collectProfiles);

router.post("/collect/profiles/pending", dataController.collectPendingProfiles);

router.get("/profiles/pending/status", dataController.getPendingProfilesStatus);

router.post("/process/profiles", dataController.processProfiles);

router.get("/insights", dataController.getInsights);

router.get("/stats", dataController.getStats);

export default router;
