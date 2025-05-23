import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

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

  // Initialiser le graphique
  createPatterns();
  createBubbles();
}
export { createBubbleChart };
