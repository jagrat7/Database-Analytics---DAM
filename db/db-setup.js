// npx knex migrate:make init --migrations-directory db/migrations
const knex = require('knex');
const knexfile = require('./knexfile');
const { Model } = require('objection');



function setupDb() {
  const db = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/my_knex_DB.sqlite3' 
    }
  });
  // plug db config into objection
  Model.knex(db);

}

// npx knex migrate:make init --migrations-directory db/migrations

// function setupDb() {
//   const db = knex(knexfile.development);

//   // plug db config into objection
//   Model.knex(db);
// }

module.exports = setupDb;

