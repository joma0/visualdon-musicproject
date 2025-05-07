import * as d3 from 'd3';

export default function radialBarChart() {
    let barHeight = 250;
    let reverseLayerOrder = true;
    let capitalizeLabels = true;
    let barColors = ['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'];
    let domain = [0, 12];
    let tickValues = [1,2,3,4,5,6,7,8,9,10,11,12];
    let tickCircleValues = [1,2,3,4,5,6,7,8,9,10,11];
    let clickCallback = null;

    function chart(selection) {
        selection.each(function(data) {
            // Configuration de base avec hauteur dynamique
            const containerHeight = window.innerHeight;
            const width = Math.min(window.innerWidth * 0.8, containerHeight * 0.8, 1000);
            const height = width; // Garde le ratio carré
            const innerRadius = Math.min(width, height) * 0.1;
            const outerRadius = Math.min(width, height) * 0.45; // Réduit légèrement pour éviter tout débordement
            
            // Nettoyer le SVG existant
            d3.select(this).select('svg').remove();

            // Créer le nouveau SVG avec dimensions adaptatives
            const svg = d3.select(this)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('margin', 'auto') // Centre le SVG horizontalement
                .append('g')
                .attr('transform', `translate(${width/2},${height/2})`);

            // Ajuster la taille lors du redimensionnement de la fenêtre
            const resizeChart = () => {
                const newContainerHeight = window.innerHeight;
                const newWidth = Math.min(window.innerWidth * 0.8, newContainerHeight * 0.8, 1000);
                svg.attr('width', newWidth)
                   .attr('height', newWidth);
            };

            window.addEventListener('resize', resizeChart);

            // Échelles
            const x = d3.scaleBand()
                .range([0, 2 * Math.PI])
                .align(0)
                .domain(Object.keys(data[0].data));

            const y = d3.scaleLinear()
                .range([innerRadius, outerRadius])
                .domain(domain);

            // Grille circulaire
            const yAxis = svg.append('g')
                .attr('class', 'grid-lines');

            tickCircleValues.forEach(r => {
                yAxis.append('circle')
                    .attr('r', y(r))
                    .attr('class', 'grid-circle')
                    .style('fill', 'none')
                    .style('stroke', 'rgba(255,255,255,0.1)')
                    .style('stroke-width', 0.5);
            });

            // Création des barres
            const bars = svg.append('g')
                .selectAll('path')
                .data(Object.entries(data[0].data))
                .enter()
                .append('path')
                .attr('class', 'bar')
                .style('fill', (d, i) => barColors[i % barColors.length])
                .style('cursor', 'pointer')
                .attr('d', d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(d => y(d[1]))
                    .startAngle(d => x(d[0]))
                    .endAngle(d => x(d[0]) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius))
                .on('mouseover', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style('filter', 'brightness(1.2)');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style('filter', 'none');
                })
                .on('click', function(event, d) {
                    if (clickCallback) {
                        clickCallback({
                            name: d[0],
                            value: d[1]
                        });
                    }
                });

            // Étiquettes
            const labels = svg.append('g')
                .selectAll('g')
                .data(Object.entries(data[0].data))
                .enter()
                .append('g')
                .attr('transform', d => {
                    const angle = x(d[0]) + x.bandwidth() / 2;
                    return `rotate(${(angle * 180 / Math.PI - 90)})`;
                });

            labels.append('text')
                .attr('x', outerRadius + 10)
                .attr('dy', '.35em')
                .style('text-anchor', 'start')
                .style('font-size', '12px')
                .style('fill', 'white')
                .text(d => capitalizeLabels ? d[0].toUpperCase() : d[0])
                .attr('transform', function(d) {
                    const angle = x(d[0]) + x.bandwidth() / 2;
                    return angle > Math.PI ? 'rotate(180) translate(-16)' : null;
                });
        });
    }

    // Setters
    chart.barHeight = function(value) {
        if (!arguments.length) return barHeight;
        barHeight = value;
        return chart;
    };

    chart.reverseLayerOrder = function(value) {
        if (!arguments.length) return reverseLayerOrder;
        reverseLayerOrder = value;
        return chart;
    };

    chart.capitalizeLabels = function(value) {
        if (!arguments.length) return capitalizeLabels;
        capitalizeLabels = value;
        return chart;
    };

    chart.barColors = function(value) {
        if (!arguments.length) return barColors;
        barColors = value;
        return chart;
    };

    chart.domain = function(value) {
        if (!arguments.length) return domain;
        domain = value;
        return chart;
    };

    chart.tickValues = function(value) {
        if (!arguments.length) return tickValues;
        tickValues = value;
        return chart;
    };

    chart.tickCircleValues = function(value) {
        if (!arguments.length) return tickCircleValues;
        tickCircleValues = value;
        return chart;
    };

    chart.onClick = function(callback) {
        if (!arguments.length) return clickCallback;
        clickCallback = callback;
        return chart;
    };

    return chart;
}
