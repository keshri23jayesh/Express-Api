var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body parsr middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//  DB config
const db = require('./config/keys').mongoURI;

//  Connect to mongo db
mongoose
    .connect(db)
    .then(() => console.log('connected!!'))
    .catch(err => console.log(err));

app.get('/', function(req, res){
    res.send("Heo Wrld");
});

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
