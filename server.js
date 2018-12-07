const express = require("express");
const Bundler = require('parcel-bundler');

const dev = process.env.NODE_DEV !== 'production';
const app = express();
const port = 3000;
const jbRoutes = require("./routes/jb");
const entryPoint = './src/*.html';
const bundler = new Bundler(entryPoint, {});

app.get("/", (req, res) => {
  res.redirect("./dashboard-engineers.html");
});

app.use("/jb", jbRoutes);

app.use(bundler.middleware());

app.listen(port, () => {
  console.log("Listening on port", port);
});
