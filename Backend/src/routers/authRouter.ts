import { Router } from "express";
import authController from "../controllers/authController"
const route = Router()

route.post("/signup",authController.signup)
route.post("/signin",authController.signin)
export default route;
