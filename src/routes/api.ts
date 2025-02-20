import express from "express";
import bodyParser from "body-parser";
import * as UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/AuthMiddleware";

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.post("/register", UserController.registerUser);
apiRouter.post("/login", UserController.loginUser);
apiRouter.get("/users", authMiddleware, UserController.getAllUsers);
apiRouter.put("/users/:userId", authMiddleware, UserController.updateUser);
apiRouter.delete("/delete/:userId", authMiddleware, UserController.deleteUser);

export default apiRouter;
