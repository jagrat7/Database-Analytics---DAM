const BaseModel = require('./base_model');

class Db_size extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_size';
    }
static get relationMappings() {
        return {

        }
    }
    
}
module.exports = Db_size;