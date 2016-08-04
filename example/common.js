var AutoFormatter = require('../src/auto-formatter');

var phoneNumberFormatter;
var creditCardFormatter;
var birthdayFormatter;

var countryCodeNode = document.getElementById('country-code');

phoneNumberFormatter = new AutoFormatter({
  targetNode: document.getElementById('phone-number'),
  limitToMaxLength: true
});
phoneNumberFormatter.enableFormatting();

countryCodeNode.addEventListener('change', function() {
  var correspondingNode = document.getElementById(this.getAttribute('data-corresponding-node-id'));
  var format = this.options[this.selectedIndex].getAttribute('data-format');
  correspondingNode.setAttribute('data-format', format ? format : '');
  correspondingNode.setAttribute('placeholder', format ? format : 'Mobile number');
  phoneNumberFormatter.enableFormatting();
});


creditCardFormatter = new AutoFormatter({
  targetNode: document.getElementById('credit-card'),
  limitToMaxLength: true
});
creditCardFormatter.enableFormatting();

birthdayFormatter = new AutoFormatter({
  targetNode: document.getElementById('birthday'),
  limitToMaxLength: true
});
birthdayFormatter.enableFormatting();

currencyFormatter = new AutoFormatter({
  targetNode: document.getElementById('currency'),
  limitToMaxLength: false,
  recurringPattern: true,
  direction: 'rtl'
});
currencyFormatter.enableFormatting();
