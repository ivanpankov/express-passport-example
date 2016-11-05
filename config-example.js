var HOST_NAME = 'http://localhost:3000/';
var SESSION_SECRET = 'SESSION-SUPER-SECRET';


exports.HOST_NAME = HOST_NAME;
exports.SESSION_SECRET = SESSION_SECRET;

exports.github = {
    CLIENT_SECRET: 'xxxxx-xxx-xxx',
    CLIENT_ID: 'xxxxx-xxx-xxx',
    CALLBACK_URL: HOST_NAME + 'auth/github/callback'
};

exports.facebook = {
    CLIENT_SECRET: 'xxxxx-xxx-xxx',
    CLIENT_ID: 'xxxxx-xxx-xxx',
    CALLBACK_URL: HOST_NAME + 'auth/facebook/callback'
};

exports.database = {
    URL: 'mongodb://localhost:27017/passportExample',
};
