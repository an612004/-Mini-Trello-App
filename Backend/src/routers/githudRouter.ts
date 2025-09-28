import express from "express";
import repositoriesController from "../controllers/repositoriesController"
const taskRouter = express.Router({ mergeParams: true }); 



taskRouter.post("/github-attach", repositoriesController.attachToTask);
taskRouter.get("/github-attachments", repositoriesController.getAttachments);
taskRouter.delete("/github-attachments/:attachmentId", repositoriesController.deleteAttachment);

export default taskRouter;
