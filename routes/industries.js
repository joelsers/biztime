const express = require('express');
const ExpressError = require("../expressError")


const db = require("../db")
const router = express.Router();

router.get('/', async (req, res, next) => {
    // const results = await db.query(`SELECT * FROM companies`)
    // return res.json(results.rows)
    try {
        const results = await db.query(`SELECT * FROM company_industries`)
        return res.json(results.rows)
    } catch (err) {
        return next(err)
    }
});


router.post('/', async (req, res, next) => {
    try {

        let { industry_code, industry_name } = req.body;
        const results = await db.query(`INSERT INTO industries (industry_code, industry_name) VALUES ($1, $2) RETURNING industry_code, industry_name`, [industry_code, industry_name]);

        return res.status(201).json({ "industries": results.rows })

    } catch (err) {
        return next(err)
    }
});



module.exports = router;