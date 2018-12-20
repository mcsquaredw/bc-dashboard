import io from 'socket.io-client';
import { createStore } from 'redux';

import reducers from './redux/reducer';
import {
    newFlagData,
    newOrderData,
    newResourceData,
    newWorksheetData,
    hideWorksheetData
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
    const modalClose = document.getElementById("modal-close");

    modalClose.onclick = (ev) => {
        store.dispatch(hideWorksheetData());
    };

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

    socket.on('worksheets', (data) => {
        store.dispatch(newWorksheetData(data.worksheets));
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
                renderDashboard(container, store, engineers, socket);
                break;
            case 'surveyor-jobs':
                renderDashboard(container, store, surveyors, store);
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

    function renderQuestion(question) {
        return `
            <div class="question-qn">
                ${question.Question}
            </div>
            <div class="question-answer">
                ${question.AnswerText}
            </div>
        `;
    }

    function updateWorksheetModal() {
        const modal = document.getElementById("modal");
        const modalTarget = document.getElementById("modal-target");
        const { worksheets, show } = store.getState().ws;

        if(show) {
            if(worksheets.length > 0) {
                modalTarget.innerHTML = `
                    ${worksheets.map(question => renderQuestion(question)).join('')}
                `;
            } else {
                modalTarget.innerHTML = `No Worksheet Data`;
            }

            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    }

    store.subscribe(updatePage);
    store.subscribe(updateWorksheetModal);

    function renderPage(ev) {
        if (window.location.hash.length > 0) {
            updatePage();
        } else {
            location.href = "#engineer-jobs";
        }
    }
});


