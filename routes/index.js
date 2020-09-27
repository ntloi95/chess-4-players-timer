var express = require("express");
var router = express.Router();
const uuid = require("uuid");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index");
});

var mappingPlayers = {};
var numberPlayers = 0;
var colors = ["white", "yellow", "red", "black"];
router.post("/login", function (req, res) {
    if (numberPlayers >= 4) {
        res.send({ ok: false, message: "Reach limit players!" });
        return;
    }

    const id = uuid.v4();
    mappingPlayers[id] = numberPlayers;

    req.session.userId = id;
    req.session.playerId = numberPlayers;
    res.send({
        ok: true,
        message: `Your color is ${colors[numberPlayers]}`,
        color: numberPlayers,
    });

    numberPlayers++;
});

module.exports = router;
