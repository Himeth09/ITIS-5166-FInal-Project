const model = require('../models/item');

//GET: send all items to the user
exports.index = (req, res, next)=>{
    model.find()
    .then(items => res.render('./trade/index', {items}))
    .catch(err=>next(err));
}

//GET: send html form for creating new item
exports.new = (req, res)=> res.render('./trade/new');

// //POST: create a new story
exports.create = (req, res, next)=>{
    let item = new model(req.body);
    item.owner = req.session.user;
    item.save()
    .then(item => {
        req.flash('success', 'Item successfully created!');
        res.redirect('/trades');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            err.status = 400;
        }
        next(err);
    });
}

// //GET: send details of item identified by id
exports.display = (req, res, next)=> {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item ID');
        err.status = 400;
        return next(err);
    }
    model.findById(id).populate('owner', 'firstName lastName')
    .then(item => {
        if(item){
            console.log(item);
            return res.render('./trade/display', {item});
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

// //GET: send html form for editing an item
exports.edit = (req, res, next)=> {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item ID');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(item => {
        if(item){
            return res.render('./trade/edit', {item});
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

// //PUT: update the item identified by id
exports.update = (req, res, next)=> {
    let item = req.body;
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story ID');
        err.status = 400;
        return next(err);
    }
    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item => {
        if(item){
            req.flash('success', 'Item successfully updated!');
            res.redirect('/trades/'+id);
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
}

// //DELETE: delete item identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item ID');
        err.status = 400;
        return next(err);
    }
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(item => {
        if(item){
            req.flash('success', 'Item successfully deleted!');
            res.redirect('/trades');
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//WATCH: watch item identified by id
exports.watch = (req, res, next)=> {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item ID');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(item => {
        if(item){
            item.watchedBy.push(req.session.user)
            req.flash('success', 'Item addded to watch list!');
            res.redirect('/users/profile');
            item.save();
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//UNWATCH: unwatch item identified by id
exports.unwatch = (req, res, next)=> {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item ID');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(item => {
        if(item){
            item.watchedBy.pull(req.session.user)
            req.flash('success', 'Item removed to watch list!');
            res.redirect('/users/profile');
            item.save();
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//SELECT: select item to trade with
exports.select = (req, res, next)=> {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item ID');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(item => {
        if(item){
            res.redirect('/users/select');
        }else{
            let err = new Error('Cannot find an item with id ' + id + ' :(');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}


exports.about = (req, res) => res.render('./trade/about');

exports.contact = (req, res) => res.render('./trade/contact');