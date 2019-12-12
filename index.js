const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const errors = require("./middleware/errors");
const users = require("./routes/user");
const auth = require("./routes/auth");
const movies = require("./routes/movies");
const app = express();

// winston.createLogger({
// 	level: "info",
// 	format: winston.format.json(),
// 	defaultMeta: { service: "user-service" },
// 	transports: [
// 		new winston.transports.File({ filename: "error.log", level: "error" })
// 	]
// });

winston.add(new winston.transports.File({
    filename: "logfile.log"
}));
winston.add(
    new winston.transports.MongoDB({
        db: "mongodb://localhost/mini-netflix-react"
    })
);

winston.exceptions.handle(
    new winston.transports.File({
        filename: "uncatchExceptions.log"
    })
);

process.on("unhandledRejection", (ex) => {
    throw ex;
});

const p = Promise.reject(new Error('Failed'));
p.then(() => console.log('done'))
//check if the private key is set
if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey is not set");
    process.exit(1);
}

// connect to database(mongoose)
mongoose
    .connect("mongodb://localhost/mini-netflix-react", {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connected to MongoDB..."))
    .catch(() => console.log("could not connect to db..."));

// middleware usage
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/movies", movies);

app.use(errors);

// create port to listen to
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

module.exports = server;