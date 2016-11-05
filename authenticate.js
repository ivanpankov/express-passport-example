var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var User = require('./models/user');
var config = require('./config');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GithubStrategy({
        clientID: config.github.CLIENT_ID,
        clientSecret: config.github.GITHUB_CLIENT_SECRET,
        callbackURL: config.github.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ OauthId: profile.id }, function(err, user) {
            if(err) {
                return done(err);
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    username: profile.displayName
                });

                user.OauthId = profile.id;
                user.OauthToken = accessToken;
                user.save(function(err) {
                    if(err) {
                        console.log(err); // handle errors!
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
));
