import * as d3 from 'd3';
import radialBarChart from './modules/radialBarChart.js';

var data = null;
var keys = ['Rock', 'Electronic', 'Pop', 'Blues', 'Funk', 'Jazz', 'Metal', 'Hip-Hop', 'Reggae', 'Country', 'Punk', 'R&B/soul'];

function initData() {
    data = [{data: {}}];
    for(var i=0; i<keys.length; i++)
        data[0].data[keys[i]] = Math.random() * 12;
};

function update() {
    initData();

    d3.select('#chart')
        .datum(data)
        .call(chart);
}

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("slider");
    const autoPlayButton = document.getElementById("auto-play");
    let autoPlayInterval = null;

    autoPlayButton.addEventListener("click", function () {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval); // Stop if already running
            autoPlayInterval = null;
            autoPlayButton.textContent = "Auto Play";
            return;
        }

        slider.value = 10; // Reset slider to 10
        autoPlayButton.textContent = "Stop";

        autoPlayInterval = setInterval(() => {
            if (slider.value > 1) {
                slider.value = parseInt(slider.value) - 1;
                slider.dispatchEvent(new Event("input")); // Simule le changement pour mettre à jour le graphique
            } else {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
                autoPlayButton.textContent = "Auto Play";
            }
        }, 3000); // 5 secondes entre chaque descente
    });
});

//d3.select('#update').on('click', update);

d3.select('#slider').on('input', update);

var chart = radialBarChart()
    .barHeight(250)
    .reverseLayerOrder(true)
    .capitalizeLabels(true)
    .barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
    .domain([0,12])
    .tickValues([1,2,3,4,5,6,7,8,9,10,11,12])
    .tickCircleValues([1,2,3,4,5,6,7,8,9,10,11]);

update();