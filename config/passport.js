const passport = require('passport');
const { Op } = require('sequelize');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('./sequelize');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new Strategy(options, (payload, done) => {
  	return User.findOne({ 
		where: {
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
passport.use(jwtStrategy);

const jwtValidator = passport.authenticate('jwt', { session: false });

module.exports = {
	passport,
	jwtValidator
};