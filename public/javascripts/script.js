var currentPlayerId = 0;
var currentPlayerIndex = 0;
var functionInterval = new Array(4);
var functionFreeTimer = new Array(4);
var listPlayers = [0, 1, 2, 3];

function getTimerPlayer(id) {
    let timerElementId = `timer-player-${id}`;
    return document.getElementById(timerElementId);
}

function getFreeTimerPlayer(id) {
    let timerElementId = `free-timer-player-${id}`;
    return document.getElementById(timerElementId);
}

function getIndicatorPlayer(id) {
    let indicatorElementId = `indicator-player-${id}`;
    return document.getElementById(indicatorElementId);
}

function getPlayerName(id) {
    let nameElementId = `player-name-${id}`;
    return document.getElementById(nameElementId);
}

function getRowPlayer(id) {
    let rowElementId = `row-${id}`;

    return document.getElementById(rowElementId);
}

function moveNextPlayer() {
    let prevIndicator = getIndicatorPlayer(currentPlayerId);
    prevIndicator.className = "hide";

    let prevfreeTimer = getFreeTimerPlayer(currentPlayerId);
    prevfreeTimer.className = "hide";

    let prevTimer = getTimerPlayer(currentPlayerId);
    prevTimer.className = "text-row";

    stopCountDownPlayer(currentPlayerId);

    currentPlayerIndex = (currentPlayerIndex + 1) % listPlayers.length;
    currentPlayerId = listPlayers[currentPlayerIndex];

    let currentIndicator = getIndicatorPlayer(currentPlayerId);
    currentIndicator.className = "triangle-playing";
    let currentFreeTimer = getFreeTimerPlayer(currentPlayerId);
    currentFreeTimer.className = "progress-circle";

    startCountDownPlayer(currentPlayerId);
}

function startCountDownPlayer(id) {
    let freeTimer = getFreeTimerPlayer(id);
    freeTimer.dataset.progress = 0;

    functionFreeTimer[id] = setInterval(function () {
        freeTimer.dataset.progress = parseInt(freeTimer.dataset.progress) + 1;

        if (parseInt(freeTimer.dataset.progress) >= 100) {
            freeTimer.className = "hide";
            clearInterval(functionFreeTimer[id]);
            let currentTimer = getTimerPlayer(currentPlayerId);
            currentTimer.className = "change-color";
            currentTimer.style.fontSize = "";

            functionInterval[id] = setInterval(function () {
                let timer = getTimerPlayer(id);

                let second = timer.innerText;

                second -= 1;
                if (second <= 0) {
                    clearInterval(functionInterval[id]);
                    second = 0;
                    checkmatePlayer();
                }
                timer.innerText = second;
            }, 1000);
        }
    }, 100);
}

function stopCountDownPlayer(id) {
    if (functionInterval[id] != undefined) {
        clearInterval(functionInterval[id]);
    }

    if (functionFreeTimer[id] != undefined) {
        clearInterval(functionFreeTimer[id]);
    }
}

function checkmatePlayer(id) {
    if (!listPlayers.includes(id)) {
        return;
    }

    let row = getRowPlayer(id);
    row.className += " check-mate";
    let currentFreeTimer = getFreeTimerPlayer(id);
    currentFreeTimer.className = "hide";
    let currentTimer = getTimerPlayer(id);
    currentTimer.className = "text-row";
    stopCountDownPlayer(id);
    listPlayers = listPlayers.filter(function (i) {
        return id != i;
    });

    currentPlayerIndex -= 1;
    if (currentPlayerIndex < 0) {
        currentPlayerIndex = listPlayers.length - 1;
    }
    currentPlayerId = listPlayers[currentPlayerIndex];
    moveNextPlayer();
}

const messages = document.querySelector("#messages");
const wsButton = document.querySelector("#wsButton");
const wsSendButton = document.querySelector("#wsSendButton");
const logout = document.querySelector("#logout");
const login = document.querySelector("#login");

function showMessage(data) {
    messages.textContent = data.message;
}

function handleResponse(response) {
    return response.ok
        ? response.json().then((data) => data)
        : Promise.reject(new Error("Unexpected response"));
}

let ws;
let color;
let userId;

login.onclick = function () {
    login.disabled = true;
    fetch("/login", { method: "POST", credentials: "same-origin" })
        .then(handleResponse)
        .then(function (data) {
            showMessage(data);
            if (data.ok) {
                color = data.color;
                userId = data.color;
                for (i = 0; i < data.currentPlayer; i++) {
                    moveNextPlayer();
                }
                openWebSocket();
                afterLogin();
            } else {
                userId = -1;
                openWebSocket();
                afterLogin();
            }
        })
        .catch(function (err) {
            showMessage(err.message);
        });
};

function openWebSocket() {
    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }

    ws = new WebSocket(`wss://${location.host}`);
    ws.onerror = function () {
        alert("WebSocket error");
    };
    ws.onopen = function () {
        console.log("Socket opened");

        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "nexted": {
                    moveNextPlayer();
                    break;
                }

                case "checkmated": {
                    checkmatePlayer(data.playerId);
                    break;
                }
            }
        };
    };
    ws.onclose = function () {
        ws = null;
    };
}

function sendNexting() {
    ws.send(
        JSON.stringify({
            userId: userId,
            type: "nexting",
        })
    );
}

function sendCheckmating() {
    ws.send(
        JSON.stringify({
            userId: userId,
            type: "checkmating",
        })
    );
}

function afterLogin() {
    var countdown = 4;
    var intervalId = setInterval(() => {
        const loginPanel = document.querySelector("#login-panel-countdown");
        loginPanel.textContent = countdown + "...";
        countdown--;
    }, 1000);

    setTimeout(() => {
        const loginPanel = document.querySelector("#login-panel");
        loginPanel.style.visibility = "hidden";

        const mainPanel = document.querySelector("#main-panel");
        mainPanel.style.visibility = "visible";

        const rowPlayer = document.querySelector(`#row-${color}`);
        rowPlayer.style.fontWeight = "bold";

        const playerName = getPlayerName(color);
        playerName.textContent += "*";
        clearInterval(intervalId);
    }, 5000);
}
