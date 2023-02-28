const express = require("express");
const morgan = require("morgan");
const { router } = require("./routes");

const ExpressError = require("./expresserror");

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use("/items", router);

// 404 handler
app.use(function (req, res, next) {
	const notFoundError = new ExpressError("Not Found", 404);
	return next(notFoundError);
});  

//global error handler
app.use(function(err, req, res, next) {
	let status = err.status;
	let message = err.message;
  
	// set the status and alert the user
	return res.status(status).json({
	    error: {message, status}
	});
});

module.exports = app;