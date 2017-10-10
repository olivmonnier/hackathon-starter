jQuery.rgbToHex = function (string) {
  if (!string || typeof string !== 'string') return false;

  if (string.substring(0, 3) == 'rgb') {
    string = string.substring(4, string.length - 1).split(',');

    if (string.length == 3 && string[0] != '' && string[1] != '' && string[2] != '') {
      if (string[0] >= 0 && string[0] <= 255 && string[1] >= 0 && string[1] <= 255 && string[2] >= 0 && string[2] <= 255) {
        return ('#' + parseInt(string[0]).toString(16) + parseInt(string[1]).toString(16) + parseInt(string[2]).toString(16)).toUpperCase();
      } else return false;
    } else return false;
  } else return false;
}