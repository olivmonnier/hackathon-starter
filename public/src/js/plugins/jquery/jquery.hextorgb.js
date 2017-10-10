jQuery.hexToRgb = function (string) {
  if (!string || typeof string !== 'string') return false;

  if (
    string.substring(0, 1) == '#'
    && (string.length == 4 || string.length == 7)
    && /^[0-9a-fA-F]+$/.test(string.substring(1, string.length))
  ) {
    string = string.substring(1, string.length);

    if (string.length == 3) string = string[0] + string[0] + string[1] + string[1] + string[2] + string[2];

    return 'rgb(' + parseInt(string[0] + string[1], 16).toString() + ',' + parseInt(string[2] + string[3], 16).toString() + ',' + parseInt(string[4] + string[5], 16).toString() + ')';
  }
  else return false;
}