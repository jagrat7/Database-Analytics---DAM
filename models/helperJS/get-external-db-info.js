
const oracledb = require('oracledb');
const User_database = require('../../db/models/userdatabase');
const setupDb = require('../../db/db-setup');
setupDb();

async function getExternalDbInfo(extdb_user, extdb_password, extdb_asm, extdb_ip, extdb_port, extdb_sid) {

    let connection;

    try {

        if (extdb_user === "sys") {
            connection = await oracledb.getConnection({
                user: extdb_user,
                password: extdb_password, 
                privilege: oracledb.SYSDBA,
                connectionString: extdb_ip + ":" + extdb_port + "/" + extdb_sid
            });
            console.log("Fetching data as SYSDBA user");
        }
        else {
            connection = await oracledb.getConnection({
                user: extdb_user,
                password: extdb_password,  
                connectionString: extdb_ip + ":" + extdb_port + "/" + extdb_sid
            });
            console.log("Fetching data");

        }

        var dbSizeDataResult;
        if (extdb_asm) {
            dbSizeDataResult = await connection.execute(
                `select name, round(TOTAL_MB /1024, 2) TOTAL_GBs, round(FREE_MB/1024, 2) FREE_GB, round((total_mb - free_mb)/1024, 2) used_gb, round((total_mb - free_mb)/total_mb*100,2) " % used "  from v$asm_diskgroup`, [], {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        }
        else {
            dbSizeDataResult = await connection.execute(
                `select  "Reserved_Space", "Reserved_Space" - "Free_Space" "Used_Space","Free_Space"  from( select (select sum(bytes/(1014*1024*1024)) from dba_data_files) "Reserved_Space", (select sum(bytes/(1024*1024*1024)) from dba_free_space) "Free_Space" from dual )`, [], {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        }
        const tablespaceResult = await connection.execute(
            `select TABLESPACE_NAME, round(TABLESPACE_SIZE*8192/1024/1024/1024, 3) TABLESPACE_SIZE_GB, round(USED_SPACE*8192/1024/1024/1024, 3) USED_SPACE_GB, round((TABLESPACE_SIZE-USED_SPACE)*8192/1024/1024/1024, 3) FREE_SPACE_GB, round(USED_PERCENT, 2) PERCENTAGE_USED from dba_tablespace_usage_metrics`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        const versionResult = await connection.execute(
            `select  version from v$instance`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        const linkResult = await connection.execute(
            `select DB_LINK from dba_db_links`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        const archiveLogSpaceResult = await connection.execute(
            `select FILE_TYPE,PERCENT_SPACE_USED from v$recovery_area_usage where FILE_TYPE='ARCHIVED LOG'`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        var dbLinksName = organize(linkResult);
        var dbLink=[];

        for (const DB_LINK in dbLinksName) {
            if (Object.hasOwnProperty.call(dbLinksName, DB_LINK)) {
                
                try {
                    var linkStatusResult = await connection.execute(
                        `select * from dual@?`, dbLinksName[DB_LINK].DB_LINK, {
                        outFormat: oracledb.OUT_FORMAT_OBJECT
                    });
                    dbLink.push({name:dbLinksName[DB_LINK].DB_LINK,status:'online'});
                } catch (error) {
                    dbLink.push({name:dbLinksName[DB_LINK].DB_LINK,status:'offline'});
                }
            }
        }
        const tablespaceResultorg = organize(tablespaceResult);
        const dbSize_data = organize(dbSizeDataResult);
        const version = organize(versionResult);
        const archiveLogSpace = organize(archiveLogSpaceResult);

        return {dbSize_data, tablespaceResultorg, version, dbLink, archiveLogSpace};


    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
async function getExternalDbConnection(extdb_user, extdb_password, extdb_asm, extdb_ip, extdb_port, extdb_sid, extdb_id) {

    let connection;

    try {
        if (extdb_user == "sys") {

            connection = await oracledb.getConnection({
                user: extdb_user,
                password: extdb_password,  
                privilege: oracledb.SYSDBA,
                connectionString: extdb_ip + ":" + extdb_port + "/" + extdb_sid
            });
            console.log("Successfully connected to Oracle Database as SYSDBA user");
            return true;
        }
        else {

            connection = await oracledb.getConnection({
                user: extdb_user,
                password: extdb_password,  
                connectionString: extdb_ip + ":" + extdb_port + "/" + extdb_sid
            });
            console.log("Successfully connected to Oracle Database");
            return true;

        }

    } catch (err) {
        return false;
    }
}
const organize = (results) => {
    let array = []
    if (results.rows.length <= 1) {
        return results.rows[0];
    }
    else {
        results.rows.forEach(result => {
            array.push(result)
        });
        return array;
    }

}

module.exports = { getExternalDbConnection, getExternalDbInfo };