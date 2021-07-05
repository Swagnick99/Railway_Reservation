const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { DateTime } = require("luxon");

dotenv.config();

const mongoose = require("mongoose");
const Trains = require("./models/trains");

const mongoDB = process.env.MONGO_URL;

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var router = express.Router();

router.route("/")
	.get((req, res) => {
		res.redirect("/schedule");
	});

router.route("/log-in")
	.get((req, res) => {
		res.render("login");
	});

router.route("/sign-up")
	.get((req, res) => {
		res.render("signup");
	});

router.route("/schedule")
	.get((req, res) => {
		res.render("schedule", {query:false});
	})
	.post((req, res) => {
		Trains.find({to: req.body.to, from:req.body.from})
		.exec(function(err, trains){
			if(err) res.send(err);
			res.render("schedule", {trains:trains, query:true, DateTime, to:req.body.to, from:req.body.from});
		});
	});

app.use("/", router);
app.listen(3000, () => console.log("Listening on port 3000..."));