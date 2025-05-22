import * as d3 from 'd3';

const width = 928;
const height = 500;

// Données de co-occurrence
const cooccurrences = [
  { genre: "Rock", score: 0.14506397 },
  { genre: "Alternative/Punk", score: 0.05591893 },
  { genre: "Punk Rock", score: 0.054914497 },
  { genre: "Alternative", score: 0.050446503 },
  { genre: "Pop", score: 0.015294913 }
];

const n = cooccurrences.length; // nombre de séries
const m = 100; // points horizontaux par couche

// Échelles
const x = d3.scaleLinear().domain([0, m - 1]).range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const z = d3.interpolateCool;

// Générateur de zones (inchangé)
const area = d3.area()
  .curve(d3.curveBasis)
  .x((d, i) => x(i))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]));

// Configuration de la pile
const stack = d3.stack()
  .keys(d3.range(n))
  .offset(d3.stackOffsetWiggle);

// Générer les données à partir des scores (fixées)
function generateLayersFromScores() {
  const layersData = [];

  // Pour chaque genre, on génère une bosse centrée à un point
  cooccurrences.forEach((d, i) => {
    const layer = Array(m).fill(0);
    const center = Math.floor((i + 0.5) * m / n); // milieu de la section
    const width = 10; // largeur de la bosse
    for (let j = -width; j <= width; j++) {
      const idx = center + j;
      if (idx >= 0 && idx < m) {
        // forme en cloche, plus haute si score est grand
        layer[idx] = d.score * Math.exp(-Math.pow(j / width, 2) * 4);
      }
    }
    layersData.push(layer);
  });

  // Transposer pour correspondre à stack
  return stack(d3.transpose(layersData));
}

const layers = generateLayersFromScores();

y.domain([
  d3.min(layers, l => d3.min(l, d => d[0])),
  d3.max(layers, l => d3.max(l, d => d[1]))
]);

// Création du SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 40) // +40 pour l'axe
  .attr("viewBox", `0 0 ${width} ${height + 40}`)
  .attr("style", "max-width: 100%; height: auto;");

// Dessin des courbes
svg.selectAll("path")
  .data(layers)
  .enter()
  .append("path")
  .attr("d", area)
  .attr("fill", () => z(Math.random()));

// Ajouter un axe x simple avec les labels
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
  .style("font-size", "12px")
  .text(d => d.label);

// Ligne de base pour l'axe
svg.append("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", height + 10)
  .attr("y2", height + 10)
  .attr("stroke", "#aaa");