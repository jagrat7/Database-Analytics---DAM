var express = require('express');
var router = express.Router();
const Db_size_history = require('../db/models/db_size_history')
const Db_tablespace_history = require('../db/models/db_tablespace_history')
const controllers = require('../controllers')
const Db_links = require('../db/models/db_links')
const {checkApproved} = require('../perms')


module.exports = (app, passport, checkAuthenticated, checkNotAuthenticated, User, User_database, Db_size, Db_tablespace,checkAdmin) => {
    // router.route('/:id')
    router.get('/:id/view',checkApproved, checkAuthenticated, async function (req, res) {
        const id = req.params.id;
        res.redirect('./view/db-size')

    });
    router.get('/:id/view/db-size',checkApproved, checkAuthenticated, controllers.dbSize  );


    router.get('/:id/view/db-tablespace',checkApproved, checkAuthenticated,controllers.tableSpace);

    router.get('/:id/view/db-archiveLog',checkApproved,checkAuthenticated,controllers.archiveLog);

    router.get('/:id/view/db-replication',checkApproved,checkAuthenticated, async function (req, res) {
        const id = req.params.id;
        const dbName = await User_database.query().select('db_nickname').where('id', id);

        res.render("dbsView/db-replication", {
            dbName: dbName[0].db_nickname,
            tableData: [undefined],
            dbTableName: 'replication'
        });

    });
    router.get('/:id/view/db-sysSpaceUtilization',checkApproved,checkAuthenticated, async function (req, res) {
        const id = req.params.id;
        const dbName = await User_database.query().select('db_nickname').where('id', id);

        res.render("dbsView/db-replication", {
            dbName: dbName[0].db_nickname,
            tableData: [undefined],
            dbTableName: 'sysSpaceUtilization'
        });

    });
    router.get('/:id/view/db-links',checkApproved,checkAuthenticated, async function (req, res) {
        const id = req.params.id;
        const dbName = await User_database.query().select('db_nickname').where('id', id);
        const dbLinkLive = await Db_links.query().where('db_id', id).orderBy('created_at', 'desc').limit(4);

        res.render("dbsView/db-links", {
            dbName: dbName[0].db_nickname,
            tableData: [undefined],
            dbTableName: 'dbLinks',
            links: dbLinkLive
        });

    });


    app.use('/db', router);

}