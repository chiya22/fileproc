const express = require('express');
const router = express.Router();

const security = require('../util/security');
const hash = require('../util/hash').digest;

const users = require('../model/users');
const tool = require('../util/tool');

// TOPページ
router.get('/', security.authorize(), (req, res, next) => {
  (async () => {
    const retObjUser = await users.findAll();
    res.render("./users", {
      users: retObjUser,
    });
  })();
});

// メニューから登録画面（usersForm）へ
router.get('/insert', security.authorize(), (req, res, next) => {
  res.render('userform', {
    selectuser: null,
    mode: 'insert',
    message: null,
  });
});

//ユーザIDを指定して更新画面（usersForm）へ
router.get('/update/:id/:ymd_end', security.authorize(), (req, res, next) => {
  (async () => {
    const retObjUser = await users.findPKey(req.params.id,req.params.ymd_end);
    res.render('userform', {
      selectuser: retObjUser[0],
      mode: 'update',
      message: null,
    });
  })();
});

//ユーザ情報の登録
router.post('/insert', security.authorize(), (req, res, next) => {

  let inObjUser = {};
  inObjUser.id = req.body.id;
  inObjUser.name = req.body.name;
  inObjUser.password = hash(req.body.password);
  inObjUser.role = req.body.role;
  inObjUser.ymd_start = req.body.ymd_start;
  inObjUser.ymd_end = req.body.ymd_end;
  inObjUser.ymd_add = tool.getYYYYMMDD(new Date());
  inObjUser.id_add = req.user.id;
  inObjUser.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjUser.id_upd = req.user.id;

  if ((!req.body.id) || (!req.body.name) || (!req.body.password) || (!req.body.ymd_start) || (!req.body.ymd_end)) {
    req.flash("msg", "ID、名前、パスワード、適用開始日、適用終了日はすべて入力してください");
    res.redirect('/users/insert');
  }

  (async () => {
    try {
      const retObjUsers = await users.insert(inObjUser);
      req.flash("msg", "ユーザー【" + inObjUser.id + "】、適用終了日【" + inObjUser.ymd_end + "】を登録しました");
      res.redirect(req.baseUrl);
    } catch (err) {
      // MySQL
      if (err.errno === 1062) {
      // Postgres
      // if (err.code === '23505') {
        req.flash("msg", "ユーザー【" + inObjUser.id + "】、適用終了日【" + inObjUser.ymd_end + "】はすでに存在しています");
        res.redirect('/users/insert');
      } else {
        throw err;
      }
    }
  })();

});

//ユーザ情報の更新
router.post('/update/update', security.authorize(), (req, res, next) => {
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
  inObjUser.before_ymd_end = req.body.before_ymd_end;

  const redirectUrl = `/users/update/${inObjUser.id}/${inObjUser.before_ymd_end}`;

  if ((!req.body.id) || (!req.body.name)) {
    req.flash("msg", "名前を入力してください");
    res.redirect(redirectUrl);
  }
  (async () => {
    try {
      const retObjUserCheck = await users.checkInterval(inObjUser.id, inObjUser.ymd_start, inObjUser.ymd_end, inObjUser.before_ymd_end);
      if (retObjUserCheck[0].length !== 0){
        req.flash("msg", "ユーザー【" + inObjUser.id + "】、適用開始日【" + inObjUser.ymd_start + "】適用終了日【" + inObjUser.ymd_end + "】は適用期間が重複しています");
        res.redirect(redirectUrl);
      } else {
        const retObjUser = await users.update(inObjUser);
        req.flash("msg", "ユーザー【" + inObjUser.id + "】、適用終了日【" + inObjUser.before_ymd_end + "】を更新しました");
        res.redirect(req.baseUrl);
      }
    } catch (err) {
      if (err.errno === 1062) {
        req.flash("msg", "ユーザー【" + inObjUser.id + "】、適用終了日【" + inObjUser.ymd_end + "】はすでに存在しています");
        res.redirect(redirectUrl);
      }
    }
  })();
});

//ユーザ情報の削除
router.post('/update/delete', security.authorize(), function (req, res, next) {
  (async () => {
    try {
      const retObjUser = await users.remove(req.body.id, req.body.ymd_end);
      req.flash("msg", "ユーザー【" + req.body.id + "】、適用終了日【" + req.body.ymd_end + "】を削除しました");
      res.redirect(req.baseUrl);
    } catch (err) {
      // MySQL
      if (err && err.errno === 1451) {
      // Postgres
      // if (err && err.code === '23503') {
        req.flash("msg", "削除対象のユーザー【" + id + "】は使用されています");
        res.redirect('/users/update/' + req.body.id + '/' + req.body.ymd_end);
      } else {
        throw err;
      }
    }
  })();
});

module.exports = router;
