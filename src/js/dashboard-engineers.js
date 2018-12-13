import { renderDashboard } from './dashboard';
import io from 'socket.io-client';

const engineers = ["Adrian Ibbertson", "Andy Begg", "Andy MacDonald", "Dave McLaughan", "Jamie Organ", "Jimmy Rawlings", "Jordan Fletcher", "Kevin Jowett", "Stuart Kershaw"];

document.addEventListener("DOMContentLoaded", function() {
    const fittersField = document.getElementById('fitters');
    var socket = io();

    socket.on('dashboard-data', (data) => {
        fittersField.innerHTML = renderDashboard(data.jobs, engineers, data.resources);
    });
});