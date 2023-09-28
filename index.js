require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const { URL } = require("url");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let shorts = [];

app.post("/api/shorturl", (req, res) => {
  try {
    const parsedUrl = new URL(req.body.url);
    const hostName = parsedUrl.hostname;
    dns.lookup(hostName, (err, address, family) => {
      if (err) return res.json({ error: "invalid url" });

      let urlId = shorts.length + 1;
      shorts.push({ id: urlId, url: req.body.url });

      return res.json({ original_url: req.body.url, short_url: urlId });
    });
  } catch (err) {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const short = shorts.find((item) => item.id === parseInt(req.params.id));
  console.log(short);

  if (!short) return res.json({ error: "invalid url" });

  return res.redirect(short.url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
