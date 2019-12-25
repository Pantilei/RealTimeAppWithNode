var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStategy = require("passport-facebook").Strategy;

// initialize the session when the user log in
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// accept that session and try to find User with that session

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(username, password, done) {
      User.findOne({ email: username }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password"
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect username or password"
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  new FacebookStategy(
    {
      clientID: "453953978655278",
      clientSecret: "fad88f39a0fe58a5ebc33f35b9ea6461",
      callbackURL:
        "https://code-colaborative-school.herokuapp.com/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"]
    },
    function(token, refreshToken, profile, done) {
      User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err) return done(err);
        // if you can find that user return it to the front page,
        if (user) {
          return done(null, user);
        } else {
          // otherwise look into the second level as email, since before we add new functionality as
          //facebook register
          //there were users with profile but without facebookId field, thus here with this code we update that
          //field using their email
          User.findOne({ email: profile.emails[0].value }, function(err, user) {
            if (user) {
              user.facebookId = profile.id;
              return user.save(function(err) {
                if (err)
                  return done(null, false, { message: "Can't save user info" });
                return done(null, user);
              });
            }
            var user = new User();
            user.name = profile.displayName;
            user.email = profile.emails[0].value;
            user.facebookId = profile.id;
            user.save(function(err) {
              if (err)
                return done(null, false, { message: "Can't save user info" });
              return done(null, user);
            });
          });
        }
      });
    }
  )
);

/* In a Connect or Express-based application, passport.initialize() middleware is required to initialize Passport.
 If your application uses persistent login sessions, passport.session() middleware must also be used.

and

Sessions

In a typical web application, the credentials used to authenticate a user will only be transmitted during the 
login request. If authentication succeeds, a session will be established and maintained via a cookie set in the 
user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. 
In order to support login sessions, Passport will serialize and deserialize user instances to and 
from the session.

and

Note that enabling session support is entirely optional, though it is recommended for most applications.
If enabled, be sure to use express.session() before passport.session() to ensure that the login session
is restored in the correct order. */
