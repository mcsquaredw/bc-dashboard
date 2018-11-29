function renderJobTypeIcon(job) {
  let jobTypeIcon = "";

  if (job.Type.includes("Fitting")) {
    jobTypeIcon = "add_box";
  } else if (job.Type.includes("Repair") || job.Type.includes("Remedial")) {
    jobTypeIcon = "build";
  } else if (job.Type.includes("Survey")) {
    jobTypeIcon = "search";
  } else if (job.Type.includes("Misc")) {
    jobTypeIcon = "search";
  } else if (job.Type.includes("Meeting")) {
    jobTypeIcon = "people";
  }

  return `
    <i class="material-icons mt-2" style="font-size: 48px;">${jobTypeIcon}</i>
  `;
}

function renderJobDetails(job) {
  return `
    <b>${job.Type}</b>
  `;
}

function renderCustomerDetails(job) {
  return `
    <b>${toTitleCase(job.Contact)}</b>
    <br />
    <b>${job.Postcode.toUpperCase()}</b>
  `;
}

function renderTimingDetails(job) {
  let iconName = "";
  let label = "";

  if (!job.RealStart) {
    iconName = "stop";
    label = "NOT STARTED";
  } else if (!job.RealEnd) {
    iconName = "play_circle_filled";
    label = `Started ${formatTime(job.RealStart)}`;
  } else {
    iconName = "watch_later";
    label = `Finished in ${formatTime(
      new Date(
        new Date(job.RealEnd).getTime() - new Date(job.RealStart).getTime()
      ).toString()
    )}hrs`;
  }

  return `
    <div class="row">
      <div class="col-2">
        <i class="material-icons" style="font-size: 25px;">${iconName}</i>
      </div>
      <div class="col-10" style="font-size: 25px;">
        ${label}
      </div>
    </div>
  `;
}

function jobStatusColour(job) {
  if(!job.RealStart) {
    return "table-danger";
  } else if(!job.RealEnd) {
    return "table-warning";
  } else {
    if(job.Status.includes("issues")) {
      return "table-info";
    } else {
      return "table-success";
    }
  }
}

function jobStatusIcon(job) {
  let iconName = "";

  if(!job.RealStart) {
    iconName = "pause_circle_filled";
  } else if(!job.RealEnd) {
    iconName = "play_circle_filled";
  } else {
    if(job.Status.includes("issues")) {
      iconName = "feedback";
    } else {
      iconName = "check_circle";
    }
  }

  return `<i class="material-icons" style="font-size: 48px;">${iconName}</i>`;
}