const express = require('express');
const ExpressError = require("../expressError")


const db = require("../db")
const router = express.Router();


let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
let paid_date = "not paid"


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
        let { comp_code, amt, paid } = req.body
        if (paid == "false") {
            paid_date = null
        } else {
            paid_date = mm + '/' + dd + '/' + yyyy;
        }

        const results = await db.query(`INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES ($1, $2, $3, $4) RETURNING comp_code, amt, paid, paid_date`, [comp_code, amt, paid, paid_date])
        return res.status(201).json({ "invoice": results.rows })
    } catch (err) {
        return next(err)
    }
})



router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id
        let { amt, paid } = req.body
        if (paid == "false") {
            paid_date = null
        } else {
            paid_date = mm + '/' + dd + '/' + yyyy;
        }
        const results = await db.query(`UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING id, amt, paid_date, paid`, [amt, paid, paid_date, id])
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