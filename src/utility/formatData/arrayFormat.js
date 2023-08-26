exports.arrayToString = (arr) => {
  let str = "";
  arr.forEach((item) => {
    str += item.filename;
    str += " ";
  });
  return str;
};
