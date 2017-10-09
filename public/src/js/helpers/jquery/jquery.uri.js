jQuery.uri = function (index) {
  const uri = window.location.toString().split('/').slice(3);

  return uri[index - 1];
}