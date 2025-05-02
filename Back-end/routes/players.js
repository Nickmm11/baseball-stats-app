/*
    This file is used to handle the routes for the players
 */
// Import express
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

//connect to database
const pool = new Pool({
    connectionString: 'postgresql://postgres:#mB+C?wY6jcnwWF@db.pdighslhiinbtpojjuiy.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});


//Helper function to get fields and values from req.body
function getFieldsAndValues(body) {
    const fields = Object.keys(body);
    const values = Object.values(body);
    const params = fields.map((_, index) => `$${index + 1}`);
    return { fields, values, params };
}

//CRUD routes

//CREATE - POST
router.post('/', async (req, res) => {
    try{
        const { fields, values: rawValues, params } = getFieldsAndValues(req.body);

        //convert empty strings to null
        const values = rawValues.map(value => value === '' ? null : value);

        console.log(`SQL Statement: INSERT INTO players(${fields.join(', ')}) VALUES(${params.join(', ')}) RETURNING *`);
        console.log('Values:', values);

        const response = await pool.query(`INSERT INTO players(${fields.join(', ')}) VALUES(${params.join(', ')}) RETURNING *`, values);
        res.json(response.rows[0]);
        console.log('Player added successfully!');
    }catch(err){
        console.error(err);
        res.json({ message: err });
    }
});

//READ - GET by id
router.get('/:id', async (req, res) => {
    console.log('Fetching player...', req.params.id);
    try{
        const id = req.params.id;
        const response = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
        if(response.rowCount === 0){
            res.json({ message: 'Player not found!' });
        }else{
            res.json(response.rows[0]);
            console.log('Player fetched successfully!');
        }
    }catch(err){
        console.error(err);
        res.json({ message: err });
    }
}); 

//READ - GET
router.get('/', async (req, res) => {
    try{
        const response = await pool.query('SELECT * FROM players');
        res.json(response.rows);
        console.log('Players fetched successfully!');
    }catch(err){
        console.error(err);
        res.json({ message: err });
    }
});

//UPDATE - PUT
router.put('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const { fields, values: rawValues } = getFieldsAndValues(req.body);
        //convert empty strings to null
        const processedValues = rawValues.map(value => value === '' ? null : value);

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

        const response = await pool.query(`UPDATE players SET ${setClause} WHERE id = $${processedValues.length + 1}`,[...processedValues, id]);

        if(response.rowCount === 0){
            res.json({ message: 'Player not found!' });
        }else{
            res.json({ message: 'Player updated successfully!' });
        }
        console.log('Player updated successfully!');
    }catch(err){
        console.error(err);
        res.json({ message: err });
    }
});

//DELETE - DELETE
router.delete('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const response = await pool.query('DELETE FROM players WHERE id = $1', [id]);

        if(response.rowCount === 0){
            res.json({ message: 'Player not found!' });
        }else{
            res.json({ message: 'Player deleted successfully!' });
        }
        console.log('Player deleted successfully!');
    }catch(err){
        console.error(err);
        res.json({ message: err });
    }
});

module.exports = router;