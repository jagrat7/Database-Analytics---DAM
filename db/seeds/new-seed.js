// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> } 
//  */
exports.seed = async function(knex) {
  // await knex.raw('TRUNCATE TABLE "user" CASCADE');
  // await knex.raw('TRUNCATE TABLE "user_database" CASCADE');
  // await knex.raw('TRUNCATE TABLE "db_size" CASCADE');
  // await knex.raw('TRUNCATE TABLE "db_tablespace" CASCADE');
  // Deletes ALL existing entries
  // await knex('table_name').del()
  await knex('user').insert([
    {id: 1, password: 'rowValue1',name:"admin",email:"admin@rules.com"},
    {id: 2, password: 'rowValue1',name:"admin1",email:"admin1@rules.com"},
  ]);

};
