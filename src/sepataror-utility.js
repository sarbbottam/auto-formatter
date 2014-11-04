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

module.exports = {
  getSepatarorIndex: getSepatarorIndex,
  getSepatarorPattern: getSepatarorPattern
};
