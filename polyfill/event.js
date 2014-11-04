'use strict';

function triggerKeydownEvent(element, keyCode) {
  var event = document.createEvent('Events');

  if (event.initEvent) {
    event.initEvent('keydown', true, true);
  }

  event.keyCode = keyCode;
  event.which = keyCode;

  element.dispatchEvent(event);
}

function triggerKeyupEvent(element, keyCode) {
  var event = document.createEvent('Events');

  if (event.initEvent) {
    event.initEvent('keyup', true, true);
  }

  event.keyCode = keyCode;
  event.which = keyCode;

  element.dispatchEvent(event);
}

module.exports = {
  triggerKeydownEvent: triggerKeydownEvent,
  triggerKeyupEvent: triggerKeyupEvent
};
