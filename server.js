
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3306;

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'alunofatec',
  database: 'todolist',
  port: 3306,
  multipleStatements: true
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão estabelecida com o banco de dados MySQL');
});

// Configuração das rotas
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao obter as tarefas: ' + err.stack);
      res.status(500).json({ error: 'Erro ao obter as tarefas' });
      return;
    }

    res.json(results);
  });
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
  const description = req.body.description;
  const completed = req.body.completed ? 1 : 0;

  const query = 'INSERT INTO tasks (description, completed) VALUES (?, ?)';
  const values = [description, completed];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao adicionar a tarefa: ' + err.stack);
      res.status(500).json({ error: 'Erro ao adicionar a tarefa' });
      return;
    }

    res.json({ message: 'Tarefa adicionada com sucesso' });
  });
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  const completed = req.body.completed ? 1 : 0;

  const query = 'UPDATE tasks SET description = ?, completed = ? WHERE id = ?';
  const values = [description, completed, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao atualizar a tarefa: ' + err.stack);
      res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
      return;
    }

    res.json({ message: 'Tarefa atualizada com sucesso' });
  });
});

// Rota para excluir uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM tasks WHERE id = ?';
  const values = [id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao excluir a tarefa: ' + err.stack);
      res.status(500).json({ error: 'Erro ao excluir a tarefa' });
      return;
    }

    res.json({ message: 'Tarefa excluída com sucesso' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log('Servidor iniciado na porta ' + port);
});
