const express = require('express');
const router = express.Router();
const security = require('../util/security');

const files = require("../model/files");
const tool = require("../util/tool");
const fs = require('fs');

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "." + Date.now())
  },
})
const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', security.authorize(), function (req, res, next) {

  (async () => {
    try {
      const retObjFiles = await files.find();
      res.render('files', {
        title: 'Express',
        msg: '',
        files: retObjFiles,
      });
    } catch(e) {
      throw e;
    }
  })();
});

//アップロード
router.post("/upload", security.authorize(), upload.single("file"), (req,res, next) => {

  let inObjFiles = {};
  inObjFiles.name = req.file.filename;
  inObjFiles.originalname = req.file.originalname;
  inObjFiles.path = req.file.path;
  inObjFiles.ymd_add = tool.getYYYYMMDD(new Date());
  inObjFiles.id_add = req.user.id;
  inObjFiles.ymd_upd = tool.getYYYYMMDD(new Date());
  inObjFiles.id_upd = req.user.id;

  (async () => {
    try {
      const retObjFilesInsert = await files.insert(inObjFiles);
      const retObjFiles = await files.find();
      req.flash("success", "アップロードしました：" + inObjFiles.originalname);
      res.redirect(req.baseUrl);
    } catch (err) {
      throw err;
    }
  })();
});

//ダウンロード
router.post("/download", security.authorize(), (req,res,next) => {
  (async () => {
    const id = req.body.id;
    const retObjFiles = await files.findPKey(id);
    const content = await fs.readFileSync(retObjFiles[0].path);
    const fileName = encodeURIComponent(retObjFiles[0].originalname);
    res.set({'Content-Disposition': `attachment; filename=${fileName}`})
    res.status(200).send(content);
  })();
})


module.exports = router;
