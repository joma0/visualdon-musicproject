import * as d3 from "d3-selection";
import { scaleLinear } from "d3-scale";
import { json } from "d3-fetch";

function createFusionChart(subgenres = []) {
  console.log("bonjour Fusion");

  //Récupérer les données
  const allSubgenres = subgenres;

  //Trier les données
  const fusionSubgenres = allSubgenres.filter(
    (subgenre) => subgenre.fusion !== null
  );

  console.log(fusionSubgenres);

  //Dimensions du SVG
  const width = 1000;
  const height = 200;

  //Sélectionner et nettoyer le container
  const container = d3.select("#fusion-chart");
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

  function createBubbles() {
    console.log("créer les bubbles pour les genres");
    const circles = svg
      .selectAll("circle")
      .data(fusionSubgenres)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("cx", (d, i) => 100 + i * 200) // espacés horizontalement
      .attr("cy", height / 2)
      .attr("fill", (d, i) => "red");
  }

  function addLabels() {
    console.log("ajouter les noms des genres");
    const labels = svg
      .selectAll("label")
      .data(subgenres)
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
      .text((d) => d["subgenre-name"]);
  }

  createBubbles();
  addLabels();
}
export { createFusionChart };
