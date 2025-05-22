import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { forceSimulation, forceCollide, forceCenter, forceX, forceY } from "d3-force";
import { transition } from "d3-transition";

function createBubbleChart(artists = []) {
  if (!artists || artists.length === 0) return;
  // Configuration
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = document.getElementById("artists-chart").clientWidth - margin.left - margin.right;
  const height = 300;

  // Échelle pour la taille des bulles
  const rScale = scaleLinear()
    .domain([0, max(artists, d => d.popularity)])
    .range([20, 50]);

  // Nettoyer et préparer le container
  const container = select("#artists-chart");
  container.html("");

  // Créer le SVG
  const svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  // Définir les motifs pour les images d'artistes
  function createPatterns() {
    const defs = svg.append("defs");

    artists.forEach((artist, i) => {
      const pattern = defs.append("pattern")
        .attr("id", `artist-pattern-${i}`)
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox");

      // Ajouter un cercle de fond
      pattern.append("circle")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fill", "#9F7AEA");

      // Ajouter l'image de l'artiste avec un clip-path circulaire
      pattern.append("image")
        .attr("href", artist.image)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", "circle(50% at center)");
    });
  }

  // Créer la simulation de force
  const simulation = forceSimulation(artists)
    .force("x", forceX(width / 2).strength(0.05))
    .force("y", forceY(height / 2).strength(0.05))
    .force("collide", forceCollide().radius(d => rScale(d.popularity) + 2))
    .force("center", forceCenter(width / 2, height / 2));

  // Créer les bulles
  function createBubbles() {
    const bubbleGroups = svg.selectAll(".bubble-group")
      .data(artists)
      .enter()
      .append("g")
      .attr("class", "bubble-group")
      .style("cursor", "pointer");

    // Ajouter les cercles
    bubbleGroups.append("circle")
      .attr("r", d => rScale(d.popularity))
      .attr("fill", (_, i) => `url(#artist-pattern-${i})`)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("class", "artist-bubble")      .on("mouseover", function(event, d) {
        select(this)
          .transition()
          .duration(200)
          .attr("stroke", "#B794F4")
          .attr("stroke-width", 3);

        // Afficher les infos au survol
        showTooltip(d, event);
      })
      .on("mouseout", function() {
        select(this)
          .transition()
          .duration(200)
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        // Cacher le tooltip
        hideTooltip();
      });

    // Ajouter les noms des artistes
    bubbleGroups.append("text")
      .attr("dy", d => rScale(d.popularity) + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(d => d.name)
      .style("pointer-events", "none");

    // Mise à jour des positions avec la simulation
    simulation.on("tick", () => {
      bubbleGroups.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  }
  // Gestion du tooltip
  const tooltip = container.append("div");
  
  // Configuration du tooltip
  tooltip
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("z-index", "100");

  function showTooltip(d, event) {
    tooltip
      .html(`
        <strong>${d.name}</strong><br/>
        Popularité: ${d.popularity}<br/>
        ${d.genres ? `Genres: ${d.genres.join(", ")}` : ""}
      `)
      .style("visibility", "visible")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
  }

  function hideTooltip() {
    tooltip.style("visibility", "hidden");
  }

  // Initialiser le graphique
  createPatterns();
  createBubbles();
}
export { createBubbleChart };
