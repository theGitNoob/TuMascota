function parsePhone(phone) {
  phone = phone.replace(/ /g, "");
  if (phone.startsWith("+")) phone = phone.substring(1);
  if (phone.length == 10) phone = phone.substring(2);
  return phone;
}

module.exports.parsePhone = parsePhone;
