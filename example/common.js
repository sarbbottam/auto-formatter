var AutoFormatter = require('../src/auto-formatter');

var phoneNumberFormatter;
var creditCardFormatter;
var birthdayFormatter;

phoneNumberFormatter = new AutoFormatter(document.querySelector('#phone-number'), true);
phoneNumberFormatter.enableFormatting();

creditCardFormatter = new AutoFormatter(document.querySelector('#credit-card'), true);
creditCardFormatter.enableFormatting();

birthdayFormatter = new AutoFormatter(document.querySelector('#birthday'), true);
birthdayFormatter.enableFormatting();
