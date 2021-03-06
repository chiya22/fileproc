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

const findByReader = async (id) => {
    try {
        const retObj = await knex.from("files").where("readers", "like", `%${id}%`).orWhere("editors", "like", `%${id}%`).orderBy("id","asc");
        return retObj;
    } catch(err) {
        throw err;
    }
};

const findByEditor = async (id) => {
    try {
        const retObj = await knex.from("files").where("editors", "like", `%${id}%`).orderBy("id","asc");
        return retObj;
    } catch(err) {
        throw err;
    }
};

const insert = async (inObj) => {
    try {
        const query = "insert into files (title, content, filename, filepath, originalfilename, readers, editors, ymd_add, id_add, ymd_upd, id_upd)  values ('" + inObj.title + "','"  + inObj.content + "','"  + inObj.filename + "','" + inObj.filepath.replace('\\','\\\\') + "','" + inObj.originalfilename + "','" + inObj.readers + "','" + inObj.editors + "','" + inObj.ymd_add + "','" + inObj.id_add + "','" + inObj.ymd_upd + "','" + inObj.id_upd + "')";
        logger.info(query);
        const retObj = await knex.raw(query);
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

const update = async (inObj) => {
    try {
        const query = "update files set title = '" + inObj.title + "', content = '"+ inObj.content + "', filename = '" + inObj.filename + "', filepath = '"+inObj.filepath.replace('\\','\\\\') + "', originalfilename = '" + inObj.originalfilename + "', readers = '" + inObj.readers + "', editors = '" + inObj.editors + "', ymd_add = '" + inObj.ymd_add + "', id_add = '" + inObj.id_add + "', ymd_upd = '" + inObj.ymd_upd + "', id_upd = '" + inObj.id_upd + "' where id = '" + inObj.id + "';" 
        logger.info(query);
        const retObj = await knex.raw(query);
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
}

const remove = async (id) => {
    try {
        const retObj = await knex.from("files").where("id",id).del();
        // const query = "delete from files where id = '" + id + "'";
        // const retObj = await knex.raw(query);
        return retObj;
        // return retObj[0];
    } catch(err) {
        throw err;
    }
};

module.exports = {
    find: find,
    findPKey: findPKey,
    findByReader: findByReader,
    findByEditor: findByEditor,
    insert: insert,
    update: update,
    remove: remove,
};