/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('user', function (table) {
        table.boolean('approved'),
        table.dropColumn('name')
    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('user', function (table) {
        table.string('name'),
        table.dropColumn('approved')

})


};
