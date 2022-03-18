const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
console.log(__dirname);
console.log(path.join(__dirname, "../"));
console.log(path.join(__dirname, "../public"));
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
app.set("view engine", "hbs");
const viewsDirectory = path.join(__dirname, "../templates/views");
app.set("views", viewsDirectory);
const hbs = require("hbs");
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);
const request = require("request");
const url = "https://newsapi.org/v2/top-headlines?country=eg&category=business&apiKey=c2dc09cc963d4338abfeb89c0eaedd69"
request({ url, json: true }, (error, response) => {
  if (error) {
    return app.get("/", (req, res) => {
      res.send({ error: "unable to connect" });
    });
  } else if (response.body.message) {
    return app.get("/", (req, res) => {
      res.send({ message: response.body.message });
    });
  } else if (response.body.articles.length == 0) {
    return app.get("/", (req, res) => {
      res.send({
        message: "No Articles",
      });
    });
  }
  app.get("/", (req, res) => {
    if (response.body.message)
      return res.send({ messsage: response.body.message });
    res.render("index", { articles: response.body.articles });
  });
});
app.listen(port, () => {
  console.log("server is running");
});
