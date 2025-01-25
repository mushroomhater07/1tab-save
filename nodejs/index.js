"use strict";
var express = require("express");

const app = express();
const port = 3000;
const connect = require("./mysqldb.js");
// const connect = require("./sqlite3db.js");

app.use(express.json({ limit: "50mb" })); //accept data in JSON format
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/web/index.html");
});
app.get("/table/:table", (req, res) => {
  res.sendFile(__dirname + "/web/index.html");
});
app.get("/import", (req, res) => {
  res.sendFile(__dirname + "/web/import.html");
});
// app.post("/import/:table", async (req, res) => {
//   let list = [];
//   const regex = /^(.*?) \| (.*)/gm;

//   let match;
//   while ((match = regex.exec(req.body.data)) !== null) {
//     let temp = { url: match[1], title: match[2] };
//     // list.push(temp);
//     list = [...list, temp];
//     connect(
//       `INSERT INTO ${req.params.table} (URL, Title) VALUES ('${match[1]}', '${match[2]}')`,
//       (err, results) => {
//         if (err) {
//           res.status(500).json({ error: "error" });
//           return;
//         }
//         res.status(200).json({ message: "Data inserted successfully" });
//       }
//     );
//   }
// });
app.post("/import/:table", async (req, res) => {
  // let list = [];
  const regex = /^(.*?) \| (.*)/gm;
  let match;
  let promises = [];

  let counter = 0;
  // console.log(req.body.data);
  while ((match = regex.exec(req.body.data)) !== null) {
    counter++;
    console.log(counter);
    // let temp = { url: match[1], title: match[2] };
    // list.push(temp);

    promises.push(
      new Promise(async (resolve, reject) => {
        const res1 = await connect(
          `INSERT INTO ${req.params.table} (URL, Title) VALUES ('${match[1]}', '${match[2]}')`
        );
        res1 === undefined ? reject(err) : resolve(results);
      })
    );
  }

  try {
    await Promise.all(promises);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: "error" });
  }
});
app.post("/api/createtable", async (req, res) => {
  // console.log(req.body.table);
  const res1 = await connect(
    `CREATE TABLE ${req.body.table} (id int NOT NULL AUTO_INCREMENT, URL varchar(255), Title varchar(255), PRIMARY KEY (id))`
  );
  res1 === undefined
    ? res.status(500).json({ error: "error" })
    : res.status(200).json({ message: "Table created successfully" });
});
app.get("/deletetable/:table", (req, res) => {
  // console.log(req.params.id);
  res.json({ message: "Table deleted successfully" });
});
app.get("/deleteitem/:table/:item", (req, res) => {
  console.log(req.params);
  res.json({ message: "Item deleted successfully" });
});
app.post("/move/:item", (req, res) => {});
app.post("/group/:item", (req, res) => {});

app.get("/export/:table", async (req, res) => {
  // Data to export
  const res1 = connect(`SELECT * FROM ${req.params.table}`);
  if (res1 === undefined) {
    res.status(500).json({ error: "error" });
  } else {
    let dataToExport = "";
    results.forEach((result) => {
      dataToExport += result.URL + " | " + result.Title + "\n";
    });
    // Set the appropriate headers for the response
    res.set({
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="exported_file.txt"',
    });

    // Send the data as the response
    res.send(dataToExport);
  }
});

app.get("/api/data/:table", async (req, res) => {
  // console.log(req.params)
  const res1 = await connect(`SELECT * FROM ${req.params.table}`);
  res1 === undefined
    ? res.status(500).json({ error: "error" })
    : res.json(res1);
});

app.get("/api/tables", async (req, res) => {
  try{
  const res1 = await connect("SHOW TABLES");
  // const res1 = await connect("SELECT     name FROM     sqlite_schema WHERE     type ='table' AND     name NOT LIKE 'sqlite_%';");
  console.log(res1);
  res1 === undefined
    ? res.status(500).json({ error: "error" })
    : res.json(res1);
  }catch(err){res.status(500).json({ error: "error" })}
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// app.engine('html', require('ejs').renderFile);// Set view engine to HTML
// app.set('view engine', 'html');

// app.set('views', path.join(__dirname, 'views'));// Set view engine
// app.set('view engine', 'ejs');

// app.use(express.static(path.join(__dirname, 'public')));// Middleware to serve static files

const controller = require("./puppeteer.js");
app.get("/report", controller.generateReport); // require chromium to be installed

const upload = require("./multer.js");
const fs = require("fs");
app.post("/upload", upload.single("file"), async (req, res) => {
  // Handle the uploaded file
  const regex = /^(.*?) \| (.*)/gm;
  let match;
  const filePath = req.file.path;

  // // Read the file asynchronously
  await fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    //     // Split the file content into lines
    const lines = data.split("\n");

    //     // Process each line
    lines.forEach(async (line, index) => {
      match = regex.exec(line);
      console.log(index);
      // let temp = { url: match[1], title: match[2] };
      // list.push(temp);
    });
    res.json({ message: "File uploaded successfully!" });
  });
});
