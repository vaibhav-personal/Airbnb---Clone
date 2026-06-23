const Home = require("../models/home");
const fs = require("fs");

// Controller for displaying the home page with registered homes
exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Your Registered Properties",
      currentPage: "host-home-list",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

// controllers/homes.js
exports.getAddHome = (req, res, next) => {
  res.render("host/add-home", {
    pageTitle: "Register Property",
    currentPage: "add-home",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

// Controller for handling the add home form submission
exports.postAddHome = (req, res, next) => {
  const { name, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(400).send("No image uploaded.");
  }

  const photo = req.file.path; // Assuming you're using multer for file uploads

  const home = new Home({ name, price, location, photo, rating, description });
  home.save().then(() => {
    console.log("Home registered successfully");
    res.redirect("/host/host-home-list");
  });
};

//  Controller for displaying the edit home form
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    } else {
      res.render("host/add-home", {
        home: home,
        pageTitle: `Update details for ${home.name}`,
        currentPage: "host-home-list",
        editing: editing,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

// Controller for handling the edit home form submission
exports.postEditHome = (req, res, next) => {
  const { _id, name, price, location, rating, description } = req.body;

  Home.findById(_id)
    .then((home) => {
      home.name = name;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting old photo: ", err);
          }
        });
        home.photo = req.file.path; // Update the photo only if a new one is uploaded
      }

      home
        .save()
        .then(() => {
          res.redirect("/host/host-home-list");
        })
        .catch((err) => {
          console.log("Error while saving home: ", err);
        });
    })
    .catch((err) => {
      console.log("Error while finding home: ", err);
    });
};

// Controller for handling the remove home action
exports.postRemoveHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error removing home: ", err);
    });
};
