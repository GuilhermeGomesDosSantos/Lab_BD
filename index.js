const express = require('express');
const mysql = require('mysql');
const app = express();

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Senha do mysql
  database: 'todolist'// nome do banco de dados
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Rota inicial
app.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('index', { tasks: rows });
  });
});

// Rota para adicionar uma nova tarefa
app.post('/add', (req, res) => {
  const task = req.body.task;
  db.query('INSERT INTO tasks (task, completed) VALUES (?, ?)', [task, 0], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Rota para marcar uma tarefa como concluída
app.get('/complete/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [1, id], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Rota para desmarcar uma tarefa como concluída
app.get('/uncomplete/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [0, id], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// ...

// Rota para exibir o formulário de edição de uma tarefa
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('edit', { task: rows[0] });
  });
});

// Rota para salvar a tarefa editada
app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const task = req.body.task;
  db.query('UPDATE tasks SET task = ? WHERE id = ?', [task, id], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// ...

// Rota para excluir uma tarefa
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
