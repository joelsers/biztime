const express = require('express');
const slugify = require("slugify");
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
        const results = await db.query(`SELECT c.code, c.name, i.industry_name
        FROM companies AS c
        LEFT JOIN company_industries AS ci
        ON c.code = ci.code
        LEFT JOIN industries AS i
        ON ci.industry_code = i.industry_code
        WHERE c.code = $1;`, [code])
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

        let { name, description } = req.body;
        let code = slugify(name, { lower: true });
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);

        return res.status(201).json({ "company": results.rows })

    } catch (err) {
        return next(err)
    }
});

router.put("/:code", async (req, res, next) => {
    try {
        let code = req.params.code;
        let { name, description } = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description`, [name, description, code])
        if (results.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        }
        return res.json({ "company": results.rows })
    } catch (err) {
        return next(err)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        let code = req.params.code
        const results = await db.query(`DELETE FROM companies WHERE code = $1 RETURNING code`, [code])

        if (results.rows.length == 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({ "status": "deleted" });
        }
    } catch (err) {
        return next(err)
    }
})




module.exports = router;