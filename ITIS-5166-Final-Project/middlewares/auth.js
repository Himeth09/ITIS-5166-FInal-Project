const item = require('../models/item');

//Check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    }else{
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    }else{
        req.flash('error', 'You are not logged in');
        return res.redirect('/users/login');
    }
};

exports.isOwner = (req, res, next) => {
    let id = req.params.id;
    item.findById(id)
    .then(item => {
        if(item) {
            if(item.owner == req.session.user) {
                return next();
            }else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err => next(err));
};