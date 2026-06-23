const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login to Airbnb",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    errorMessages: [],
    oldInput: {
      email: "",
      password: "",
    },
    user: {},
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login to Airbnb",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["User does not exist"],
      oldInput: { email },
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login to Airbnb",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["Invalid credentials"],
      oldInput: { email },
      user: {},
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
  };
  await req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).send("Session error");
    }
    res.redirect("/");
  });
};

exports.postLogout = (req, res, next) => {
  console.log(req.body);
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Register to Airbnb",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    errorMessages: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      password: "",
      user: {},
    },
  });
};

exports.postSignup = [
  // Validation for First name
  check("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required")
    .matches(/^[a-zA-z\s]+$/)
    .withMessage("First name can contian only letters"),

  // Validation for last name
  check("lastName")
    .trim()
    .optional({ checkFalsy: true })
    .matches(/^[a-zA-z\s]*$/)
    .withMessage("Last name can contain only letters"),

  // Validation for email
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("please enter a valid email")
    .normalizeEmail(),

  //Validation for user type
  check("userType")
    .isIn(["guest", "host"])
    .withMessage("User type must be either Guest or Host"),

  // Validation for password
  check("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage(
      "Password must be at least 8 characters long including uppercase, lowercase, number and special character",
    )
    .trim(),

  // Validaion for confirm password
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),

  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Click on the check box to accept TnC");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, userType, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Register to Airbnb",
        currentPage: "signup",
        isLoggedIn: false,
        errorMessages: errors.array().map((error) => error.msg),
        oldInput: { firstName, lastName, email, userType, password },
        user: {},
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          userType,
          password: hashedPassword,
        });
        return user.save();
      })
      .then(() => {
        console.log("User saved successfully");
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        let message = "Something went wrong";
        if (err.code === 11000) {
          message = "Email already exists";
        }
        return res.status(422).render("auth/signup", {
          pageTitle: "Register to Airbnb",
          currentPage: "signup",
          isLoggedIn: false,
          errorMessages: [message],
          oldInput: { firstName, lastName, email, userType, password },
          user: {},
        });
      });
  },
];
