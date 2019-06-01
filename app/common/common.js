var bCrypt = require('bcrypt-nodejs');

exports.ResponseFormat = function(status, message, data) {
    
	response = {}

    response.status = status,
    response.message = message,
    response.data = data

    return response;

};

exports.generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

exports.isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
};

// route middleware to make sure
exports.isLoggedIn = function(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}