import { removeChildren } from './utils';
import Chart from 'chart.js';

var cht;

export function renderChart(chartCanvas, datasetLabel, labels, data, colours) {
    let ctx = chartCanvas.getContext('2d');

    removeChildren(chartCanvas);

    if(cht) {
        cht.destroy();
    }

    cht = new Chart(ctx, {
        type: 'pie',

        data: {
            labels,
            datasets: [{
                label: datasetLabel,
                data,
                backgroundColor: colours 
            }]
        },

        options: {
            legend: {
                labels: {
                    fontSize: 18
                }
            }
        }
    });
}