let topics = {};

jQuery.Topic = function (id) {
  let callbacks, method,
      topic = id && topics[id];

  if (!topic) {
    callbacks = jQuery.Callbacks();
    topic = {
      publish: callbacks.fire,
      subscribe: callbacks.add,
      unsubscribe: callbacks.remove
    };
    if (id) {
      topics[id] = topic;
    }
  }
  return topic;
}