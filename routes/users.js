var express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
const cors = require('./cors');

var passport = require('passport');
var authenticate = require('../authenticate');
var crypto = require('crypto');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/signup')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {
	if(req.body.name != null){
		User.register(new User({name: req.body.name, username: req.body.username}), req.body.password, (err, user) => {
			if(err){
				res.status = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({err: err});
			}
			else{
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: 'Registered Successfully'});
				});
				
			}
		})
	}
	else if(req.body.name == null){
		User.find({username: req.body.username})
		.then((user) => {
			console.log("Initial User is", user);
			if(user[0] != undefined){
				name = user[0].username;
			}
			else{
				name = null;
			}
			if(name !== null && req.body.password != ''){
				user[0].setPassword(req.body.password, (next) => {
					user[0].save();
					res.status= 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({id: null, name: null, success: false, status: 'User doesnot exist', token: null});
				})
			}
			else{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({id: null, name: null, success: false, status: 'User doesnot exist', token: null});	
			}
		})
	}
	
});

router.route('/checkEmail')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,  (req, res, next) => {
	User.find({username: req.body.username})
		.then((user) => {
			if(user[0] != undefined){
				name = user[0].username;
			}
			else{
				name = null;
			}
			if(name !== null){
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({id: null, name: null, success: true, status: 'Email exists', token: null});
			}
			else{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({id: null, name: null, success: false, status: 'Email doesnot exist', token: null});	
			}
		})	
});

router.route('/login')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,  (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if(err){
			next(err)
		}
		else if(!user){
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({name: null, success: false, status: 'Login Unsuccessful!', err: info});
		}
		else{
			req.logIn(user, (err) => {
				if(err){
						res.statusCode = 401;
						res.setHeader('Content-Type', 'application/json');
						res.json({id: null, name: null, success: false, status: 'Login Unsuccessful!', err: 'User unable to login'});
				}
				else{
					var token = authenticate.GetToken({_id : req.user._id});
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({id: req.user._id, name: user.name, success: true, status: 'Login Successful!', token: token});
				}
			})
		}
	}) (req, res, next);
	
});

router.route('/logout')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
	if(req.session){
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/')
	}
	else{
		var err = new Error('You are not logged in!');
	    err.status = 403;
	    next(err);
	}
});

router.route('/checkJWTToken')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res) => {
	passport.authenticate('jwt', {session: false}, (err, user, info) => {
		if(err){
			next(err);
		}
		if(!user){
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
      		return res.json({status: 'JWT invalid!', success: false, err: info});
		}
		else{
			res.statusCode = 200;
      		res.setHeader('Content-Type', 'application/json');
      		return res.json({status: 'JWT valid!', success: true, user: user});
		}
	}) (req, res)
});

module.exports = router;
