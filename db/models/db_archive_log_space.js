const BaseModel = require('./base_model');

class Db_archive_log_space extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_archive_log_space';
    }

static get relationMappings() {
        return {
        }
    }
}
module.exports = Db_archive_log_space;