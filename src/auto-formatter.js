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

function formatter(separator, separatorIndex, separatorPattern, e) {
  var caretIndex = this.selectionStart;
  var lastCharTyped = this.value.charAt(caretIndex - 1);
  var lastCharTypedIsSeparator = separator.indexOf(lastCharTyped) !== -1 ? 1 : 0;
  var expectedValueArray = unFormat(this.value, separatorPattern).split('');
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
        if(caretIndex >= this.value.length) {
          caretIndex += 1;
        }

        if(caretIndex === separatorIndex[i] + 1) {
          caretIndex += 1;
        }
      }
    }

    //this.value = result.value.substr(0, formatLength);

    this.value = expectedValueArray.join('');
    if (e.type) {
        this.selectionStart = caretIndex;
        this.selectionEnd = caretIndex;
    }
  }
}

var AutoFormatter = function(targetNode) {
  this.targetNode = targetNode;
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

    //targetNode.setAttribute('maxLength', format.length);

    this.formatter = formatter.bind(targetNode, separator, separatorIndex, separatorPattern);
    targetNode.addEventListener('keyup', this.formatter);
    if(value !== '') {
      formatter.call(targetNode, separator, separatorIndex, separatorPattern, e || {});
    }
  } else {
    targetNode.value = value.replace(separatorPattern, '');
  }
};

module.exports = AutoFormatter;
