var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var statusValidos = {
    values: [1, 2, 3, 4, 5],
    messages: "{VALUE} is not valid value"
};

var userSchema = new Schema({

    fullname: { type: String, required: [true, "The fullname is required"] },
    email: { type: String, unique: true, required: [true, "The email is required"] },
    password: { type: String, required: [true, "The password is required"] },
    status: { type: Number, min: 1, max: 3, required: [true, "The status is required"], enum: statusValidos },
    type: { type: Number, min: 1, max: 3, required: [true, "The type is required"] },
    verifyed: { type: Boolean, required: [true, "The verifyed is required"] },
    img: { type: String, required: false },
    dateadd: { type: Date, default: Date.now },
    dateupdate: { type: Date, default: Date.now }

});

userSchema.plugin(uniqueValidator, { message: "The {PATH} must be unique" });

module.exports = mongoose.model('User', userSchema);