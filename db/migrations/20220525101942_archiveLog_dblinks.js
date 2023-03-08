/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return  knex.schema.createTable('db_archive_log_space',function(table){
        table.increments('id').primary();
        table.string('db_archive_percent_used');
        table.integer('db_id').references('id').inTable('user_database');
        table.timestamps(true, true);
    }).createTable('db_archive_log_space_history',function(table){
        table.increments('id').primary();
        table.string('db_archive_history_percent_used');
        table.integer('db_id').references('id').inTable('user_database');
        table.timestamps(true, true);
    }).createTable('db_links',function(table){
        table.increments('id').primary();
        table.string('db_link_name');
        table.string('db_link_status');
        table.integer('db_id').references('id').inTable('user_database');
        table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return  knex.schema.dropTableIfExists('archive_log_space')
    .dropTableIfExists('db_links')

  
};
