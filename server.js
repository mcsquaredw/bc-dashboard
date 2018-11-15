const express = require("express");
const app = express();
const port = 3000;
const jbRoutes = require("./routes/jb");
const gdnRoutes = require("./routes/gdn");

app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("./jobs-engineers.html");
});
app.use("/jb", jbRoutes);
app.use("/gdn", gdnRoutes);

app.listen(port, () => {
  console.log("Listening on port", port);
});
