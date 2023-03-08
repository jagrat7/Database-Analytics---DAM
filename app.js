const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config()
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash')
const initializePassport = require('./passport-config')
const setupDb = require('./db/db-setup');
const User = require('./db/models/user')
const User_database = require('./db/models/userdatabase')
const Db_size = require('./db/models/db_size')
const Db_tablespace = require('./db/models/db_tablespace')
const ConnectorServerFunctions = require('./ConnectorServer')
var cron = require('node-cron');
var SQLiteStore = require('connect-sqlite3')(session);
const https = require('https');
const fs = require('fs');



// set up database with objection and knex
setupDb();

const store = new SQLiteStore({ table: 'sessions', db: 'my_knex_DB.sqlite3', dir: './db' })
const saltRounds = 10;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("./public"));
//app.use('/', express.static(path.join(__dirname,'/dist/basic-structure')));
app.use(flash())
app.use(session({
  secret: '1a9n9i8me',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 1800000, //30mins 
    sameSite: true
  },
  store: store//?here is some bug here cuzing changes to the session not register, comment it out when making changes
}))
app.use(passport.initialize())
app.use(passport.session())



//Passport Setup

async function getid(id) {
  let juser = await User.query().findById(id);
  let userstrg = JSON.parse(JSON.stringify(juser));
  return userstrg;
};

async function getemail(email) {
  let suser = await User.query().where('email', email);
  let userstrg = JSON.parse(JSON.stringify(suser))[0];
  return userstrg;

}

initializePassport(
  passport,
  async function (email) {
    let x = await getemail(email)
    return x;
  },
  async function (id) {
    let y = await getid(id)
    return y;
  }
)
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  }
  next()
}



(async function () {

})();


cron.schedule('* 5 * * * *',  () => {
    ConnectorServerFunctions.updateDbInfo();
});


cron.schedule('* 59 23 * * *',() => {
  ConnectorServerFunctions.clearDailyTables();
});

// app.use(require('./routes'));
require('./routes/index.js')(app, passport, bcrypt, checkAuthenticated, checkNotAuthenticated, saltRounds, User, setupDb, session,);
require('./routes/dashboard.js')(app, passport, checkAuthenticated, checkNotAuthenticated, User, User_database, Db_size, setupDb);
require('./routes/db.js')(app, passport, checkAuthenticated, checkNotAuthenticated, User, User_database, Db_size, Db_tablespace, setupDb,);
//GETS and POSTS


app.get('/logout', function (req, res) {

  req.logout();
  res.redirect("/");

});

app.use((req, res) => {
  res.status(404).render('404');
});


// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
})
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// https.createServer(options,app).listen(3000,()=>{
//   console.log("Server started on port 3000");
// });
