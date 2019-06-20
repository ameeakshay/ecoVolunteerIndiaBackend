var express = require('express');
var volunteerRouter = express.Router();

var volunteer_info = require('../controllers/volunteerController.js');
var common = require('../common/common.js');

volunteerRouter.get('/volunteers', volunteer_info.get_all_volunteers);

module.exports = volunteerRouter;