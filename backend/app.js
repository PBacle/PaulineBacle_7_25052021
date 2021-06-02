const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser'); 
const path = require('path'); /* will be useful when dealing with storage of filzzzzzz */
const connection = require('./mysql-connection'); 
const helmet = require("helmet");/* safety package that protects API from weaknesses and prevents some issues like cross-site scripting, MIME sniffing et clickjacking */
const nocache = require('nocache'); /* disables cache to make sure that user gets the more updated version */
require('dotenv').config();

/* Routes */
const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/post');
const commentsRoutes = require('./routes/comment');

// Connection à la db
connection.connect(function (err) {
  if (err) {
    console.error('Connexion à la bdd échouée ! Erreur: ' + err.stack);
    return;
  }
  console.log('Connexion à la bdd réussie ! ID : ' + connection.threadId);
});

const app = express(); 

app.use(bodyParser.urlencoded({ extended: true })); /* requests send by user will be accessible as req.body */
app.use(bodyParser.json()); /* transform data from post request in usable JSON */

app.use(cors());
app.use(helmet());
app.use(nocache());

app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/api/', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts', commentsRoutes);


module.exports = app;
