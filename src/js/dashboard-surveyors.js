import axios from 'axios';
import $ from 'jquery';
import { dateToString, removeChildren } from './utils';
import { renderDashboard } from './dashboard';

const surveyors = ["Andy Marshall", "Darren Baker", "Jason Housby"];

var selectedDate = new Date();

$(document).ready(() => {
    const dateField = document.getElementById('start');
    const surveysField = document.getElementById('surveys');

    function getData() {
        console.log("Updating from Big Change");
        axios.get(`/jb/all-jobs`).then(response => {
            axios.get('/jb/resources').then(resourcePositions => {
                const jobs = response.data;
                const tracking = resourcePositions.data;

                removeChildren(surveysField);
        
                surveysField.innerHTML = renderDashboard(jobs, surveyors, tracking);
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        })
    }
    
    dateField.valueAsDate = selectedDate;

    getData();

    setInterval(() => {
        var newDate = dateField.valueAsDate;

        if (newDate.getTime() !== selectedDate.getTime()) {
            selectedDate = dateField.valueAsDate;
            getData();
        }
    }, 1000);

    setInterval(getData, 60000);
});