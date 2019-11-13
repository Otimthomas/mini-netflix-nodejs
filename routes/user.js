const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash')
const {
    validate,
    User
} = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send('A user with this email already exits');

    user = new User(_.pick(req.body, ['username', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).header('access-control-expose-headers', 'x-auth-token')
        .send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;