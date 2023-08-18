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

/*-----EVENT LISTENERS-----*/
//show hitting stats if batter is selected
hitsElement.addEventListener('input', calcBattingAverage);
atBatsElement.addEventListener('input', calcBattingAverage);

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
    //get player data
    const playerData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        playerData[input.id] = input.value;
    });
    //save player data to local storage
    const players = JSON.parse(localStorage.getItem('players')) || [];
    players.push(playerData);
    localStorage.setItem('players', JSON.stringify(players));
    //clear form
    playerFormElement.reset();
    //display feedback
    addFeedback('Player added successfully!', 'success');
    //display stats
    displayStats(playerData);
    //PROCESS DATA
});

//load player data from local storage on page load
document.addEventListener('DOMContentLoaded', function() {
    const players = JSON.parse(localStorage.getItem('players'));
    if(players && players.length > 0) { 
        const latestPlayer = players[players.length - 1];
        Object.keys(latestPlayer).forEach(key => {
            const input = document.getElementById(key);
            if(input) {
                input.value = latestPlayer[key];
            }
        });
    }
});

/*-----API CALLS-----*/
const playerData = gatherFormData();

//create(POST)
fetch('http://localhost:3000/api/players', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(playerData)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error: ', error));

//read(GET)
fetch('http://localhost:3000/api/players')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        //display data
    })
    .catch(error => console.error('Error: ', error));

//update(PUT)
const updatedPlayerData = gatherFormData(true);

//placeholder for player id
const playerIdUpdate = 'some-id';

fetch(`http://localhost:3000/api/players/${playerIdUpdate}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedPlayerData)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error: ', error));

//delete(DELETE)
//placeholder for player id
const playerIdDelete = 'some-id';

fetch(`http://localhost:3000/api/players/${playerIdDelete}`, {
    method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error: ', error));