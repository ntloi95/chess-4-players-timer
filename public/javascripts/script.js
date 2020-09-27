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

function countdownNextPlayer() {
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

function checkmatePlayer() {
    if (!listPlayers.includes(currentPlayerId)) {
        return;
    }

    let row = getRowPlayer(currentPlayerId);
    row.className += " check-mate";
    let currentFreeTimer = getFreeTimerPlayer(currentPlayerId);
    currentFreeTimer.className = "hide";
    let currentTimer = getTimerPlayer(currentPlayerId);
    currentTimer.className = "text-row";
    stopCountDownPlayer(currentPlayerId);
    listPlayers = listPlayers.filter(function (id) {
        return id != currentPlayerId;
    });

    currentPlayerIndex -= 1;
    if (currentPlayerIndex < 0) {
        currentPlayerIndex = listPlayers.length - 1;
    }
}
