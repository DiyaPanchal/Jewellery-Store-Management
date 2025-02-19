import express from "express";
import bodyParser from "body-parser";

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.get("/");

export default apiRouter;