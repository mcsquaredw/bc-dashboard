import { sortJobs, toTitleCase, formatTime } from '../utils';
import { updateDashboardDate } from '../redux/actions';

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
      <button class="view-worksheets" 
        ${job.RealEnd ? '' : 'disabled'}
              data-job-id="${job.JobId}" 
              data-customer="${job.Contact}"
              data-postcode="${job.Postcode}"
              data-job-type="${job.Type}"
      >
        <i class="material-icons mt-2" style="font-size: 48px;"
            data-job-id="${job.JobId}" 
            data-customer="${job.Contact}"
            data-postcode="${job.Postcode}"
            data-job-type="${job.Type}"
        >${jobTypeIcon}</i>
      </button>
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
      <b>
        ${toTitleCase(job.Contact)}
        ${job.Postcode.toUpperCase()}
      </b>
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
        label = `Started ${formatTime(job.RealStart)} - Finished ${formatTime(job.RealEnd)}`;
    }

    return `
        <div class="timing-icon">
            <i class="material-icons" style="font-size: 25px;">${iconName}</i>
        </div>
        <div class="timing-label">
            ${label}
        </div>
        <div class="timing-icon2">
            <i class="material-icons" style="font-size: 25px;">${iconName}</i>
        </div>
    `;
}

function jobStatusColour(job) {
    if (!job.RealStart) {
        return "danger";
    } else if (!job.RealEnd) {
        return "warning";
    } else {
        if (job.Status.includes("issues")) {
            return "info";
        } else {
            return "success";
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
        <div class="job-card">
            <div class="header ${jobStatusColour(job)}">
                <div class="type-icon">
                    ${renderJobTypeIcon(job)}
                </div>
                <div class="type">
                    ${renderJobDetails(job)}
                </div>
                <div class="status">
                    ${jobStatusIcon(job)}
                </div>
            </div>
            <div class="customer">
                ${renderCustomerDetails(job)}
            </div>
            <div class="timing">
                ${renderTimingDetails(job)}
            </div>
        </div>
    `;
}

function renderWorker(worker, jobs, position) {
    return `
        <div class="worker">
            <div class="location">
                <iframe src="https://google.com/maps/embed/v1/place?key=AIzaSyD55V3pJb2XQ02l44ecXJ5VgWWE8KRk-NM&zoom=9&q=${position}">
                </iframe>
            </div>
            <div class="name">${worker}</div>
            <div class="jobs">
                ${jobs.map(job => renderJob(job)).join('')}
            </div>
        </div>
    `;
}

export function renderDashboard(target, dateFieldId, store, desiredWorkers, socket) {
    const jobs = store.getState().bc.jobs;
    const positions = store.getState().bc.resources;
    const container = document.getElementById(target);
    const dateField = document.getElementById(dateFieldId);

    dateField.valueAsDate = store.getState().bc.dashboardDate;
    
    dateField.onchange = (ev) => {
        store.dispatch(updateDashboardDate(dateField.valueAsDate));
    };

    let workers = {};
    let now = new Date(new Date(dateField.valueAsDate).setHours(0, 0, 0, 0));
    let later = new Date(new Date(dateField.valueAsDate).setHours(23, 59, 59, 999));

    jobs
        .filter(job => desiredWorkers.includes(job.Resource))
        .filter(job => job.PlannedStart)
        .filter(job => new Date(job.PlannedStart).getTime() >= now.getTime())
        .filter(job => new Date(job.PlannedStart).getTime() <= later.getTime())
        .sort(sortJobs)
        .map(job => {
            if (!workers[job.Resource]) {
                workers[job.Resource] = {};
                workers[job.Resource].jobs = [];
            }

            workers[job.Resource].jobs.push(job);
        });

    container.innerHTML = Object.keys(workers).map(key => {
        const position = positions
            .filter(resource => resource.ResourceName === key)
            .map(resource => {
                return `${resource.PositionLatitude},${resource.PositionLongitude}`;
            })
            .join('');

        return `${renderWorker(key, workers[key].jobs, position)}`;
    }).join('');

    [...document.getElementsByClassName("view-worksheets")].map(jobCard => {
        jobCard.addEventListener('click', (ev) => {
            console.log(ev.target);
            const jobId = ev.target.getAttribute("data-job-id");
            const customer = ev.target.getAttribute("data-customer");
            const postcode = ev.target.getAttribute("data-postcode");
            const jobType = ev.target.getAttribute("data-job-type");
            const modalTitle = document.getElementById("modal-title-text");

            console.log(jobId, customer, postcode, jobType);

            modalTitle.innerHTML = `
                ${jobType} - ${customer} ${postcode}
            `;

            socket.emit("get-worksheets", { jobId });
        });
    });
}