const knex = require('../db/knex.js').connect();
const log4js = require("log4js");
const logger = log4js.configure("./config/log4js-config.json").getLogger();

const findPKey = async (id, ymd_end) => {
    try {
        const retObj = await knex.from("users").where({id:id, ymd_end:ymd_end});
        return retObj;
    } catch(err) {
        throw err;
    }
};

const findPKeyActive = async (id, ymd) => {
    try {
        const retObj = await knex.from("users").where('id',id).andWhere('ymd_end','>=',ymd).andWhere('ymd_start', '<=', ymd);
        return retObj;
    } catch(err) {
        throw err;
    }
};

const checkInterval = async (id, ymd_start, ymd_end, before_ymd_start, before_ymd_end) => {
    try {
        // const retObj = await knex.from("users").where('id',id).andWhere('ymd_start','<',ymd_end).andWhere('ymd_end', '>', ymd_start);
        const query = "select * from users where id = '" + id + "' and ymd_start <= '" + ymd_end + "' and ymd_end >= '" + ymd_start + "' and (id, ymd_start, ymd_end) NOT IN (('" + id + "','" + before_ymd_start + "','" + before_ymd_end + "'));"
        const retObj = knex.raw(query);
        return retObj;
    } catch(err) {
        throw err;
    }
};

const find = async () => {
    try {
        const retObj = await knex.from("users").where({ymd_end: '99991231'}).orderBy("id","asc")
        return retObj;
    } catch(err) {
        throw err;
    }
};

const findAll = async () => {
    try {
        const retObj = await knex.from("users").orderBy("id","asc")
        return retObj;
    } catch(err) {
        throw err;
    }
};

const insert = async (inObj) => {
    try {
        const query = "insert into users values ('" + inObj.id + "','" + inObj.name + "','" + inObj.password + "','" + inObj.role + "','" + inObj.ymd_start + "','" + inObj.ymd_end + "','" + inObj.ymd_add + "','" + inObj.id_add + "','" + inObj.ymd_upd + "','" + inObj.id_upd + "')";
        logger.info(query);
        const retObj = await knex.raw(query)
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

const update = async (inObj) => {
    try {
        let query = "update users set name = '" + inObj.name + "',";
        // パスワードが入力されている時のみパスワードを更新する
        if (inObj.password) {
            query += " password = '" + inObj.password + "',";
        }
        query += " role = '" + inObj.role + "', ymd_start = '" + inObj.ymd_start + "', ymd_end = '" + inObj.ymd_end + "', ymd_add = '" + inObj.ymd_add + "', id_add = '" + inObj.id_add + "', ymd_upd = '" + inObj.ymd_upd + "', id_upd = '" + inObj.id_upd + "' where id = '" + inObj.id + "' and ymd_end = '" + inObj.before_ymd_end + "'";
        logger.info(query);
        const retObj = await knex.raw(query)
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

const remove = async (id, ymd_end) => {
    try {
        const query = "delete from users where id = '" + id + "' and ymd_end = '" + ymd_end + "'";
        const retObj = await knex.raw(query)
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

module.exports = {
    find: find,
    findPKeyActive,findPKeyActive,
    findAll: findAll,
    findPKey: findPKey,
    checkInterval: checkInterval,
    insert: insert,
    update: update,
    remove: remove,
};