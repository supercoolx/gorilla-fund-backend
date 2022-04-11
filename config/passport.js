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
				{ address: payload.address || "xxx" }
			]
		}
	})
	.then(user => done(null, {
		id: user.id,
		name: user.name,
		email: user.email,
		avatar: user.avatar,
		emailSetting: user.emailSetting,
		address: user.address,
	}))
	.catch(err => done(err));
});
passport.use(jwtStrategy);

const jwtValidator = passport.authenticate('jwt', { session: false });

module.exports = {
	passport,
	jwtValidator
};