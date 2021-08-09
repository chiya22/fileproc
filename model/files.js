const knex = require('../db/knex.js').connect();
const log4js = require("log4js");
const logger = log4js.configure("./config/log4js-config.json").getLogger();

const findPKey = async (id) => {
    try {
        const retObj = await knex.from("files").where({id: id})
        return retObj;
    } catch(err) {
        throw err;
    }
};

const find = async () => {
    try {
        const retObj = await knex.from("files").orderBy("id","asc")
        return retObj;
    } catch(err) {
        throw err;
    }
};

const insert = async (inObj) => {
    try {
        const query = "insert into files (name, path, originalname, ymd_add, id_add, ymd_upd, id_upd)  values ('" + inObj.name + "','" + inObj.path.replace('\\','\\\\') + "','" + inObj.originalname + "','" + inObj.ymd_add + "','" + inObj.id_add + "','" + inObj.ymd_upd + "','" + inObj.id_upd + "')";
        logger.info(query);
        const retObj = await knex.raw(query)
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

const remove = async (id) => {
    try {
        const query = "delete from files where id = '" + id + "'";
        const retObj = await knex.raw(query)
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

module.exports = {
    find: find,
    findPKey: findPKey,
    insert: insert,
    remove: remove,
};