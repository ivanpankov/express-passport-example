var express = require('express');
var app = express();
var session = require('express-session');

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
    clientID: config.CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));


app.use(session({
    secret: config.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    console.log(req.path);
    next();
});

// routes
app.get('/', (req, res) => {
    var html = "<ul>\
        <li><a href='/auth/github'>GitHub</a></li>\
        <li><a href='/logout'>logout</a></li>\
    </ul>";

    if (req.isAuthenticated()) {
        html += "<p>authenticated as user:</p>";
        html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
    }

    res.send(html);
});

app.get('/logout', function (req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        console.log(req.hostname, ' :', req.query);
        res.redirect('/');
    }
);

app.get('/protected', ensureAuthenticated, function (req, res) {
    res.send("access granted. secure stuff happens here");
});




var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    console.log('The app listening at http://%s:%s', server.address().address, server.address().port);
});

// Simple middleware to ensure user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user is available for use here
        next();
    } else {
        // denied. redirect to login
        res.redirect('/')
    }
}