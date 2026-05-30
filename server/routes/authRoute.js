import expres from "express";
import { getUser, login, register } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const authRouter = expres.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", auth, getUser);

export default authRouter;
