const Home = require("../models/home");
const User = require("../models/user");

// Controller for displaying the home page
exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Welcome to Airbnb",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

// Controller for displaying the home page with registered homes
exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "homelist",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

// Controller for displaying the bookings page
exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavourites = async (req, res, next) => {
  try {
    // Check login
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const userID = req.session.user._id;
    const user = await User.findById(userID).populate("favourites");
    const favouriteHomes = user.favourites;
    res.render("store/favourite", {
      favouriteHomes,
      pageTitle: "Favourite Property list",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
// Controller for displaying the favorites page
// exports.getFavourites = async (req, res, next) => {
//   const userID = req.session.user._id;
//   const user = await User.findById(userID).populate("favourites");
//   const favouriteHomes = user.favourites;
//   res.render("store/favourite", {
//     favouriteHomes: favouriteHomes,
//     pageTitle: "Favourite Property list",
//     currentPage: "favourites",
//     isLoggedIn: req.isLoggedIn,
//     user: req.session.user,
//   });
// };

exports.postAddToFavourites = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;
    const userID = req.session.user._id;
    const user = await User.findById(userID);

    // Check if already exists
    const alreadyFavourite = user.favourites.some(
      (fav) => fav.toString() === homeId,
    );
    // Add only if not exists
    if (!alreadyFavourite) {
      user.favourites.push(homeId);
      await user.save();
    }
    res.redirect("/favourites");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

// exports.postAddToFavourites = async (req, res, next) => {
//   const homeId = req.body.homeId;
//   const userID = req.session.user._id;
//   const user = await User.findById(userID).populate("favourites");
//   if (!user.favourites.includes(homeId)) {
//     user.favourites.push(homeId);
//     await user.save();
//   }
//   res.redirect("/favourites");
// };

exports.postRemoveFavourites = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userID = req.session.user._id;
    const user = await User.findById(userID);

    user.favourites = user.favourites.filter(
      (fav) => fav.toString() !== homeId,
    );
    await user.save();
    res.redirect("/favourites");
  } catch (err) {
    console.log(err);
    res.redirect("/favourites");
  }
};

// exports.postRemoveFavourites = async (req, res, next) => {
//   const homeId = req.params.homeId;
//   const userID = req.session.user._id;
//   const user = await User.findById(userID);
//   console.log("Removing from favourites: ", homeId);
//   if (user.favourites.includes(homeId)) {
//     user.favourites = user.favourites.filter(fav => fav != homeId);
//     await user.save();
//   }
//   res.redirect("/favourites");
// };

// Controller for displaying a specific home by ID in homedetail page
exports.getHomeById = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.status(404).render("404-error", {
        pageTitle: "Home Not Found",
        currentPage: "404-error",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
    res.render("store/home-details", {
      home: home,
      pageTitle: home.name,
      currentPage: "homelist",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};
