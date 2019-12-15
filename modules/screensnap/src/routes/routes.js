/**
 * Api Routes
 */
const express = require('express');
const router = new express.Router({});
const screensnap = require('../controllers/screensnap.controller');

// Basic
router.get('/screensnap',screensnap.screensnap);
module.exports = router;
