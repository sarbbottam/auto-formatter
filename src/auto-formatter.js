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

  if(keyCode >= 48 && keyCode <= 90 || keyCode >= 96 && keyCode <= 105) {
    return true;
  }

  return false;
}

function isModifierKey(e) {
  var keyCode = e.keyCode;

  if(keyCode >= 8 && keyCode <= 46) {
    return true;
  }
  return false;
}

function unFormat(value, separatorPattern) {
  return value.replace(separatorPattern, '');
}

function formatter(targetNode, separator, separatorIndex, separatorPattern, maxLength, e) {
  var caretIndex = targetNode.selectionStart;
  var lastCharTyped = targetNode.value.charAt(caretIndex - 1);
  var lastCharTypedIsSeparator = separator.indexOf(lastCharTyped) !== -1 ? 1 : 0;
  var expectedValueArray = unFormat(targetNode.value, separatorPattern).split('');
  if(lastCharTypedIsSeparator) {
    caretIndex -= 1;
  }

  /*
   * no format
   * ---------
   * if the keycode is between 8 & 46, backspace, left/right arrow keys etc.
   * avoid the pain of maintaining the caretIndex when ever formattig is done.
   * format
   * ------
   * if the last character typed is one of the separator
   * so that the seperator is not typed over and over
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

    if (this && this.hasMaxLength) {
      targetNode.value = expectedValueArray.slice(0, maxLength).join('');
    } else {
      targetNode.value = expectedValueArray.join('');
    }
    if (e.type) {
        targetNode.selectionStart = caretIndex;
        targetNode.selectionEnd = caretIndex;
    }
  }
}

var AutoFormatter = function(targetNode, hasMaxLength) {
  this.targetNode = targetNode;
  this.hasMaxLength = hasMaxLength;
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

  document.dispatchEvent(new CustomEvent('cleared-formatting', {
    'detail': {
      targetNode: this.targetNode
    }
  }));
};

AutoFormatter.prototype.enableFormatting = function(e) {
  var targetNode = this.targetNode;
  var value = targetNode.value;
  var format = targetNode.getAttribute('data-format');
  var separator;
  var separatorIndex;
  var separatorPattern;

  if (this.formatter || this.separatorPattern) {
    this.disableFormatting();
  }

  this.format = format = format === null ? '' : format;

  if (format && format.length) {
    this.separator = separator = format.match(/[^X]/g);
    this.separatorIndex = separatorIndex = sepatarorUtility.getSepatarorIndex(separator, format);
    this.separatorPattern = separatorPattern = sepatarorUtility.getSepatarorPattern(separator);

    if (this.hasMaxLength) {
      targetNode.setAttribute('maxlength', format.length);
    }

    this.formatter = formatter.bind(this, targetNode, separator, separatorIndex, separatorPattern, format.length);
    targetNode.addEventListener('keyup', this.formatter);
    if(value !== '') {
      formatter(targetNode, separator, separatorIndex, separatorPattern, format.length, e || {});
    }
  } else {
    targetNode.value = value.replace(separatorPattern, '');
  }
};

module.exports = AutoFormatter;
