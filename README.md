# fileproc
ファイルのダウンロードアップロード用

<pre>
CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) COLLATE utf8mb4_bin DEFAULT NULL,
  `path` varchar(1000) COLLATE utf8mb4_bin DEFAULT NULL,
  `originalname` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ymd_add` char(8) COLLATE utf8mb4_bin DEFAULT NULL,
  `id_add` varchar(10) COLLATE utf8mb4_bin DEFAULT NULL,
  `ymd_upd` char(8) COLLATE utf8mb4_bin DEFAULT NULL,
  `id_upd` varchar(10) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
</pre>

<pre>
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `ymd_start` char(8) NOT NULL,
  `ymd_end` char(8) NOT NULL,
  `ymd_upd` char(8) NOT NULL,
  `id_upd` char(10) NOT NULL,
  PRIMARY KEY (`id`,`ymd_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
</pre>
