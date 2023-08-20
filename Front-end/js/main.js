/*-----DOM ELEMENTS-----*/
//basic player info
const playerFormElement = document.getElementById('player-form');
const playerNameElement = document.getElementById('player-name');
const playerPositionElement = document.getElementById('player-position');
const playerTeamElement = document.getElementById('team-name');
const playerNumberElement = document.getElementById('player-number');
//hitting stats
const hittingStatsSectionElement = document.getElementById('hitting-stats');
const atBatsElement = document.getElementById('at-bats');
const hitsElement = document.getElementById('hits');
const doublesElement = document.getElementById('doubles');
const triplesElement = document.getElementById('triples');
const homeRunsElement = document.getElementById('hr');
const runsElement = document.getElementById('runs');
const rbiElement = document.getElementById('rbi');
const walksElement = document.getElementById('walks');
const strikeoutsElement = document.getElementById('strikeouts-batter');
const hitByPitchElement = document.getElementById('hbp');
const battingAverageElement = document.getElementById('batting-average');
//pitching stats
const pitchingStatsSectionElement = document.getElementById('pitching-stats');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const savesElement = document.getElementById('saves');
const hitsAllowedElement = document.getElementById('hits-allowed');
const runsAllowedElement = document.getElementById('runs-allowed');
const earnedRunsElement = document.getElementById('earned-runs');
const walksAllowedElement = document.getElementById('walks-allowed');
const strikeoutsPitcherElement = document.getElementById('strikeouts');
const hitBattersElement = document.getElementById('hit-batters');
const inningsPitchedElement = document.getElementById('innings');
//fielding stats
const fieldingStatsSectionElement = document.getElementById('fielding-stats');
const putoutsElement = document.getElementById('putouts');
const assistsElement = document.getElementById('assists');
const errorsElement = document.getElementById('errors');
//base running stats
const baserunningStatsSectionElement = document.getElementById('baserunning-stats');
const stolenBasesElement = document.getElementById('sb');
const caughtStealingElement = document.getElementById('cs');
//buttons and other elements
const submitButtonElement = document.getElementById('submit');
const feedbackElement = document.getElementById('feedback');
const playerStatsDisplayElement = document.getElementById('player-stats-display');



/*-----UTILITY FUNCTIONS-----*/
//add feedback to form
function addFeedback(message, type) {
    feedbackElement.textContent = message;
    feedbackElement.className = type;
}

//batting average calculation
function calcBattingAverage(){
    const hits = parseInt(hitsElement.value);
    const atBats = parseInt(atBatsElement.value);
    const battingAverage = (atBats !== 0) ? (hits / atBats).toFixed(3) : 0;
    battingAverageElement.value = battingAverage;
}

//function to display statistics
function displayStats(data) {
    playerStatsDisplayElement.innerHTML = '';

    //title
    const title = document.createElement('h2');
    title.textContent = `${data['player-name']}'s Statistics`;
    playerStatsDisplayElement.appendChild(title);

    //display each stat
    for(let key in data) {
        if(data[key]){
            const stat = document.createElement('div');
            stat.className = 'stat-item';
            stat.textContent = `${key.replace('-', ' ').toUpperCase()}: ${data[key]}`;
            playerStatsDisplayElement.appendChild(stat);
        }
    }
}

//function to collect player data
function gatherFormData(onlyFilledFields = false){
    const playerData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if(!onlyFilledFields || (onlyFilledFields && input.value.trim !== '')){
            playerData[input.id] = input.value;
        }
    });
    return playerData;
}

//function to display leaderboard
function displayLeaderboard(players) {
    playerStatsDisplayElement.innerHTML = '';

    players.forEach(player => {
        const playerEntry = document.createElement('div');
        playerEntry.className = 'player-entry';

        //display
        let playerInfo = `<strong>${player['player-name']}</strong> - ${player['team-name']} - ${player['player-position']}<br>`;
        for(let key in player) {
            if(player[key] && key !== 'player-name' && key !== 'team-name' && key !== 'player-position' && key !== 'id'){
                playerInfo += `${key.replace('-', ' ').toUpperCase()}: ${player[key]}<br>`;
            }
        }

        //edit and delete buttons
        const editButton = `<button class="edit-button" data-id="${player.id}">Edit</button>`;
        const deleteButton = `<button class="delete-button" data-id="${player.id}">Delete</button>`;

        playerEntry.innerHTML = playerInfo + editButton + deleteButton;
        playerStatsDisplayElement.appendChild(playerEntry);
    });
}

//edit and delete functions
function editFunction(e) {
    const playerId = e.target.getAttribute('data-id');
    //fetch player data, then populate form
    fetch(`http://localhost:3000/api/players/${playerId}`)
    .then(response => response.json())
    .then(player => {
        for(let key in player) {
            const input = document.getElementById(key);
            if(input) {
                input.value = player[key];
            }
        }

        playerFormElement.addEventListener('submit', function onFormSubmit(e) {
            e.preventDefault();
            //update player
            updatePlayer(playerId);
            //remove event listener to prevent multiple submissions
            playerFormElement.removeEventListener('submit', onFormSubmit);
        });
    })
    .catch(error => console.error('Error fetching player for edit: ', error));
}

/*-----CRUD OPERATIONS-----*/
//CREATE - POST
function createPlayer() {
    const playerData = gatherFormData();

    //fetch player data
    fetch('http://localhost:3000/api/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
    .then(response => response.json())
    .then(data => {
        addFeedback('Player added successfully!', 'success');
        fetchPlayerData();
    })
    .catch(error => console.error('Error creating player: ', error));
}

//READ - GET
function fetchPlayerData() {
    fetch('http://localhost:3000/api/players')
    .then(response => response.json())
    .then(players => displayLeaderboard(players))
    .catch(error => console.error('Error: ', error));
}

//UPDATE - PUT
function updatePlayer(playerId) {
    const updatedPlayerData = gatherFormData(true);

    //fetch player data
    fetch(`http://localhost:3000/api/players/${playerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlayerData)
    })
    .then(response => response.json())
    .then(data => {
        addFeedback('Player updated successfully!', 'success');
        fetchPlayerData();
    })
    .catch(error => console.error('Error updating player: ', error));
}

//DELETE - DELETE
function deletePlayer(e) {
    const playerId = e.target.getAttribute('data-id');
    //delete player, then fetch and display updated leaderboard
    fetch(`http://localhost:3000/api/players/${playerId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if(response.ok) {
            fetchPlayerData();
        } else {
            console.error('Error deleting player: ', response);
        }
    })
    .catch(error => console.error('Error deleting player: ', error));
}

/*-----EVENT LISTENERS-----*/
//show hitting stats if batter is selected
hitsElement.addEventListener('input', calcBattingAverage);
atBatsElement.addEventListener('input', calcBattingAverage);

//event listener for edit and delete buttons
document.addEventListener('click', function(e) {
    if(e.target && e.target.classList.contains('edit-button')) {
        editFunction(e);
    } else if(e.target && e.target.classList.contains('delete-button')) {
        deletePlayer(e);
    }
});

//show pitching stats if pitcher is selected
playerPositionElement.addEventListener('change', function() {
    if (playerPositionElement.value === 'SP' || playerPositionElement.value === 'RP') {
        pitchingStatsSectionElement.style.display = 'block';
    } else {
        pitchingStatsSectionElement.style.display = 'none';
    }
});


//submit player form
playerFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    //create player
    createPlayer();
    //clear form
    playerFormElement.reset();
});

//load player data on page load
document.addEventListener('DOMContentLoaded', fetchPlayerData);

/*-----LOCAL STORAGE-----*/
//save player data to local storage
function saveToLocalStorage(players) {
    localStorage.setItem('players', JSON.stringify(players));
}

//load player data from local storage
function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('players')) || [];
}