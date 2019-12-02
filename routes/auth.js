var express = require("express");
var router = express.Router();

router.get("/login", function(req, res, next) {
  res.render("login", { title: "Colaborative code" });
});

router
  .route("/register")
  .get(function(req, res, next) {
    res.render("register", { title: "Colaborative code" });
  })
  .post(function(req, res, next) {
    req.checkBody("name", "Empty Name").notEmpty();
    req.checkBody("email", "Invalid Email").isEmail();
    req.checkBody("password", "Empty Password").notEmpty();
    req
      .checkBody("confirmPassword", "Password do not match")
      .equals(req.body.password)
      .notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.render("register", {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors
      });
    } else {
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password);

      user.save(function(err) {
        if (err) {
          res.render("register", { errorMessages: err });
        } else {
          res.redirect("/login");
        }
      });
    }
  });

module.exports = router;
