var HOST_NAME = 'http://localhost:3000/';

module.exports = {
    // Oauth Configs
    HOST_NAME: HOST_NAME,
    CALLBACK_URL: HOST_NAME + 'auth/github/callback',

    // fill this according your github settings
    GITHUB_CLIENT_SECRET: 'YOUR_CLIENT_SECRET',
    CLIENT_ID: 'YOUR_CLIENT_ID',

    // Session Congigs
    SESSION_SECRET: 'SESSION-SUPER-SECRET'
};