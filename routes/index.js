var express = require("express");
var router = express.Router();

var nodemailer = require("nodemailer");
var config = require("../config");

var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "ColaborativeCode" });
});

router.get("/about", function(req, res, next) {
  res.render("about", { title: "ColaborativeCode" });
});

router
  .route("/contact")
  .get(function(req, res, next) {
    res.render("contact", { title: "ColaborativeCode" });
  })
  .post(function(req, res, next) {
    req.checkBody("name", "Empty Name").notEmpty();
    req.checkBody("email", "Empty Email").isEmail();
    req.checkBody("message", "Empty Message").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.render("contact", {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    } else {
      var mailOptions = {
        from: "ColabarativeCode",
        to: "ianulov.pantilei@gmail.com",
        subject: "New message from visitor",
        text: req.body.message
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }
        res.render("thank", { title: "ColaborativeCode" });
      });
    }
  });

module.exports = router;
