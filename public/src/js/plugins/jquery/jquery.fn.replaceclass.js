jQuery.fn.replaceClass = function (oldClass, newClass) {
  return this.each(function (i, el) {
    $(el).attr('class', function (index, attr) {
      return attr.replace(oldClass, newClass);
    });
  });
}