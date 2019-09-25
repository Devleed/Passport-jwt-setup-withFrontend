const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../Models/user");

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async function(email, password, done) {
      const user = await User.findOne({
        email,
        password
      });
      if (!user) return done(null, false);
      return done(null, user);
    }
  )
);

// Setting Up Passport-jwt
const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // jwtFromRequest:function(){return localStorage.getItem('auth-token')},
  secretOrKey: "SecretData"
};

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, async function(jwtPayload, done) {
      console.log("SEE => ", req.headers);
      try {
        const user = await User.findById(jwtPayload.user._id);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
