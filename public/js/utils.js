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

function formatTime(dateStr) {
  const dateObj = new Date(dateStr);

  return `${("0" + dateObj.getHours()).slice(-2)}:${(
    "0" + dateObj.getMinutes()
  ).slice(-2)}:${("0" + dateObj.getSeconds()).slice(-2)}`;
}

function formatDate(dateStr) {
  const dateObj = new Date(dateStr);

  return `${("0" + dateObj.getDate()).slice(-2)}/${(
    "0" +
    (dateObj.getMonth() + 1)
  ).slice(-2)}/${dateObj.getFullYear()}`;
}

function toTitleCase(str) {
  return str.replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
}

function sortJobs(a, b) {
  if (a.Resource > b.Resource) {
    return 1;
  }
  if (b.Resource > a.Resource) {
    return -1;
  }
  if (a.PlannedStart > b.PlannedStart) {
    return 1;
  }
  if (b.PlannedStart > a.PlannedStart) {
    return -1;
  }
}
