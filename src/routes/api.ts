import express from "express";
import bodyParser from "body-parser";
import * as UserController from "../controllers/UserController";
import * as CategoryController from "../controllers/CategoryController";
import authMiddleware from "../middlewares/AuthMiddleware";

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.post("/register", UserController.registerUser);
apiRouter.post("/login", UserController.loginUser);
apiRouter.get("/users", authMiddleware, UserController.getAllUsers);
apiRouter.put("/users/:userId", authMiddleware, UserController.updateUser);
apiRouter.delete("/delete/:userId", authMiddleware, UserController.deleteUser);
apiRouter.post(
  "/categories/add",
  authMiddleware,
  CategoryController.createCategory
);
apiRouter.get(
  "/categories",
  authMiddleware,
  CategoryController.getAllCategories
);
apiRouter.put(
  "/categories/:categoryId",
  authMiddleware,
  CategoryController.updateCategory
);
apiRouter.delete(
  "/categories/:categoryId",
  authMiddleware,
  CategoryController.deleteCategory
);

export default apiRouter;
