const express = require('express');
const controller = require('../controllers/itemController');
const {isLoggedIn, isOwner} = require('../middlewares/auth');
const { validateId } = require('../middlewares/validator');

const router = express.Router();

//GET /trades: send all trades to the user
//Remove prefix, otherwise it will try to get /trades/trades
router.get('/', controller.index);

//GET /trades/new: send html form for creating new item
router.get('/new', isLoggedIn, controller.new);

// //POST /trades: create a new item
router.post('/', isLoggedIn, controller.create);

//GETs /about and /contact pages
router.get('/about', controller.about);
router.get('/contact', controller.contact);

// //GET /trades/:id: send details of item identified by id
router.get('/:id', validateId, controller.display);

// //GET /trades/:id/edit: send html form for editing a item
router.get('/:id/edit', validateId, isLoggedIn, isOwner, controller.edit);

// //PUT /trades/:id: update the item identified by id
router.put('/:id', validateId, isLoggedIn, isOwner, controller.update);

// //DELETE /trades/:id: delete item identified by id
router.delete('/:id', validateId, isLoggedIn, isOwner, controller.delete);

router.get('/:id/watch', validateId, isLoggedIn, controller.watch);

router.get('/:id/unwatch', validateId, isLoggedIn, controller.unwatch);

router.get('/:id/select', validateId, isLoggedIn, controller.select);

module.exports = router;