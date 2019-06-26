
var common = require('../common/common.js');
var models = require('../models');
var sequelize = require('sequelize');

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

    if (Map != null) {

        Map.findAll({ where: { eventEventId :  req.params.eventId}}).then(function(user) {

            temp = common.ResponseFormat(200, '', user);

            if (user) {
                console.log(user);                
                Volunteer.findAll({ where : { volunteerId : user.volunteerVolunteerId}, attributes : attributes_user }).then(function(vol) {
                    
                        if (vol) {
                            temp = common.ResponseFormat(200, 'All volunteer details for event ', vol);
                        } else {
                            temp = common.ResponseFormat(500, 'No data found', {});
                        }
                });
                     
                res.status(temp.status)
                    .json(temp);   

            }
            else {
                temp = common.ResponseFormat(500, 'Unable to retrieve event info', {});                
                 
                res.status(temp.status)
                    .json(temp);
            }
        
        });
    }
};