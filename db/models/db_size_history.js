const BaseModel = require('./base_model');


class Db_size_history extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_size_history';
    }
static get relationMappings() {
        return {

        }
    }
    
}
module.exports = Db_size_history;