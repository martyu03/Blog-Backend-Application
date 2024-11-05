//auth.js
const jwt = require("jsonwebtoken");
const secret = "BlogManagement";

module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		username: user.username,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, secret, {});
}

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === 'undefined') {
        return res.status(400).send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length); 

        jwt.verify(token, secret, (err, decodedToken) => { 
            if (err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken; 
                req.userId = decodedToken.id;
                next();
            }
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {

	if(req.user.isAdmin) {

		next();

	} else {

		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

module.exports.errorHandler = (err, req, res, next) => {

	console.error(err);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER ERROR',
			details: err.details || null 
		}
	})
}

module.exports.isLoggedIn = (req, res, next) => {
	if(req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
}