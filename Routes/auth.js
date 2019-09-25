const express = require("express");
const User = require("../Models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router = express.Router();
const allUsers = [];

// Setting up local storage

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());
router.use(express.json());

router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const saved = await newUser.save();
    res.send(saved);
  } catch (error) {
    throw error;
  }
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {
  passport.authenticate(
    "local",
    {
      session: false
    },
    (err, user, info) => {
      if (err || !user) {
        console.log(err);
        return res.send("Something went wrong");
      }
      req.login(
        user,
        {
          session: false
        },
        err => {
          if (err) return res.send(err);
          const token = jwt.sign(
            {
              user
            },
            "SecretData"
          );
          res.header("auth-token", token); 
          res.redirect("/user");
        }
      );
    }
  )(req, res);
});
router.get("/logout", (req, res) => {
  req.logout();
  localStorage.removeItem("auth-token");
  res.send("Logged Out");
});

module.exports = router;
