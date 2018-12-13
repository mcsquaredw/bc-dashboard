import { renderDashboard } from './dashboard';
import io from 'socket.io-client';

const socket = io();
const engineers = ["Adrian Ibbertson", "Andy Begg", "Andy MacDonald", "Dave McLaughan", "Jamie Organ", "Jimmy Rawlings", "Jordan Fletcher", "Kevin Jowett", "Stuart Kershaw"];

socket.on('dashboard-data', (data) => {
    console.log('New Data Received');
    const fittersField = document.getElementById('fitters');
    fittersField.innerHTML = renderDashboard(data.jobs, engineers, data.resources);
});