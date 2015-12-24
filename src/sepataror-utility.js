/*
 * Copyright 2015, Yahoo Inc
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */

'use strict';

function getSepatarorIndex(separator, format) {
  var separatorIndex = [],
    currentSeparatorIndex = -1;

  for(var i = 0, l = separator.length; i < l; i += 1) {
    currentSeparatorIndex = format.indexOf(separator[i], currentSeparatorIndex + 1);
    separatorIndex.push(currentSeparatorIndex);
  }

  return separatorIndex;
}

function getSepatarorPattern(separator) {
  var separatorPattern = '(';

  for ( var index = 0, length = separator.length; index < length; index += 1 ) {
    if(index > 0) {
      separatorPattern = separatorPattern + '|';
    }
    separatorPattern = separatorPattern + '\\' + separator[index];
  }

  separatorPattern = separatorPattern + ')';

  return new RegExp(separatorPattern, 'g');
}

function getSeparatorAndSeparatorIndexForRecurringPattern(value, seperatorIndexIncrementValue, separator, separatorIndex) {
  var expectedValueLength = value.length + separator.length;
  var lastSeperatorIndex = separatorIndex.length - 1;

  while(separatorIndex[lastSeperatorIndex] < expectedValueLength - seperatorIndexIncrementValue) {
    separatorIndex.push(
      separatorIndex[lastSeperatorIndex] +
      seperatorIndexIncrementValue
    );
    separator.push(separator[separator.length - 1]);
    //separator.unshift(separator[0]);
    expectedValueLength += 1;
    lastSeperatorIndex = separatorIndex.length - 1;
  }

  return {
    separator: separator,
    separatorIndex: separatorIndex
  };
}

module.exports = {
  getSepatarorIndex: getSepatarorIndex,
  getSepatarorPattern: getSepatarorPattern,
  getSeparatorAndSeparatorIndexForRecurringPattern: getSeparatorAndSeparatorIndexForRecurringPattern
};
