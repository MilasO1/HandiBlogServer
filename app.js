const express = require('express'); // Framework pour créer un serveur web.
const bodyParser = require('body-parser'); // Middleware pour traiter les données des requêtes HTTP.
const db = require('./db/handiblog'); // Modèle de base de données pour les tâches (SQLite).

// Initialisation de l'application Express et définition du port
const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Use body-parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Pour traiter les données des formulaires (application/x-www-form-urlencoded).
app.use(bodyParser.json()); // Pour traiter les requêtes envoyées au format JSON.
app.use(express.static('public')); // Pour servir les fichiers statiques (CSS, JS, images) depuis le dossier 'public'.

// Home page
app.get('/', (req, res) => {
    db.all('SELECT * FROM articles', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching articles.');
        } else {
            res.render('index', { articles: rows });
        }
    });
});

// Article page
app.get('/article/:id', (req, res) => {
    const articleId = req.params.id;

    db.get('SELECT * FROM articles WHERE id = ?', articleId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching article');
        } else if (row) {
            res.render('article', { article: row });
        } else {
            res.status(404).send('Article not found');
        }
    });
});

// Admin 
app.get('/admin', (req, res) => {
    db.all('SELECT * FROM articles', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching articles');
        } else {
            res.render('admin', { articles: rows });
        }
    });
});

// Add / edit article
app.get('/admin/add', (req, res) => {
    res.render('form', { 
        title: 'Add Article', 
        action: '/admin/add', 
        article: {}, 
        buttonText: 'Create' 
    });
});

app.get('/admin/edit/:id', (req, res) => {
    const articleId = req.params.id;

    db.get('SELECT * FROM articles WHERE id = ?', articleId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching article');
        } else {
            res.render('form', { 
                title: 'Edit Article', 
                action: `/admin/edit/${articleId}`, 
                article: row, 
                buttonText: 'Update' 
            });
        }
    });
});

app.post('/admin/add', (req, res) => {
    const { title, type, image, description, content } = req.body;

    db.run('INSERT INTO articles (title, type, image, description, content) VALUES (?, ?, ?, ?, ?)',
        [title, type, image, description, content],
        (err) => {
            if (err) {
                console.error('Error adding article:', err.message);
                res.status(500).send('Error adding article');
            } else {
                res.redirect('/admin');
            }
        }
    );
});

app.post('/admin/edit/:id', (req, res) => {
    const articleId = req.params.id;
    const { title, type, image, description, content } = req.body;

    db.run('UPDATE articles SET title = ?, type = ?, image = ?, description = ?, content = ? WHERE id = ?',
        [title, type, image, description, content, articleId],
        (err) => {
            if (err) {
                console.error('Error updating article:', err.message);
                res.status(500).send('Error updating article');
            } else {
                res.redirect('/admin');
            }
        }
    );
});

// Delete article
app.get('/admin/delete/:id', (req, res) => {
    const articleId = req.params.id;

    db.run('DELETE FROM articles WHERE id = ?', articleId, (err) => {
        if (err) {
            console.error('Error deleting article:', err.message);
            res.status(500).send('Error deleting article');
        } else {
            res.redirect('/admin');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
