const { Model } = require('objection');

class BaseModel extends Model {

  $beforeInsert() {
    // const options = {
    //   year: 'numeric', month: 'numeric', day: 'numeric',hour: 'numeric', minute: 'numeric',
    //   second: 'numeric'
    // };
    // this.created_at = new Date().toLocaleDateString(undefined, options);
    // this.updated_at = new Date().toLocaleDateString(undefined, options);

    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  $beforeUpdate() {
    // const options = {
    //   year: 'numeric', month: 'numeric', day: 'numeric',hour: 'numeric', minute: 'numeric',
    //   second: 'numeric'
    // };
    // this.updated_at = new Date().toLocaleDateString(undefined, options);


    this.updated_at = new Date().toISOString();
  }
}

module.exports = BaseModel;