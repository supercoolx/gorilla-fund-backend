const passport = require('passport');
const { Op } = require('sequelize');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User, Admin } = require('./sequelize');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new Strategy(options, (payload, done) => {
  	return User.findOne({ 
		where: {
			deleted: false,
			[Op.or]: [
				{ email: payload.email || "xxx" },
				{ walletAddress: payload.walletAddress || "xxx" }
			]
		}
	})
	.then(user => {
		if(user) return done(null, user);
		else throw new Error('Cannot find user.');
	})
	.catch(err => done(err));
});
const adminStrategy = new Strategy(options, (payload, done) => {
	return Admin.findOne({ where: { email: payload.email } })
	.then(admin => {
		if(admin) return done(null, admin);
		else throw new Error('Cannot find admin.');
	})
	.catch(err => done(err));
});

passport.use('user', jwtStrategy);
passport.use('admin', adminStrategy);

const jwtValidator = passport.authenticate('user', { session: false });
const adminValidator = passport.authenticate('admin', { session: false });

module.exports = {
	passport,
	jwtValidator,
	adminValidator
};