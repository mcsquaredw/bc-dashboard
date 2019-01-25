import { renderChart } from './pieChart';
import { sortJobs, getFlagDetails, getNextFlag, getPreviousFlag } from '../utils';
import { changeSalesFilters } from '../redux/actions';
import { renderJobCard } from './job-card';

export function renderSales(store, surveyors) {
  const jobs = store.getState().bc.jobs;
  const flags = store.getState().bc.flags;
  const container = document.getElementById("sales");
  const startDateField = document.getElementById('sales-start');
  const endDateField = document.getElementById('sales-end');
  const surveyorField = document.getElementById('sales-surveyor');
  var sold = 0;
  var followup = 0;
  var notsold = 0;
  var notset = 0;
  var total = 0;
  let startDate = new Date(new Date(store.getState().sales.start).setHours(0, 0, 0, 0)).getTime();
  let endDate = new Date(new Date(store.getState().sales.end).setHours(23, 59, 59, 999)).getTime();

  surveyorField.innerHTML = `${surveyors.map(surveyor => `<option value="${surveyor}">${surveyor}</surveyor>`).join('')}`;

  startDateField.onchange = (ev) => {
    store.dispatch(changeSalesFilters(startDateField.valueAsDate, endDateField.valueAsDate, surveyorField.value));
  };
  endDateField.onchange = (ev) => {
    store.dispatch(changeSalesFilters(startDateField.valueAsDate, endDateField.valueAsDate, surveyorField.value));
  };
  surveyorField.onchange = (ev) => {
    store.dispatch(changeSalesFilters(startDateField.valueAsDate, endDateField.valueAsDate, surveyorField.value));
  };

  startDateField.valueAsDate = store.getState().sales.start;
  endDateField.valueAsDate = store.getState().sales.end;
  surveyorField.value = store.getState().sales.surveyor;

  container.innerHTML = `
    <div id="sales-container">
      <div id="chart">
        <canvas id="chartCanvas"></canvas>
      </div>
      <div id="table">
      </div>
    </div>
  `;
  


  document.getElementById("table").innerHTML = `
    <div class="survey-cards">
      ${jobs
      .filter(job => job.Type.includes("Survey"))
      .filter(job => job.Resource)
      .filter(job => job.Resource.includes(store.getState().sales.surveyor))
      .filter(job => job.RealStart && job.RealEnd)
      .filter(job => new Date(job.RealStart).getTime() >= startDate && new Date(job.RealStart).getTime() <= endDate)
      .sort(sortJobs)
      .map(job => {
        const currentFlag = getFlagDetails(job.CurrentFlag, flags)
        const nextFlag = getNextFlag(job, flags);
        const previousFlag = getPreviousFlag(job, flags);

        total += 1;

        if (job.CurrentFlag) {
          if (job.CurrentFlag.includes("SF01")) {
            notsold += 1;
          }

          if (job.CurrentFlag.includes("SF02")) {
            followup += 1;
          }

          if (job.CurrentFlag.includes("SF03") || job.CurrentFlag.includes("SF04")) {
            sold += 1;
          }
        } else {
          notset += 1;
        }

        return `
          ${
            renderJobCard(job, currentFlag, previousFlag, nextFlag)
          }
        `;
      }).join('')}
    </div>
  `;
  renderChart(
    document.getElementById('chartCanvas'),
    "Sales Report",
    [
      `Sold (${sold} Sales) ${(sold / total * 100).toFixed(2)}%`,
      `To Follow Up (${followup} Sales) ${(followup / total * 100).toFixed(2)}%`,
      `Not Sold (${notsold} Sales) ${(notsold / total * 100).toFixed(2)}%`,
      `Not Set (${notset} Sales) ${(notset / total * 100).toFixed(2)}%`
    ],
    [
      sold,
      followup,
      notsold,
      notset
    ],
    [
      'rgb(255, 255, 0)',
      'rgb(30, 144, 255)',
      'rgb(0, 0, 0)',
      'rgb(255, 0, 0)'
    ]
  );
}

