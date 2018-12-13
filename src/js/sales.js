import { renderChart } from './pieChart';
import { sortJobs, toTitleCase, formatDate } from './utils';
import io from 'socket.io-client';

var socket = io();
var startDate = new Date();
var endDate = new Date();
var surveyor = "";

function highlightJob(job) {
  if(job.CurrentFlag) {
    if(job.CurrentFlag.includes("SF01")) {
      return 'danger';
    } else if(job.CurrentFlag.includes("SF02")) {
      return 'warning';
    } else if(job.CurrentFlag.includes("SF03") || job.CurrentFlag.includes("SF04")) {
      return 'success';
    } else {
      return 'danger';
    }
  } else {
    return 'danger';
  }
}

function jobStatusIcon(job) {
  let icon = ""

  if(job.CurrentFlag) {
    if(job.CurrentFlag.includes("SF03")) {
      icon = "thumb_up";
    } else if(job.CurrentFlag.includes("SF02")) {
      icon = "help";
    } else if(job.CurrentFlag.includes("SF01")) {
      icon = "thumb_down";
    } else {
      icon = "report_problem";
    }
  } else {
    icon = "report_problem"; 
  }
  return `<i class="material-icons">${icon}</i>`
}

socket.on('sales', (data) => {
  const { jobs } = data;

  var sold = 0;
    var followup = 0;
    var notsold = 0;
    var notset = 0;
    var total = 0;

    document.getElementById("table").innerHTML = `
      <div class="survey-cards">
        ${jobs
        .filter(job => job.Type.includes("Survey"))
        .filter(job => job.Resource)
        .filter(job => job.Resource.includes(surveyor))
        .filter(job => job.RealStart && job.RealEnd)
        .filter(job => new Date(job.RealStart).getTime() >= startDate.getTime() && new Date(job.RealStart).getTime() <= endDate.getTime()) 
        .sort(sortJobs)
        .map((job, index) => {
          total += 1;

          if(job.CurrentFlag) {
            if(job.CurrentFlag.includes("SF01")) {
              notsold += 1;
            }

            if(job.CurrentFlag.includes("SF02")) {
              followup += 1;
            }

            if(job.CurrentFlag.includes("SF03") || job.CurrentFlag.includes("SF04")) {
              sold += 1;
            }
          } else {
            notset += 1;
          }

          return `
            <div class="survey-card">
              <div class="flag ${highlightJob(job)}">
                ${job.CurrentFlag ? job.CurrentFlag : "NOT SET"}
              </div>
              <div class="status">
                ${jobStatusIcon(job)}
              </div>
              <div class="customer">
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
        'rgb(75, 192, 192)', 
        'rgb(255, 205, 86)', 
        'rgb(255, 99, 132)', 
        'rgb(51, 51, 255)' 
      ]
    );
});

document.addEventListener("DOMContentLoaded", function() {
  const startDateField = document.getElementById('start');
  const endDateField = document.getElementById('end');
  const surveyorField = document.getElementById('surveyor'); 

  endDate.setDate(endDate.getDate() + 1);
  startDateField.valueAsDate = startDate;
  endDateField.valueAsDate = endDate;

  setInterval(() => {
      let newStartDate = startDateField.valueAsDate;
      let newEndDate = endDateField.valueAsDate;
      let newSurveyor = surveyorField.value;
    
      if(newStartDate.getTime() !== startDate.getTime() || newEndDate.getTime() !== endDate.getTime() || newSurveyor !== surveyor) {
        startDate = startDateField.valueAsDate;
        endDate = endDateField.valueAsDate;
        surveyor = surveyorField.value;
        socket.emit('get-sales');
      }
    }, 500);
});

