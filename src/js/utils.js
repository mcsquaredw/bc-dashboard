export function dateToString(date) {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
}

export function getSelectedFromSelect(select) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].selected) {
      return i;
    }
  }
}

export function formatTime(dateStr) {
  const dateObj = new Date(dateStr);

  return `${dateObj.getHours()}:${(
    "0" + dateObj.getMinutes()
  ).slice(-2)}`;
}

export function formatDate(dateStr) {
  const dateObj = new Date(dateStr);

  return `${("0" + dateObj.getDate()).slice(-2)}/${(
    "0" +
    (dateObj.getMonth() + 1)
  ).slice(-2)}/${dateObj.getFullYear()}`;
}

export function toTitleCase(str) {
  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}

export function sortJobs(a, b) {
  const aDate = new Date(a.PlannedStart);
  const bDate = new Date(b.PlannedStart);
  const result = ('' + a.Resource).localeCompare(b.Resource);
  return (result !== 0 ? result : aDate - bDate);
}

export function removeChildren(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

export function getFlagDetails(flagName, flags) {
  let flag;

  if (!flagName || flagName === "") {
    flag = {
      tagName: "NO FLAG",
      colour: "red"
    };
  } else {
    flag = flags.filter(flag => flag.tagName.includes(flagName))[0];
  }

  return flag;
}

export function getPreviousFlag(job, flags) {
  let previousFlag;

  if (job.CurrentFlag && job.Type.includes("Fitting") && !job.Type.includes("Motor")) {
    if (job.CurrentFlag.includes("IF01")) {
      previousFlag = getFlagDetails("IF03", flags);
    } else if (job.CurrentFlag.includes("IF03")) {
      previousFlag = getFlagDetails("IF06", flags);
    } else if (job.CurrentFlag.includes("IF06", flags)) {
      previousFlag = getFlagDetails("IF02", flags);
    } 
  } 

  return previousFlag;
}

export function getNextFlag(job, flags) {
  let nextFlag;

  if (job.Type.includes("Fitting") && !job.Type.includes("Motor")) {
    if(!job.CurrentFlag) {
      nextFlag = getFlagDetails("IF02", flags);
    } else if (job.CurrentFlag.includes("IF01")) {
      nextFlag = getFlagDetails("Paid", flags);
    } else if (job.CurrentFlag.includes("IF03")) {
      nextFlag = getFlagDetails("IF01", flags);
    } else if (job.CurrentFlag.includes("IF06", flags)) {
      nextFlag = getFlagDetails("IF03", flags);
    } else if (job.CurrentFlag.includes("IF02", flags)) {
      nextFlag = getFlagDetails("IF06", flags);
    } else {
      nextFlag = getFlagDetails("IF02", flags);
    }
  }

  return nextFlag;
}