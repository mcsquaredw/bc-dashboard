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
  const spFitter = document.createElement("b");
  const colType = document.createElement("div");

  spJobType.appendChild(document.createTextNode(job.Type));
  spFitter.appendChild(document.createTextNode(job.Resource));

  colType.classList.add(`col-${width}`);
  colType.setAttribute("style", "font-size: 25px;");
  colType.appendChild(spJobType);
  colType.appendChild(document.createElement("br"));
  colType.appendChild(document.createTextNode("Assigned To: "));
  colType.appendChild(spFitter);

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
  const iStartIcon = document.createElement("i");
  const iEndIcon = document.createElement("i");
  const colTiming = document.createElement("div");

  iStartIcon.classList.add("material-icons");
  iStartIcon.setAttribute("style", "font-size: 25px;");
  iStartIcon.appendChild(document.createTextNode("play_circle_filled"));
  iEndIcon.classList.add("material-icons");
  iEndIcon.setAttribute("style", "font-size: 25px;");
  iEndIcon.appendChild(document.createTextNode("stop"));

  colTiming.classList.add(`col-${width}`);
  colTiming.setAttribute("style", "font-size: 25px;");
  colTiming.appendChild(iStartIcon);
  colTiming.appendChild(
    document.createTextNode(
      job.RealStart ? formatTime(job.RealStart) : "NOT STARTED"
    )
  );
  colTiming.appendChild(document.createElement("br"));
  colTiming.appendChild(iEndIcon);
  colTiming.appendChild(
    document.createTextNode(
      job.RealEnd ? formatTime(job.RealEnd) : "NOT FINISHED"
    )
  );

  container.appendChild(colTiming);
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
