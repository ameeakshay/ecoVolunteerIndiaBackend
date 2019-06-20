var express = require('express');
var eventRouter = express.Router();

var events = require('../controllers/eventController.js');
var common = require('../common/common.js');

eventRouter.post('/postEvent', common.isLoggedIn, events.add_event)
eventRouter.get('/events', events.get_events)
/*tenderRouter.get('/client_tenders/', common.isLoggedIn, tenders.get_client_tenders)
tenderRouter.get('/potential_tenders', common.isLoggedIn, tenders.get_potential_tenders)
tenderRouter.get('/tender_bids/:tenderId', common.isLoggedIn, tenders.get_all_bids)
*/
module.exports = eventRouter;