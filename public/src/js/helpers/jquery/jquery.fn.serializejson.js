jQuery.fn.serializeJson = function () {
  let data = {};
  const $form = $(this);
  const arrayData = $form.serializeArray()

  arrayData.forEach(function (obj) {
    data[obj.name] = obj.value;
  });

  return data;
}