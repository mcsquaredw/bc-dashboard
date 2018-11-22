const express = require("express");
const dev = process.env.NODE_DEV !== 'production';
const next = require("next");
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const jbRoutes = require("./routes/jb");

nextApp.prepare().then(() => {
  const app = express();
  const port = 3000;

  app.set("view engine", "pug");
  app.use(express.static("public"));

  app.get("/", (req, res) => {
    res.redirect("./jobs-engineers.html");
  });

  app.use("/jb", jbRoutes);

  app.listen(port, () => {
    console.log("Listening on port", port);
  });
})
