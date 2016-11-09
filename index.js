var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var passport = require('passport');
var authenticate = require('./authenticate');

mongoose.connect(config.database.URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database");
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('*', (req, res, next) => {
    console.log(req.path);
    next();
});




app.get('/api/admin/users', function (req, res) {
    res.json(['user1', 'user2', 'user3']);
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}),
    function (req, res) {

        // var profile = {
        //     displayName: req.user.displayName,
        //     photo: req.user.photos[0].value
        // };
        //
        // var jwt = {
        //     blah: 'sdrgergcregrtg'
        // };

        // var message = JSON.stringify({
        //     type:'access_token_github',
        //     access_token: 'ieruhcoeruihg ioreug',
        //     expires_in:  '23455',
        //     profile: profile
        // });


        // var accepted_origin = "http://localhost:3001/";
        // var js = `window.opener.postMessage(${message}, \'${accepted_origin}\');window.close()`;
        //
        // res.send(`<script>${js}</script>`);

        res.json(req.user);
    }
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/'}),
    function (req, res) {

        res.json(req.user);
    }
);

app.post('/auth/local/register', function (req, res) {
    var password = req.body.password;
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname || '',
        lastname: req.body.lastname || ''
    });
    var register = function(err, user) {
        if (err) {
            return res.status(500).json({ err: err });
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({ status: 'Registration Successful!' });
        });
    };

    User.register(newUser, password, register);
});

app.post('/auth/local', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                err: info
            });
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});


var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    console.log('The app listening at http://%s:%s', server.address().address, server.address().port);
});
