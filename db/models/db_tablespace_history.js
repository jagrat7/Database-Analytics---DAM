const BaseModel = require('./base_model');

class Db_tablespace_history extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_tablespace_history';
    }

static get relationMappings() {
        return {
        }
    }
}
module.exports = Db_tablespace_history;