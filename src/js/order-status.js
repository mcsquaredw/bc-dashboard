import io from 'socket.io-client';

import { formatDate, toTitleCase, dateToString } from './utils';

const socket = io();

function setFlag(jobId, flagId) {
    socket.emit('set-flag', {jobId, flagId});
}

function flagColour(flagName, flags) {
    return flags.map(flag => `${flag.tagName.includes(flagName) ? `${flag.colour}` : ""}`).join('');
}

function flagId(flagName, flags) {
    return flags.filter(flag => flag.tagName.includes(flagName))[0].Id;
}

function jobButton(job, flags) {
    let message = "";
    let nextHandler = "";
    let prevHandler = "";
    let colour = "";

    if(job.CurrentFlag) {
        if(job.CurrentFlag.includes("IF01")) {
            message = "Paid"
            colour = flagColour("Paid", flags);
            nextHandler = `${job.JobId},${flagId("Paid", flags)}`;
            prevHandler = `${job.JobId},${flagId("IF03", flags)}`;
        } else if(job.CurrentFlag.includes("IF03")) {
            message = "IF01: Door Arrived";
            colour = flagColour("IF01", flags);
            nextHandler = `${job.JobId},${flagId("IF01", flags)}`;
            prevHandler = `${job.JobId},${flagId("IF06", flags)}`;
        } else if(job.CurrentFlag.includes("IF06")) {
            message = "IF03: To Be Delivered";
            colour = flagColour("IF03", flags);
            nextHandler = `${job.JobId},${flagId("IF03", flags)}`;
            prevHandler = `${job.JobId},${flagId("IF02", flags)}`;
        } else if(job.CurrentFlag.includes("IF02")) {
            message = "IF06: Door to be Ack";
            colour = flagColour("IF06", flags);
            nextHandler = `${job.JobId},${flagId("IF06", flags)}`;
        }
    } else {
        message = "IF02: Door To Order";
        colour = "red";
        nextHandler = `${job.JobId},${flagId("IF02", flags)}`;
    }

    return `
        ${prevHandler !== '' ? 
            `<button onclick="changeFlag(${prevHandler})">
                <i class="material-icons">replay</i>
                Undo Last Flag
            </button>`
            :
            ``
        }
        <button onclick="changeFlag(${nextHandler})" ${message.includes("Paid") && !job.RealEnd ? "disabled" : "enabled"}>
            Change Flag to 
            <span 
                class="button-flag" 
                style="background-color:${colour}">
                ${message}
            </span>
        </button>
    `;
}

function jobMessage(job) {
    let message = "";
    if (job.CurrentFlag) {
        if (job.CurrentFlag.includes("SF03")) {
            message = `
                Surveyed ${formatDate(job.PlannedStart)} by <br />
                ${job.Resource}
            `;
        } else if (job.CurrentFlag.includes("IF02")) {
            message = `
                ${job.Type} <br />To Be Fitted ${job.PlannedStart ? formatDate(job.PlannedStart) : "NO FITTING DATE"}
            `;
        } else if (job.CurrentFlag.includes("IF06")) {
            message = `
                ${job.Type} <br /> ${job.PlannedStart ? `To Be Fitted ${formatDate(job.PlannedStart)}` : "NO FITTING DATE"}
            `;
        } else if (job.CurrentFlag.includes("IF03")) {
            message = `
                ${job.PlannedStart ? `${job.Type} <br />To Be Fitted ${formatDate(job.PlannedStart)}` : `NO FITTING DATE`}
            `;
        } else if (job.CurrentFlag.includes("IF01")) {
            if (job.RealEnd) {
                if (job.Status.includes("issues")) {
                    message = `                                
                        ${job.Type} <br />Fitted ${formatDate(job.RealEnd)}
                    `;
                } else {
                    message = `
                        ${job.Type} <br />Fitted ${formatDate(job.RealEnd)}
                    `;
                }
            } else {
                message = `
                    ${job.Type} <br />To Be Fitted ${formatDate(job.PlannedEnd)}
                `;
            }
        } else {
            message = `${job.Type}<br /> ${job.Flag}`
        }
    } else {
        message = `
            ${job.Type} - NO FLAG!
        `;
    }

    return message;
}

function renderAlertLevelIcon(job) {
    const jobDate = new Date(job.PlannedStart);
    const now = new Date();
    const diff = jobDate.getTime() - now.getTime();

    if (job.RealEnd && job.Status.includes("issues")) {
        return "feedback";
    } else if (job.RealEnd && job.Type.includes("Fitting")) {
        return "credit_card";
    } else if (job.PlannedStart && job.CurrentFlag && job.CurrentFlag.includes("IF01")) {
        return "today";
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        return "report_problem";
    } else if (diff < 14 * 24 * 60 * 60 * 1000) {
        return "help";
    } else {
        return "info";
    }
}

function renderAlertText(job) {
    const jobDate = new Date(job.PlannedStart);
    const now = new Date();
    const diff = jobDate.getTime() - now.getTime();

    if (job.RealEnd && job.Status.includes("issues")) {
        return "Completed With Issues";
    } else if (job.RealEnd && job.Type.includes("Fitting")) {
        return "Completed - Ready To Pay";
    } else if (job.PlannedStart && job.CurrentFlag && job.CurrentFlag.includes("IF01")) {
        return "Job To Be Completed";
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        return "Door Not Arrived - Less Than 7 Days to Fitting!";
    } else if (diff < 14 * 24 * 60 * 60 * 1000) {
        return "Door Not Arrived - Less than 14 Days to Fitting";
    } else {
        return "Job Proceeding";
    }
}

function renderOrderStatus(jobs, flags) {
    const container = document.getElementById("container");
    const dates = {}

    dates["No Date"] = {};
    dates["No Date"].jobs = [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    jobs
        .sort((a, b) => {
            return new Date(a.PlannedStart) - new Date(b.PlannedStart)
        })
        .map(job => {
            let dateKey = "";
            let start;

            if (job.PlannedStart) {
                dateKey = dateToString(new Date(job.PlannedStart));
                start = new Date(job.PlannedStart);
                if (!dates[dateKey]) {
                    dates[dateKey] = {};
                    dates[dateKey].jobs = [];
                }
            } else {
                dateKey = "No Date";
            }

            if (job.Type.includes("Fitting") && (job.PlannedStart && start.getTime() >= now.getTime()) && (!job.CurrentFlag || (job.CurrentFlag && !job.CurrentFlag.includes("Paid") || !job.Status.includes("Cancelled")))) {
                dates[dateKey].jobs.push(job);
            }
        });

    container.innerHTML = `${
        Object.keys(dates).sort((a, b) => ('' + a).localeCompare(b)).map(key => {
            if (dates[key].jobs.length > 0) {
                return `    
                    <h2 class="date-label">
                        ${new Date(key).toLocaleDateString("en-GB", { weekday: 'long' })} ${formatDate(new Date(key))}
                    </h2>

                    <div class="grid-cards">
                    ${dates[key].jobs
                    .map((job, index) => `
                        <div class="grid-card">
                            <div class="flag" style="background-color:${flags.map(flag => `${flag.tagName.includes(job.CurrentFlag) ? `${flag.colour}` : ""}`).join('')}${job.CurrentFlag ? `` : `red`}">                                           
                                ${job.CurrentFlag ? job.CurrentFlag : "NO FLAG"}
                            </div>
                            
                            <div class="logo">
                                <i class="material-icons">add_box</i>
                            </div>
                            
                            <div class="desc">
                                ${toTitleCase(job.Contact)} ${job.Postcode.toUpperCase()}
                            </div>

                            <div class="job">
                                ${jobMessage(job)}
                            </div>
                            
                            <div class="fitter">
                                ${job.Resource ? `To Be Fitted By <b>${job.Resource}</b>` : "NOT ASSIGNED TO FITTER"}
                            </div>
                            
                            <div class="status-icon">
                                <i class="material-icons pt-2">${renderAlertLevelIcon(job)}</i>
                            </div>

                            <div class="status">
                                ${renderAlertText(job)}
                            </div>

                            <div class="controls">
                                ${jobButton(job, flags)}
                            </div>
                        </div>
                    `).join('')}
                    </div>
                `;
            }
        }).join('')
        }`;
}

socket.on('order-status', (data) => {
    renderOrderStatus(data.jobs, data.flags);
});

document.addEventListener("DOMContentLoaded", function() {
    let oldJobId = 0;
    let oldFlagId = 0;

    setInterval(() => {
        let jobIdInput = document.getElementById("job-id");
        let flagIdInput = document.getElementById("flag-id");
        let newJobId = jobIdInput.value;
        let newFlagId = flagIdInput.value;

        if(newJobId != oldJobId || newFlagId != oldFlagId) {
            setFlag(newJobId, newFlagId);
            oldJobId = newJobId;
            oldFlagId = newFlagId;
            jobIdInput = 0;
            flagIdInput = 0;
        }

    }, 500);
});
