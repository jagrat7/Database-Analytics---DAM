
const Db_size_history = require('./db/models/db_size_history')
const Db_tablespace_history = require('./db/models/db_tablespace_history')
const setupDb = require('./db/db-setup');
const Db_archive_log_space_history = require('./db/models/db_archive_log_space_history')
setupDb();

async function getDataByTime(id, table, daysAdded) {
    try {

        // console.log(daysAdded)

        const createTimeframeArray = (start, length, flag) => {
            var timeFrameArray = [];
            var curr;
            for (let i = start; i <= start + length - 1; i++) {
                curr = new Date(); // get current date
                // console.log('curr: ',curr)
                let first = curr.getDate() + curr.getDay() - i;
                // console.log('frist : '+curr.getDay() )
                // console.log(day)
                var day
                if (flag) {
                    day = new Date(curr.setDate(first)).toISOString().slice(0, 24)
                }
                else {
                    day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
                }
                timeFrameArray.push(day);
            }

            return timeFrameArray;
        }
        var timeFrame = createTimeframeArray((daysAdded+1), daysAdded, true);
        var internalTimeFrame = createTimeframeArray((daysAdded  ), daysAdded + 1, false);
        internalTimeFrame = internalTimeFrame.reverse();
        // console.log(timeFrame);
        const options = {
            day: 'numeric', year: 'numeric', month: 'numeric'
        };
        timeFrame = timeFrame.map(a => new Date(a).toLocaleDateString('en-GB', options));
        timeFrame = timeFrame.reverse()
        // console.log(timeFrame);
        // console.log(internalTimeFrame);

        let dbSizeValues = []
        let dbTableSpaceValues = []
        let dbArchiveSpaceI = []
        var dbTableSpaceValuesInternal = []
        if (table == 'dbSize') {

            // internalTimeFrame = createTimeframeArray((daysAdded +1 ), daysAdded + 1, false); //! temp fix need to slove error occuring at 12am
            for (let i = 0; i < internalTimeFrame.length; i++) {
                if (i !== internalTimeFrame.length - 1) {
                    // console.log(internalTimeFrame[i], '  ', internalTimeFrame[i ])
                    // console.log( (await Db_size_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i+1], internalTimeFrame[i]]).avg('db_total_history as avgTotal'))[0])
                    // console.log((await Db_size_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i+1], internalTimeFrame[i]]).avg('db_used_history as db_used_history'))[0])
                    dbSizeValues.push({
                        db_total_history: (await Db_size_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i], internalTimeFrame[i +1]]).avg('db_total_history as avgTotal'))[0].avgTotal,
                        db_used_history: (await Db_size_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i], internalTimeFrame[i +1]]).avg('db_used_history as avgUsed'))[0].avgUsed
                    })
                }
            }
            console.log( dbSizeValues,internalTimeFrame, timeFrame)
            return { dbSizeValues, timeFrame }
        }
        else if (table == 'archiveLogSpace') {

            // internalTimeFrame = createTimeframeArray((daysAdded +1 ), daysAdded + 1, false); //! temp fix need to slove error occuring at 12am
            for (let i = 0; i < internalTimeFrame.length; i++) {
                if (i !== internalTimeFrame.length - 1) {
                    // console.log(internalTimeFrame[i], '  ', internalTimeFrame[i ])
                    // console.log(await Db_archive_log_space_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i], internalTimeFrame[i]]).avg('db_archive_history_percent_used as avgTotal'))
                    dbArchiveSpaceI.push({
                        percent_used: (await Db_archive_log_space_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i], internalTimeFrame[i+1]]).avg('db_archive_history_percent_used as avgTotal'))[0].avgTotal
                    })
                }
            }
            // console.log( dbArchiveSpaceI,internalTimeFrame, timeFrame)

            return { dbArchiveSpaceI, timeFrame }
        }
        else if (table == 'dbTableSpace') {
            var dbTableNames = await Db_tablespace_history.query().where('db_id', id).select('db_table_name_history').limit(5)
            var tableNames = dbTableNames.map(x => x.db_table_name_history)
            // internalTimeFrame = createTimeframeArray((daysAdded +1), daysAdded + 1, false); //! temp fix need to slove error occuring at 12am

            // console.log(tableNames)
            for (let i = 0; i < internalTimeFrame.length; i++) {
                if (i !== internalTimeFrame.length - 1) {
                    // dbTableSpaceValues.push(await Db_tablespace_history.query().where('db_id', id).whereBetween('created_at', [internalTimeFrame[i+1], internalTimeFrame[i]]).orderBy('created_at', 'desc').limit(5)  )//returns 2d array  array[each day][tableName]
                    // console.log(internalTimeFrame[i], '  ', internalTimeFrame[i])
                    for (let k = 0; k < tableNames.length; k++) {

                        // console.log(await Db_tablespace_history.query().where('db_id', id).where('db_table_name_history', tableNames[k])
                        //     .whereBetween('created_at', [internalTimeFrame[i], internalTimeFrame[i]]).avg('db_table_pct_history as avgDATA'))   
                        dbTableSpaceValuesInternal.push({
                            db_table_name_history: tableNames[k],
                            db_table_pct_history: (await Db_tablespace_history.query().where('db_id', id).where('db_table_name_history', tableNames[k])
                                .whereBetween('created_at', [internalTimeFrame[i], internalTimeFrame[i +1]]).avg('db_table_pct_history as avgDATA'))[0].avgDATA
                        })
                    }
                        while(dbTableSpaceValuesInternal.length > 0) {
                            dbTableSpaceValues.push(dbTableSpaceValuesInternal.splice(0,5));
                        }    

                }
            }
            // console.log(dbTableSpaceValues, internalTimeFrame)
        return { dbTableSpaceValues, timeFrame, tableNames };

        }



    } catch (error) {
        console.error(error)
    }

}


const getLocalTime = (array) => {
    const options = {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
        second: 'numeric'
    };
    var localTime = array.map(a => new Date(a.created_at).toLocaleDateString('en-GB', options));
    return localTime

}


module.exports = {
    getLocalTime, getDataByTime
}