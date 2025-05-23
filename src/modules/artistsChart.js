import * as d3 from "d3";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { max, min } from "d3-array";
import {
  forceSimulation,
  forceCollide,
  forceCenter,
  forceManyBody,
} from "d3-force";

function createBubbleChart(subgenres) {
  //Données
  const data = subgenres;
  const allArtists = data
    .filter((subgenre) => subgenre.artists)
    .map((subgenre) => subgenre.artists)
    .flat();
  const allSubgenres = data.map((subgenre) => subgenre["subgenre-name"]);

  //Echelle
  const maxPopularity = max(allArtists, (d) => d.popularity);
  const minPopularity = min(allArtists, (d) => d.popularity);
  const rScale = scaleLinear()
    .domain([minPopularity, maxPopularity])
    .range([20, 80]);

  //Dimensions du SVG
  const containerWidth = document
    .getElementById("artists-chart")
    .getBoundingClientRect().width;
  const padding = 16;
  const width = Math.min(1000, containerWidth - padding * 2);
  const height = 600;

  // Sélectionner et nettoyer le container
  const container = d3.select("#artists-chart");
  container.html("");

  // Créer un conteneur flex pour organiser verticalement
  container
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center")
    .style("gap", "20px");

  // Créer les SVG
  const buttonsSVG = container
    .append("svg")
    .attr("width", width)
    .attr("height", 100) // Hauteur initiale, sera ajustée par createButtons
    .style("display", "block");

  const bubblesSVG = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block");

  function createButtons() {
    // Calculer la disposition des boutons
    const buttonPadding = 10;
    const buttonHeight = 30;
    let currentX = buttonPadding;
    let currentY = buttonPadding;
    const maxWidth = width - buttonPadding * 2;

    // Créer les groupes de boutons avec "Tous" en premier
    const allSubgenresWithAll = ["Tous", ...allSubgenres];

    const buttonGroups = buttonsSVG
      .selectAll("g.button-group")
      .data(allSubgenresWithAll)
      .enter()
      .append("g")
      .attr("class", "button-group")
      .attr("transform", (d, i) => {
        // Créer un texte temporaire pour mesurer la largeur
        const tempText = buttonsSVG
          .append("text")
          .text(d)
          .attr("font-size", "12px");
        const textWidth = tempText.node().getBBox().width;
        tempText.remove();

        const buttonWidth = textWidth + buttonPadding * 2;

        // Passer à la ligne si nécessaire
        if (currentX + buttonWidth > maxWidth) {
          currentX = buttonPadding;
          currentY += buttonHeight + buttonPadding;
        }

        const x = currentX;
        currentX += buttonWidth + buttonPadding;

        return `translate(${x}, ${currentY})`;
      });

    // Ajouter les rectangles (fond des boutons)
    buttonGroups
      .append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", (d) => (d === "Tous" ? "#6B46C1" : "grey"))
      .attr("width", function (d) {
        const tempText = buttonsSVG
          .append("text")
          .text(d)
          .attr("font-size", "12px");
        const width = tempText.node().getBBox().width + buttonPadding * 2;
        tempText.remove();
        return width;
      })
      .attr("height", buttonHeight);

    // Ajouter le texte des boutons
    buttonGroups
      .append("text")
      .attr("fill", "white")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("y", buttonHeight / 2)
      .attr("x", function (d) {
        const tempText = buttonsSVG
          .append("text")
          .text(d)
          .attr("font-size", "12px");
        const width = tempText.node().getBBox().width + buttonPadding * 2;
        tempText.remove();
        return width / 2;
      })
      .attr("font-size", "12px")
      .text((d) => d);

    // Modifier l'interactivité
    buttonGroups
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).select("rect").attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).select("rect").attr("opacity", 1);
      })
      .on("click", function (event, d) {
        // Reset tous les boutons en gris
        buttonGroups.select("rect").attr("fill", "grey");
        // Activer le bouton cliqué
        d3.select(this).select("rect").attr("fill", "#6B46C1");

        // Sélectionner tous les groupes d'artistes
        const artistGroups = bubblesSVG.selectAll(".artist-group");

        if (d === "Tous") {
          // Réinitialiser tous les artistes
          artistGroups
            .transition()
            .duration(300)
            .style("opacity", 1)
            .select("circle")
            .attr("fill", "#6B46C1");
        } else {
          // Filtrer et styliser les artistes
          artistGroups.each(function (artist) {
            const group = d3.select(this);
            const matchingSubgenre = data.find(
              (subgenre) =>
                subgenre["subgenre-name"] === d &&
                subgenre.artists.some(
                  (a) => a["artist-name"] === artist["artist-name"]
                )
            );

            group
              .transition()
              .duration(300)
              .style("opacity", matchingSubgenre ? 1 : 0.2);

            group
              .select("circle")
              .transition()
              .duration(300)
              .attr("fill", matchingSubgenre ? "#6B46C1" : "#999999");
          });
        }
      });
  }

  // Définir les motifs pour les images d'artistes
  function createPatterns() {
    const defs = svg.append("defs");

    allArtists.forEach((artist, i) => {
      defs
        .append("pattern")
        .attr("id", `image-${i}`)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")

        .attr("href", artist.image)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", "circle(50% at center)");
    });
  }

  function displayPlaylist(artistName) {
    const url = `https://open.spotify.com/search/${encodeURIComponent(
      artistName
    )}`;
    window.open(url, "_blank");
  }

  function createBubbles() {
    const nodes = allArtists.map((d) => {
      const tempText = bubblesSVG
        .append("text")
        .attr("font-size", "12px")
        .text(d["artist-name"]);
      const textBox = tempText.node().getBBox();
      tempText.remove();

      const circleRadius = rScale(d.popularity);

      const nodeWidth = Math.max(textBox.width, circleRadius * 2);
      const nodeHeight = textBox.height + circleRadius * 2;

      return {
        ...d,
        r: circleRadius,
        width: nodeWidth + 10,
        height: nodeHeight + 10,
        textWidth: textBox.width,
        textHeight: textBox.height,
      };
    });

    // Calcul de la surface totale nécessaire
    const totalArea = nodes.reduce(
      (sum, node) => sum + Math.PI * Math.pow(node.r, 2),
      0
    );
    const aspectRatio = width / height;
    const optimalHeight = Math.sqrt(totalArea / aspectRatio) * 2;
    const optimalWidth = optimalHeight * aspectRatio;

    // Mise à jour des dimensions du SVG
    const finalHeight = Math.max(height, optimalHeight);
    const finalWidth = Math.max(width, optimalWidth);

    bubblesSVG.attr("width", finalWidth).attr("height", finalHeight);

    const simulation = forceSimulation(nodes)
      .force("charge", forceManyBody().strength(10))
      .force(
        "collide",
        forceCollide()
          .radius((d) => Math.max(d.width, d.height) / 2)
          .strength(0.2)
      )
      .force("center", forceCenter(finalWidth / 2, finalHeight / 2)) // Centrage avec les nouvelles dimensions
      .stop();

    // Exécuter la simulation
    for (let i = 0; i < 300; i++) simulation.tick();

    // Créer les groupes
    const artistGroups = bubblesSVG
      .selectAll("g.artist-group")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "artist-group")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // Ajouter les cercles
    artistGroups
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("cx", 0) // Centre le cercle dans le groupe
      .attr("cy", 0) // Centre le cercle dans le groupe
      .attr("fill", "#6B46C1");

    // Ajouter les labels centrés sur les bulles
    artistGroups
      .append("text")
      .attr("class", "artist-label")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("x", 0) // Centre le texte horizontalement
      .attr("y", 0) // Centre le texte verticalement
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text((d) => d["artist-name"]);

    // Ajouter l'interactivité aux groupes
    artistGroups.style("cursor", "pointer").on("click", function (event, d) {
      // Vérifier si l'artiste n'est pas grisé
      const group = d3.select(this);
      const isActive = group.style("opacity") !== "0.2";

      if (isActive) {
        displayPlaylist(d["artist-name"]);
      }
    });
  }

  createButtons();
  //createPatterns();
  createBubbles();
}
export { createBubbleChart };
