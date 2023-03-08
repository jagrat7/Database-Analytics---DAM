/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =  function(knex) {
    return  knex.schema.createTable('user',function(table){
        table.increments('id').primary();
        table.string('password');
        table.string('name');
        table.string('role');
        table.string('email');
        table.timestamps(true, true);
    }).createTable('user_database',function(table){
      table.increments('id').primary();
      table.string('db_nickname')
      table.string('db_sid').notNullable();
      table.string('db_host').notNullable();
      table.string('db_port');
      table.string('db_username').notNullable();
      table.string('db_password').notNullable();
      table.string('db_status');
      table.string('db_version');
      table.string('db_asm');
      // table.integer('db_id').notNullable().unique();
      table.timestamps(true, true);
  }).createTable('db_size',function(table){
      table.increments('id').primary();
      table.integer('db_free').notNullable();
      table.integer('db_used').notNullable();
      table.integer('db_total').notNullable();
      table.integer('db_id').references('id').inTable('user_database');
      table.timestamps(true, true);
  }).createTable('db_tablespace',function(table){
      table.increments('id').primary();
      table.string('db_table_name').notNullable();
      table.integer('db_table_used').notNullable();
      table.integer('db_table_size').notNullable();
      table.string("db_table_pct").notNullable();
      table.integer('db_id').references('id').inTable('user_database');
      table.timestamps(true, true);
  }).createTable('db_size_history',function(table){
      table.increments('id').primary();
      table.integer('db_free_history').notNullable();
      table.integer('db_used_history').notNullable();
      table.integer('db_total_history').notNullable();
      table.integer('db_id').references('id').inTable('user_database');
      table.timestamps(true, true);
  }).createTable('db_tablespace_history',function(table){
      table.increments('id').primary();
      table.string('db_table_name_history').notNullable();
      table.integer('db_table_used_history').notNullable();
      table.integer('db_table_size_history').notNullable();
      table.string("db_table_pct_history").notNullable();
      table.integer('db_id').references('id').inTable('user_database');
      table.timestamps(true, true);
  })
  };
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
  exports.down =  function(knex) {
      return  knex.schema.dropTableIfExists('user')
      .dropTableIfExists('user_database')
      .dropTableIfExists('db_size')
      .dropTableIfExists('db_tablespace')  
      .dropTableIfExists('db_size_history')
      .dropTableIfExists('db_tablespace_history');
  };
  