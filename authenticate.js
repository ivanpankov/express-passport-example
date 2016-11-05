var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var config = require('./config');

passport.serializeUser(function (user, done) {
    // placeholder for custom user serialization
    // null is for errors
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // placeholder for custom user deserialization.
    // maybe you are going to get the user from mongo by id?
    // null is for errors
    done(null, user);
});

passport.use(new GithubStrategy({
        clientID: config.github.CLIENT_ID,
        clientSecret: config.github.GITHUB_CLIENT_SECRET,
        callbackURL: config.github.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
