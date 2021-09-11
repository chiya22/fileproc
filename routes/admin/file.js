const express = require("express");
const router = express.Router();
const security = require("../../util/security");

const files = require("../../model/files");
const tool = require("../../util/tool");
const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "." + Date.now())
  },
})
const upload = multer({ storage: storage })

/* GET home page. */
router.get("/", security.authorize(), function (req, res, next) {

  res.render("admin/file", {
    mode: "insert",
    file: null,
  });
});

/* GET home page. */
router.get("/:id", security.authorize(), function (req, res, next) {

  (async () => {
    try {
      const retObjFiles = await files.findPKey(req.params.id);
      res.render("admin/file", {
        mode: "update",
        file: retObjFiles[0],
      });
    } catch(e) {
      throw e;
    }
  })();
});

//ファイル登録
router.post("/insert", security.authorize(), upload.single("file"), (req,res, next) => {

  let inObjFiles = {};
  inObjFiles.title = req.body.title;
  inObjFiles.content = req.body.content;
  inObjFiles.filename = req.file.filename;
  inObjFiles.originalfilename = req.file.originalname;
  inObjFiles.filepath = req.file.path;
  inObjFiles.readers = `${req.user.id},${req.body.readers}`;
  inObjFiles.editors = `${req.user.id},${req.body.editors}`;
  inObjFiles.ymd_add = tool.getYYYYMMDD(new Date());
  inObjFiles.id_add = req.user.id;
  inObjFiles.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjFiles.id_upd = req.user.id;

  (async () => {
    try {
      const retObjFilesInsert = await files.insert(inObjFiles);
      // const retObjFiles = await files.find();
      req.flash("msg", "登録しました：" + inObjFiles.title + " | " + inObjFiles.originalfilename);
      res.redirect("/admin/files");
    } catch (err) {
      throw err;
    }
  })();
});

//ファイル更新
router.post("/update", security.authorize(), (req,res, next) => {

  let inObjFiles = {};
  inObjFiles.id = req.body.id;
  inObjFiles.title = req.body.title;
  inObjFiles.content = req.body.content;
  inObjFiles.filename = req.body.filename;
  inObjFiles.originalfilename = req.body.originalfilename;
  inObjFiles.filepath = req.body.filepath;
  inObjFiles.readers = `${req.user.id},${req.body.readers}`;
  inObjFiles.editors = `${req.user.id},${req.body.editors}`;
  inObjFiles.ymd_add = req.body.ymd_add;
  inObjFiles.id_add = req.body.id_add;
  inObjFiles.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjFiles.id_upd = req.user.id;

  (async () => {
    try {
      const retObjFilesInsert = await files.update(inObjFiles);
      req.flash("msg", "更新しました：" + inObjFiles.title + " | " + inObjFiles.originalfilename);
      res.redirect("/admin/files");
    } catch (err) {
      throw err;
    }
  })();
});

//ファイル削除
router.post("/delete", security.authorize(), (req,res,next) => {

  const id = req.body.id;
  const originalfilename = req.body.originalfilename;
  const path = req.body.filepath;
  (async () => {
    try {
      const retObjFilesDelete = await files.remove(id);
      // 実ファイルを削除
      fs.unlinkSync(path);
      req.flash("msg", "削除しました：" + originalfilename);
      res.redirect("/admin/files");
    } catch (err) {
      throw err;
    }
  })()
});

//ダウンロード
router.post("/download", security.authorize(), (req,res,next) => {
  (async () => {
    const id = req.body.id;
    const retObjFiles = await files.findPKey(id);
    const content = await fs.readFileSync(retObjFiles[0].filepath);
    const fileName = encodeURIComponent(retObjFiles[0].originalfilename);
    res.set({'Content-Disposition': `attachment; filename=${fileName}`})
    res.status(200).send(content);
  })();
})

module.exports = router;
