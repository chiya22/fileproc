const express = require('express');
const router = express.Router();

const security = require('../util/security');
const users = require('../model/users');

// TOPページ
router.get('/', security.authorize(), (req, res, next) => {
  (async () => {
    const retObjUser = await users.findAll();
    res.render("./users", {
      users: retObjUser,
    });
  })();
});

module.exports = router;
