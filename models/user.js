const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

// create a schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        name: this.username,
        email: this.email,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        username: Joi.string().required().min(5).max(255),
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(6).max(1024)
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;