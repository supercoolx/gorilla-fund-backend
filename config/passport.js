const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('./sequelize');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new Strategy(options, (payload, done) => {
  return User.findOne({ 
		where: { email: payload.email } 
	})
	.then(user => done(null, user))
	.catch(err => done(err));
});
passport.use(jwtStrategy);

const jwtValidator = passport.authenticate('jwt', { session: false });

module.exports = {
	passport,
	jwtValidator
};