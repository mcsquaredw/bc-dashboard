import { renderDashboard } from './dashboard';
import io from 'socket.io-client';

const surveyors = ["Andy Marshall", "Darren Baker", "Jason Housby"];

document.addEventListener("DOMContentLoaded", function() {
    const surveyorsField = document.getElementById('surveyors');
    var socket = io();

    socket.on('dashboard-data', (data) => {
        surveyorsField.innerHTML = renderDashboard(data.jobs, surveyors, data.resources);
    });
});