// lobby, game & result screens
const lobbyScreen = document.getElementById("lobby-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

// form and buttons
const playerJoinForm = document.querySelector(".join-form");
const addPlayerBtn = document.getElementById("add-player-btn");
const startQuizBtn = document.getElementById("start-game-btn");

// score board and player list
const playerList = document.getElementById("player-list");
const scoreBoardList = document.getElementById("scoreboard-list");

// Name and number of players in game screen
const playerName = document.querySelector("#current-player-display");
const numOfPlayers = document.querySelector(".audience");

// round & timer of quiz
const round = document.querySelector(".round-bubble");
const timer = document.querySelector(".timer");

// question & it's related elements
const difficultyLevel = document.querySelector(".difficulty");
const questionText = document.querySelector("#question-text");
const categoryHeading = document.querySelector(".hint");
const answerOptions = document.querySelector("#answer-options");
const answers = document.querySelectorAll(".answer");

// leader board from result
const leaderBoard = document.querySelector("#leaderboard-list");


let players = [];    // array of players
let questions = [];    // array questions

let gameEnded = false;    // to identify the game is ended

try {
    // to catch error if occure while getting players list from local storage
    players = JSON.parse(localStorage.getItem("players")) || [];
} catch (error) {
    console.error("Failed to load Players: ", error.message);
    window.alert("Failed to load Players: ", error.message);
    localStorage.removeItem("players");    // delete players from local storage if any error occures
}

// load quiz questions from json file
(async function loadQuizQuestions() {
    try {
        const response = await fetch("questions.json");
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to load questions");
        }

        questions = data.questions;
    } catch (error) {
        console.error("Error loading the quiz:", error);
        window.alert("Could not load quiz");
    }
})();

// add elements to the array and render lists if any changes occured in local storage
window.addEventListener("storage", () => {
    try {
        // to catch error if occure
        players = JSON.parse(localStorage.getItem("players")) || [];

        if (isGameStarted()) {
            renderSideBar();    // only render the sidebar if the game is started
        } else {
            renderLobbyList();
            renderSideBar();
            startQuizGame();
            isUserjoin();
            enableStartQuizBtn();
        }
    } catch (error) {
        console.error("Storage sync failed: ", error.message);
        window.alert("Storage sync failed: ", error.message);
        players = [];    // make players array as empty if any error occures
    }
});

// save array to the local storage
function saveToLocalStorage() {
    localStorage.setItem("players", JSON.stringify(players));
}

// say game is started to the browser, so no other user can't join after game start
function setGameStarted(value = false) {
    localStorage.setItem("gameStarted", JSON.stringify(value));
}

function isGameStarted() {
    return JSON.parse(localStorage.getItem("gameStarted"));
}




//-----------------------------------------
//-------------------------------------------------------------------------------------------------------
// Lobby loader
// adding players to the array from form input
playerJoinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isGameStarted()) {
        window.alert("Game already started. Wait for the next round");    // make user unable to join if the game is already started
        return;
    }

    const playerNameInput = document.getElementById("player-name");
    let playerName = playerNameInput.value.trim();

    if (playerName === "") {
        // validating input
        window.alert("Play the game. Not to Us");
        return;
    }

    playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1);

    // struture of object
    const player = { id: Date.now(),
                     name: playerName, score: 0, 
                     isReady: false, 
                     hasFinished: false };

    players.push(player);

    sessionStorage.setItem("playerId", player.id);
    // console.log(players);
    playerNameInput.value = "";

    saveToLocalStorage();
    renderLobbyList();
    renderSideBar();
    isUserjoin();
});

// getting the session id of current tab
const playerSessionId = Number(sessionStorage.getItem("playerId"));

// making user able to enter only once in a game
function isUserjoin() {
    if (playerSessionId) {
        addPlayerBtn.setAttribute("disabled", true);
    }
}

// lobby user list render
function renderLobbyList() {
    playerList.innerHTML = "";

    players.forEach((player) => {
        let liForPlayer = document.createElement("li");
        liForPlayer.classList.add("player-card");
        liForPlayer.innerHTML = `<div class="avatar">${player.name.charAt(0)}</div>
                                 <div class="info">
                                    <div class="name">${player.name}</div>
                                    <div class="status ${player.isReady ? "ready" : "waiting"}">${player.isReady ? "Ready" : "Waiting"}</div>
                                 </div>
                                 <div class="player-actions">
                                    <button class="small" onclick="kick(${player.id})">Kick</button>
                                 </div>`;

        playerList.appendChild(liForPlayer);
    });
}

// scoreboard user list render
function renderSideBar() {

    // sorting user array according to score
    const sortedScore = [...players].sort((item, next) => next.score - item.score);

    scoreBoardList.innerHTML = "";

    sortedScore.forEach((player) => {
        let liForScoreBoard = document.createElement("li");
        liForScoreBoard.classList.add("player-row");
        liForScoreBoard.innerHTML = `<div class="avatar">${player.name.charAt(0)}</div>
                                     <div class="player-info">
                                        <div class="name">${player.name}</div>
                                        <div class="meta">${player.isReady ? "Ready" : "Waiting"}</div>
                                     </div>
                                     <div class="points">${player.score}</div>`;

        scoreBoardList.appendChild(liForScoreBoard);
    });
}

// to kick out user
function kick(idToKick) {
    // checks, is really the user who clicked the kick button
    if (idToKick === playerSessionId) {
        players = players.filter((player) => player.id !== idToKick);
        sessionStorage.removeItem("playerId");

        addPlayerBtn.removeAttribute("disabled");

        saveToLocalStorage();
        renderLobbyList();
        renderSideBar();
    } else {
        window.alert("Don't try such naughty things");
    }
}

// check there is more than one player, if yes enable start quiz button
function enableStartQuizBtn() {
    if (players.length >= 2) {
        startQuizBtn.textContent = "Start Quiz";
        startQuizBtn.removeAttribute("disabled");
    } else {
        startQuizBtn.textContent = "Waiting for Other players";
        startQuizBtn.setAttribute("disabled", true);
    }
}

// if user click Start Quiz button, function will change isReady =  true
startQuizBtn.onclick = function () {
    players = players.map((player) => {
        if (player.id === playerSessionId) {
            player.isReady = true;
        }
        return { ...player };
    });

    saveToLocalStorage();
    renderLobbyList();
    renderSideBar();

    startQuizGame();
};

// start the game by changing the screen to game-screen from lobby-screen
function startQuizGame() {
    // check all players are ready to start the quiz
    let allPlayersReady = players.length > 0 && players.every((player) => player.isReady === true);

    if (allPlayersReady) {
        window.alert("Game will start in short");
        setTimeout(() => {   // set a timeout to start the game
            gameEnded = false;

            lobbyScreen.style.display = "none";
            gameScreen.style.display = "block";

            let currentPlayer = players.find((player) => player.id === playerSessionId);

            playerName.textContent = `${currentPlayer.name}'s Turn`;
            numOfPlayers.textContent = `${players.length} Players`;

            setGameStarted(true);   // set game is started
            renderQuizScreen();
        }, 500);
    } else {
        lobbyScreen.style.display = "block";
        gameScreen.style.display = "none";
    }
}



//-------------------------------------------
//-------------------------------------------------------------------------------------------------------
// Game Engine
let currentQuestionIndex = 0;
let timerSeconds = 15;
let gameTimerInterval;
let correctAnswer;

// shuffle options of question (Fisher Yates Shuffle)
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// timer function to count time
function startTimer() {
    if (gameEnded) return;   // if true stop the timer
    if (gameScreen.style.display === "none") return;  // don't start if game screen not showing

    clearInterval(gameTimerInterval);
    timerSeconds = 15;

    gameTimerInterval = setInterval(() => {
        timerSeconds--;   // decrease timer

        timer.textContent = `00:${timerSeconds < 10 ? "0" + timerSeconds : timerSeconds}`;

        if (timerSeconds <= 0) {   
            clearInterval(gameTimerInterval);
            timerSeconds = 15;
            nextQuestion();
        }
    }, 1000);
}

// to render the contents of game screen
function renderQuizScreen() {
    const currentQuestion = questions[currentQuestionIndex];
    const { qnId, question, category, difficulty, options, answer } = currentQuestion;    // destructure question and it's related elements
    correctAnswer = answer;

    numOfQuestions = questions.length;
    round.textContent = isGameStarted() ? `${qnId} / ${questions.length}` : `0 / ${questions.length}`;

    difficultyLevel.textContent = difficulty;
    questionText.textContent = question;
    categoryHeading.textContent = `Category: ${category}`;

    const shuffledArray = shuffleArray(options);   // shuffle answer options

    answers[0].textContent = shuffledArray[0];
    answers[1].textContent = shuffledArray[1];
    answers[2].textContent = shuffledArray[2];
    answers[3].textContent = shuffledArray[3];

    startTimer();
}

// ----------------------- the judge/game engine ------------------------
const buttonArray = Array.from(answers);   // convert the options buttons from object to array type

buttonArray.forEach((button) => {
    button.addEventListener("click", (event) => {
        const userClick = event.target;
        const userChoice = userClick.textContent;

        buttonArray.forEach((btn) => (btn.disabled = true));
        document.querySelector(".buzz").disabled = true;
        document.querySelector(".buzz").style.backgroundColor = "var(--glass)";

        const others = buttonArray.filter((btn) => btn !== userClick);   // list of buttons not clicked

        // changing colours of buttons according the clicked option is right or wrong and disabling other buttons to prevent multiple clicks
        if (userChoice === correctAnswer) {
            userClick.style.backgroundColor = "#07c26b";   // right answer
            others.forEach((btn) => (btn.style.backgroundColor = "var(--glass)"));   // to highlight the clicked one

            updateScore();
        } else {
            userClick.style.backgroundColor = "#ff0019";   // wrong one

            buttonArray.forEach((btn) => {
                if (btn.textContent === correctAnswer) {
                    btn.style.backgroundColor = "#07c26baa";   // actual answer
                } else if (btn !== userClick) {
                    btn.style.backgroundColor = "var(--glass)";   // to highlight clicked one
                }
            });
        }
    });
});

// update score of the player if they click the right answer
function updateScore() {
    const pointEarned = 10 + timerSeconds;

    players = players.map((player) => {
        if (player.id === playerSessionId) {
            player.score += pointEarned;
        }
        return { ...player };
    });

    saveToLocalStorage();
    renderSideBar();
}

// forward user to the next question
function nextQuestion() {
    clearInterval(gameTimerInterval); // stop timer immediately

    setTimeout(() => {   // set 1s timout between every question
        document.querySelector(".buzz").disabled = false;
        buttonArray.forEach((btn) => {
            btn.style.backgroundColor = "#fff";
            btn.disabled = false;
        });

        currentQuestionIndex++;   // increase question index

        if (currentQuestionIndex < questions.length) {   // render next question if condition is true otherwise it will show result
            renderQuizScreen();
        } else {
            gameEnded = true;   // game is ended
            showResult();
        }
    }, 1000);
}



//-----------------------------------------------
//-------------------------------------------------------------------------------------------------------
// result screen
function showResult() {
    gameEnded = true;

    clearInterval(gameTimerInterval);
    timer.textContent = "00:00";
    round.textContent = "0 / 10";
    currentQuestionIndex = 0;

    // make display none to lobby and game screen to show result
    lobbyScreen.style.display = "none";
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";

    players = players.map(player =>
        player.id === playerSessionId ? { ...player, isReady: false, hasFinished: true } : player,
    );
    
    const sortedScore = [...players].sort((item, next) => next.score - item.score);   // sorting user array according to scores
    let index = 1;

    leaderBoard.innerHTML = "";

    sortedScore.forEach((player) => {   // render scores of players
        const leader = document.createElement("div");
        leader.classList.add("leader");

        leader.innerHTML = `<div class="rank">${index}</div>
                            <div class="avatar large">${player.name.charAt(0)}</div>
                            <div class="info">
                                <div class="name">${player.name}</div>
                                <div class="score">${player.score} pts</div>
                            </div>`;

        leaderBoard.append(leader);
        index++;   // increase 
    });

    setTimeout(() => {   // set 10s of waiting to click Play Again button
        document.querySelector(".play-again-btn").disabled = false;
    }, 10000);
}

// reset and delete storages for fresh restart
function playAgain() {
    sessionStorage.removeItem("playerId");
    localStorage.removeItem("players");
    localStorage.removeItem("gameStarted");
    location.reload();
}

// termnate the user if they refresh page
window.addEventListener("beforeunload", (event) => {
    if (isGameStarted()) {
        const confirmReload = confirm("Reloading will terminate you from the game. Do you really want to reload?");

        if (confirmReload) {
            players = players.filter((player) => player.id !== playerSessionId);
            saveToLocalStorage();
            sessionStorage.removeItem("playerId");
            sessionStorage.setItem("isTerminated", true);

            lobbyScreen.style.display = "none";
            gameScreen.style.display = "none";
            resultScreen.style.display = "none";
            window.alert("You are terminated from this game because you refreshed the page");
        } else {
            event.preventDefault();
            event.returnValue = "";
        }
    }
});

renderLobbyList();
        renderSideBar();
            enableStartQuizBtn();
