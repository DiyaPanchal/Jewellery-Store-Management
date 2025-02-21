import express from "express";
import bodyParser from "body-parser";
import * as UserController from "../controllers/UserController";
import * as CategoryController from "../controllers/CategoryController";
import * as ClientController from "../controllers/ClientController";
import * as PurchaseController from "../controllers/PurchaseController";
import * as SalesController from "../controllers/SalesController";
import * as RateController from "../controllers/RateController";
import getPurchaseReport from "../services/GetPurchaseReport";
import getSalesReport from "../services/GetSalesReport";
import getBalanceSheetReport  from "../services/GetBalanceSheetReport";
import authMiddleware from "../middlewares/AuthMiddleware";

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.post("/register", UserController.registerUser);
apiRouter.post("/login", UserController.loginUser);
apiRouter.get("/users", authMiddleware, UserController.getAllUsers);
apiRouter.put("/users/:userId", authMiddleware, UserController.updateUser);
apiRouter.delete("/users/:userId", authMiddleware, UserController.deleteUser);
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
apiRouter.post("/clients", authMiddleware, ClientController.createClient);
apiRouter.get("/clients", authMiddleware, ClientController.getAllClients);
apiRouter.put("/clients/:clientId", authMiddleware, ClientController.updateClient);
apiRouter.delete("/clients/:clientId", authMiddleware, ClientController.deleteClient);
apiRouter.get("/purchases", PurchaseController.getPurchases);
apiRouter.post("/purchases", PurchaseController.createPurchase);
apiRouter.get("/purchases/:purchaseId", PurchaseController.getPurchaseById);
apiRouter.get("/sales", authMiddleware, SalesController.getSales);
apiRouter.post("/sales", authMiddleware, SalesController.createSale);
apiRouter.get("/sales/:saleId", authMiddleware, SalesController.getSaleById);
apiRouter.get("/rates", RateController.getRate);
apiRouter.post("/rates", RateController.upsertRate);
apiRouter.delete("/rates", RateController.deleteRate);
apiRouter.get("/purchases/report", getPurchaseReport);
apiRouter.get("/sales/report", getSalesReport);
apiRouter.get("/balance/report", getBalanceSheetReport);

export default apiRouter;
