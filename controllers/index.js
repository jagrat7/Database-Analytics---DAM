
const ConnectorServerFunctions = require('../ConnectorServer');
const User_database = require('../db/models/userdatabase')
const Db_size = require('../db/models/db_size')
const Db_tablespace = require('../db/models/db_tablespace')
const Db_size_history = require('../db/models/db_size_history')
const Db_tablespace_history = require('../db/models/db_tablespace_history')
const Db_archive_log_space = require('../db/models/db_archive_log_space')
const Db_archive_log_space_history = require('../db/models/db_archive_log_space_history')
const Db_links = require('../db/models/db_links')
const setupDb = require('../db/db-setup');
const timeHelp = require('../getDataByTime')

setupDb();

async function addDbController(req, res) {
    var syscheck = req.body.sysCheck;
    if (syscheck == "on") { syscheck = true }
    else { syscheck = false }
    let nickname = req.body.dbName;
    let sid = req.body.dbSid;
    let host = req.body.dbIP;
    let port = req.body.dbPort;
    let username = req.body.dbUser;
    let password = req.body.dbPassword;
    try {
        let connectAndGetData = await ConnectorServerFunctions.writeToDbOnPost(sid, host, port, username, password, syscheck)

        if (connectAndGetData.extdb_connection) {
            const { extdb_data: { dbSize_data, tablespaceResultorg: tableData,archiveLogSpace,dbLink } } = connectAndGetData;
            await User_database.query().insertGraph({
                db_nickname: nickname,
                db_sid: sid,
                db_host: host,
                db_port: port,
                db_username: username,
                db_password: password,
                db_asm: syscheck,
                db_version: connectAndGetData.extdb_data.version.VERSION,
                db_status: "online",
                db_size: {
                    db_free: dbSize_data.Free_Space,
                    db_used: dbSize_data.Used_Space,
                    db_total: dbSize_data.Reserved_Space,
                },
                db_tablespace: [
                    {
                        db_table_name: tableData[0].TABLESPACE_NAME,
                        db_table_used: tableData[0].USED_SPACE_GB,
                        db_table_size: tableData[0].TABLESPACE_SIZE_GB,
                        db_table_pct: tableData[0].PERCENTAGE_USED,
                    },
                    {
                        db_table_name: tableData[1].TABLESPACE_NAME,
                        db_table_used: tableData[1].USED_SPACE_GB,
                        db_table_size: tableData[1].TABLESPACE_SIZE_GB,
                        db_table_pct: tableData[1].PERCENTAGE_USED,
                    },
                    {
                        db_table_name: tableData[2].TABLESPACE_NAME,
                        db_table_used: tableData[2].USED_SPACE_GB,
                        db_table_size: tableData[2].TABLESPACE_SIZE_GB,
                        db_table_pct: tableData[2].PERCENTAGE_USED,
                    },
                    {
                        db_table_name: tableData[3].TABLESPACE_NAME,
                        db_table_used: tableData[3].USED_SPACE_GB,
                        db_table_size: tableData[3].TABLESPACE_SIZE_GB,
                        db_table_pct: tableData[3].PERCENTAGE_USED,
                    },
                    {
                        db_table_name: tableData[4].TABLESPACE_NAME,
                        db_table_used: tableData[4].USED_SPACE_GB,
                        db_table_size: tableData[4].TABLESPACE_SIZE_GB,
                        db_table_pct: tableData[4].PERCENTAGE_USED,
                    }
                ],
                db_size_history: {
                    db_free_history: dbSize_data.Free_Space,
                    db_used_history: dbSize_data.Used_Space,
                    db_total_history: dbSize_data.Reserved_Space,
                },
                db_tablespace_history: [
                    {
                        db_table_name_history: tableData[0].TABLESPACE_NAME,
                        db_table_used_history: tableData[0].USED_SPACE_GB,
                        db_table_size_history: tableData[0].TABLESPACE_SIZE_GB,
                        db_table_pct_history: tableData[0].PERCENTAGE_USED,
                    },
                    {
                        db_table_name_history: tableData[1].TABLESPACE_NAME,
                        db_table_used_history: tableData[1].USED_SPACE_GB,
                        db_table_size_history: tableData[1].TABLESPACE_SIZE_GB,
                        db_table_pct_history: tableData[1].PERCENTAGE_USED,
                    },
                    {
                        db_table_name_history: tableData[2].TABLESPACE_NAME,
                        db_table_used_history: tableData[2].USED_SPACE_GB,
                        db_table_size_history: tableData[2].TABLESPACE_SIZE_GB,
                        db_table_pct_history: tableData[2].PERCENTAGE_USED,
                    },
                    {
                        db_table_name_history: tableData[3].TABLESPACE_NAME,
                        db_table_used_history: tableData[3].USED_SPACE_GB,
                        db_table_size_history: tableData[3].TABLESPACE_SIZE_GB,
                        db_table_pct_history: tableData[3].PERCENTAGE_USED,
                    },
                    {
                        db_table_name_history: tableData[4].TABLESPACE_NAME,
                        db_table_used_history: tableData[4].USED_SPACE_GB,
                        db_table_size_history: tableData[4].TABLESPACE_SIZE_GB,
                        db_table_pct_history: tableData[4].PERCENTAGE_USED,
                    }
                ],
                db_archive_log_space: {
                    db_archive_percent_used: archiveLogSpace.PERCENT_SPACE_USED,
                },
                db_archive_log_space_history: {
                    db_archive_history_percent_used: archiveLogSpace.PERCENT_SPACE_USED,
                }, 
                db_links: [
                    {
                        db_link_name: dbLink[0].name,
                        db_link_status: dbLink[0].status,
                    },
                    {
                        db_link_name: dbLink[1].name,
                        db_link_status: dbLink[1].status,
                    },
                    {
                        db_link_name: dbLink[2].name,
                        db_link_status: dbLink[2].status,
                    },
                    {
                        db_link_name: dbLink[3].name,
                        db_link_status: dbLink[3].status,
                    }
                ]
            }).then(async () => {
                res.json({ connection: connectAndGetData.extdb_connection })
            })
        } else {
            res.json({ connection: connectAndGetData.extdb_connection })
        }
    } catch (e) {
        console.error(e);
    }
}
async function dbSize(req, res) {

    const id = req.params.id;
    const querys = req.query;
    const { timeFrame } = querys; //week , months

    try {
        if (Object.keys(querys).length <= 0) {
            const dbName = await User_database.query().select('db_nickname').where('id', id);
            const dbSizeLive = await Db_size.query().where('db_id', id).orderBy('created_at', 'desc').first();
            const dbSizeValues = await Db_size_history.query().where('db_id', id).orderBy('id', 'desc');

 
            res.render("dbsView/db-size", {
                free: Math.round(dbSizeLive.db_free),
                used: Math.round(dbSizeLive.db_used),
                total: Math.round(dbSizeLive.db_total),
                dbName: dbName[0].db_nickname,
                tableData: dbSizeValues,
                dbTableName: 'dbSize',
                historical: timeFrame
            });
        }
        else {
            const dbName = await User_database.query().select('db_nickname').where('id', id);
            const dbSizeValues = await Db_size_history.query().where('db_id', id).orderBy('id', 'desc');

            let dataByTimeFrame

            if (timeFrame == 'week') {
                dataByTimeFrame = await timeHelp.getDataByTime(id, 'dbSize', 3) //! fillings in values that are not avilable
                    dataByTimeFrame.dbSizeValues.map((item) => {
                        if (item.db_total_history == undefined) { dataByTimeFrame = 'error'; }
                        if (item.db_total_history == null) { dataByTimeFrame = 'error'; }
                    })
            }
            else if (timeFrame == 'month') {
                dataByTimeFrame = await timeHelp.getDataByTime(id, 'dbSize', 30) //! fillings in values that are not avilable
                dataByTimeFrame.dbSizeValues.map((item) => {
                    if (item.db_total_history == undefined) { dataByTimeFrame = 'error'; }
                    if (item.db_total_history == null) { dataByTimeFrame = 'error'; }
                })
            }
            // const {db_free_history}=dataByTimeFrame.dbSizeValues
            if (dataByTimeFrame !== 'error') {
                var used = dataByTimeFrame.dbSizeValues.map(a => a.db_used_history);
                var total = dataByTimeFrame.dbSizeValues.map(a => a.db_total_history);
            }

            // console.log(total);
            if (dataByTimeFrame === 'error') {
                res.render("dbsView/db-size", {
                    dbName: dbName[0].db_nickname,
                    tableData: dbSizeValues,
                    dbTableName: 'dbSize',
                    historical: "error"

                });
            }
            else {
                res.render("dbsView/db-size", {
                    dbName: dbName[0].db_nickname,
                    tableData: dbSizeValues,
                    dbTableName: 'dbSize',
                    historical: timeFrame,
                    historicalLabel: dataByTimeFrame.timeFrame,
                    historicalUsed: used,
                    historicalTotal: total

                });
            }
        }

    } catch (error) {
        console.error(error)
    }
}


async function archiveLog(req, res) {

    const id = req.params.id;
    const querys = req.query;
    const { timeFrame } = querys; //week , months

    try {
        if (Object.keys(querys).length <= 0) {
            const dbName = await User_database.query().select('db_nickname').where('id', id);
            const archiveLogLive = await Db_archive_log_space.query().where('db_id', id).orderBy('created_at', 'desc').first();
            const dbArchiveSpace = await Db_archive_log_space_history.query().where('db_id', id).orderBy('id', 'desc');

            res.render("dbsView/db-archiveLog", {
                percentUsed: Math.round(archiveLogLive.db_archive_percent_used),
                dbName: dbName[0].db_nickname,
                tableData: dbArchiveSpace,
                dbTableName: 'archiveLog',
                historical: timeFrame
            });
        }
        else {
            const dbName = await User_database.query().select('db_nickname').where('id', id);
            const dbArchiveSpace = await Db_archive_log_space_history.query().where('db_id', id).orderBy('id', 'desc');


            let dataByTimeFrame

            if (timeFrame == 'week') {
                dataByTimeFrame = await timeHelp.getDataByTime(id, 'archiveLogSpace', 3) //! fillings in values that are not avilable
                    dataByTimeFrame.dbArchiveSpaceI.map((item) => {
                        if (item.percent_used == undefined) { dataByTimeFrame = 'error'; }
                        if (item.percent_used == null) { dataByTimeFrame = 'error'; }
                    })
            }
            else if (timeFrame == 'month') {
                dataByTimeFrame = await timeHelp.getDataByTime(id, 'archiveLogSpace', 30) //! fillings in values that are not avilable
                dataByTimeFrame.dbArchiveSpaceI.map((item) => {
                    if (item.percent_used == undefined) { dataByTimeFrame = 'error'; }
                    if (item.percent_used == null) { dataByTimeFrame = 'error'; }
                })
            }
            // const {db_free_history}=dataByTimeFrame.dbArchiveSpace
            if (dataByTimeFrame !== 'error') {
                var percent = dataByTimeFrame.dbArchiveSpaceI.map(a => a.percent_used);
            }

            // console.log(total);
            if (dataByTimeFrame === 'error') {
                res.render("dbsView/db-archiveLog", {
                    dbName: dbName[0].db_nickname,
                    tableData: dbArchiveSpace,
                    dbTableName: 'archiveLog',
                    historical: "error"

                });
            }
            else {
                res.render("dbsView/db-archiveLog", {
                    dbName: dbName[0].db_nickname,
                    tableData: dbArchiveSpace,
                    dbTableName: 'archiveLog',
                    historical: timeFrame,
                    historicalLabel: dataByTimeFrame.timeFrame,
                    historicalPercentUsed: percent,
                    
                });
            }
        }

    } catch (error) {
        console.error(error)
    }
}

async function tableSpace(req, res) {
    const id = req.params.id;
    const querys = req.query;
    const { tableName, timeFrame } = querys;


    try {
        if (tableName == undefined && timeFrame == undefined || tableName == undefined) {
            const dbTableSpaceValues = await Db_tablespace_history.query().where('db_id', id).orderBy('id', 'desc');

            let tbNames = [];
            let tbUsed = [];
            let tbSize = [];
            let tbPct = [];


            const dbName = await User_database.query().select('db_nickname').where('id', id);

            let dbTableInfo = await Db_tablespace.query().where('db_id', id).orderBy('created_at', 'desc');//limit(5)
            for (let i = 0; i < 5; i++) {
                tbNames.push(dbTableInfo[i].db_table_name)
                tbUsed.push(Math.round(dbTableInfo[i].db_table_used))
                tbSize.push(Math.round(dbTableInfo[i].db_table_size))
                tbPct.push(parseFloat(dbTableInfo[i].db_table_pct).toFixed(2))

            }

            if (timeFrame !== undefined) {
                let dataByTimeFrame

                if (timeFrame == 'week') {
                    dataByTimeFrame = await timeHelp.getDataByTime(id, 'dbTableSpace', 3) //! fillings in values that are not avilable
                    // console.log(dataByTimeFrame.dbTableSpaceValues)
                    dataByTimeFrame.dbTableSpaceValues.map((item) => {
                        // console.log(item[0].db_table_pct_history )
                        item.forEach(element => {
                            if (element.db_table_pct_history == null || element.db_table_pct_history == undefined) { dataByTimeFrame = 'error'; }

                        });
                    })

                }
                else if (timeFrame == 'month') {
                    dataByTimeFrame = await timeHelp.getDataByTime(id, 'dbTableSpace', 30) //! fillings in values that are not avilable
                    dataByTimeFrame.dbTableSpaceValues.map((item) => {
                        item.forEach(element => {
                            if (element.db_table_pct_history == null || element.db_table_pct_history == undefined) { dataByTimeFrame = 'error'; }

                        });                    })
                }
                // console.log(dataByTimeFrame.dbTableSpaceValues)
                if (dataByTimeFrame !== 'error') {
                    var historicalTableName = dataByTimeFrame.tableNames;
                    // console.log(historicalTableName)
                    var pct = [];
                    dataByTimeFrame.dbTableSpaceValues.map((item) => {
                        pct.push([item[0].db_table_pct_history, item[1].db_table_pct_history, item[2].db_table_pct_history, item[3].db_table_pct_history, item[4].db_table_pct_history]);

                    })
                    // console.log(pct)
                    var t1=[]
                    var t2=[]
                    var t3 =[]
                    var t4 =[]
                    var t5 =[]
                    
                    // for (let k = 0; k < 5; k++) {
                    //     const element = array[k];

                    // }
                    for (let i = 0; i < pct.length; i++) {
                        t1.push(pct[i][0])
                    }
                    // console.log(t1)
                    for (let i = 0; i < pct.length; i++) {
                        t2.push(pct[i][1])
                    }
                    for (let i = 0; i < pct.length; i++) {
                        t3.push(pct[i][2])
                    }
                    for (let i = 0; i < pct.length; i++) {
                        t4.push(pct[i][3])
                    }
                    for (let i = 0; i < pct.length; i++) {
                        t5.push(pct[i][4])
                    }
                }


                if (dataByTimeFrame === 'error') {
                    res.render("dbsView/db-tableSpace", {
                        tableNames: tbNames,
                        used: tbUsed,
                        size: tbSize,
                        pct: tbPct,
                        dbName: dbName[0].db_nickname,
                        tableData: dbTableSpaceValues,
                        tableName: 'allData',
                        dbTableName: 'tableSpace',
                        historical: "error"
                    });

                }
                else {

                    res.render("dbsView/db-tableSpace", {
                        tableNames: tbNames,
                        used: tbUsed,
                        size: tbSize,
                        pct: tbPct,
                        dbName: dbName[0].db_nickname,
                        tableData: dbTableSpaceValues,
                        tableName: 'allData',
                        dbTableName: 'tableSpace',
                        historical: timeFrame,
                        historicalLabel: dataByTimeFrame.timeFrame,
                        historicalTableNameLabel: historicalTableName,
                        historicalPctT1: t1,
                        historicalPctT2: t2,
                        historicalPctT3: t3,
                        historicalPctT4: t4,
                        historicalPctT5: t5,
                    });
                }
            } else {
                res.render("dbsView/db-tableSpace", {
                    tableNames: tbNames,
                    used: tbUsed,
                    size: tbSize,
                    pct: tbPct,
                    dbName: dbName[0].db_nickname,
                    tableData: dbTableSpaceValues,
                    tableName: 'allData',
                    dbTableName: 'tableSpace',
                    historical: undefined,
                });
            }

        }
        else {
            const dbTableSpaceValues = await Db_tablespace_history.query().where('db_id', id).orderBy('id', 'desc');
            const dbName = await User_database.query().select('db_nickname').where('id', id);

            let dbTableInfo = await Db_tablespace.query().where('db_table_name', tableName).where('db_id', id).orderBy('id', 'desc').first();//limit(5)
            if (timeFrame !== undefined) {
                let dataByTimeFrame
                if (timeFrame == 'week') {
                    dataByTimeFrame = await timeHelp.getDataByTime(id, 'dbTableSpace', 3) //! fillings in values that are not avilable
                    // console.log(dataByTimeFrame.dbTableSpaceValues)
                    dataByTimeFrame.dbTableSpaceValues.map((item) => {
                        item.forEach(element => {
                            if (element.db_table_pct_history == null || element.db_table_pct_history == undefined) { dataByTimeFrame = 'error'; }

                        });                    })
                }
                else if (timeFrame == 'month') {
                    dataByTimeFrame = await timeHelp.getDataByTime(id, 'dbTableSpace', 30) //! fillings in values that are not avilable
                    dataByTimeFrame.dbTableSpaceValues.map((item) => {
                        item.forEach(element => {
                            if (element.db_table_pct_history == null || element.db_table_pct_history == undefined) { dataByTimeFrame = 'error'; }

                        });                    })
                }
                // console.log(dataByTimeFrame.dbTableSpaceValues)
                if (dataByTimeFrame !== 'error') {
                    var pct = [];
                    dataByTimeFrame.dbTableSpaceValues.map((item) => {
                        item.forEach((element) => {
                            if (element.db_table_name_history == tableName) {
                                // console.log(element.created_at)
                                pct.push(element.db_table_pct_history);
                            }
                        })
                    })
                    // console.log(pct)

                }


                if (dataByTimeFrame === 'error') {
                    res.render("dbsView/db-tableSpace", {
                        dbName: dbName[0].db_nickname,
                        tableData: dbTableSpaceValues,
                        tableName: tableName,
                        dbTableName: 'tableSpace',
                        historical: "error"
                    });

                }
                else {

                    res.render("dbsView/db-tableSpace", {
                        tableNames: dbTableInfo.db_table_name,
                        used: Math.round(dbTableInfo.db_table_used),
                        size: Math.round(dbTableInfo.db_table_size),
                        pct: parseFloat(dbTableInfo.db_table_pct).toFixed(2),
                        dbName: dbName[0].db_nickname,
                        tableData: dbTableSpaceValues,
                        tableName: tableName,
                        dbTableName: 'tableSpace',
                        historical: timeFrame,
                        historicalLabel: dataByTimeFrame.timeFrame,
                        historicalPct: pct,

                    });
                }
            } else {
                res.render("dbsView/db-tableSpace", {
                    tableNames: dbTableInfo.db_table_name,
                    used: Math.round(dbTableInfo.db_table_used),
                    size: Math.round(dbTableInfo.db_table_size),
                    pct: parseFloat(dbTableInfo.db_table_pct).toFixed(2),
                    dbName: dbName[0].db_nickname,
                    tableData: dbTableSpaceValues,
                    tableName: tableName,
                    dbTableName: 'tableSpace',
                    historical: undefined,
                });
            }

        }

    } catch (error) {
        console.error(error)
    }

}


module.exports = { addDbController, archiveLog, tableSpace, dbSize }