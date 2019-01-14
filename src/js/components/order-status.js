import { changeSearchText, changeSearchFlag } from '../redux/actions';
import { formatDate, dateToString, getFlagDetails, getNextFlag, getPreviousFlag } from '../utils';
import { renderJobCard } from './job-card';

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
                    <h2 class="order-status-date-label">
                        ${new Date(key).toLocaleDateString("en-GB", { weekday: 'long' })} ${formatDate(new Date(key))}
                    </h2>

                    <div class="order-status-grid">
                    ${dates[key].jobs
                        .map((job) => {
                            const currentFlag = getFlagDetails(job.CurrentFlag, flags)
                            const nextFlag = getNextFlag(job, flags);
                            const previousFlag = getPreviousFlag(job, flags);

                            return renderJobCard(job, currentFlag, previousFlag, nextFlag)
                        }).join('')}
                    </div>
                `;
            }
        }).join('')
    }`;
}
