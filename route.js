// route.js
const express = require('express');
const userRoutes = require('./user');

const router = express.Router();
console.log("route /user");

router.use('/user', userRoutes);


module.exports = router;
