var AutoFormatter = require('../src/auto-formatter');

var phoneNumberFormatter;
var creditCardFormatter;
var birthdayFormatter;

var countryCodeNode = document.getElementById('country-code');

phoneNumberFormatter = new AutoFormatter(document.getElementById('phone-number'), true);
phoneNumberFormatter.enableFormatting();

countryCodeNode.addEventListener('change', function() {
  var correspondingNode = document.getElementById(this.getAttribute('data-corresponding-node-id'));
  var format = this.options[this.selectedIndex].getAttribute('data-format');
  correspondingNode.setAttribute('data-format', format ? format : '');
  correspondingNode.setAttribute('placeholder', format ? format : 'Mobile number');
  phoneNumberFormatter.enableFormatting();
});


creditCardFormatter = new AutoFormatter(document.getElementById('credit-card'), true);
creditCardFormatter.enableFormatting();

birthdayFormatter = new AutoFormatter(document.getElementById('birthday'), true);
birthdayFormatter.enableFormatting();

/*
 * ToDo
 * add example for recurringPattern
 */
