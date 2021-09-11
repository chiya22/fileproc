const express = require("express");
const router = express.Router();
const security = require("../../util/security");

const files = require("../../model/files");
const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "." + Date.now());
  },
});
const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", security.authorize(), function (req, res, next) {

  (async () => {
    try {
      const retObjFilesFind = await files.findByReader(req.user.id);

      let retObjFiles = [];
      retObjFilesFind.forEach((file) => {
        if (fs.existsSync(file.filepath)) {
          retObjFiles.push(file);
        }
      });
      res.render("admin/files", {
        title: "Express",
        msg: "",
        files: retObjFiles,
      });
    } catch (e) {
      throw e;
    }
  })();
  
});

module.exports = router;
