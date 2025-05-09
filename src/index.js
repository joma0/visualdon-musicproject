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
    this.chart = null;
    this.initializeChart();
    this.setupEventListeners();
  }

  initializeChart() {
    this.chart = radialBarChart()
      .barHeight(250)
      .reverseLayerOrder(true)
      .capitalizeLabels(true)
      .barColors([
        "#F40342",
        "#FD4102",
        "#FD7B03",
        "#FDBE00",
        "#E8FF0A",
        "#02FF64",
        "#00FFF7",
        "#00C3FF",
        "#008CFF",
        "#7A00FF",
        "#C900FF",
        "#FF00DC",
      ])
      .domain([0, 12])
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      .tickCircleValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    // Ajouter l'event listener pour les clics sur les éléments
    this.chart.onClick((element) => this.handleGenreClick(element));
  }

  async setupEventListeners() {
    this.detailsPanel = setupDetailsPanel();
    setupControls(async (decade) => {
      this.data = await this.updateDataForDecade(decade);
      this.updateVisualization();
    });

    // Gestion de la fermeture du panneau
    document.getElementById("close-panel").addEventListener("click", () => {
      document
        .getElementById("visualization-container")
        .classList.remove("w-1/2");
      document.getElementById("details-panel").classList.remove("slide-in");
    });
  }

  async handleGenreClick(genre) {
    this.currentGenre = genre;
    const genreData = await fetchGenreData(genre.name);

    // Animer le conteneur de visualisation
    document.getElementById("visualization-container").classList.add("w-1/2");

    // Mettre à jour et afficher le panneau de détails
    this.detailsPanel.update(genreData);
    document.getElementById("details-panel").classList.add("slide-in");
  }

  async updateDataForDecade(decade) {
    // Simuler des données pour le moment - à remplacer par de vraies données
    return [
      {
        data: this.generateRandomData(),
      },
    ];
  }

  generateRandomData() {
    const genres = [
      "Rock",
      "Electronic",
      "Pop",
      "Blues",
      "Funk",
      "Jazz",
      "Metal",
      "Hip-Hop",
      "Reggae",
      "Country",
      "Punk",
      "R&B/soul",
    ];
    const data = {};
    genres.forEach((genre) => {
      data[genre] = Math.random() * 12;
    });
    return data;
  }

  updateVisualization() {
    if (!this.data) return;
    d3.select("#chart").datum(this.data).call(this.chart);
  }
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  const visualizer = new MusicVisualizer();
});
