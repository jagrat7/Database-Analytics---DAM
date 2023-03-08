var express = require('express');
var router = express.Router();
const User_database = require('../db/models/userdatabase')
const Db_size = require('../db/models/db_size')
const ConnectorServerFunctions = require('../ConnectorServer')
const controllers = require('../controllers')
const permissions = require('../perms')


module.exports = (app, passport, checkAuthenticated, checkNotAuthenticated, User, User_database, Db_size, dbList, session) => {

    router.get('/', permissions.checkApproved,checkAuthenticated, async function (req, res) {
        try {

            let dbSizeArray = [];
            let dbListP = await User_database.query();
            const user = await req.user;
            for (let i = 0; i < dbListP.length; i++) {
                dbSizeArray.push(await Db_size.query().where('db_id', dbListP[i].id).orderBy('created_at', 'desc').first())
            }
            res.render("dashboard/dashboard", {
                user:user,
                dbSizeInfo: dbSizeArray,
                dbList: dbListP
            });

        } catch (error) {
            console.error(error)
        }

    });

    router.get('/profile', permissions.checkApproved, checkAuthenticated, async function (req, res) {
        try {

            const user = await req.user;
            res.render("dashboard/profile", {
                user: user
            });

        } catch (error) {
            console.error(error)
        }

    });
    router.route('/adminPanel')
        .get(checkAuthenticated, permissions.checkApproved, permissions.checkAdmin, async function (req, res) {
            try {

                const users = await User.query();
                res.render("dashboard/adminPanel", {
                    users: users
                });

            } catch (error) {
                console.error(error)
            }

        })
        .patch(checkAuthenticated, permissions.checkApproved, permissions.checkAdmin, async function (req, res) {
            try {

                const querys = req.query;
                const { id } = querys;
                const { type } = querys;
                const { value } = querys;

                if (type === "role") {
                    await User.query().findById(id).patch({ role: value })
                        .then(() => res.json({ redirect: '/dashboard/adminPanel' }))
                }
                else {
                    await User.query().findById(id).patch({ approved: value })
                        .then(() => res.json({ redirect: '/dashboard/adminPanel' }))

                }

            } catch (error) {
                console.error(error)
            }

        })
        .delete(checkAuthenticated, permissions.checkApproved, permissions.checkAdmin, async function (req, res) {
            try {
                const querys = req.query;
                const { id } = querys;

                await User.query().deleteById(id)
                    .then(() => res.json({ redirect: '/dashboard/adminPanel' }))

            } catch (error) {
                console.error(error)
            }

        });

    router.route('/addDB')
        .get(checkAuthenticated, permissions.checkApproved,permissions.checkAdmin, function (req, res) {
            res.render("dashboard/addDB", {

            });
        })
        .post(checkAuthenticated, permissions.checkApproved,permissions.checkAdmin, controllers.addDbController);



    router.route('/:id/edit')
        .get(checkAuthenticated,  permissions.checkApproved,permissions.checkAdmin,async function (req, res) {
            const id = req.params.id;
            let dbListP = await User_database.query().findById(id);
            res.render("dashboard/editDB", {
                dbList: dbListP
            });
        })
        .post(checkAuthenticated, permissions.checkApproved,permissions.checkAdmin, async function (req, res) {
            const id = req.params.id;
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

                let connectAndGetData = await ConnectorServerFunctions.getDbConnection(sid, host, port, username, password, syscheck, id)

                if (connectAndGetData) {
                    await User_database.query().findById(id).patch({
                        db_nickname: nickname,
                        db_sid: sid,
                        db_host: host,
                        db_port: port,
                        db_username: username,
                        db_password: password,
                        db_asm: syscheck,
                        db_status: "online",
                    }).then(async () => {
                        res.json({ connection: connectAndGetData })
                    })
                } else {
                    res.json({ connection: connectAndGetData })
                }

            } catch (e) {
                console.error(e);
            }
        });


    router.delete('/:id/delete',  permissions.checkApproved,permissions.checkAdmin,checkAuthenticated, async function (req, res) {
        const id = req.params.id;
        const dbToBeDeleted = await User_database.query().where('id', id);

        await dbToBeDeleted[0].$relatedQuery('db_size').delete()
        await dbToBeDeleted[0].$relatedQuery('db_links').delete()
        await dbToBeDeleted[0].$relatedQuery('db_size_history').delete()
        await dbToBeDeleted[0].$relatedQuery('db_tablespace').delete()
        await dbToBeDeleted[0].$relatedQuery('db_tablespace_history').delete()
        await dbToBeDeleted[0].$relatedQuery('db_archive_log_space').delete()
        await dbToBeDeleted[0].$relatedQuery('db_archive_log_space_history').delete()
            .then(await User_database.query().delete().findById(id))
            .then(result => {
                res.json({ redirect: '/dashboard' });
            })
            .catch(err => {
                console.log(err);
            });

    });



    app.use('/dashboard', router);

}
