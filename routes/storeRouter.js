const express = require("express");
const storeRouter = express.Router();

const storeController = require("../controllers/store-controller");

storeRouter.get("/", storeController.getIndex);

storeRouter.get("/homelist", storeController.getHomes);

storeRouter.get("/bookings", storeController.getBookings);

storeRouter.get("/favourites", storeController.getFavourites);

storeRouter.get("/favourites/:homeId", storeController.getHomeById);

storeRouter.post("/favourites", storeController.postAddToFavourites);

storeRouter.post(
  "/favourites/remove/:homeId",
  storeController.postRemoveFavourites,
);

storeRouter.get("/home-list/:homeId", storeController.getHomeById);

module.exports = storeRouter;
