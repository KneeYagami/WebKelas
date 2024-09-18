const express=require('express');
const app = express();
const path = require('path');
const bodyParser=require('body-parser');
const sqlite3=require('sqlite3');
const notifier = require('node-notifier');

const dbPath = path.join(__dirname, 'datakelas.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => { 
    console.log("Database Has Connected")
});
app.use(express.static('features'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"index.html"))
})
var server = app.listen(5002, function () {
    console.log("Express App running at http://127.0.0.1:5002/");
 })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/login/index.html', (req, res) => {
    res.render('login');
});

var jump=0;

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
      if (row) {
        res.sendFile(path.join(__dirname,"features/gallery/index.html"))
      } else {
        jump++;
        notifier.notify({
            title: 'Password!',
            message: 'Password kamu salah!,Silahkan Refresh Halaman',
            sound: true,
            wait: true
          });
        console.log(jump);
        if (jump>2){
            res.sendFile(path.join(__dirname,"features/index.html"))
        };
       
      }
    });
});
