import * as d3 from "d3";
import radialBarChart from "./modules/radialBarChart.js";
import { setupDetailsPanel } from "./modules/detailsPanel.js";
import { setupControls } from "./modules/controls.js";
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
    setupControls(async (decade) => {
      this.data = await this.updateDataForDecade(decade);
      this.updateVisualization();
    });
    document.getElementById("close-panel").addEventListener("click", () => {
      document.getElementById("visualization-container").classList.remove("w-1/2");
      document.getElementById("details-panel").classList.remove("slide-in");
    });
    // déclenchement initial sur la valeur courante du slider
    const initialDecade = setupControls(value => value);
    // on veut lancer tout de suite l'affichage pour cette décennie
    this.updateDataForDecade(initialDecade).then(data => {
      this.data = data;
      this.updateVisualization();
    });
  }

  async updateDataForDecade(decade) {
    // 1. Charger le JSON
    const decades = await d3.json('/data-true/decades.json');
    // 2. Trouver l'entrée correspondante
    const entry = decades.find(d => d['start-year'] === decade);
    const rated = Array.isArray(entry?.['genres-rating']) ? entry['genres-rating'] : [];
    // 3. Liste fixe de tous les genres
    const allGenres = [
      'hip-hop','pop','electronic','rbn','rock','country',
      'metal','reggae','punk','funk','jazz','blues'
    ];
    const maxVal = allGenres.length;
    // 4. Construire le mapping nom → score (12 = plus populaire, 0 = absent)
    const dataMap = {};
    allGenres.forEach((g, idx) => {
      const rank = rated.indexOf(g);
      dataMap[g] = rank >= 0 ? (maxVal - rank) : 0;
    });
    // 5. Retourner au format attendu
    return [{ data: dataMap }];
  }

  updateVisualization() {
    if (!this.data) return;
    d3.select("#chart").datum(this.data).call(this.chart);
  }
}

new MusicVisualizer();