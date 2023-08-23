/*-----DOM ELEMENTS-----*/
//basic player info
const playerFormElement = document.getElementById('player-form');
const playerNameElement = document.getElementById('player_name');
const playerPositionElement = document.getElementById('player_position');
const playerTeamElement = document.getElementById('team_name');
const playerNumberElement = document.getElementById('player_number');
//hitting stats
const hittingStatsSectionElement = document.getElementById('hitting-stats');
const atBatsElement = document.getElementById('at_bats');
const hitsElement = document.getElementById('hits');
const doublesElement = document.getElementById('doubles');
const triplesElement = document.getElementById('triples');
const homeRunsElement = document.getElementById('hr');
const runsElement = document.getElementById('runs');
const rbiElement = document.getElementById('rbi');
const walksElement = document.getElementById('walks');
const strikeoutsElement = document.getElementById('strikeouts_batter');
const hitByPitchElement = document.getElementById('hbp');
const battingAverageElement = document.getElementById('batting_average');
//pitching stats
const pitchingStatsSectionElement = document.getElementById('pitching-stats');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const savesElement = document.getElementById('saves');
const hitsAllowedElement = document.getElementById('hits_allowed');
const runsAllowedElement = document.getElementById('runs_allowed');
const earnedRunsElement = document.getElementById('earned_runs');
const walksAllowedElement = document.getElementById('walks_allowed');
const strikeoutsPitcherElement = document.getElementById('strikeouts');
const hitBattersElement = document.getElementById('hit_batters');
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
const playerProfileElement = document.getElementById('player-profile-display');
const playerIdElement = document.getElementById('id');



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


//function to collect player data
function gatherFormData(onlyFilledFields = false){
    const playerData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if(input.id !== 'id' && !onlyFilledFields || (onlyFilledFields && input.value.trim() !== '')){
            playerData[input.id] = input.value;
        }
    });
    return playerData;
}

//function to display leaderboard
function displayLeaderboard(players) {
    playerStatsDisplayElement.innerHTML = '';

    //stats to be displayed
    const statsToDisplay = ['player_name', 'team_name', 'player_position', 'at_bats', 'hits', 'batting_average', 'hr', 'wins', 'losses', 'saves', 'innings', 'strikeouts', 'sb', 'cs'];

    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    //create table header
    const headerRow = document.createElement('tr');
    statsToDisplay.forEach(stat => {
        const headerCell = document.createElement('th');
        headerCell.textContent = stat.replace('_', ' ').toUpperCase();
        headerRow.appendChild(headerCell);
    });
    headerRow.appendChild(document.createElement('th')); //edit button
    headerRow.appendChild(document.createElement('th')); //delete button
    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

    //create table body 
    players.forEach(player => {
        console.log(player);
        const playerRow = document.createElement('tr');
        statsToDisplay.forEach(stat => {
            const playerCell = document.createElement('td');

            if(stat === 'player_name') {
                const playerLink = document.createElement('a');
                playerLink.href = '#';
                playerLink.innerHTML = `<strong>${player['player_name']}</strong>`;
                playerLink.addEventListener('click', () => displayPlayerProfile(player));
                playerCell.appendChild(playerLink);
            } else {
                playerCell.textContent = player[stat];
            }
            playerRow.appendChild(playerCell);
        });

        //edit button
        const editTd = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.dataset.id = player.id;
        editButton.textContent = 'Edit';
        editTd.appendChild(editButton);

        //delete button
        const deleteTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.dataset.id = player.id;
        deleteButton.textContent = 'Delete';
        deleteTd.appendChild(deleteButton);

        playerRow.appendChild(editTd);
        playerRow.appendChild(deleteTd);
        tableBody.appendChild(playerRow);
    });
    table.appendChild(tableBody);

    playerStatsDisplayElement.appendChild(table);

}

//display player profile
function displayPlayerProfile(player) {
    playerProfileElement.innerHTML = '';

    for(let key in player) {
        const stat = document.createElement('div');
        stat.id = 'stat-item';
        if(player[key]){
            stat.innerHTML = `${key.replace('_', ' ').toUpperCase()}: ${player[key]}`;
            playerProfileElement.appendChild(stat);
        }
    }
}

//reset form
function resetForm() {
    playerFormElement.reset();
    playerIdElement.value = '';
}

//edit function
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

    playerIdElement.value = playerId;
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

    //check if player is being created or updated
    const playerId = playerIdElement.value;
    if(playerId) {
        updatePlayer(playerId);
    } else {
        createPlayer();
    }

    //reset player id
    playerIdElement.value = '';

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