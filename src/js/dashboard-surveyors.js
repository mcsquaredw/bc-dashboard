import { renderDashboard } from './dashboard';
import io from 'socket.io-client';

const socket = io();
const surveyors = ["Andy Marshall", "Darren Baker", "Jason Housby"];

socket.on('dashboard-data', (data) => {
    console.log('New Data Received');
    const surveyorsField = document.getElementById('surveyors');
    surveyorsField.innerHTML = renderDashboard(data.jobs, surveyors, data.resources);
});