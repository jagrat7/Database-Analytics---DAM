const BaseModel = require('./base_model');

class Db_links extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_links';
    }

static get relationMappings() {
        return {
        }
    }
}
module.exports = Db_links;