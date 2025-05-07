const express = require("express");
const request = require("request");

const app = express();
const port = 5000;

app.get(/(.*)/, async (req, res) => {
  const url = req.path.substring(1);
  console.info("Proxied:", url);
  request(url)
    .pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

