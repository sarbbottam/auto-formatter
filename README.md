auto-formatter
---


[![build status](https://travis-ci.org/sarbbottam/auto-formatter.svg?branch=master)](https://travis-ci.org/sarbbottam/auto-formatter)
[![coverage status](https://coveralls.io/repos/sarbbottam/auto-formatter/badge.svg?branch=master&service=github)](https://coveralls.io/github/sarbbottam/auto-formatter?branch=master)
[![sauce test status](https://saucelabs.com/buildstatus/sarbbottam)](https://saucelabs.com/u/sarbbottam)

[![sauce browser matrix](https://saucelabs.com/browser-matrix/sarbbottam.svg)](https://saucelabs.com/u/sarbbottam)

Format as you type.

* phone number ```(XXX) XXX-XXXX, XXXXX-XXXXX```
* credit card number ```XXXX XXXX XXXX XXXX, XXXX XXXXXX XXXXX```
* date ```DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD```

![animated demo](http://i.imgur.com/IR7veRM.gif)

## Usage:

```html
<input type="tel" id="mobile-number" value="1234567890" data-format="(XXX) XXX-XXXX">
<script src="path/to/auto-formatter.js"></script>
<script>
var phoneNumberFormatter;

phoneNumberFormatter = new AutoFormatter({
  targetNode: document.querySelector('#phone-number'),
  limitToMaxLength: true
});
phoneNumberFormatter.enableFormatting();

AutoFormatter.format({
  value: '1234567890',
  format: 'XXXXX-XXXXX'
}); // 12345-67890
</script>
```

---

## API

```js
/*
 * create an instance of autoformatter
 * by passing the targetNode and optional limitToMaxLength (true|false) flag
 * if limitToMaxLength === true is passed, the `maxlength` attribute,
 * with `length of the format` will be added to the targetNode
 * and formatted value will be trimmed to `length of the format`
 * if limitToMaxLength is passed as true, recurringPattern will not have any effect
 */
targetNodeFormatter = new AutoFormatter({
  targetNode: targetNode, // DOM Node
  limitToMaxLength: limitToMaxLength, // optional - true | false
  recurringPattern: recurringPattern, // optional - true | false
  direction: direction // optional - 'ltr' || 'rtl'
})

/*
 * enable formatting on the targetNode
 * if the targetNode has existing value, it would format and update the existing value
 * format as you type will be enabled on this node
 */
targetNodeFormatter.enableFormatting();

/*
 * disable formatting on the targetNode
 * if the targetNode has existing value, it would un-format and update the existing value
 * format as you type will be disabled on this node
 */
targetNodeFormatter.disableFormatting();

/*
 * format a value
 * as per the desired format
 * if limitToMaxLength is passed as true, recurringPattern will not have any effect
 */
AutoFormatter.format({
  value: value,
  format: format,
  limitToMaxLength: limitToMaxLength, // optional - true | false
  recurringPattern: recurringPattern, // optional - true | false
  direction: direction // optional - 'ltr' || 'rtl'
})
```

---

## License

Copyright 2015, Yahoo Inc. Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
