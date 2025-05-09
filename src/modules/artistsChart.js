import * as d3 from "d3-selection";
import { scaleLinear } from "d3-scale";
import { json } from "d3-fetch";

function createBubbleChart() {
  console.log("bonjour");

  //Data de test
  const artists = [
    {
      name: "Artiste A",
      popularity: 123,
      image: "./asset/images/artisteA.jpeg",
    },
    {
      name: "Artiste B",
      popularity: 47,
      image: "./asset/images/artisteA.jpeg",
    },
    {
      name: "Artiste C",
      popularity: 85,
      image: "./src/asset/images/artisteA,jpeg",
    },
  ];

  //Dimensions du SVG
  const width = 1000;
  const height = 200;

  //Echelle pour la taille des cercles
  const rScale = scaleLinear().domain([0, 500]).range([30, 300]);

  //Sélectionner et nettoyer le container
  const container = d3.select("#artists-chart");
  container.html("");

  //SVG prévu pour encapsuler le graphique
  const svg = createSVG();

  function createSVG() {
    console.log("créer le svg");
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    return svg;
  }

  function createPatterns() {
    const defs = svg.append("defs");

    artists.forEach((artist, i) => {
      defs
        .append("pattern")
        .attr("id", `image-${i}`)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")
        .attr("href", artist.image)
        .attr("width", rScale(artist.popularity) * 2)
        .attr("height", rScale(artist.popularity) * 2)
        .attr("x", 0)
        .attr("y", 0)
        .attr("preserveAspectRatio", "xMidYMid slice");
    });
  }

  function createBubbles() {
    console.log("créer les bubbles");
    const circles = svg
      .selectAll("circle")
      .data(artists)
      .enter()
      .append("circle")
      .attr("r", (d) => rScale(d.popularity))
      .attr("cx", (d, i) => 100 + i * 200) // espacés horizontalement
      .attr("cy", height / 2)
      .attr("fill", (d, i) => `url(#image-${i})`);
  }

  function addLabels() {
    console.log("ajouter les textes");
    const labels = svg
      .selectAll("label")
      .data(artists)
      .enter()
      .append("text")
      .attr("x", (d, i) => 100 + i * 200)
      .attr("y", height / 2)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("pointer-events", "none") //pour que le texte ne bloque pas les interactions
      .text((d) => d.name);
  }

  createPatterns();
  createBubbles();
  addLabels();
}
export { createBubbleChart };
