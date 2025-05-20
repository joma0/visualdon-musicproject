import * as d3 from "d3";
import radialBarChart from "./modules/radialBarChart.js";
import { setupDetailsPanel } from "./modules/detailsPanel.js";
import { setupControls } from "./modules/controls.js";
import { fetchGenreData } from "./modules/dataManager.js";
import "./css/index.css";

class MusicVisualizer {
  constructor() {
    this.data = null;
    this.currentGenre = null;
    this.detailsPanel = null;
    this.chart = radialBarChart()
      .barHeight(250)
      .reverseLayerOrder(true)
      .capitalizeLabels(true)
      .domain([0, 12])
      .tickValues([1,2,3,4,5,6,7,8,9,10,11,12])
      .tickCircleValues([1,2,3,4,5,6,7,8,9,10,11])
      .barColors([
        "#F40342","#FD4102","#FD7B03","#FDBE00","#E8FF0A",
        "#02FF64","#00FFF7","#00C3FF","#008CFF","#7A00FF",
        "#C900FF","#FF00DC"
      ]);
    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.detailsPanel = setupDetailsPanel();
    setupControls(
      async (decade) => {
        this.data = await this.updateDataForDecade(decade);
        this.updateVisualization();
      }
    );
    document.getElementById("close-panel").addEventListener("click", () => {
      document.getElementById("visualization-container").classList.remove("w-1/2");
      document.getElementById("details-panel").classList.remove("slide-in");
    });
    // démarrage initial
    setupControls(value => value); // init slider without autoplay
  }

  async updateDataForDecade(decade) {
    // remplace par fetchDecadeData si besoin
    return [{ data: this.generateRandomData() }];
  }

  generateRandomData() {
    const genres = [
      "Rock","Electronic","Pop","Blues","Funk","Jazz",
      "Metal","Hip-Hop","Reggae","Country","Punk","R&B"
    ];
    const data = {};
    genres.forEach(g => data[g] = Math.random()*12);
    return data;
  }

  updateVisualization() {
    if (!this.data) return;
    d3.select("#chart").datum(this.data).call(this.chart);
  }
}

new MusicVisualizer();