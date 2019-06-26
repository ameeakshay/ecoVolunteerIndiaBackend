
var crypto = require('crypto');
var common = require('../common/common.js');
var models = require('../models');
var Sequelize = require('sequelize');

const Op = Sequelize.Op;
var Event = models.event;
var VolEventMap = models.volEventMap;

exports.add_event = function(req, res) {

    if (req.body.eventName && req.body.eventDate && req.body.noOfVolsReq) {

        console.log("volunteer  " + req.user.voulnteerId + " is posting an event. " + "Event date: " + req.body.eventDate + " Event name: " + req.body.eventName);

        const random_id = crypto.randomBytes(16).toString('hex');

        var eventData = {
            eventId : random_id,
            eventName: req.body.eventName,
            eventDate: req.body.evventDate,
            eventDescription: req.body.eventDescription,
            noOfVolsReq: req.body.noOfVolsReq,
            noOfVolsReg : 0,
            eventStatus : 'Ongoing'
        };

        Event.create(eventData).then(function (newEvent) {

            temp = common.ResponseFormat(200, '', []);

            if (newEvent) {

                var mapData = {
                    volunteerVolunteerId : req.user.id,
                    eventEventId : newEvent.eventId
                };

                VolEventMap.create(mapData).then(function (newMap) {
                    if (newMap) {
                        temp = common.ResponseFormat(201, 'Successfully created the event', newEvent);
                    }
                    else {
                        temp = common.ResponseFormat(409, 'Unable to create the map', {});
                    }
                });
            }
            else {
                temp = common.ResponseFormat(409, 'Unable to create the event', {});   
            }

            res.status(temp.status)
                .json(temp);
        });
    }
};


exports.get_events = function(req, res) {

    console.log(req.user);
    temp = common.ResponseFormat(200, '', []);
    Event.findAll().then(function(events) {
        if (events) {
            temp.status = 200;
            temp.message = 'All list of events..';
            temp.data = events;
        }
        else {
            temp.message = 'Unable to retrieve volunteer info ';
        }

        res.status(temp.status)
        .json(temp);
    })
};

/*
exports.get_events = function(req, res) {

    let page = req.query.page;
    let limitTenders = 15;
    let offsetTenders = limitTenders * (page - 1);

    Tender.findAndCountAll({where: {clientId: req.user.id}, limit: limitTenders, offset: offsetTenders}).then(function(clientTenders) {

        console.log(clientTenders);

        temp = common.ResponseFormat(200, '', []);

        if (clientTenders.rows.length) {
            
            let pages = Math.ceil(clientTenders.count / limitTenders);
            
            temp.message = 'Retreived all Tenders for Client ' + req.user.id;
            temp.data = clientTenders.rows;
            temp.current_page_count = clientTenders.rows.length;
            temp.total_count = clientTenders.count;
        }
        else {
            temp.message = 'Unable to find Tenders posted by Client ' + req.user.id;
        }
        
        res.status(temp.status)
            .json(temp);
    })
};
*/

