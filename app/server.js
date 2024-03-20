const express = require("express");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.post("*", async (req, res) => {
    res.send("This is Post");
});

app.get("*", async (req, res) => {
    res.send("This is Get");
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT ", `${PORT}`)
});