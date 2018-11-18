var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var statusValidos = {
    values: [1, 2, 3, 4, 5],
    messages: "{VALUE} is not valid value"
};

var eventTypeSchema = new Schema({

    name: { type: String, unique: true, required: [true, "The name is required"] },
    status: { type: Number, min: 1, max: 3, required: [true, "The status is required"], enum: statusValidos },
    description: { type: String, required: [true, "The description is required"] },
    is_tematic: { type: Boolean, required: [true, "The is tematic is required"] },
    dateadd: { type: Date, default: Date.now },
    dateupdate: { type: Date, default: Date.now }

});

eventTypeSchema.plugin(uniqueValidator, { message: "The {PATH} must be unique" });

module.exports = mongoose.model('TypeEvent', eventTypeSchema);