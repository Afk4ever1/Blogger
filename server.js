import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
const filePath = "data.json";

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.jsonFileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading the file:", error);
    return [];
  }
}
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
  } catch (error) {
    console.error("Error writing to the file:", error);
  }
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/create", (req, res) => {
  res.render("create.ejs");
});
app.get("/browse", (req, res) => {
  const jsonDataBr = fs.readFileSync(filePath, "utf8");

  const brData = JSON.parse(jsonDataBr);
  res.render("browse.ejs", { data: brData });
});

app.get("/articles", (req, res) => {
  res.render("articles.ejs");
});

app.get("/browse", (req, res) => {
  const jsonDataBr = fs.readFileSync(filePath, "utf8");
  const brData = JSON.parse(jsonDataBr);
  res.render("browse.ejs", { data: brData });
});

app.get("/get-article", (req, res) => {
  let data_number = req.query.classNum;
  const jsonDataArt = fs.readFileSync(filePath, "utf8");
  const artData = JSON.parse(jsonDataArt);
  res.render("articles.ejs", { data: artData, dataNum: data_number });
});

app.get("/del-article", (req, res) => {
  let articleNum = req.query.classNum;
  const jsonDataDel = readJsonFile(filePath, "utf8");
  jsonDataDel.splice(articleNum, 1);
  writeJsonFile(filePath, jsonDataDel);

  res.render("browse.ejs", { data: jsonDataDel });
});

app.get("/edit-article", (req, res) => {
  let articleNum = req.query.classNum;
  const jsonDataArt = fs.readFileSync(filePath, "utf8");
  const artData = JSON.parse(jsonDataArt);
  res.render("edit.ejs", { data: artData, articleNum: articleNum });
});

app.post("/update", (req, res) => {
  const updatedData = req.body;
  let articleNum = req.query.classNum;

  let oldData = readJsonFile(filePath, "utf8");

  oldData[articleNum].title = updatedData.title;
  oldData[articleNum].author = updatedData.author;
  oldData[articleNum].summary = updatedData.summary;
  oldData[articleNum].article = updatedData.article;
  writeJsonFile(filePath, oldData);
  res.render("articles.ejs", { data: oldData, dataNum: articleNum });
});

app.post("/submit", (req, res) => {
  const formData = req.body;
  let data = readJsonFile(filePath);
  data.push(formData);
  writeJsonFile(filePath, data);
  const jsonData = fs.readFileSync(filePath, "utf8");

  // Parse the JSON data into a JavaScript variable
  const datas = JSON.parse(jsonData);
  app.locals.jsonFileData = 1;
  res.render("browse.ejs", { data: datas });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
