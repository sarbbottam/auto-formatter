'use strict';

describe('AutoFormatter', function() {
  var event = require('../polyfill/event');
  var AutoFormatter = require('../src/auto-formatter');
  var autoFormatter;
  var inputNode;
  var config = {
    limitToMaxLength: true,
    recurringPattern: false
  };

  before(function() {
    inputNode = document.createElement('input');
    document.body.appendChild(inputNode);
    config.targetNode = inputNode;
    autoFormatter = new AutoFormatter(config);

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
        autoFormatter = new AutoFormatter(config);
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

      it('should format if the last chracter typed is a separator and also a modifier key', function() {
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
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        assert.equal(inputNode.getAttribute('maxlength'), '11');
      });

      it('should limit the maximum character to the format length', function() {
        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', '(XXX) XXX-XXXX');
        inputNode.value = '12345678901234567890';
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '(123) 456-7890');
      });

      it('should format recurringly w.r.t the last seperator if desired', function() {
        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', '(XXX) XXX-XXXX');
        inputNode.value = '12345678901234567890';
        config.limitToMaxLength = false;
        config.recurringPattern = true;
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '(123) 456-7890-1234-5678-90');

        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', 'XXXXX-XXXXX');
        inputNode.value = '1234567890123456789';
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '12345-67890-12345-6789');

        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', 'X-XX');
        inputNode.value = '12345678';
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '1-23-45-67-8');
      });

      it('should format in rtl manner, recurringly if desired', function() {
        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', 'XXX,XXX.XX');
        inputNode.value = '1234567890';
        config.direction = 'rtl';
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '12,345,678.90');

        autoFormatter.disableFormatting();
        inputNode.setAttribute('data-format', 'XXX,XXX.XX');
        inputNode.value = '12345';
        autoFormatter = new AutoFormatter(config);
        autoFormatter.enableFormatting();
        event.triggerKeyupEvent(inputNode, 48);
        assert.equal(inputNode.value, '123.45');
      });

    });
  });

  describe('.format', function() {

    it('should return the value as is if no format has been provided', function() {
      config.value = '1234567890';
      config.format = '';
      assert.equal(AutoFormatter.format(config), '1234567890');
    });

    it('should return the value as is if no value has been provided', function() {
      config.value = '';
      config.format = '(XXX) XXX-XXXX';
      assert.equal(AutoFormatter.format(config), '');
    });

    it('should return the value as is if its length is less than the first separatorIndex', function() {
      config.value = '1234';
      config.format = 'XXXXX-XXXXX';
      assert.equal(AutoFormatter.format(config), '1234');
    });

    it('should format the value with respect to passed format', function() {
      config.value = '1234567890';
      config.format = '(XXX) XXX-XXXX';
      config.recurringPattern = false;
      assert.equal(AutoFormatter.format(config), '(123) 456-7890');
    });

    it('should format and limit the maximum character to the format length', function() {
      config.value = '12345678901234567890';
      config.format = '(XXX) XXX-XXXX';
      config.limitToMaxLength = true;
      config.direction = false;
      assert.equal(AutoFormatter.format(config), '(123) 456-7890');
    });

    it('should format recurringly w.r.t the last seperator if desired', function() {
      config.value = '12345678901234567890';
      config.format = '(XXX) XXX-XXXX';
      config.limitToMaxLength = false;
      config.recurringPattern = true;

      assert.equal(AutoFormatter.format(config), '(123) 456-7890-1234-5678-90');

      config.format = 'XXXXX-XXXXX';
      assert.equal(AutoFormatter.format(config), '12345-67890-12345-67890');

      config.value = '123456789012345678';
      assert.equal(AutoFormatter.format(config), '12345-67890-12345-678');

      config.value = '123456789';
      config.format = 'X-XX';
      assert.equal(AutoFormatter.format(config), '1-23-45-67-89');
    });

    it('should not format recurringly and limit the maximum character to the format length if desired', function() {
      config.value = '12345678901234567890';
      config.format = '(XXX) XXX-XXXX';
      config.limitToMaxLength = true;
      config.recurringPattern = true;
      assert.equal(AutoFormatter.format(config), '(123) 456-7890');

      config.format = 'XXXXX-XXXXX';
      assert.equal(AutoFormatter.format(config), '12345-67890');

      config.value = '123456789';
      config.format = 'X-XX';
      assert.equal(AutoFormatter.format(config), '1-23');
    });

    it('should format in rtl manner, recurringly if desired', function() {
      config.limitToMaxLength = false;
      config.recurringPattern = true;
      config.direction = 'rtl';

      config.value = '1234567890';
      config.format = 'XXX,XXX.XX';
      assert.equal(AutoFormatter.format(config), '12,345,678.90');

      config.value = '12345';
      config.format = 'XXX,XXX.XX';
      assert.equal(AutoFormatter.format(config), '123.45');
    });

  });

});
