var cht;

function renderChart(datasetLabel, labels, data, colours) {
    const chart = document.getElementById('chart');
    let ctx = chart.getContext('2d');

    removeChildren(chart);

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