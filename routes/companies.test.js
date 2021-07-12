process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

const db = require("../db")

let testCompany;
beforeEach(async () => {
    let companies = await db.query(`INSERT INTO companies (code, name, description) VALUES ('test', 'test name','test description') RETURNING code, name, description`)
    // let invoices = await db.query(`INSERT INTO invoices ()`)
    testCompany = companies.rows[0]
    // testInvoice = invoices.rows[0]
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
    // await db.query(`DELETE FROM invoices`)
})

afterAll(async () => {
    await db.end()
})

describe("testing company", () => {
    test("TEST", () => {
        console.log(testCompany);
        expect(1).toBe(1);
    })
})

describe("testing /companies routes", () => {
    test("body matches db", async () => {
        const response = await request(app).get(`/companies`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([{ "code": "test", "description": "test description", "name": "test name" }])
    });

    test("creating a new company", async () => {
        const response = await request(app).post("/companies").send({ code: "test1", name: "testcompany", description: "test description yo" })
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({ "company": [{ code: "test1", name: "testcompany", description: "test description yo" }] })
    })

});


