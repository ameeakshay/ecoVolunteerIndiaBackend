
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

