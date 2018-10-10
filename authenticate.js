var passport = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var User = require('./models/user');
var config = require('./config');

var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

exports.GetToken = (user) => {
	return jwt.sign(user, config.secretKey, {expiresIn : 7200000 });
}

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JWTStrategy(opts, 
	(jwt_payload, done) => {
		console.log(jwt_payload);
		User.findOne({_id: jwt_payload._id}, (err, user) => {
			if(err){
				return done(err, false);
			}
			else if(user){
				return done(null, user);
			}
			else{
				return done(null, false);
			}
		})
	}))
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());