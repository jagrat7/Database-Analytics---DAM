const { Model } = require('objection');
const BaseModel = require('./base_model');

class User_database extends BaseModel {
    // Table name is the only required property.

    static get tableName() {

        return 'user_database';
    }

    static get relationMappings() {

        const Db_size = require('./db_size');
        const Db_archive_log_space = require('./db_archive_log_space');
        const Db_links = require('./db_links');
        const Db_tablespace = require('./db_tablespace');
        const Db_size_history = require('./db_size_history');
        const Db_tablespace_history = require('./db_tablespace_history');
        const Db_archive_log_space_history = require('./db_archive_log_space_history');
        return {
            db_size: {
                relation: Model.HasManyRelation,
                modelClass: Db_size,
                join: {
                    from: 'user_database.id',
                    to: 'db_size.db_id'
                }
            },
            db_tablespace: {
                relation: Model.HasManyRelation,
                modelClass: Db_tablespace,
                join: {
                    from: 'user_database.id',
                    to: 'db_tablespace.db_id'
                }
            },
            db_tablespace_history: {
                relation: Model.HasManyRelation,
                modelClass: Db_tablespace_history,
                join: {
                    from: 'user_database.id',
                    to: 'db_tablespace_history.db_id'
                }
            },
            db_size_history: {
                relation: Model.HasManyRelation,
                modelClass: Db_size_history,
                join: {
                    from: 'user_database.id',
                    to: 'db_size_history.db_id'
                }
            },
            db_archive_log_space: {
                relation: Model.HasManyRelation,
                modelClass: Db_archive_log_space,
                join: {
                    from: 'user_database.id',
                    to: 'db_archive_log_space.db_id'
                }
            },
            db_archive_log_space_history: {
                relation: Model.HasManyRelation,
                modelClass: Db_archive_log_space_history,
                join: {
                    from: 'user_database.id',
                    to: 'db_archive_log_space_history.db_id'
                }
            }, 
            db_links: {
                relation: Model.HasManyRelation,
                modelClass: Db_links,
                join: {
                    from: 'user_database.id',
                    to: 'db_links.db_id'
                }
            }

        }
    }

}
module.exports = User_database;