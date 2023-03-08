const setupDb = require('./db/db-setup');
const User_database = require('./db/models/userdatabase')
const Db_size = require('./db/models/db_size')
const Db_tablespace = require('./db/models/db_tablespace')
const ExternalDb = require("./models/external-db")
const { raw } = require('objection');
// set up database with objection and knex

const Db_size_history = require('./db/models/db_size_history')
const Db_tablespace_history = require('./db/models/db_tablespace_history')

setupDb();

(async function () {
  let id = 1
  try {
    const dbListP = await User_database.query().findById(id);
    const extdb_userDatabases = await User_database.query()
    const extdb_userDatabases_db_size = await Db_size.query()
    const extdb_userDatabases_db_tablespace = await Db_tablespace.query()


    let daysAdded = 2;
    let table = 'dbTableSpace';
    id = 7;


    let today = new Date()
    today = today.toISOString()

    const getWeekFromStartDay = (start, length) => {
      var weekDays = [];
      var curr;
      for (let i = start + 1; i <= start + length; i++) {
        curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay() + i;
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        weekDays.push(day + 'T');
      }
      return weekDays;
    }
    console.log(getWeekFromStartDay(-(daysAdded - 1), daysAdded));
    week = getWeekFromStartDay(-(daysAdded - 1), daysAdded);
    // const week = lastWeek();
    let startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysAdded)
    startDate = new Date((startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear()).toISOString()
    let dbSizeValues = []
    let dbTableSpaceValues = []
    if (table == 'dbSize') {
      for (let i = 0; i < week.length; i++) {
        dbSizeValues.push(await Db_size_history.query().where('db_id', id).whereBetween('created_at', [startDate, week[i]]).orderBy('created_at', 'desc').first())//  .avg({average_free:'db_free_history'})
      }
      console.log(dbSizeValues)
      return dbSizeValues

    }
    else if (table == 'dbTableSpace') {
      for (let i = 0; i < week.length; i++) {
        dbTableSpaceValues.push(await Db_tablespace_history.query().where('db_id', id).whereBetween('created_at', [startDate, week[i]]).orderBy('created_at', 'desc').limit(5))//  .avg({average_free:'db_free_history'})
      }
      console.log(dbTableSpaceValues)
      return dbTableSpaceValues;
    }
  } catch (error) {
    console.error(error)
  }

})();

