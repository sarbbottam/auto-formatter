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
var mobileNumber = document.getElementById('mobile-number');
var autoFormatter = new AutoFormatter(mobileNumber);
autoFormatter.enableFormatting();
</script>
```

---

## License

Copyright 2015, Yahoo Inc. Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
