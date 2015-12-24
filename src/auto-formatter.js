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

  // refer http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes for keyCodes
  if(keyCode >= 48 && keyCode <= 90 || keyCode >= 96 && keyCode <= 105) {
    return true;
  }

  return false;
}

function isModifierKey(e) {
  var keyCode = e.keyCode;

  // refer http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes for keyCodes
  if(keyCode >= 8 && keyCode <= 46) {
    return true;
  }
  return false;
}

function unFormat(value, separatorPattern) {
  return value.replace(separatorPattern, '');
}

function formatter(e) {
  var targetNode = this.targetNode;
  var separator = this.separator;
  var separatorIndex = this.separatorIndex;
  var separatorPattern = this.separatorPattern;
  var caretIndexFromStart = targetNode.selectionStart;
  var caretIndexFromEnd = targetNode.value.length - caretIndexFromStart;
  var lastCharTyped = targetNode.value.charAt(caretIndexFromStart - 1);
  var separatorAndSeparatorIndexForRecurringPattern;
  var expectedValueArray;
  var lastCharTypedIsSeparator;
  var value = targetNode.value;
  /*
   * if recurringPattern, for example
   * if the entered input value is 1234567890 and the pattern is XX-XX
   * the value will be formatted as 12-34-56-78-90; the pattern following the last separator
   * will be used in recurrance
   * getSeparatorAndSeparatorIndexForRecurringPattern(), will compute the separator and separatorIndex
   * from the current value, the lenght of the pattern following the last separator, current separator
   * and current separatorIndex
   */
  if (this.recurringPattern) {
    separatorAndSeparatorIndexForRecurringPattern =
      sepatarorUtility.getSeparatorAndSeparatorIndexForRecurringPattern(
        value, this.seperatorIndexIncrementValue, separator, separatorIndex
      );
    separator = separatorAndSeparatorIndexForRecurringPattern.separator;
    separatorIndex = separatorAndSeparatorIndexForRecurringPattern.separatorIndex;
  }

  lastCharTypedIsSeparator = separator.indexOf(lastCharTyped) !== -1 ? 1 : 0;

  // separatorPattern is used to unformat the formatted value
  separatorPattern = sepatarorUtility.getSepatarorPattern(separator);

  if (this.direction === 'rtl') {
    /*
     * if the formatting direction is 'rtl'; the current value needs to be reversed,
     * to reuse the same logic that is used for formatting 'ltr' direction.
     */
    expectedValueArray = unFormat(value.split('').reverse().join(''), separatorPattern).split('');
  } else {
    expectedValueArray = unFormat(value, separatorPattern).split('');
  }
  /*
   * no format
   * ---------
   * if the keycode is between 8 & 46, backspace, left/right arrow keys etc.
   * avoid the pain of maintaining the caretIndexFromStart when ever formattig is done.
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
        if(caretIndexFromStart >= value.length) {
          caretIndexFromStart += 1;
        }

        if(caretIndexFromStart === separatorIndex[i] + 1) {
          caretIndexFromStart += 1;
        }
      }
    }

    // if recurringPattern, the trailing seperator, if any, is removed
    if (this.recurringPattern &&
      separator.indexOf(expectedValueArray[expectedValueArray.length - 1]) !== -1) {
        expectedValueArray.pop();
    }

    /*
     * since the value has been reversed for formatting it needs to be re-revesed
     * before setting it to targetNode
     */
    if (this.direction === 'rtl') {
      expectedValueArray.reverse();
    }

    if (this.limitToMaxLength) {
      // trim the value to maxLength
      targetNode.value = expectedValueArray.slice(0, this.maxLength).join('');
    } else {
      targetNode.value = expectedValueArray.join('');
    }

    // if the direction is 'rtl' caretIndexFromStart is recalculated
    if (this.direction === 'rtl') {
      caretIndexFromStart = expectedValueArray.length - caretIndexFromEnd;
    }

    if (e.type) {
        targetNode.selectionStart = caretIndexFromStart;
        targetNode.selectionEnd = caretIndexFromStart;
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

  // prior attaching the event listener for auto formatting, remove any, if exists.
  if (this.formatter || this.separatorPattern) {
    this.disableFormatting();
  }

  value = targetNode.value;

  this.format = format = format === null ? '' : format;

  // initialize auto formatting only if there is a valid format
  if (format && format.length) {
    separator = format.match(/[^X]/g);
    /*
     * if the formatting direction is 'rtl'; the current separator & format need to be reversed,
     * to reuse the same logic that is used for formatting 'ltr' direction.
     */
    if (this.direction === 'rtl') {
      separator = separator.reverse();
      format = format.split('').reverse().join('');
    }
    this.separator = separator;
    this.separatorIndex = separatorIndex = sepatarorUtility.getSepatarorIndex(separator, format);
    this.separatorPattern = sepatarorUtility.getSepatarorPattern(separator);

    // the legth of the format from the last separator, including the last separator
    this.seperatorIndexIncrementValue = format.length - separatorIndex[separatorIndex.length - 1];
    if (this.limitToMaxLength) {
      targetNode.setAttribute('maxlength', format.length);
      this.maxLength = format.length;
    } else {
      targetNode.removeAttribute('maxlength', format.length);
      this.maxLength = false;
    }

    // maintain the reference of the bounded formatter, so that it can be removed
    this.formatter = formatter.bind(this);
    targetNode.addEventListener('keyup', this.formatter);
    if(value !== '') {
      formatter.bind(this)(e || {});
    }
  }
};

/*
 * static function to format a given value
 * this function is similar to the format function above
 * it does not worry about the complex auto formatting logic
 * and caretIndex.
 */
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
  /*
   * if recurringPattern, for example
   * if the entered input value is 1234567890 and the pattern is XX-XX
   * the value will be formatted as 12-34-56-78-90; the pattern following the last separator
   * will be used in recurrance
   * getSeparatorAndSeparatorIndexForRecurringPattern(), will compute the separator and separatorIndex
   * from the current value, the lenght of the pattern following the last separator, current separator
   * and current separatorIndex
   */
  if (recurringPattern) {
    separatorAndSeparatorIndexForRecurringPattern =
      sepatarorUtility.getSeparatorAndSeparatorIndexForRecurringPattern(
        value, format.length - separatorIndex[separatorIndex.length - 1], separator, separatorIndex
      );
    separator = separatorAndSeparatorIndexForRecurringPattern.separator;
    separatorIndex = separatorAndSeparatorIndexForRecurringPattern.separatorIndex;
  }

  // separatorPattern is used to unformat the formatted value
  separatorPattern = sepatarorUtility.getSepatarorPattern(separator);
  expectedValueArray = unFormat(value, separatorPattern).split('');

  for( var i = 0, l = separatorIndex.length; i < l; i += 1 ) {
    if(expectedValueArray.length >= separatorIndex[i]) {
      expectedValueArray.splice(separatorIndex[i], 0, separator[i]);
    }
  }

  // if recurringPattern, the trailing seperator, if any, is removed
  if (recurringPattern &&
    separator.indexOf(expectedValueArray[expectedValueArray.length - 1]) !== -1) {
      expectedValueArray.pop();
  }

  /*
   * since the value has been reversed for formatting it needs to be re-revesed
   * before setting it to targetNode
   */
  if (direction === 'rtl') {
    expectedValueArray.reverse();
  }

  if (limitToMaxLength) {
    // trim the value to maxLength
    return expectedValueArray.slice(0, format.length).join('');
  } else {
    return expectedValueArray.join('');
  }
};

module.exports = AutoFormatter;
