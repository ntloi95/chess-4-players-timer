var express = require("express");
var router = express.Router();
var www = require("../bin/www");
/* GET home page. */
router.get("/", function (_, res, _) {
    res.render("index");
});

var numberPlayers = 0;
var colors = ["white", "yellow", "red", "black"];
router.post("/login", function (req, res) {
    if (numberPlayers >= 4) {
        res.send({ ok: false, message: "Reach limit players!" });
        return;
    }

    res.send({
        ok: true,
        message: `Your color is ${colors[numberPlayers]}`,
        color: numberPlayers,
        currentPlayer: www.currentPlayer(),
    });

    numberPlayers++;
});

module.exports = router;
