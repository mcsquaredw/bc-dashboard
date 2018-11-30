function util_dateToString(date) {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
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
  const aDate = new Date(a.PlannedStart);
  const bDate = new Date(b.PlannedStart);
  const result = ('' + a.Resource).localeCompare(b.Resource)
  return (result !== 0 ? result : aDate - bDate);
}

function removeChildren(container) {
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function renderAlertLevelIcon(job) {
  const jobDate = new Date(job.PlannedStart);
  const now = new Date();
  const diff = jobDate.getTime() - now.getTime();

  if(diff < 7 * 24 * 60 * 60 * 1000) {
    return "report_problem";
  } else if(diff < 14 * 24 * 60 * 60 * 1000) {
    return "help";
  } else {
    return "info";
  }

  return "";
}

