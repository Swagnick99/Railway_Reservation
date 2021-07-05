const mongoose = require("mongoose");

var TrainsSchema = new mongoose.Schema({
	number: Number,
	to: String,
	from: String,
	dep_time: Object,
	arr_time: Object
});

module.exports = mongoose.model("Trains", TrainsSchema);