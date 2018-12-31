import io from 'socket.io-client';
import { createStore } from 'redux';

import reducers from './redux/reducer';
import {
    newFlagData,
    newOrderData,
    newResourceData
} from './redux/actions';
import { renderDashboard } from './components/dashboard';
import { renderOrderStatus } from './components/order-status';
import { renderSales } from './components/sales';
import { renderGDNLookup } from './components/gdn-lookup';

const engineers = [
    "Adrian Ibbertson",
    "Andy Begg",
    "Andy MacDonald",
    "Dave McLaughan",
    "Jamie Organ",
    "Jimmy Rawlings",
    "Jordan Fletcher",
    "Kevin Jowett",
    "Stuart Kershaw"
];

const surveyors = [
    "Andy Marshall",
    "Darren Baker",
    "Jason Housby"
];

document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const store = createStore(reducers);
    const container = document.getElementById("container");
    const controls = document.getElementById("controls");

    window.onhashchange = renderPage;

    socket.on('orders', (data) => {
        store.dispatch(newOrderData(data.jobs));
    });

    socket.on('resources', (data) => {
        store.dispatch(newResourceData(data.resources));
    });

    socket.on('flags', (data) => {
        store.dispatch(newFlagData(data.flags));
    });

    if (window.location.hash.length === 0) {
        window.location.hash = "engineer-jobs";
    }

    function updatePage() {
        const page = window.location.hash.substr(1);

        container.innerHTML = "";
        controls.innerHTML = "";

        switch (page) {
            case 'engineer-jobs':
                renderDashboard(container, store, engineers);
                break;
            case 'surveyor-jobs':
                renderDashboard(container, store, surveyors);
                break;
            case 'door-orders':
                renderOrderStatus(container, controls, store, socket);
                break;
            case 'sales':
                renderSales(container, controls, store);
                break;
            case 'gdn-contractors':
                renderGDNLookup(container, controls, store);
                break;

        }
    }

    store.subscribe(updatePage);

    function renderPage(ev) {
        if (window.location.hash.length > 0) {
            updatePage();
        } else {
            location.href = "#engineer-jobs";
        }
    }
});


