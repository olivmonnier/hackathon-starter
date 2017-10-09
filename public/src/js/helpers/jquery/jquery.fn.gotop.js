jQuery.fn.goTop = function () {
  $(this).on('click', function (e) {
    e.preventDefault();

    $(document.body).animate({ scrollTop: 0 }, 800);
  });
  return this;
}