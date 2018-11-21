function renderJobTypeIcon(job, container, width) {
  const iTypeIcon = document.createElement("i");
  const colTypeIcon = document.createElement("div");

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

  iTypeIcon.classList.add("material-icons");
  iTypeIcon.classList.add("mt-2");
  iTypeIcon.setAttribute("style", "font-size: 48px;");
  iTypeIcon.appendChild(document.createTextNode(jobTypeIcon));
  colTypeIcon.classList.add(`col-${width}`);
  colTypeIcon.classList.add("align-middle");
  colTypeIcon.classList.add("text-center");
  colTypeIcon.appendChild(iTypeIcon);

  container.appendChild(colTypeIcon);
}

function renderJobDetails(job, container, width) {
  const spJobType = document.createElement("b");
  const colType = document.createElement("div");

  spJobType.appendChild(document.createTextNode(job.Type));

  colType.classList.add(`col-${width}`);
  colType.setAttribute("style", "font-size: 25px;");
  colType.appendChild(spJobType);

  container.appendChild(colType);
}

function renderCustomerDetails(job, container, width) {
  const spCustomerName = document.createElement("b");
  const spCustomerPostcode = document.createElement("b");
  const colCustomer = document.createElement("div");

  spCustomerName.appendChild(document.createTextNode(toTitleCase(job.Contact)));
  spCustomerPostcode.appendChild(
    document.createTextNode(job.Postcode.toUpperCase())
  );

  colCustomer.classList.add(`col-${width}`);
  colCustomer.setAttribute("style", "font-size: 25px;");
  colCustomer.appendChild(spCustomerName);
  colCustomer.appendChild(document.createElement("br"));
  colCustomer.appendChild(spCustomerPostcode);

  container.appendChild(colCustomer);
}

function renderTimingDetails(job, container, width) {
  const iIcon = document.createElement("i");
  const rowTiming = document.createElement("div");
  const colIcon = document.createElement("div");
  const colTiming = document.createElement("div");
  const colContainer = document.createElement("div");

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
    )}`;
  }

  iIcon.appendChild(document.createTextNode(iconName));
  iIcon.classList.add("material-icons");
  iIcon.setAttribute("style", "font-size: 25px;");

  colIcon.setAttribute("style", "font-size: 25px;");
  colIcon.appendChild(iIcon);
  colIcon.classList.add("col-2");

  colTiming.appendChild(document.createTextNode(label));
  colTiming.setAttribute("style", "font-size: 25px;");
  colTiming.classList.add("col-10");

  rowTiming.classList.add("row");
  rowTiming.appendChild(colIcon);
  rowTiming.appendChild(colTiming);

  colContainer.appendChild(rowTiming);
  colContainer.classList.add(`col-${width}`);

  container.appendChild(colContainer);
}

function renderJobStatus(job, container, width) {
  const iStatus = document.createElement("i");
  const colStatus = document.createElement("div");

  iStatus.setAttribute("style", "font-size: 48px;");
  iStatus.classList.add("material-icons");

  if (!job.RealStart && !job.RealEnd) {
    iStatus.appendChild(document.createTextNode("pause_circle_filled"));
    container.classList.add("table-danger");
  }

  if (job.RealStart && !job.RealEnd) {
    iStatus.appendChild(document.createTextNode("play_circle_filled"));
    container.classList.add("table-warning");
  }

  if (job.RealStart && job.RealEnd) {
    if (job.Status.includes("issues")) {
      iStatus.appendChild(document.createTextNode("feedback"));
      container.classList.add("table-info");
    } else {
      iStatus.appendChild(document.createTextNode("check_circle"));
      container.classList.add("table-success");
    }
  }

  colStatus.classList.add(`col-${width}`);
  colStatus.appendChild(iStatus);

  container.appendChild(colStatus);
}
