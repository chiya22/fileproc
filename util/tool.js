//
// 日付よりyyyymmdd形式の文字列を返却する
//
const getYYYYMMDD = (date) => {
  let tmp;
  tmp = "" + date.getFullYear();
  tmp += "" + ("0" + (date.getMonth() + 1)).slice(-2);
  tmp += "" + ("0" + date.getDate()).slice(-2);
  return tmp;
};
module.exports = {
  getYYYYMMDD,
};
