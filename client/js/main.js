import io from 'socket.io-client';
import { createStore } from 'redux';

import reducers from './redux/reducer';
import {
    newFlagData,
    newOrderData,
    newResourceData,
    newWorksheetData,
    hideWorksheetData,
    setFromTo
} from './redux/actions';
import { renderDashboard } from './components/dashboard';
import { renderOrderStatus } from './components/order-status';
import { renderSales } from './components/sales';
import { renderGDNLookup } from './components/gdn-lookup';

document.addEventListener("DOMContentLoaded", () => {
    const socket = io.connect({ secure: true });
    const store = createStore(reducers);
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

        switch (page) {
            case 'engineer-jobs':
                renderDashboard("engineer-jobs", "engineer-date", store, store.getState().bc.resources.filter(resource => resource.isEngineer).map(resource => resource.ResourceName));
                break;
            case 'surveyor-jobs':
                renderDashboard("surveyor-jobs", "surveyor-date", store, store.getState().bc.resources.filter(resource => resource.isSurveyor).map(resource => resource.ResourceName));
                break;
            case 'door-orders':
                renderOrderStatus(store);
                break;
            case 'sales':
                renderSales(store, store.getState().bc.resources.filter(resource => resource.isSurveyor).map(resource => resource.ResourceName));
                break;
            case 'gdn-contractors':
                renderGDNLookup(store);
                break;
        }

        [...document.getElementsByClassName("menu-item")].map(menuItem => {
            menuItem.classList.remove("selected");
        });

        document.getElementById(`${page}-link`).classList.add("selected");

        [...document.getElementsByClassName("controls")].map(controls => {
            controls.classList.remove("show");
        });
        
        document.getElementById(`${page}-controls`).classList.add("show");

        [...document.getElementsByClassName("view")].map(view => {
            view.classList.remove("show");
        });

        document.getElementById(`${page}`).classList.add("show");

        [...document.getElementsByClassName("job-card")].map(jobCard => {
            jobCard.onclick = (ev) => {
                const element = ev.currentTarget;
                const { jobid, customer, postcode, jobtype, workerposition, jobposition } = element.dataset;
                const modalTitle = document.getElementById("modal-title-text");
    
                modalTitle.innerHTML = `
                    ${jobtype} - ${customer} ${postcode}
                `;

                store.dispatch(setFromTo(workerposition, jobposition));
                socket.emit("get-worksheets", { jobId: jobid });
            };
        });

        [...document.getElementsByClassName("flag-button")].map(flagButton => {
            flagButton.onclick = (ev) => {
                const element = ev.currentTarget;
                const { jobid, flagid } = element.dataset;

                socket.emit("set-flag", {
                    jobid, 
                    flagid
                });
            }
        })
    }

    function renderQuestion(question) {
        let element;

        if(question.AnswerPhoto) {
            element = `<img width="400" height="224" src="data:image/png;base64, ${question.AnswerPhoto}" />`;
        } else if(question.AnswerText === "true") {
            element = `Yes`;
        } else if(question.AnswerText === "false") {
            element = `No`;
        } else {
            element = `${question.AnswerText}`;
        }

        return `
            <div class="question">
                <div class="qn">
                    ${question.Question}
                </div>
                <div class="answer">
                    ${element}
                </div>
            </div>
        `;
    }

    function updateWorksheetModal() {
        const modal = document.getElementById("modal");
        const modalTarget = document.getElementById("modal-target");
        const { worksheets, show, from, to } = store.getState().ws;

        if(show) {
            modalTarget.innerHTML = `
                <iframe frameborder="0" 
                        style="border:0"
                        src="https://www.google.com/maps/embed/v1/directions?origin=${from.replace(/ /g, "+")}&destination=${to.replace(/ /g, "+")}&key=AIzaSyD55V3pJb2XQ02l44ecXJ5VgWWE8KRk-NM" 
                        allowfullscreen>
                </iframe> 
                ${worksheets.length > 0 ?
                    worksheets.sort((a, b) => {
                        return a.QuestionOrder - b.QuestionOrder;
                    }).map(question => renderQuestion(question)).join('')
                : 
                    "No Worksheet Data"
                }
            `;

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


