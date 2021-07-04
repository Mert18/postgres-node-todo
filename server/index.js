const express = require('express');
const app = express();
const cors = require('cors');

const pool = require('./db');

app.use(cors());
app.use(express.json());

app.post('/todos', async(req, res) => {
    try{
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    }catch{
        console.error(err.message);
    }
})

app.get('/todos', async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message)
    }
})

app.get('/todos/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const singleTodo = await pool.query("SELECT * FROM todo WHERE id = $1", [id])
        res.json(singleTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

app.put('/todos/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id]);
        res.json("Todo was updated.");
    } catch (error) {
        console.error(error.message);
    }
})

app.delete('/todos/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const updateTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);
        res.json("Todo was deleted.");
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(5000, () => {
    console.log("server has started on port 5000");
})