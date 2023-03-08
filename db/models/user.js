const BaseModel = require('./base_model');


class User extends BaseModel {
    // Table name is the only required property.

    static get tableName() {
        return 'user';
    }
}
// static get relationMappings() {
//         return {

//         }
//     }
    
// }

module.exports = User;