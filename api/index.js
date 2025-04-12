const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pokemon_tcg'
});

// Obtener todas las cartas
app.get('/cartas', (req, res) => {
  connection.query('SELECT * FROM cartas', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Agregar carta
app.post('/cartas', (req, res) => {
  const data = req.body;
  connection.query('INSERT INTO cartas (nombre, precio, stock, edicion, rareza) VALUES', data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ id: results.insertId });
  });
});

// Actualizar carta por ID
app.put('/cartas/:id', (req, res) => {
  const { id } = req.params;
  const data = req.body;
  connection.query('UPDATE cartas SET ? WHERE id = ?', [data, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Eliminar carta por ID
app.delete('/cartas/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM cartas WHERE id = ?', id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`API ejecutándose en puerto ${port}`);
});
