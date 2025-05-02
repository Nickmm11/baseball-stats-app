require('dotenv').config();
// Initialize express
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
// Initialize pg promise
const { Pool } = require('pg');

app.use(express.static(path.join(__dirname, '..', 'Front-end')));
// Initialize cors
app.use(cors());
// Initialize body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);

//connect to database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
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
            player_name VARCHAR(255) NOT NULL,
            player_position VARCHAR(50),
            team_name VARCHAR(255),
            player_number INTEGER DEFAULT NULL,
            at_bats INTEGER DEFAULT 0,
            hits INTEGER DEFAULT 0,
            doubles INTEGER DEFAULT 0,
            triples INTEGER DEFAULT 0,
            hr INTEGER DEFAULT 0,
            runs INTEGER DEFAULT 0,
            rbi INTEGER DEFAULT 0,
            walks INTEGER DEFAULT 0,
            strikeouts_batter INTEGER DEFAULT 0,
            hbp INTEGER DEFAULT 0,
            batting_average DECIMAL(5,3) DEFAULT 0,
            wins INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            saves INTEGER DEFAULT 0,
            hits_allowed INTEGER DEFAULT 0,
            runs_allowed INTEGER DEFAULT 0,
            earned_runs INTEGER DEFAULT 0,
            walks_allowed INTEGER DEFAULT 0,
            strikeouts INTEGER DEFAULT 0,
            hit_batters INTEGER DEFAULT 0,
            innings DECIMAL(5,2) DEFAULT 0,
            putouts INTEGER DEFAULT 0,
            assists INTEGER DEFAULT 0,
            errors INTEGER DEFAULT 0,
            sb INTEGER DEFAULT 0,
            cs INTEGER DEFAULT 0
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

//createTable
createTable();

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
