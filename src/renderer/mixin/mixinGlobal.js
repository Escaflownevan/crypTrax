// mixin.js
function twoDecimals(number) {
  if (number != 0) {
    var log10 = number ? Math.floor(Math.log10(number)) : 0,
      div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;
    let newNumber = Math.round(number * div) / div
    let string = String(newNumber)
    if (string.indexOf("e-") > 0) {
      let index = string.slice(string.indexOf("e-") + 2, newNumber.length)
      return newNumber.toFixed(index)
    }
    return Math.round(number * div) / div
  } else {
    return 0
  }
}

function bigMoneyName(number) {
  switch (true) {
    case number >= 1.0e+12:
      return String((number / 1.0e+12).toFixed(2)) + " Tril";
    case number >= 1.0e+9:
      return String((number / 1.0e+9).toFixed(2)) + " Bil";
    case number >= 1.0e+6:
      return String((number / 1.0e+6).toFixed(2)) + " Mil";
    case number >= 1.0e+5:
      return String((number / 1.0e+3).toFixed(2)) + " T";
    case number == 0:
      return "N/A"

  }
}

function arrayMove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  return arr
}

function checkGecko(element, symbol) {
  return element.some(el => el.symbol == symbol)
}

function crypt(text) {
  if (text == null) return ""
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars("8742gbnio5b561eau4bj333dd4288f55c92").reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
}

function decrypt(encoded) {
  if (encoded == "") return ""
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars("8742gbnio5b561eau4bj333dd4288f55c92").reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");

}

function hider(string) {
  return decrypt(string).replace(/(.{7})..+/, "$1...")
}

module.exports = {
  twoDecimals,
  bigMoneyName,
  arrayMove,
  checkGecko,
  crypt,
  decrypt,
  hider
};
