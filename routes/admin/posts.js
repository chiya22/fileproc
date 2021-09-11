const express = require('express');
const router = express.Router();

const security = require('../../util/security');
const posts = require('../../model/posts');

// TOPページ
router.get('/', security.authorize(), (req, res, next) => {
  (async () => {
    const retObjUser = await posts.find();
    res.render("admin/posts", {
      posts: retObjUser,
    });
  })();
});

module.exports = router;
