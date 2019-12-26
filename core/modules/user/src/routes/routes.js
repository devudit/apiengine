/**
 * Api Routes
 */
const express = require('express');
const router = new express.Router({});
const user = require('../controllers/user.controller');

// Basic
router.post('/api/v1/register', user.userRegister);
router.post('/api/v1/login', user.userLogin);
module.exports = router;
