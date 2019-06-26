    

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var randomstring = require('randomstring');

var common = require('../common/common.js');
var models = require('../models');
var sequelize = require('sequelize');

var Volunteer = models.volunteer;

exports.login = function(req, res) {

    var User = Volunteer;

    console.log("this prints...");
    User.findOne({where: { email: req.body.username }}).then(function(user) {

        if (!user) {

            temp = common.ResponseFormat(401, 'Authentication Failed. User not found!', {});

            res.status(temp.status)
                .json(temp);
        }

        else if (user) {
            
            if (!common.isValidPassword(user.password, req.body.password)) { 

                temp = common.ResponseFormat(401, 'Authentication Failed. Password Incorrect!', []);

                 res.status(temp.status)
                    .json(temp);
            }
            else {
            
                var Verify = models.verification;
                var temp = {};

                Verify.findOne({where: {volunteerId : user.volunteerId}}).then(function(verify) {
                
                    //console.log(verify);
                    console.log(verify.accountVerified);
                    if (!verify.accountVerified) {

                        temp = common.ResponseFormat(403, 'Please complete the verification before logging in!', verify)

                        return res.status(temp.status)
                                    .json(temp);    
                    }

                    tenderPosting = verify.canPostTender;
                    temp = common.ResponseFormat(200, 'User logged in Successfully', {"token": jwt.sign({ email: user.email, id: user.volunteerId }, 'ecovolunteerindia')});
                    
                    res.status(temp.status)
                            .json(temp);
                });
            }
        }
    })
};

exports.signup = function(req, res) {

    var User;

    User = Volunteer;
    console.log("This prints...");
    User.findOne({ where: { email: req.body.username }}).then(function(user) {
        console.log("inside finOne");
        if (user)
        {

            temp = common.ResponseFormat(409, 'User already exists', {});

            res.status(temp.status)
                .json(temp);
        } 
        else {

            var userPassword = common.generateHash(req.body.password);
            const random_id = crypto.randomBytes(16).toString('hex');
            console.log(random_id);

            var data = {
                volunteerId: random_id, 
                email: req.body.username,
                password: userPassword,
                volunteerName: req.body.volunteerName,
                phoneNumber: req.body.phoneNumber,
                bio: req.body.bio,
                occupation: req.body.occupation
            };

            User.create(data).then(function(newUser) {
                
                if (!newUser) {

                    temp = common.ResponseFormat(200, 'Unable to create the User', []);
                }

                if (newUser) {

                    temp = common.ResponseFormat(200, 'User created Successfully', newUser);

                    var permalink_local = req.body.username.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();

                    var token = randomstring.generate({
                        length: 64
                    });

                    var link_data = {
                        volunteerId : newUser.volunteerId,
                        verify_token : token,
                        permalink : permalink_local,
                        accountVerified : true
                    }
                    console.log(permalink_local +token);

                    var link = "http://" + req.headers.host + "/verification/" + permalink_local + "/" + token + "/" + newUser.volunteerId;

                    var Verification = models.verification;
                    temp.status = 200;

                    Verification.create(link_data).then(function(client) {

                        if (!client) {
                            console.log("error");
                            temp.message = 'error with verification process';
                            temp.data = null;

                            return res.status(temp.status).json(temp);
                        }

                        temp.message = 'Successful Signup and link generated';
                        temp.data = newUser;
                        console.log(temp.message);
                    });

                    var mailOptions = {
                        to: newUser.email,
                        subject: 'Verification link',
                        user: {
                            login_link: link
                        },
                        attachments: [{   // file on disk as an attachment
                            filePath: "../../data/TnC.pdf" // stream this file
                        }]
                    }
                        req.app.mailer.send('email', mailOptions, function (err, message) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log("mail sent");
                            temp.data = {"id": newUser.volunteerId, "email":newUser.email, "type": req.body.type};
                            return res.status(temp.status).json(temp);  
                        });
                    
                }
                
            });
        }
    }); 
};

exports.verify = function(req, res) {

    var Verification = models.verification;

    Verification.update({accountVerified : true}, {where :{volunteerId : req.params.id, $and:[
        {permalink : req.params.link}, 
        {verify_token : req.params.token},
        {accountVerified : false}
        ]}}).then(function(client) {
        console.log(client);
        if(!client) {

            temp = common.ResponseFormat(500, 'Verification Failed!', {});

            return res.status(temp.status)
                        .json(temp);
        } else if(client == 0){
            temp = common.ResponseFormat(403, 'Already verified!', {});

            return res.status(temp.status)
                    .json(temp);
        }
        else {
            temp = common.ResponseFormat(200, 'The email for client ' + req.params.id + ' is verified!', client);

            return res.status(temp.status)
                    .json(temp);
        }
    });
};
