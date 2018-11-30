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
      <br />
      Expected to take ${job.Duration}hrs
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
    if (!job.RealStart) {
        return "table-danger";
    } else if (!job.RealEnd) {
        return "table-warning";
    } else {
        if (job.Status.includes("issues")) {
            return "table-info";
        } else {
            return "table-success";
        }
    }
}

function jobStatusIcon(job) {
    let iconName = "";

    if (!job.RealStart) {
        iconName = "pause_circle_filled";
    } else if (!job.RealEnd) {
        iconName = "play_circle_filled";
    } else {
        if (job.Status.includes("issues")) {
            iconName = "feedback";
        } else {
            iconName = "check_circle";
        }
    }

    return `<i class="material-icons" style="font-size: 48px;">${iconName}</i>`;
}

function renderJob(job) {
    return `
        <div class="row align-items-center my-1 ${jobStatusColour(job)} no-gutters">
            <div class="col-1 align-middle text-center">
                ${renderJobTypeIcon(job)}
            </div>
            <div class="col-3" style="font-size: 25px;">
                ${renderJobDetails(job)}
            </div>
            <div class="col-4" style="font-size: 25px;">
                ${renderCustomerDetails(job)}
            </div>
            <div class="col-3" style="font-size: 25px;">
                ${renderTimingDetails(job)}
            </div>
            <div class="col-1">
                ${jobStatusIcon(job)}
            </div>
        </div>
    `;
}

function renderWorker(worker, jobs, position) {
    return `
        <div class="row p-2 m-1 rounded border-secondary row-border">
            <div class="col-3 mr-0 pr-0">
                <div class="row"
                     style="font-size: 25px;">
                    <b>${worker}</b>
                </div>
                <div class="row" 
                    style="height: 90%; width: 100%; overflow-y: hidden;">
                    <iframe 
                        src="https://google.com/maps/embed/v1/place?key=AIzaSyD55V3pJb2XQ02l44ecXJ5VgWWE8KRk-NM&zoom=9&q=${position}"
                        style="width: 100%">
                    </iframe>
                </div>
            </div>
            <div class="col-9 mx-0 px-0">
                ${jobs.map(job => renderJob(job)).join('')}
            </div>
        </div>
    `;
}

function renderDashboard(jobs, desiredWorkers, positions) {
    let workers = {};
    let dashboard = ``;

    jobs
        .filter(job => desiredWorkers.includes(job.Resource))
        .sort(sortJobs)
        .map(job => {
            if (!workers[job.Resource]) {
                workers[job.Resource] = {};
                workers[job.Resource].jobs = [];
            }

            workers[job.Resource].jobs.push(job);
        });

    Object.keys(workers).map(key => {
        const position = positions
            .filter(resource => resource.ResourceName === key)
            .map(resource => {
                return `${resource.PositionLatitude},${resource.PositionLongitude}`;
            })
            .join('');

        dashboard += `${renderWorker(key, workers[key].jobs, position)}`;
    });

    return dashboard;
}