const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('handiblog.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                type TEXT,
                image TEXT,
                description TEXT,
                content TEXT
            )`, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Table created successfully.');
            });
    });
});

module.exports = db;