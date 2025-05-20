import * as d3 from 'd3';

const width = 928;
const height = 500;
const n = 20, m = 200, k = 10;

// Création des échelles
const x = d3.scaleLinear().domain([0, m - 1]).range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const z = d3.interpolateCool;

// Générateur de zones (area) avec interpolation fluide
const area = d3.area()
    .curve(d3.curveBasis)
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

// Configuration de la pile (stack) pour créer le streamgraph
const stack = d3.stack()
    .keys(d3.range(n))
    .offset(d3.stackOffsetWiggle);

// Fonction générant des "bumps" inspirée de Lee Byron
function bumpsGenerator() {
    // Fonction bump qui ajoute une "bosse" dans le tableau a
    function bump(a, n) {
        const x = 1 / (0.1 + Math.random());
        const y = 2 * Math.random() - 0.5;
        const z = 10 / (0.1 + Math.random());
        for (let i = 0; i < n; ++i) {
          const w = (i / n - y) * z;
          a[i] += x * Math.exp(-w * w);
        }
    }
    // Fonction retournant un tableau de m valeurs
    return function bumps(n, m) {
        const a = new Array(n).fill(0);
        for (let i = 0; i < m; ++i) {
          bump(a, n);
        }
        return a;
    };
}
const generateBumps = bumpsGenerator();

// Fonction pour générer de nouvelles couches de données
function randomize() {
    // Génère un tableau de n séries, chacune constituée de m valeurs
    const layers = stack(d3.transpose(Array.from({ length: n }, () => generateBumps(m, k))));
    // Mise à jour du domaine de l'échelle y en fonction des valeurs minimales et maximales
    y.domain([
        d3.min(layers, l => d3.min(l, d => d[0])),
        d3.max(layers, l => d3.max(l, d => d[1]))
    ]);
    return layers;
}

// Création de l'élément SVG dans le conteneur #chart
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("style", "max-width: 100%; height: auto;");

// Initialisation des données et affichage des chemins
let layers = randomize();
const paths = svg.selectAll("path")
    .data(layers)
    .enter()
    .append("path")
    .attr("d", area)
    .attr("fill", () => z(Math.random()));

// Ajout d'un écouteur sur le bouton pour déclencher la transition
document.getElementById("transitionButton").addEventListener("click", () => {
    layers = randomize();
    paths.data(layers)
        .transition()
        .duration(1500)
        .attr("d", area);
});