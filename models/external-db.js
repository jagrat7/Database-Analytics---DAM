const ExternalDbFuncs = require('./helperJS/get-external-db-info')

// class ExternalDb {
module.exports = class ExternalDb {
    constructor(extdb_user, extdb_password, extdb_asm, extdb_ip, extdb_port, extdb_sid,extdb_id) {
        this.extdb_user = extdb_user,
        this.extdb_password = extdb_password,
        this.extdb_asm = extdb_asm,
        this.extdb_ip = extdb_ip,
        this.extdb_port = extdb_port,
        this.extdb_sid = extdb_sid,
        this.extdb_id = extdb_id
    }
    /**
     */
    async getAllDbData(){
        const data=await ExternalDbFuncs.getExternalDbInfo(this.extdb_user, this.extdb_password, this.extdb_asm, this.extdb_ip, 
            this.extdb_port, this.extdb_sid);
        return data;
    }
    async getConnectionStatus(){
        const connectionStatus = await ExternalDbFuncs.getExternalDbConnection(this.extdb_user, this.extdb_password, this.extdb_asm, this.extdb_ip, 
            this.extdb_port, this.extdb_sid,this.extdb_id);
        return connectionStatus;
    }
};

// const newDb= new ExternalDb("sys", "Root1234",1,"10.110.38.1","","itsuat",1);

// (async function () {
//     let x =  (await newDb.getAllDbData())
// // console.log(x.dbLinksName)
// // let y = await newDb.getDbSize()
// // console.log(x)
// // let x = await newDb.getDbData()
// // console.log(x.dbSize_data)
// // let y= await newDb.getDbData()
// // console.log(y.tablespace_data)
// })();