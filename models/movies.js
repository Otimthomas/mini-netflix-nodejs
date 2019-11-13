const Joi = require('joi');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    imgUrl: {
        type: String,
        required: true
    },
    isFavourite: {
        type: Boolean,
        default: false
    },
    year: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().required().min(5).max(255),
        imgUrl: Joi.string().required(),
        isFavourite: Joi.boolean(),
        year: Joi.string().required()
    }
    return Joi.validate(movie, schema);
}

module.exports.validate = validateMovie;
module.exports.Movie = Movie;