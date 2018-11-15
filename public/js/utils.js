function util_dateToString(date) {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
}

function util_startDate(date) {
  date.setHours(0, 0, 0, 0);

  return util_dateToString(date);
}

function util_endDate(date) {
  date.setHours(23, 59, 59, 999);

  return util_dateToString(date);
}

function getSelectedFromSelect(select) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].selected) {
      return i;
    }
  }
}
