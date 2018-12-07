import axios from 'axios';
import $ from 'jquery';
import { dateToString, removeChildren } from './utils';
import { renderDashboard } from './dashboard';

const engineers = ["Adrian Ibbertson", "Andy Begg", "Andy MacDonald", "Dave McLaughan", "Jamie Organ", "Jimmy Rawlings", "Jordan Fletcher", "Kevin Jowett", "Stuart Kershaw"];

var selectedDate = new Date();

$(document).ready(() => {
    const dateField = document.getElementById('start');
    const fittersField = document.getElementById('fitters');

    function getData() {
        console.log("Updating from Big Change");
        axios.get(`/jb/jobs/${dateToString(selectedDate)}`).then(response => {
            axios.get('/jb/resources').then(resourcePositions => {
                const jobs = response.data.Result;
                const tracking = resourcePositions.data.Result;

                removeChildren(fittersField);
        
                fittersField.innerHTML = renderDashboard(jobs, engineers, tracking);
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        })
    }
    
    dateField.valueAsDate = selectedDate;

    setInterval(() => {
        var newDate = dateField.valueAsDate;

        if (newDate.getTime() !== selectedDate.getTime()) {
            selectedDate = dateField.valueAsDate;
            getData();
        }
    }, 1000);

    setInterval(getData, 60000);
});