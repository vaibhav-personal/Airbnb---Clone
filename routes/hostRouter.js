const express = require("express");
const hostRouter = express.Router();

const hostController = require("../controllers/host-controller");

hostRouter.get("/add-home", hostController.getAddHome);

hostRouter.post("/add-home", hostController.postAddHome);

hostRouter.get("/edit-home/:homeId", hostController.getEditHome);

hostRouter.get("/host-home-list", hostController.getHostHomes);

hostRouter.post("/edit-home", hostController.postEditHome);

hostRouter.post(
  "/host-home-list/remove/:homeId",
  hostController.postRemoveHome,
);

module.exports = hostRouter;
