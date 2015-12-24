/*
 * Copyright 2015, Yahoo Inc
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

'use strict';

var sepatarorUtility = require('./sepataror-utility');

function isAutoFormatEnabled(e) {
  var keyCode = e.keyCode;
  if(!keyCode) {
    return true;
  }

  if(keyCode === 8 || keyCode === 46 || keyCode >= 48 && keyCode <= 90 || keyCode >= 96 && keyCode <= 105) {
    return true;
  }

  return false;
}

function isModifierKey(e) {
  var keyCode = e.keyCode;

  if(keyCode >= 9 && keyCode <= 46) {
    return true;
  }
  return false;
}

function unFormat(value, separatorPattern) {
  return value.replace(separatorPattern, '');
}

function formatter(targetNode, separator, separatorIndex, separatorPattern, e) {
  var caretIndex = targetNode.selectionStart;
  var lastCharTyped = targetNode.value.charAt(caretIndex - 1);
  var separatorAndSeparatorIndexForRecurringPattern;
  var expectedValueArray;
  var lastCharTypedIsSeparator;


  if (this.recurringPattern) {
    separatorAndSeparatorIndexForRecurringPattern =
      sepatarorUtility.getSeparatorAndSeparatorIndexForRecurringPattern(
        targetNode.value, this.seperatorIndexIncrementValue, separator, separatorIndex
      );
    separator = separatorAndSeparatorIndexForRecurringPattern.separator;
    separatorIndex = separatorAndSeparatorIndexForRecurringPattern.separatorIndex;
  }

  lastCharTypedIsSeparator = separator.indexOf(lastCharTyped) !== -1 ? 1 : 0;

  separatorPattern = sepatarorUtility.getSepatarorPattern(separator);
  if (this.direction === 'rtl') {
    expectedValueArray = unFormat(targetNode.value.split('').reverse().join(''), separatorPattern).split('');
  } else {
    expectedValueArray = unFormat(targetNode.value, separatorPattern).split('');
  }
  /*
   * no format
   * ---------
   * if the keycode is between 8 & 46, backspace, left/right arrow keys etc.
   * avoid the pain of maintaining the caretIndex when ever formattig is done.
   * format
   * ------
   * if the last character typed is one of the separator
   * so that the separator is not typed over and over
   */
  if( (lastCharTypedIsSeparator && !isModifierKey(e) ) || isAutoFormatEnabled(e) ) {
    for( var i = 0, l = separatorIndex.length; i < l; i += 1 ) {
      if(expectedValueArray.length >= separatorIndex[i]) {
        expectedValueArray.splice(separatorIndex[i], 0, separator[i]);
        if (lastCharTypedIsSeparator) {
          continue;
        }
        /*
         * update the caret index
         * ----------------------
         * formatting happens only on keyup
         * if the key has not been released for a long
         * same character will be entered multiple time in the input
         * the caret index needs to be updated accordingly, after the formatting
         * which must take, the separator added, in to consideration
         */
        if(caretIndex >= targetNode.value.length) {
          caretIndex += 1;
        }

        if(caretIndex === separatorIndex[i] + 1) {
          caretIndex += 1;
        }
      }
    }

    if (this.direction === 'rtl') {
      expectedValueArray.reverse();
    }

    if (this.limitToMaxLength) {
      targetNode.value = expectedValueArray.slice(0, this.maxLength).join('');
    } else {
      targetNode.value = expectedValueArray.join('');
    }

    if (e.type) {
        targetNode.selectionStart = caretIndex;
        targetNode.selectionEnd = caretIndex;
    }
  }
}

var AutoFormatter = function(targetNode, limitToMaxLength, recurringPattern, direction) {
  this.targetNode = targetNode;
  this.limitToMaxLength = limitToMaxLength;
  this.recurringPattern = recurringPattern && !limitToMaxLength;
  this.direction = direction;
};

AutoFormatter.prototype.disableFormatting = function() {
  var value = this.targetNode.value;

  /* istanbul ignore next */
  if (value !== '') {
    this.targetNode.value = unFormat(value, this.separatorPattern);
  }

  /* istanbul ignore next */
  if (this.formatter) {
    this.targetNode.removeEventListener('keyup', this.formatter);
  }

};

AutoFormatter.prototype.enableFormatting = function(e) {
  var targetNode = this.targetNode;
  var value;
  var format = targetNode.getAttribute('data-format');
  var separator;
  var separatorIndex;
  var separatorPattern;

  if (this.formatter || this.separatorPattern) {
    this.disableFormatting();
  }

  value = targetNode.value;

  this.format = format = format === null ? '' : format;

  if (format && format.length) {
    separator = format.match(/[^X]/g);
    if (this.direction === 'rtl') {
      separator = separator.reverse();
      format = format.split('').reverse().join('');
    }
    this.separator = separator;
    this.separatorIndex = separatorIndex = sepatarorUtility.getSepatarorIndex(separator, format);
    this.separatorPattern = separatorPattern = sepatarorUtility.getSepatarorPattern(separator);

    this.seperatorIndexIncrementValue = format.length - separatorIndex[separatorIndex.length - 1];
    if (this.limitToMaxLength) {
      targetNode.setAttribute('maxlength', format.length);
      this.maxLength = format.length;
    } else {
      targetNode.removeAttribute('maxlength', format.length);
      this.maxLength = false;
    }


    this.formatter = formatter.bind(this, targetNode, separator, separatorIndex, separatorPattern);
    targetNode.addEventListener('keyup', this.formatter);
    if(value !== '') {
      formatter.bind(this)(targetNode, separator, separatorIndex, separatorPattern, e || {});
    }
  }
};

AutoFormatter.format = function(value, format, limitToMaxLength, recurringPattern, direction) {
  var separator;
  var separatorIndex;
  var separatorPattern;
  var expectedValueArray;
  var separatorAndSeparatorIndexForRecurringPattern;
  recurringPattern = recurringPattern && !limitToMaxLength;

  if (!value) {
    return value;
  }

  if (!format) {
    return value;
  }

  separator = format.match(/[^X]/g);

  if (direction === 'rtl') {
    value = value.split('').reverse().join('');
    separator = separator.reverse();
    format = format.split('').reverse().join('');
  }

  separatorIndex = sepatarorUtility.getSepatarorIndex(separator, format);
  if (recurringPattern) {
    separatorAndSeparatorIndexForRecurringPattern =
      sepatarorUtility.getSeparatorAndSeparatorIndexForRecurringPattern(
        value, format.length - separatorIndex[separatorIndex.length - 1], separator, separatorIndex
      );
    separator = separatorAndSeparatorIndexForRecurringPattern.separator;
    separatorIndex = separatorAndSeparatorIndexForRecurringPattern.separatorIndex;
  }
  separatorPattern = sepatarorUtility.getSepatarorPattern(separator);

  expectedValueArray = unFormat(value, separatorPattern).split('');

  for( var i = 0, l = separatorIndex.length; i < l; i += 1 ) {
    if(expectedValueArray.length >= separatorIndex[i]) {
      expectedValueArray.splice(separatorIndex[i], 0, separator[i]);
    }
  }

  if (direction === 'rtl') {
    expectedValueArray.reverse();
  }

  if (limitToMaxLength) {
    return expectedValueArray.slice(0, format.length).join('');
  } else {
    return expectedValueArray.join('');
  }
};

module.exports = AutoFormatter;
