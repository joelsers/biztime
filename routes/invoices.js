const express = require('express');
const ExpressError = require("../expressError")


const db = require("../db")
const router = express.Router();


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json(results.rows)
    } catch (err) {
        return next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404)
        }
        return res.json({ "invoice": results.rows })
    } catch (err) {
        return next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let { comp_code, amt } = req.body
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING comp_code, amt`, [comp_code, amt])
        return res.status(201).json({ "invoice": results.rows })
    } catch (err) {
        return next(err)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id
        let { amt } = req.body
        const results = await db.query(`UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, amt`, [amt, id])
        if (results.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        }
        return res.json({ "invoices": results.rows })
    } catch (err) {
        return next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id
        const results = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING id`, [id])
        if (results.rows.length == 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404)
        } else {
            return res.json({ "status": "deleted" });
        }
    } catch (err) {
        return next(err)
    }
})

module.exports = router;