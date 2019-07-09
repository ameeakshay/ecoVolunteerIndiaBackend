
var crypto = require('crypto');
var common = require('../common/common.js');
var models = require('../models');
var sequelize = require('sequelize');
var randomstring = require('randomstring');

exports.get_all_volunteers = function(req, res) {

    var User = models.volunteer;
    var attributes_user;
    if (req.user) {
        attributes_user = ['volunteerName', 'phoneNumber', 'email', 'bio', 'occupation'];
    } else {
        attributes_user = ['volunteerName', 'bio', 'occupation'];
    }


    if (User != null) {

        User.findAll({attributes: attributes_user}).then(function(user) {

            temp = common.ResponseFormat(200, '', {});

            if (user) {

                    temp.message = 'Data for all volunteers ';
                    temp.data = user;
                     
                    res.status(temp.status)
                        .json(temp);   

            }
            else {
                temp.message = 'Unable to retrieve volunteer info ';                
                 
                res.status(temp.status)
                    .json(temp);
            }
        
        });
    }
};


exports.get_volunteers = function(req, res) {

    var Map = models.volEventMap;
    var Volunteer = models.volunteer;
    var attributes_user = ['volunteerName', 'phoneNumber', 'email', 'bio', 'occupation'];
             
                Volunteer.findAll({include : [{model : models.event}]}).then(function(vol) {
                    
                        if (vol) {
                            temp = common.ResponseFormat(200, 'All volunteer details for event ', vol);
                        } else {
                            temp = common.ResponseFormat(500, 'No data found', {});
                        }
                });
                     
                res.status(temp.status)
                    .json(temp);   

 
};


exports.insert_volunteers = function(req, res) {

    Volunteer = models.volunteer;

    req.body.data.forEach(element => {
        var userPassword = common.generateHash(element.password);
        const random_id = crypto.randomBytes(16).toString('hex');
        console.log(random_id);
    
        var data = {
            volunteerId: random_id, 
            email: element.username,
            password: userPassword,
            volunteerName: element.volunteerName,
            phoneNumber: element.phoneNumber,
            bio: element.bio,
            occupation: element.occupation
        };    
        temp = common.ResponseFormat(500, '', {});
        Volunteer.create(data).then(function(newUser) {

            if (!newUser) {

                temp = common.ResponseFormat(200, 'Unable to create the User', []);
            }

            if (newUser) {

                temp = common.ResponseFormat(200, 'User created Successfully', newUser);

                var permalink_local = element.username.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();

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
                var Verification = models.verification;
                temp.status = 200;

                Verification.create(link_data).then(function(client) {

                    if (!client) {
                        console.log("error");
                        temp.message = 'error with verification process';
                        temp.data = null;
                    }

                    temp.message = 'Successful Signup and link generated';
                    temp.data = newUser;
                    console.log(temp.message);
                });
                
            }

        });
    });

    return res.status(temp.status).json(temp);
 
};