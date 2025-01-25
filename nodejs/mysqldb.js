const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.HOST1,
  port: process.env.PORT1,
  user: process.env.USER1,
  password: process.env.PASS1,
  database: process.env.DTBS1,
  multipleStatements: true,
  debug: false,
});

async function connect(queryterm) {
  try {
    var res = "";
    res = await db.promise().query(queryterm);
    // console.log(res);
    // console.log(res[0])
    return res[0];
  } catch (err) {
    return undefined;
  }
}

module.exports = connect;

// no need promise() no need async await
// db.query("SHOW TABLES", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(results);
//   });
