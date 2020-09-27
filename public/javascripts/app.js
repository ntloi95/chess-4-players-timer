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

login.onclick = function () {
    fetch("/login", { method: "POST", credentials: "same-origin" })
        .then(handleResponse)
        .then(function (data) {
            showMessage(data);
            if (data.ok) {
                color = data.color;
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

    ws = new WebSocket(`ws://${location.host}`);
    ws.onerror = function () {
        alert("WebSocket error");
    };
    ws.onopen = function () {
        console.log("Socket opened");
    };
    ws.onclose = function () {
        ws = null;
    };
}

function play() {
    if (!ws) {
        showMessage("No WebSocket connection");
        return;
    }

    ws.send("played");
    showMessage('Sent "Hello World!"');
}

function checkmate() {
    if (!ws) {
        showMessage("No WebSocket connection");
        return;
    }

    ws.send("checkmated");
    showMessage('Sent "Hello World!"');
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
        rowPlayer.style.backgroundColor = "#5f9ea06b";
        clearInterval(intervalId);
    }, 5000);
}
