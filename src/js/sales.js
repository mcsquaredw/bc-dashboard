import axios from 'axios';
import $ from 'jquery';

import { renderChart } from './pieChart';
import { dateToString, removeChildren, sortJobs, formatDate } from './utils';
import { now } from 'moment';

var startDate = new Date();
var endDate = new Date();
var surveyor = "";

function highlightJob(job) {
  if(job.CurrentFlag) {
    if(job.CurrentFlag.includes("SF01")) {
      return 'table-danger';
    }

    if(job.CurrentFlag.includes("SF02")) {
      return 'table-warning';
    }

    if(job.CurrentFlag.includes("SF03") || job.CurrentFlag.includes("SF04")) {
      return 'table-success';
    }
  } else {
    return 'table-danger text-danger';
  }
}

function getData() {
  console.log("Updating from Big Change");

  axios.get(`/jb/all-jobs`).then(response => {
    const data = response.data;

    var sold = 0;
    var followup = 0;
    var notsold = 0;
    var notset = 0;
    var total = 0;

    jobs.innerHTML = data
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
          <tr class="${highlightJob(job)}">
            <td>${job.Contact ? job.Contact + " " + job.Postcode : "NOT SET"}</td>
            <td>${job.CurrentFlag ? job.CurrentFlag : "NOT SET"}</td>
            <td>${job.PlannedStart ? formatDate(job.PlannedStart) : "NOT SET"}</td>
          </tr>
        `;
    }).join('');

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
  }).catch(err => {
    console.log(err);
  });   
}

$(document).ready(() => {
  var startDateField = document.getElementById('start');
  var endDateField = document.getElementById('end');
  var surveyorField = document.getElementById('surveyor'); 
  endDate.setDate(endDate.getDate() + 1);
  startDateField.valueAsDate = startDate;
  endDateField.valueAsDate = endDate;

  setInterval(() => {
      var newStartDate = startDateField.valueAsDate;
      var newEndDate = endDateField.valueAsDate;
      var newSurveyor = surveyorField.value;
    
      if(newStartDate.getTime() !== startDate.getTime() || newEndDate.getTime() !== endDate.getTime() || newSurveyor !== surveyor) {
        startDate = startDateField.valueAsDate;
        endDate = endDateField.valueAsDate;
        surveyor = surveyorField.value;
        getData();
      }
    }, 1000);

  getData();
});

