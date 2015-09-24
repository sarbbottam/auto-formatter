auto-formatter
---

Format as you type.

* phone number ```(XXX) XXX-XXXX, XXXXX-XXXXX```
* credit card number ```XXXX XXXX XXXX XXXX, XXXX XXXXXX XXXXX```
* date ```DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD```

## Usage:

```html
<input type="tel" id="mobile-number" value="1234567890" data-format="(XXX) XXX-XXXX">
<script src="path/to/auto-formatter.js"></script>
<script>
var phoneNumberFormatter;

phoneNumberFormatter = new AutoFormatter(document.querySelector('#phone-number'), true);
phoneNumberFormatter.enableFormatting();
</script>
```

---

## API

```js
/*
 * create an instance of autoformatter
 * by passing the targetNode and optional hasMaxLength (true|false) flag
 * if hasMaxLength === true is passed, the `maxlength` attribute,
 * with `length of the format` will be added to the targetNode
 * and formatted value will be trimmed to `length of the format`
 */
targetNodeFormatter = new AutoFormatter(targetNode, [hasMaxLength])

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
```

---

## License

Copyright 2015, Yahoo Inc. Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
