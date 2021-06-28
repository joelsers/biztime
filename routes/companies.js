const express = require('express');
const ExpressError = require("../expressError")


const db = require("../db")
const router = express.Router();

router.get('/', async (req, res, next) => {
    // const results = await db.query(`SELECT * FROM companies`)
    // return res.json(results.rows)
    try {
        const results = await db.query(`SELECT * FROM companies`)
        return res.json(results.rows)
    } catch (err) {
        return next(err)
    }
});






module.exports = router;