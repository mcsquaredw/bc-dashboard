import { sortJobs, getNextFlag, getPreviousFlag, getFlagDetails } from '../utils';
import { updateDashboardDate } from '../redux/actions';
import { renderJobCard } from './job-card';
import moment from 'moment';

function renderWorker(worker, jobs, position, driving, flags, positionDate) {
    return `
        <div class="worker">
            <div class="name"><i class="material-icons">${driving ? 'local_shipping' : 'home'}</i> ${worker} - ${position ? `Last Reported at ${position} at ${moment(positionDate).format("HH:mm:ss")}` : `No Position Data`}</div>
            <div class="jobs">
                ${jobs.map(job => {
                    const currentFlag = getFlagDetails(job.CurrentFlag, flags)
                    const nextFlag = getNextFlag(job, flags);
                    const previousFlag = getPreviousFlag(job, flags);

                    return renderJobCard(job, currentFlag, previousFlag, nextFlag, position)
                }).join('')}
            </div>
        </div>
    `;
}

export function renderDashboard(target, dateFieldId, store, desiredWorkers) {
    const jobs = store.getState().bc.jobs;
    const positions = store.getState().bc.resources;
    const flags = store.getState().bc.flags;
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
        const positionData = positions
            .filter(resource => resource.ResourceName === key)
            .map(resource => {
                return {
                    positionAddress: resource.PositionAddress,
                    positionSpeed: resource.PositionSpeed,
                    positionDate: resource.PositionDate
                };
            })[0];

        return `${renderWorker(key, workers[key].jobs, positionData.positionAddress, (positionData.positionSpeed ? true : false) , flags, positionData.positionDate)}`;
    }).join('');
}