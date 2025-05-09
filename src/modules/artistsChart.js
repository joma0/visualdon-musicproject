import * as d3 from "d3-selection";
import { scaleLinear } from "d3-scale";
import { json } from "d3-fetch";

function createBubbleChart() {
  console.log("bonjour");

  const artists = [
    {
      name: "Artiste A",
      popularity: 123,
      image: "../asset/images/artisteA",
    },
    {
      name: "Artiste B",
      popularity: 47,
      image: "./src/asset/images/artisteA",
    },
    {
      name: "Artiste C",
      popularity: 85,
      image: "./src/asset/images/artisteA",
    },
  ];

  const width = 1000;
  const height = 200;

  const rScale = scaleLinear().domain([0, 500]).range([10, 200]);

  const svg = createSVG();

  function createSVG() {
    console.log("créer le svg");
    const svg = d3
      .select("#artists-list")
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
        .attr("width", 100)
        .attr("height", 100)
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
      .attr("cx", (d, i) => 100 + i * 100) // espacés horizontalement
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
      .attr("x", (d, i) => 100 + i * 150)
      .attr("y", height / 2)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("pointer-events", "none") //pour que le texte ne bloque pas les interactions
      .text((d) => d.name);
  }

  createPatterns();
  createBubbles();
  addLabels();
}
export { createBubbleChart };
