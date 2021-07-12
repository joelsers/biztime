/** Database setup for BizTime. */

const { Client } = require("pg")

let DB_URI = "postgresql://joelser:joelser123@localhost:5432/biztime";

if (process.env.NODE_ENV === "test") {

    DB_URI = "postgresql://joelser:joelser123@localhost:5432/biztime_test"
} else {
    DB_URI = "postgresql://joelser:joelser123@localhost:5432/biztime"
}

let db = new Client({
    connectionString: DB_URI
})

db.connect();

module.exports = db