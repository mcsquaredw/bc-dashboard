import axios from 'axios';
import $ from 'jquery';

import { formatDate, toTitleCase, dateToString } from './utils';

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
        return "Job To Be Completed Today";
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        return "Door Not Arrived - Less Than 7 Days to Fitting!";
    } else if (diff < 14 * 24 * 60 * 60 * 1000) {
        return "Door Not Arrived - Less than 14 Days to Fitting";
    } else {
        return "Job Proceeding";
    }
}

function getData() {
    const container = document.getElementById("container");
    const dates = {}

    dates["No Date"] = {};
    dates["No Date"].jobs = [];

    console.log("Updating from Big Change");
    axios.get(`/jb/flags`).then(flagResponse => {
        const flags = flagResponse.data;

        axios.get(`/jb/all-jobs`).then(response => {
            const jobs = response.data;
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

                        <h2 class="text-center py-1 my-2 bg-secondary text-light">
                            ${new Date(key).toLocaleDateString("en-GB", { weekday: 'long' })} ${formatDate(new Date(key))}
                        </h2>
                        ${dates[key].jobs
                            .map((job, index) => `
                                <div class="card m-1" style="max-width: 25%; display:inline-block;">
                                    <div class="card-header text-light" ${flags.map(flag => `${flag.tagName.includes(job.CurrentFlag) ? `style="background-color:${flag.colour}"` : ""}`).join('')}>
                                        <b>${job.CurrentFlag ? job.CurrentFlag : "NO FLAG"}</b>
                                    </div>
                                    
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-2">
                                                <i class="material-icons">add_box</i>
                                            </div>
                                            <div class="col-10">
                                                <p>${toTitleCase(job.Contact)} ${job.Postcode.toUpperCase()}</p>
                                                <p>${jobMessage(job)}</p>
                                                <p>${job.Resource ? `To Be Fitted By <b>${job.Resource}</b>` : "NOT ASSIGNED TO FITTER"}</p>
                                                <button type="button" class="btn btn-primary ml-auto" data-toggle="modal" data-target="#jobDetails" data-jobId="${job.JobId}">
                                                    View Details...
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card-footer">
                                        <div class="row align-items-center">
                                            <div class="col-2 row-height">
                                                <i class="material-icons pt-2">${renderAlertLevelIcon(job)}</i>
                                            </div>
                                            <div class="col-10 row-height">
                                                ${renderAlertText(job)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        ).join('')}
                    `;
                    }

                }).join('')
                }`;
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}

$(document).ready(() => {
    getData();
});

