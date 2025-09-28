import  express  from "express";
import taskController from "../controllers/taskController"
import githudRouter from "./githudRouter"
const taskRouter = express.Router({ mergeParams: true }); 

taskRouter.get("/", taskController.getAll);
taskRouter.post("/", taskController.create);
taskRouter.get("/:taskId", taskController.getById);
taskRouter.put("/:taskId", taskController.update);
taskRouter.delete("/:taskId", taskController.delete);
taskRouter.post("/:taskId/assign", taskController.assignMember);
taskRouter.get("/:taskId/assign", taskController.getMembers);
taskRouter.delete("/:taskId/assign/:memberId", taskController.removeMember);

taskRouter.use("/:taskId",githudRouter)


export default taskRouter;
