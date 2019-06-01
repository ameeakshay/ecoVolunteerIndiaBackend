var express = require('express');
var authenticationRouter = express.Router();

var authentication = require('../controllers/authenticationController.js');

authenticationRouter.post('/login', authentication.login);
authenticationRouter.post('/signup', authentication.signup);
authenticationRouter.get('/verification/:link/:token/:id', authentication.verify);

module.exports = authenticationRouter;