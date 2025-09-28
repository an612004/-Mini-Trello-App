import { Router } from "express";
import cardController from "../controllers/cardController";
import inviteController from "../controllers/inviteController";
import taskRouter from "./taskRoute"

const route = Router({ mergeParams: true });
route.get("/", cardController.getAll);
route.post("/", cardController.create);
route.get("/:cardId", cardController.getById);
route.delete("/:cardId", cardController.delete);
route.put("/:cardId", cardController.update);
route.get("/user/:userId", cardController.getByUser);
route.post("/invite", inviteController.invite);
route.post("/:cardId/invite/accept", inviteController.acceptInvite);

route.use("/:cardId/tasks", taskRouter)

export default route;
