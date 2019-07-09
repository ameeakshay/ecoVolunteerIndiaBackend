var express = require('express');
var volunteerRouter = express.Router();

var volunteer_info = require('../controllers/volunteerController.js');
var common = require('../common/common.js');

volunteerRouter.get('/volunteers', volunteer_info.get_all_volunteers);
volunteerRouter.get('/volunteers/:eventId', volunteer_info.get_volunteers);
volunteerRouter.post('/insertVolunteers', volunteer_info.insert_volunteers);

module.exports = volunteerRouter;