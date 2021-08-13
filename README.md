# fileproc
ファイルのダウンロードアップロード用

<pre>
CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `path` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `originalname` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `owners` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ymd_add` char(8) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_add` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ymd_upd` char(8) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_upd` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
</pre>

<pre>
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `ymd_start` char(8) NOT NULL,
  `ymd_end` char(8) NOT NULL,
  `ymd_add` char(8) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_add` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ymd_upd` char(8) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id_upd` char(10) NOT NULL,
  PRIMARY KEY (`id`,`ymd_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
</pre>