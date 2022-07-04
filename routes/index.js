const express = require('express');
const router = express.Router();
const database = require('../models/database.js');
const Thread = require('../models/Thread.js');

router.get('/', (req, res) => {
    database.findMany(Thread, {}, null, (found) => {
        console.log(found);
        if(found){
            res.render('index', {threads: found});
        }
    });
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;