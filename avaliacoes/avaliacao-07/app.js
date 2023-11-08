const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('SCA.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Crie a tabela TB_CLIENTES, se ainda não existir
db.run(
  'CREATE TABLE IF NOT EXISTS TB_CLIENTES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_cli TEXT)',
  (err) => {
    if (err) {
      console.error('Erro ao criar tabela TB_CLIENTES:', err.message);
    } else {
      console.log('Tabela TB_CLIENTES criada com sucesso.');
    }
  }
);

// Rotas para operações CRUD


// Criar um cliente
app.post('/clientes', (req, res) => {
  const {nome_cli } = req.body;
  db.run('INSERT INTO TB_CLIENTES (nome_cli) VALUES (?)', [nome_cli], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: 'Cliente criado com sucesso' });
  });
});


// Obter todos os clientes
app.get('/clientes', (req, res) => {
  db.all('SELECT * FROM TB_CLIENTES', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ clientes: rows });
  });
});


// Obter um aluno por ID
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM TB_CLIENTES WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Cliente não encontrado' });
      return;
    }
    res.json({ cliente: row }); //Se der erro, tentar clientes
  });
});


// Atualizar um cliente por ID
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome_cli} = req.body;
  db.run('UPDATE TB_CLIENTES SET nome_cli = ? WHERE id = ?', [nome_cli, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Cliente atualizado com sucesso' });
  });
});


// Excluir um cliente por ID
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM TB_CLIENTES WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Cliente excluído com sucesso' });
  });
});


db.run(
    'CREATE TABLE IF NOT EXISTS TB_VENDEDOR (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_vend TEXT)',
    (err) => {
      if (err) {
        console.error('Erro ao criar tabela TB_VENDEDOR:', err.message);
      } else {
        console.log('Tabela TB_VENDEDOR criada com sucesso.');
      }
    }
  );

  app.post('/vendedores', (req, res) => {
    const {nome_vend } = req.body;
    db.run('INSERT INTO TB_VENDEDOR (nome_vend) VALUES (?)', [nome_vend], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
  });

  app.get('/vendedores', (req, res) => {
    db.all('SELECT * FROM TB_VENDEDOR', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ vendedores: rows });
    });
  });

  app.get('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_VENDEDOR WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ message: 'Vendedor não encontrado' });
        return;
      }
      res.json({ vendedor: row }); 
    });
  });

  app.put('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    const { nome_vend} = req.body;
    db.run('UPDATE TB_VENDEDOR SET nome_vend = ? WHERE id = ?', [nome_vend, id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Vendedor atualizado com sucesso' });
    });
  });
  
  app.delete('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_VENDEDOR WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Vendedor excluído com sucesso' });
    });
  });
  
  db.run(
    'CREATE TABLE IF NOT EXISTS TB_NOTAFISCAL (id INTEGER PRIMARY KEY AUTOINCREMENT, valor FLOAT, FOREIGN KEY (id) REFERENCES TB_CLIENTES(cliente_id), FOREIGN KEY (id) REFERENCES TB_VENDEDOR (vendedor_id))',
    (err) => {
      if (err) {
        console.error('Erro ao criar tabela TB_NOTAFISCAL:', err.message);
      } else {
        console.log('Tabela TB_NOTAFISCAL criada com sucesso.');
      }
    }
  );

  app.post('/notasFiscais', (req, res) => {
    const {valor, cliente_id, vendedor_id} = req.body;
    db.run('INSERT INTO TB_NOTAFISCAL (valor, cliente_id, vendedor_id) VALUES (?,?,?)', [valor, cliente_id, vendedor_id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Nota Fiscal criada com sucesso' });
    });
  });

  app.get('/notasFiscais', (req, res) => {
    db.all('SELECT * FROM TB_NOTAFISCAL', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ notasFiscais: rows });
    });
  });

  app.get('/notasFiscais/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_NOTAFISCAL WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ message: 'Nota Fiscal não encontrada' });
        return;
      }
      res.json({ notasFiscais: row }); 
    });
  });

  app.put('/notasFiscais/:id', (req, res) => {
    const { id } = req.params;
    const { valor } = req.body;
    const { cliente_id } = req.body;
    const { vendedor_id } = req.body;

    db.run('UPDATE TB_NOTAFISCAL SET valor, cliente_id, vendedor_id = ?,?,?, WHERE id = ?', [valor, cliente_id, vendedor_id, id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Nota Fiscal atualizada com sucesso' });
    });
  });
  
  app.delete('/notasFiscais/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_NOTAFISCAL WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Nota Fiscal excluída com sucesso'});
    });
  });




  db.run(
    'CREATE TABLE IF NOT EXISTS TB_ITEM_NOTA_FISCAL (id INTEGER PRIMARY KEY AUTOINCREMENT, quantidade FLOAT, FOREIGN KEY (valor) REFERENCES TB_NOTAFISCAL(valor_item), unidade INTEGER , notafiscal_id INTEGER AUTOINCREMENT, produto_id INTEGER AUTOINCREMENT)',
    (err) => {
      if (err) {
        console.error('Erro ao criar tabela TB_ITEM_NOTA_FISCAL:', err.message);
      } else {
        console.log('Tabela TB_ITEM_NOTA_FISCAL criada com sucesso.');
      }
    }
  );
  app.post('/item_notafiscal', (req, res) => {
    const {valor, cliente_id, vendedor_id} = req.body;
    db.run('TB_ITEM_NOTA_FISCAL (valorm, cliente_id, vendedor_id) VALUES (?,?,?)', [valor, cliente_id, vendedor_id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: 'Nota Fiscal criada com sucesso' });
    });
  });














// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
