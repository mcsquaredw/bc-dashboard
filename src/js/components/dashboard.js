import { sortJobs, getNextFlag, getPreviousFlag, getFlagDetails } from '../utils';
import { updateDashboardDate } from '../redux/actions';
import { renderJobCard } from './job-card';

function renderWorker(worker, jobs, position, flags) {
    return `
        <div class="worker">
            <div class="location">
                <iframe src="https://google.com/maps/embed/v1/place?key=AIzaSyD55V3pJb2XQ02l44ecXJ5VgWWE8KRk-NM&zoom=9&q=${position}">
                </iframe>
            </div>
            <div class="name">${worker}</div>
            <div class="jobs">
                ${jobs.map(job => {
                    const currentFlag = getFlagDetails(job.CurrentFlag, flags)
                    const nextFlag = getNextFlag(job, flags);
                    const previousFlag = getPreviousFlag(job, flags);

                    return renderJobCard(job, currentFlag, previousFlag, nextFlag)
                }).join('')}
            </div>
        </div>
    `;
}

export function renderDashboard(target, dateFieldId, store, desiredWorkers, socket) {
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
        const position = positions
            .filter(resource => resource.ResourceName === key)
            .map(resource => {
                return `${resource.PositionLatitude},${resource.PositionLongitude}`;
            })
            .join('');

        return `${renderWorker(key, workers[key].jobs, position, flags)}`;
    }).join('');
}