const { validationResult } = require('express-validator');
const model = require('../models/user');
const Item = require('../models/item');

exports.new = (req, res)=>{
        res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(user=> {
        req.flash('success', 'Account successfully created!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'Welcome back ' + user.firstName + '!');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Item.find({owner: id}), Item.find({watchedBy: id})])
    .then(results=> {
        const [user, items, watching] = results;
        res.render('./user/profile', {user, items, watching});
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err){ 
           return next(err);
        }else {
            res.redirect('/');
        }  
    });
 };

 exports.select = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Item.find({owner: id})])
    .then(results=> {
        const [user, items] = results;
        res.render('./user/select', {user, items});
    })
    .catch(err=>next(err));
};


