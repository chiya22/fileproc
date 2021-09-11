const express = require("express");
const router = express.Router();

const security = require("../../util/security");

const posts = require("../../model/posts");
const tool = require("../../util/tool");

// 投稿一覧から登録画面（postsForm）へ
router.get("/", security.authorize(), (req, res, next) => {
  res.render("admin/post", {
    selectpost: null,
    mode: "insert",
    message: null,
  });
});

//投稿IDを指定して更新画面（postsForm）へ
router.get("/:id", security.authorize(), (req, res, next) => {
  (async () => {
    const retObjPost = await posts.findPKey(req.params.id);
    res.render("admin/post", {
      selectpost: retObjPost[0],
      mode: "update",
      message: null,
    });
  })();
});

//投稿情報の登録
router.post("/insert", security.authorize(), (req, res, next) => {

  let inObjPost = {};
  inObjPost.title = req.body.title;
  inObjPost.content = req.body.content;
  inObjPost.readers = `${req.user.id},${req.body.readers}`;
  inObjPost.editors = `${req.user.id},${req.body.editors}`;
  inObjPost.ymd_add = tool.getYYYYMMDD(new Date());
  inObjPost.id_add = req.user.id;
  inObjPost.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjPost.id_upd = req.user.id;

  (async () => {
    try {
      const retObjPost = await posts.insert(inObjPost);
      req.flash("msg", "タイトル【" + inObjPost.title + "】を登録しました");
      res.redirect("/admin/posts");
    } catch (err) {
      throw err;
    }
  })();

});

//投稿情報の更新
router.post("/update", security.authorize(), (req, res, next) => {
  let inObjPost = {};
  inObjPost.id = req.body.id;
  inObjPost.title = req.body.title;
  inObjPost.content = req.body.content;
  inObjPost.readers = req.body.readers;
  inObjPost.editors = req.body.editors;
  inObjPost.ymd_add = req.body.ymd_add;
  inObjPost.id_add = req.body.id_add;
  inObjPost.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjPost.id_upd = req.user.id;

  (async () => {
    try {
        const retObjPost = await posts.update(inObjPost);
        req.flash("msg", "タイトル【" + inObjPost.title + "】を更新しました");
        res.redirect(`/admin/post/${inObjPost.id}`);
    } catch (err) {
      throw err;
    }
  })();
});

//投稿情報の削除
router.post("/delete", security.authorize(), function (req, res, next) {
  (async () => {
    try {
      const retObjPost = await posts.remove(req.body.id);
      req.flash("msg", "ユーザー【" + req.body.title + "】を削除しました");
      res.redirect(req.baseUrl);
    } catch (err) {
      // MySQL
      if (err && err.errno === 1451) {
      // Postgres
      // if (err && err.code === '23503') {
        req.flash("msg", "削除対象の投稿【" + req.body.title + "】は使用されています");
        res.redirect("admin/post/" + req.body.id);
      } else {
        throw err;
      }
    }
  })();
});

module.exports = router;
