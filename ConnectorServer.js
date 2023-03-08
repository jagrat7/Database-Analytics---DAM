const setupDb = require('./db/db-setup');
const User_database = require('./db/models/userdatabase')
const Db_size = require('./db/models/db_size')
const Db_tablespace = require('./db/models/db_tablespace')
const Db_size_history = require('./db/models/db_size_history')
const Db_tablespace_history = require('./db/models/db_tablespace_history')
const Db_archive_log_space = require('./db/models/db_archive_log_space')
const Db_archive_log_space_history = require('./db/models/db_archive_log_space_history')
const Db_links = require('./db/models/db_links')
const ExternalDb = require("./models/external-db")
// set up database with objection and knex
setupDb();


async function writeToDbOnPost(db_sid, db_host, db_port, db_username, db_password, db_sysuser) {
  try {
    let extdb_data;
    const extdb = new ExternalDb(db_username, db_password,
      db_sysuser, db_host, db_port, db_sid, undefined);
    const extdb_connection = await extdb.getConnectionStatus();

    if (extdb_connection) {
      extdb_data = await extdb.getAllDbData();
    }
    return { extdb_data, extdb_connection };
  }
  catch (e) {
    console.error(e);
  }
};
async function getDbConnection(db_sid, db_host, db_port, db_username, db_password, db_sysuser,db_id) {
  try {

    const extdb = new ExternalDb(db_username, db_password,
      db_sysuser, db_host, db_port, db_sid, db_id);
    const extdb_connection = await extdb.getConnectionStatus();

    return  extdb_connection ;
  }
  catch (e) {
    console.error(e);
  }
};

async function updateDbInfo() {
  const extdb_userDatabases = await User_database.query()
  if (!(extdb_userDatabases.length === 0)) { //every 5 mins
    try {
      for (let i = 0; i < extdb_userDatabases.length; i++) {
        const extdb = new ExternalDb(extdb_userDatabases[i].db_username, extdb_userDatabases[i].db_password,
          extdb_userDatabases[i].db_sysuser, extdb_userDatabases[i].db_host, extdb_userDatabases[i].db_port, extdb_userDatabases[i].db_sid, extdb_userDatabases[i].id);
        extdb_connection = await extdb.getConnectionStatus();

        if (extdb_connection) {
          const extdb_data = await extdb.getAllDbData();
          await extdb_userDatabases[i].$relatedQuery('db_size').insert({
            db_free: extdb_data.dbSize_data.Free_Space,
            db_used: extdb_data.dbSize_data.Used_Space,
            db_total: extdb_data.dbSize_data.Reserved_Space,
          });
          await extdb_userDatabases[i].$relatedQuery('db_size_history').insert({
            db_free_history: extdb_data.dbSize_data.Free_Space,
            db_used_history: extdb_data.dbSize_data.Used_Space,
            db_total_history: extdb_data.dbSize_data.Reserved_Space,
          });
          await extdb_userDatabases[i].$relatedQuery('db_archive_log_space').insert({
            db_archive_percent_used: extdb_data.archiveLogSpace.PERCENT_SPACE_USED,
          });
          await extdb_userDatabases[i].$relatedQuery('db_archive_log_space_history').insert({
            db_archive_history_percent_used: extdb_data.archiveLogSpace.PERCENT_SPACE_USED,
          });

          for (let k = 0; k < extdb_data.dbLink.length; k++) {
            await extdb_userDatabases[i].$relatedQuery('db_links').insert(
              {
                db_link_name: extdb_data.dbLink[k].name,
                db_link_status: extdb_data.dbLink[k].status
              }
            );
          }
          for (let k = 0; k < extdb_data.tablespaceResultorg.length; k++) {
            await extdb_userDatabases[i].$relatedQuery('db_tablespace').insert(
              {
                db_table_name: extdb_data.tablespaceResultorg[k].TABLESPACE_NAME,
                db_table_used: extdb_data.tablespaceResultorg[k].USED_SPACE_GB,
                db_table_size: extdb_data.tablespaceResultorg[k].TABLESPACE_SIZE_GB,
                db_table_pct: extdb_data.tablespaceResultorg[k].PERCENTAGE_USED,
              }
            );
            await extdb_userDatabases[i].$relatedQuery('db_tablespace_history').insert(
              {
                db_table_name_history: extdb_data.tablespaceResultorg[k].TABLESPACE_NAME,
                db_table_used_history: extdb_data.tablespaceResultorg[k].USED_SPACE_GB,
                db_table_size_history: extdb_data.tablespaceResultorg[k].TABLESPACE_SIZE_GB,
                db_table_pct_history: extdb_data.tablespaceResultorg[k].PERCENTAGE_USED,
              }
            );
          }
        }
      }

    } catch (e) {
      console.error(e);
    }

  }

};

const clearDailyTables = async () => {
  const extdb_userDatabases = await User_database.query()
  const extdb_userDatabases_db_size = await Db_size.query()
  const extdb_userDatabases_db_tablespace = await Db_tablespace.query()
  const extdb_userDatabases_db_archive_log_space = await Db_archive_log_space.query()
  const archive_log_space_limit = extdb_userDatabases.length;
  const tablespace_limit = extdb_userDatabases.length * 5;
  const dbSize_limit = extdb_userDatabases.length;

  if (extdb_userDatabases.length !== 0) {
    //! need to error check all tables 
    await Db_links.query().del().whereRaw('id NOT IN (SELECT id FROM db_tablespace order by id desc LIMIT ? OFFSET 0)', dbSize_limit * 4)

    if ((extdb_userDatabases_db_archive_log_space.length !== 0) && (extdb_userDatabases_db_size.length !== 0) && (extdb_userDatabases_db_tablespace.length !== 0)) {
      try {
        await Db_size.query().del().whereRaw('id NOT IN (SELECT id FROM db_size order by id desc LIMIT ? OFFSET 0)', dbSize_limit)
        await Db_archive_log_space.query().del().whereRaw('id NOT IN (SELECT id FROM db_archive_log_space order by id desc LIMIT ? OFFSET 0)', archive_log_space_limit)
        await Db_tablespace.query().del().whereRaw('id NOT IN (SELECT id FROM db_tablespace order by id desc LIMIT ? OFFSET 0)', tablespace_limit)
        console.log("daily tables wiped")
      } catch (e) {
        console.error(e);
      }
    }
    else if ((extdb_userDatabases_db_tablespace.length !== 0) && (extdb_userDatabases_db_size.length === 0)) {
      try {
        await Db_tablespace.query().del().whereRaw('id NOT IN (SELECT id FROM db_tablespace order by id desc LIMIT ? OFFSET 0)', tablespace_limit)
      } catch (e) {
        console.error(e);
      }
    }
    else if ((extdb_userDatabases_db_tablespace.length === 0) && (extdb_userDatabases_db_size.length !== 0)) {
      try {
        await Db_size.query().del().whereRaw('id NOT IN (SELECT id FROM db_size order by id desc LIMIT ? OFFSET 0)', dbSize_limit)
      } catch (e) {
        console.error(e);
      }
    }
    else {
      console.log("info tables empty");
    }

  }

};
module.exports = { writeToDbOnPost, updateDbInfo, clearDailyTables ,getDbConnection}