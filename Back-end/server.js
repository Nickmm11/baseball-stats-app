// Initialize express
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
// Initialize pg promise
const { Pool } = require('pg');

app.use(express.static('Front-end'));
// Initialize cors
app.use(cors());
// Initialize body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect to database
const pool = new Pool({
    connectionString: 'postgres://ungclbar:Yp6AMSD50Vr-Xoi9PBi92tZocKHAp3MF@batyr.db.elephantsql.com/ungclbar',
    ssl: {
        rejectUnauthorized: false
    }
});

//create table for stats
async function createTable() {
    try{
        const client = await pool.connect();

        //check if table exists
        const checkTable = await client.query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = 'players'
            );`
        );
        if(!checkTable.rows[0].exists){
        const createTable = `CREATE TABLE players (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            position VARCHAR(50),
            team_name VARCHAR(255),
            player_number INTEGER,
            at_bats INTEGER,
            hits INTEGER,
            doubles INTEGER,
            triples INTEGER,
            home_runs INTEGER,
            runs INTEGER,
            rbi INTEGER,
            walks INTEGER,
            strikeouts_batter INTEGER,
            hbp INTEGER,
            batting_average DECIMAL(5,3),
            wins INTEGER,
            losses INTEGER,
            saves INTEGER,
            hits_allowed INTEGER,
            runs_allowed INTEGER,
            earned_runs INTEGER,
            walks_allowed INTEGER,
            strikeouts_pitcher INTEGER,
            hit_batters INTEGER,
            innings DECIMAL(5,2),
            putouts INTEGER,
            assists INTEGER,
            errors INTEGER,
            stolen_bases INTEGER,
            caught_stealing INTEGER
        );
        `;
        await client.query(createTable);
        console.log('Table created');
        }else{
            console.log('Table already exists');
        }
        client.release();
    }catch(err){
        console.error(err);
    }
}

//createTable();
createTable();

// Import routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});