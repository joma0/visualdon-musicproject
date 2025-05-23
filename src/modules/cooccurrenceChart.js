// src/modules/cooccurrenceChart.js
import * as d3 from 'd3';

export function renderCooccurrenceChart(cooccurrences) {
  const width = 928;
  const height = 250;
  const n = cooccurrences.length;
  const m = 100;

  // Nettoyer l'ancien graphique
  d3.select("#influences-chart").selectAll("*").remove();

  const x = d3.scaleLinear().domain([0, m - 1]).range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const z = d3.interpolateCool;

  const area = d3.area()
    .curve(d3.curveBasis)
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  const stack = d3.stack()
    .keys(d3.range(n))
    .offset(d3.stackOffsetWiggle);

  const layersData = cooccurrences.map((d, i) => {
    const layer = Array(m).fill(0);
    const center = Math.floor((i + 0.5) * m / n);
    const w = 10;
    for (let j = -w; j <= w; j++) {
      const idx = center + j;
      if (idx >= 0 && idx < m) {
        layer[idx] = d.score * Math.exp(-Math.pow(j / w, 2) * 4);
      }
    }
    return layer;
  });

  const layers = stack(d3.transpose(layersData));

  y.domain([
    d3.min(layers, l => d3.min(l, d => d[0])),
    d3.max(layers, l => d3.max(l, d => d[1]))
  ]);

  const svg = d3.select("#influences-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 40)
    .attr("viewBox", `0 0 ${width} ${height + 40}`)
    .style("max-width", "100%")
    .style("height", "auto");

  svg.selectAll("path")
    .data(layers)
    .enter()
    .append("path")
    .attr("d", area)
    .attr("fill", () => z(Math.random()));

  const xAxisLabels = cooccurrences.map((d, i) => ({
    label: d.genre,
    x: (i + 0.5) * width / n
  }));

  svg.selectAll("text.axis-label")
  .data(xAxisLabels)
  .enter()
  .append("text")
  .attr("class", "axis-label")
  .attr("x", d => d.x)
  .attr("y", height + 30)
  .attr("text-anchor", "middle")
  .style("font-size", "16px") // taille augmentée
  .style("fill", "white")     // couleur blanche
  .style("font-weight", "bold") // (optionnel)
  .text(d => d.label);
}