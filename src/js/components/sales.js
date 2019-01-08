import { renderChart } from './pieChart';
import { sortJobs, toTitleCase, formatDate, getFlagDetails } from '../utils';
import { changeSalesFilters } from '../redux/actions';

function highlightJob(job, flags) {
  if (job.CurrentFlag) {
    let flag = getFlagDetails(job.CurrentFlag, flags);

    return flag.colour;
  } else {
    return 'red';
  }
}

function jobStatusIcon(job) {
  let icon = ""

  if (job.CurrentFlag) {
    if (job.CurrentFlag.includes("SF03")) {
      icon = "thumb_up";
    } else if (job.CurrentFlag.includes("SF02")) {
      icon = "help";
    } else if (job.CurrentFlag.includes("SF01")) {
      icon = "thumb_down";
    } else {
      icon = "report_problem";
    }
  } else {
    icon = "report_problem";
  }
  return `<i class="material-icons">${icon}</i>`
}

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
  
  let startDate = new Date(new Date(store.getState().sales.start).setHours(0, 0, 0, 0)).getTime();
  let endDate = new Date(new Date(store.getState().sales.end).setHours(23, 59, 59, 999)).getTime();

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
          <div class="survey-card">
            <div class="flag" style="background-color:${highlightJob(job, flags)}">
              ${job.CurrentFlag ? job.CurrentFlag : "NOT SET"}
            </div>
            <div class="status">
              ${jobStatusIcon(job)}
            </div>
            <div class="sales-customer">
              ${job.Contact ? toTitleCase(job.Contact) + "<br />" + job.Postcode : "NOT SET"}
            </div>
            <div class="date">
              Survey Date: <b>${formatDate(job.PlannedStart)}</b>
            </div>
          </div>
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

