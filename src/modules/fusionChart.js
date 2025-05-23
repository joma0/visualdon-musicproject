import * as d3 from "d3-selection";
import { scaleLinear } from "d3-scale";
import { json } from "d3-fetch";
import { drag } from "d3-drag";

function createFusionChart(genreName, subgenres = []) {
  console.log("bonjour Fusion");

  const allSubgenres = subgenres;
  const fusionSubgenres = allSubgenres.filter(
    (subgenre) => subgenre.fusion !== null
  );
  const allGenres = [
    "hip-hop",
    "pop",
    "electronic",
    "r&b",
    "rock",
    "country",
    "metal",
    "reggae",
    "punk",
    "funk",
    "jazz",
    "blues",
  ];
  const currentGenre = genreName.toLowerCase();
  const otherGenres = allGenres.filter(
    (genre) => genre.toLowerCase() != currentGenre
  );
  console.log(currentGenre);
  console.log(otherGenres);
  console.log(fusionSubgenres);

  //Dimensions du SVG
  const containerWidth = document
    .getElementById("fusion-chart")
    .getBoundingClientRect().width;
  const width = Math.min(1000, containerWidth); // limite à 1000px maximum
  const height = 600;

  //Sélectionner et nettoyer le container
  const container = d3.select("#fusion-chart");
  container.html("");

  //SVG prévu pour encapsuler le graphique
  const svg = createSVG();

  //Cercle invisible
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2.5;
  const angleStep = (2 * Math.PI) / otherGenres.length;

  function createSVG() {
    console.log("créer le svg");
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    return svg;
  }

  function createBubbles() {
    console.log("créer les bubbles pour les genres");

    //Genre actuel
    svg
      .append("circle")
      .attr("r", 100)
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("fill", "blue");
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("font-size", "16px") // Taille plus grande pour le genre principal
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("pointer-events", "none")
      .text(currentGenre);

    //Autres genres
    const genresGroup = svg
      .selectAll(".other-genres")
      .data(otherGenres)
      .enter()
      .append("g")
      .attr("class", "genre-group");

    // Ajouter les cercles dans les groupes
    const circles = genresGroup
      .append("circle")
      .attr("r", 30)
      .attr("cx", (d, i) => centerX + radius * Math.cos(i * angleStep))
      .attr("cy", (d, i) => centerY + radius * Math.sin(i * angleStep))
      .attr("fill", "red");

    // Ajouter les labels dans les groupes
    const labels = genresGroup
      .append("text")
      .attr("x", (d, i) => centerX + radius * Math.cos(i * angleStep))
      .attr("y", (d, i) => centerY + radius * Math.sin(i * angleStep))
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("pointer-events", "none")
      .text((d) => d);

    // Fonction pour vérifier si un cercle est sur le cercle central
    function isOverCenter(x, y) {
      const dx = x - centerX;
      const dy = y - centerY;
      return Math.sqrt(dx * dx + dy * dy) < 80; // 80 est le rayon du cercle central
    }

    // Définir le comportement de drag sur les groupes
    const dragHandler = drag()
      .on("start", function (event, d) {
        // Sauvegarder la position initiale
        const i = otherGenres.indexOf(d);
        const startX = radius * Math.cos(i * angleStep);
        const startY = radius * Math.sin(i * angleStep);
        d3.select(this).attr("data-x", startX).attr("data-y", startY);
      })
      .on("drag", function (event) {
        // Calculer le déplacement relatif depuis la position initiale
        const startX = +d3.select(this).attr("data-x");
        const startY = +d3.select(this).attr("data-y");
        const dx = event.x - centerX - startX;
        const dy = event.y - centerY - startY;

        d3.select(this).attr("transform", `translate(${dx}, ${dy})`);
      })
      .on("end", function (event, d) {
        // Position actuelle
        const x = event.x;
        const y = event.y;

        // Retourner à la position initiale avec une animation
        d3.select(this)
          .transition()
          .duration(500)
          .attr("transform", "translate(0,0)")
          .on("end", () => {
            // Si on était sur le cercle central, afficher les fusions
            if (isOverCenter(x, y)) {
              console.log("Genre sélectionné:", d);
              console.log(
                "Sous-genres de fusion disponibles:",
                fusionSubgenres
              );

              const fusions = fusionSubgenres.filter((fusionSubgenre) => {
                // Vérifier que fusionSubgenre et fusion existent
                if (!fusionSubgenre || !fusionSubgenre.fusion) {
                  return false;
                }
                return fusionSubgenre.fusion.toLowerCase() === d.toLowerCase();
              });
              showFusionSubgenres(fusions, d); // Passer aussi le genre sélectionné
            }
          });
      });

    // Appliquer le drag aux groupes
    genresGroup.call(dragHandler);
  }

  function showFusionSubgenres(fusionSubgenres, selectedGenre) {
    // Supprimer les anciens cercles de fusion
    svg.selectAll(".fusion-group").remove();

    // Vérifier qu'il y a des données à afficher
    if (!fusionSubgenres || fusionSubgenres.length === 0) {
      console.warn("Pas de sous-genres de fusion à afficher");
      return;
    }

    const fixedAngle = Math.PI / 4; // Répartition des cercles
    const startAngle = (-fixedAngle * (fusionSubgenres.length - 1)) / 2;
    const positionRadius = radius * 0.1;
    const spacing = 100;

    // Trouver l'index du genre sélectionné pour calculer sa position
    const selectedIndex = otherGenres.indexOf(selectedGenre);

    // Calculer la position du cercle rouge sélectionné
    const selectedX = centerX + radius * Math.cos(selectedIndex * angleStep);
    const selectedY = centerY + radius * Math.sin(selectedIndex * angleStep);

    // Calculer le point médian entre le cercle bleu et le cercle rouge
    const midX = (centerX + selectedX) / 2;
    const midY = (centerY + selectedY) / 2;

    // Calculer l'angle entre le centre et le cercle sélectionné
    const angle = Math.atan2(selectedY - centerY, selectedX - centerX);

    // Largeur totale disponible pour les cercles de fusion
    const fusionWidth = (fusionSubgenres.length - 1) * 120; // 120px d'espacement entre les cercles

    const fusionGroups = svg
      .selectAll(".fusion-group")
      .data(fusionSubgenres)
      .enter()
      .append("g")
      .attr("class", "fusion-group")
      .style("opacity", 0);

    // Ajouter les cercles
    fusionGroups
      .append("circle")
      .attr("r", 40)
      .attr("cx", (d, i) => {
        const offset = (i - (fusionSubgenres.length - 1) / 2) * spacing;
        return midX + offset * Math.cos(angle + Math.PI / 2);
      })
      .attr("cy", (d, i) => {
        const offset = (i - (fusionSubgenres.length - 1) / 2) * spacing;
        return midY + offset * Math.sin(angle + Math.PI / 2);
      })
      .attr("fill", "purple");

    // Ajuster aussi la position des labels
    fusionGroups
      .append("text")
      .attr("x", (d, i) => {
        const offset = (i - (fusionSubgenres.length - 1) / 2) * spacing;
        return midX + offset * Math.cos(angle + Math.PI / 2);
      })
      .attr("y", (d, i) => {
        const offset = (i - (fusionSubgenres.length - 1) / 2) * spacing;
        return midY + offset * Math.sin(angle + Math.PI / 2);
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .each(function (d) {
        const text = d["subgenre-name"];
        const words = text.split(" ");
        if (words.length > 1) {
          const firstLine = words
            .slice(0, Math.ceil(words.length / 2))
            .join(" ");
          const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");
          d3.select(this)
            .selectAll("tspan")
            .data([firstLine, secondLine])
            .enter()
            .append("tspan")
            .attr("x", this.getAttribute("x"))
            .attr("dy", (_, i) => (i === 0 ? "-0.5em" : "1em"))
            .text((d) => d);
        } else {
          d3.select(this).text(text);
        }
      });

    // Animation d'apparition
    fusionGroups.transition().duration(500).style("opacity", 1);
  }

  createBubbles();
}
export { createFusionChart };
