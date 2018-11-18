var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var statusValidos = {
    values: [1, 2, 3, 4, 5],
    messages: "{VALUE} is not valid value"
};

var eventSchema = new Schema({

    name: { type: String, unique: true, required: [true, "The name is required"] },
    description: { type: String, required: [true, "The email is required"] },
    status: { type: Number, min: 1, max: 3, required: [true, "The status is required"], enum: statusValidos },
    is_enterprise: { type: Boolean, required: [true, "The is_enterprise is required"] },
    event_type: {
        type: Schema.Types.ObjectId,
        ref: 'TypeEvent',
        required: [true, 'The id event type is required']
    },
    dateadd: { type: Date, default: Date.now },
    dateupdate: { type: Date, default: Date.now }

});

eventSchema.plugin(uniqueValidator, { message: "The {PATH} must be unique" });

module.exports = mongoose.model('Event', eventSchema);