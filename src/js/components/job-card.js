import { toTitleCase, formatDate, formatTime } from '../utils';
import { renderFlagButton } from './flag-button';

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
    if (job.Status.includes("issues")) {
        return "report_problem";
    } else if (job.Status.includes("Completed")) {
        return "thumb_up";
    } else if (job.Status.includes("Suspended")) {
        return "pause_circle";
    } else if (!job.RealStart) {
        return "watch_later";
    } else if (!job.RealEnd) {
        return "play_arrow";
    }
}

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
        <i class="material-icons">
            ${jobTypeIcon}
        </i>
    `;
}

export function renderJobCard(job, flag, previousFlag, nextFlag) {
    return `
        <div class="job-card shadow">
            <div class="job-card-header ${jobStatusColour(job)}">
                <div class="job-card-icon">
                    ${renderJobTypeIcon(job)}
                </div>
                <div class="job-card-type">
                     ${job.Type}
                </div>
                ${ flag ?
            `
                    <div class="job-card-flag shadow" style="background-color: ${flag.colour}">
                        <i class="material-icons">flag</i> ${flag.tagName}
                        <div class="job-card-change-flag">
                        ${
            nextFlag || previousFlag
                ?
                `<fieldset>
                    <legend>Change To:</legend>
                    ${
                        renderFlagButton(job.JobId, nextFlag)
                    }
                    ${
                        renderFlagButton(job.JobId, previousFlag)
                    }
                </fieldset>
                `
                :
                ``
            }
                </div>
            </div>
            `
            :
            ''
        }
            </div>
            <div class="job-card-details">
                <div class="job-card-customer">
                    ${toTitleCase(job.Contact)}
                    <br />
                    ${job.Postcode.toUpperCase()}
                </div>
                <div class="job-card-status">
                    <div class="job-card-status-icon">
                        <i class="material-icons">${jobStatusIcon(job)}</i>
                    </div>
                    <div class="job-card-status-date">
                        ${job.PlannedStart ? formatDate(job.PlannedStart) : "NOT SCHEDULED"}
                    </div>
                    <div class="job-card-status-start">
                        S: ${job.RealStart ? formatTime(job.RealStart) : `Scheduled ${formatTime(job.PlannedStart)}`}
                    </div>
                    <div class="job-card-status-finish">
                        F: ${job.RealEnd ? formatTime(job.RealEnd) : `Scheduled ${formatTime(job.PlannedEnd)}`}
                    </div>
                </div>
            </div>
            <div class="job-card-controls">
                                   
                <button class="show-description shadow view-worksheets"
                    data-jobid="${job.JobId}"
                    data-customer="${job.Contact}"
                    data-postcode="${job.Postcode}"
                    data-jobType="${job.Type}"
                    ${job.RealEnd ? '' : 'disabled'}
                    >
                    <i class="material-icons">assignment</i> <b>Worksheets</b>
                </button>
            </div>
        </div>
    `;
}