/**
 * Api Routes
 */
const express = require('express');
const router = new express.Router({});

// Basic
router.get('/api/v1/register', (req, res) => {
    res.status(200).send("Server App is running OK!").end();
});
module.exports = router;
