const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database("./uploads/1tab.db", (err) => {
  err
    ? console.error(err)
    : db.serialize(() => {
        result = db.run(
          "CREATE TABLE IF NOT EXISTS updatethis (id INTEGER PRIMARY KEY AUTOINCREMENT, URL varchar(255), Title varchar(255));"
        );
      });

  db.close();
}); //sqlite3.OPEN_READWRITE, sqlite3.OPEN_CREATE
async function connect(params) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./uploads/1tab.db", (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                db.serialize(() => {
                    db.all(params, (err, rows) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            }
            db.close();
        });
    });
}
module.exports = connect;

// const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
// for (let i = 0; i < 10; i++) {
//     stmt.run("Ipsum " + i);
// }
// stmt.finalize();

// db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//     console.log(row.id + ": " + row.info);
// });
