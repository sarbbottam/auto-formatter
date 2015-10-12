'use strict';

describe('AutoFormatter', function() {
  var event = require('../polyfill/event');
  var AutoFormatter = require('../src/auto-formatter');
  var autoFormatter;
  var inputNode;

  before(function() {
    inputNode = document.createElement('input');
    document.body.appendChild(inputNode);

    autoFormatter = new AutoFormatter(inputNode);

  });

  it('should return an function', function() {
    assert.isFunction(AutoFormatter);
  });

  describe('invoked with new operator', function() {

    it('should return an object with enableFormatting & disableFormatting method', function() {
      assert.isObject(autoFormatter);
      assert.isFunction(autoFormatter.enableFormatting);
      assert.isFunction(autoFormatter.disableFormatting);
    });

  });

  describe('new AutoFormatter()', function() {

    describe('.enableFormatting', function() {

      before(function() {
        autoFormatter = new AutoFormatter(inputNode);
        inputNode.value = '1234567890';
        inputNode.setAttribute('data-format', '(XXX) XXX-XXXX');
        autoFormatter.enableFormatting();
      });

      it('should format 1234567890 in (XXX) XXX-XXXX format', function() {
        assert.equal(inputNode.value, '(123) 456-7890');
      });

      it('should format if the keyCode is between 48 & 90 and 96 && 105', function() {
        inputNode.value = '1234567890';
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '(123) 456-7890');
        inputNode.value = '1234567890';
        event.triggerKeyupEvent(inputNode, 96);
        assert.equal(inputNode.value, '(123) 456-7890');
      });

      it('should not format if the keyCode is not between 48 & 90 and 96 && 105', function() {
        inputNode.value = '1234567890';
        event.triggerKeyupEvent(inputNode, 8);
        assert.equal(inputNode.value, '1234567890');
      });

      it('should format if the last chracter typed is a separator and alos a modifier key', function() {
        inputNode.value = '(123) 456-7890';
        inputNode.selectionStart = 10;
        inputNode.selectionEnd = 10;
        event.triggerKeyupEvent(inputNode, 8);
        assert.equal(inputNode.value, '(123) 456-7890');
      });

      it('should not format if the last chracter typed is a separator and not a modifier key', function() {
        inputNode.value = '(123) 456-7890';
        inputNode.selectionStart = 10;
        inputNode.selectionEnd = 10;
        event.triggerKeyupEvent(inputNode, 47);
        assert.equal(inputNode.value, '(123) 456-7890');
      });

      it('should format 1234567890 in XXXXX-XXXXX format', function() {
        inputNode.value = '1234567890';
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        autoFormatter.enableFormatting();
        assert.equal(inputNode.value, '12345-67890');
      });

      it('should not add format listenter if data-format attribute is not present', function() {
        inputNode.value = '1234567890';
        inputNode.removeAttribute('data-format');
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '1234567890');
      });

      it('should not format if the value is empty even if data-format attribute is present', function() {
        inputNode.value = '';
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        autoFormatter.enableFormatting();
        assert.equal(inputNode.value, '');
      });

      it('should not format if the value length is shorter than separatorIndex', function() {
        inputNode.value = '1234';
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        autoFormatter.enableFormatting();
        assert.equal(inputNode.value, '1234');
      });

      it('should increment the caretIndex if the current caretIndex is equal to the index of next sperator', function() {
        inputNode.value = '12345';
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        autoFormatter.enableFormatting();
        assert.equal(inputNode.value, '12345-');
      });

      it('should set the caretIndex properly', function() {
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        autoFormatter.enableFormatting();
        inputNode.value = '1234567890';
        inputNode.selectionStart = 6;
        inputNode.selectionEnd = 6;
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '12345-67890');
        assert.equal(inputNode.selectionStart, 7);
        inputNode.setAttribute('data-format', '(XXX) XXX-XXXX');
        autoFormatter.enableFormatting();
        inputNode.value = '(123';
        inputNode.selectionStart = 4;
        inputNode.selectionEnd = 4;
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.selectionStart, 6);
      });

      it('should add maxlength attribute to the input node if limitToMaxLength is passed as true', function() {
        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        inputNode.value = '12345678901234567890';
        autoFormatter = new AutoFormatter(inputNode, true);
        autoFormatter.enableFormatting();
        assert.equal(inputNode.getAttribute('maxlength'), '11');
      });

      it('should limit the maximum character to the format length', function() {
        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', '(XXX) XXX-XXXX');
        inputNode.value = '12345678901234567890';
        autoFormatter = new AutoFormatter(inputNode, true);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '(123) 456-7890');
      });

    });
  });

  describe('.format', function() {

    it('should return the value as is if no format has been provided', function() {
      assert.equal(AutoFormatter.format('1234567890', ''), '1234567890');
    });

    it('should return the value as is if no value has been provided', function() {
      assert.equal(AutoFormatter.format('', '(XXX) XXX-XXXX'), '');
    });

    it('should return the value as is if its length is less than the first separatorIndex', function() {
      assert.equal(AutoFormatter.format('1234', 'XXXXX-XXXXX'), '1234');
    });

    it('should format the value with respect to passed format', function() {
      assert.equal(AutoFormatter.format('1234567890', '(XXX) XXX-XXXX'), '(123) 456-7890');
    });

    it('should format limit the maximum character to the format length', function() {
      assert.equal(AutoFormatter.format('12345678901234567890', '(XXX) XXX-XXXX', true), '(123) 456-7890');
    });

  });

});
