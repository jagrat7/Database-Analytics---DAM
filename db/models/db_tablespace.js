const { Model } = require('objection');
const BaseModel = require('./base_model');

class Db_tablespace extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'db_tablespace';
    }

static get relationMappings() {
        return {
        }
    }
}
module.exports = Db_tablespace;