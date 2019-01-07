import { changeSearchText, changeSearchFlag } from '../redux/actions';
import { formatDate, toTitleCase, dateToString, getFlagDetails } from '../utils';

function jobButton(job, flags) {
    let nextFlag;
    let previousFlag;

    if (job.CurrentFlag) {
        if (job.CurrentFlag.includes("IF01")) {
            nextFlag = getFlagDetails("Paid", flags);
            previousFlag = getFlagDetails("IF03", flags);
        } else if (job.CurrentFlag.includes("IF03")) {
            nextFlag = getFlagDetails("IF01", flags);
            previousFlag = getFlagDetails("IF06", flags);
        } else if (job.CurrentFlag.includes("IF06", flags)) {
            nextFlag = getFlagDetails("IF03", flags);
            previousFlag = getFlagDetails("IF02", flags);
        } else if (job.CurrentFlag.includes("IF02", flags)) {
            nextFlag = getFlagDetails("IF06", flags);
        }
    } else {
        nextFlag = getFlagDetails("IF02", flags);
    }

    return `
        ${previousFlag ?
            `<button data-job-id="${job.JobId}" data-flag-id="${previousFlag.Id}" class="changeFlagButton">
                <i class="material-icons">replay</i>
                Undo Last Flag
            </button>`
            :
            ``
        }
        <button data-job-id="${job.JobId}" data-flag-id="${nextFlag.Id}" ${nextFlag.tagName.includes("Paid") && !job.RealEnd ? "disabled" : "enabled"} class="changeFlagButton">
            Change Flag to 
            <span 
                class="button-flag" 
                style="background-color:${nextFlag.colour}">
                ${nextFlag.tagName}
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

export function renderOrderStatus(store, socket) {
    const dates = {};
    const jobs = store.getState().bc.jobs;
    const flags = store.getState().bc.flags;
    const searchText = store.getState().orderStatus.searchText;
    const searchFlag = store.getState().orderStatus.searchFlag;
    const searchTextInput = document.getElementById("dashboard-search");
    const searchFlagInput = document.getElementById("dashboard-flag");
    const now = new Date(new Date().setHours(0, 0, 0, 0));
    const container = document.getElementById("door-orders");

    searchTextInput.onkeyup = (ev) => {
        store.dispatch(changeSearchText(searchTextInput.value));
    };

    searchFlagInput.onchange = (ev) => {
        store.dispatch(changeSearchFlag(searchFlagInput.value));
    };

    dates["No Date"] = {};
    dates["No Date"].jobs = [];

    jobs
        .filter(job => !job.Status.includes("Cancelled"))
        .filter(job => job.Type.includes("Fitting"))
        .filter(job => new Date(job.PlannedStart).getTime() >= now.getTime())
        .filter(job => searchText !== "" ? job.Contact.toUpperCase().includes(searchText.toUpperCase()) || job.Postcode.toUpperCase().includes(searchText.toUpperCase()) : true)
        .filter(job => searchFlag !== "" ? job.CurrentFlag && job.CurrentFlag.includes(searchFlag) : true)
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

            if (!job.CurrentFlag || !job.CurrentFlag.includes("Paid")) {
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
                                <i style="font-size: 48px;" class="material-icons">add_box</i>
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

                            <div class="job-controls">
                                ${jobButton(job, flags)}
                            </div>
                        </div>
                    `).join('')}
                    </div>
                `;
            }
        }).join('')
        }`;

    [...document.getElementsByClassName("changeFlagButton")].map(button => {
        button.onclick = (ev) => {
            const flagId = ev.target.getAttribute("data-flag-id");
            const jobId = ev.target.getAttribute("data-job-id");

            socket.emit('set-flag', { jobId, flagId });
        };
    });
}
