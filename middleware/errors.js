const winston = require("winston");

module.exports = (err, req, res, next) => {
	// Log the exception
	winston.error(err.message);
	res.status(500).send("Something failed");
};
