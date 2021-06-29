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

router.get('/:code', async (req, res, next) => {
    try {
        let code = req.params.code;
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        }
        return res.json({ "company": results.rows })

    } catch (err) {
        return next(err)
    }
});

router.post('/', async (req, res, next) => {
    try {
        console.log('cool')
        let { code, name, description } = req.body;
        console.log('cool')
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
        console.log('cool')
        return res.status(201).json({ "company": results.rows })

    } catch (err) {
        return next(err)
    }
});





module.exports = router;