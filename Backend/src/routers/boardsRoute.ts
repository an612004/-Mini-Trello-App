import { Router } from "express";
import boardController from "../controllers/boardController"
import cardsRouter from "./cardsRouter"
import inviteController from "../controllers/inviteController";
const route = Router()

route.post("/", boardController.create);
route.get("/", boardController.getAll);
route.get("/:boardId", boardController.getById);
route.put("/:boardId", boardController.update);
route.delete("/:boardId", boardController.delete);
route.get("/:boardId/invite", inviteController.getInvite);
route.post("/:boardId/invite", inviteController.invite);
route.post("/:boardId/invite/:inviteId/accept", inviteController.acceptInvite);
route.use("/:boardId/cards",cardsRouter)

export default route;
