import * as d3 from "d3";
import { createBubbleChart } from "./artistsChart";
import { createFusionChart } from "./fusionChart";

export function setupDetailsPanel() {
  function createFusionList(genreName, subgenres) {
    document.getElementById("fusion-chart").innerHTML = "";
    createFusionChart(genreName, subgenres);
  }
  function createInfluencesChart(influences) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width =
      document.getElementById("influences-chart").clientWidth -
      margin.left -
      margin.right;
    const height = 200 - margin.top - margin.bottom;
    d3.select("#influences-chart").html("");
    const svg = d3
      .select("#influences-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);
    x.domain(influences.map((d) => d["subgenre-name"]));
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");
    svg.append("g").call(d3.axisLeft(y));
    svg
      .selectAll(".bar")
      .data(influences)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d["subgenre-name"]))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.percent))
      .attr("height", (d) => height - y(d.percent))
      .attr("fill", "#9F7AEA");
  }
  function createArtistsGrid(subgenres) {
    document.getElementById("artists-chart").innerHTML = "";
    createBubbleChart(subgenres);
  }

  return {
    update(genreData) {
      document.getElementById("genre-title").textContent =
        genreData["genre-name"];

      createFusionList(genreData["genre-name"], genreData.subgenres);
      createInfluencesChart(genreData.influences || []);
      createArtistsGrid(genreData.subgenres || []);
    },
  };
}
