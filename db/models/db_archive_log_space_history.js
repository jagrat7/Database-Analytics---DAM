const BaseModel = require('./base_model');

class Db_archive_log_space_history extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_archive_log_space_history';
    }

static get relationMappings() {
        return {
        }
    }
}
module.exports = Db_archive_log_space_history;