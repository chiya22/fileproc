const express = require('express');
const router = express.Router();
const security = require('../util/security');
const hash = require('../util/hash').digest;

const users = require("../model/users");
const tool = require('../util/tool');

const posts = require("../model/posts");
const files = require("../model/files");

/* GET home page. */
router.get('/', security.authorize(), function (req, res, next) {
  if (req.user.role === "admin") {
    res.render("admin", {
      title: "管理者メニュー",
      msg: '',
    });
  } else {
    (async () => {
      const retObjPosts = await posts.findByReader(req.user.id);
      const retObjFiles = await files.findByReader(req.user.id);
      res.render("index", {
        title: "メニュー",
        posts: retObjPosts,
        files: retObjFiles,
        msg: '',
      });
    })();
  }
});

//認証画面の初期表示
router.get('/login', function (req, res) {
  res.render("./login.ejs", { message: req.flash("message") });
});

//認証画面の入力
router.post('/login', security.authenticate());

//ログアウト
router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

//ユーザIDを指定してパスワード変更画面へ
router.get('/changepwd/:id/:ymd_end', security.authorize(), (req, res, next) => {
  (async () => {
    const retObjUser = await users.findPKey(req.params.id,req.params.ymd_end);
    res.render('userchangepwd', {
      selectuser: retObjUser[0],
      mode: "changepwd",
      message: null,
    });
  })();
});

//パスワード更新
router.post('/changepwd', security.authorize(), (req, res, next) => {
  let inObjUser = {};
  inObjUser.id = req.body.id;
  inObjUser.name = req.body.name;
  inObjUser.password = req.body.password?hash(req.body.password):null;
  inObjUser.role = req.body.role;
  inObjUser.ymd_start = req.body.ymd_start;
  inObjUser.ymd_end = req.body.ymd_end;
  inObjUser.ymd_add = req.body.ymd_add;
  inObjUser.id_add = req.body.id_add;
  inObjUser.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjUser.id_upd = req.user.id;
  inObjUser.before_ymd_start = req.body.ymd_start;
  inObjUser.before_ymd_end = req.body.ymd_end;

  (async () => {
    try {
      const retObjUser = await users.update(inObjUser);
      req.flash("msg", "ユーザー【" + req.body.id + "】のパスワードを変更しました");
      res.redirect("/");
    } catch (err) {
      throw err;
    }
  })();
});

module.exports = router;
