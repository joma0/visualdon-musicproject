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
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      .tickCircleValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
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
      .onClick((genre) => this.handleGenreClick(genre));
    document.addEventListener("DOMContentLoaded", () => this.init());
  }  init() {
    this.detailsPanel = setupDetailsPanel();
    setupControls(async (decade) => {
      this.data = await this.updateDataForDecade(decade);
      this.updateVisualization();
    });
    document.getElementById("close-panel").addEventListener("click", () => {
      document
        .getElementById("visualization-container")
        .classList.remove("w-1/2");
      document.getElementById("details-panel").classList.remove("slide-in");
      document.getElementById("app").classList.remove("details-open");
    });
    // déclenchement initial sur la valeur courante du slider
    const initialDecade = setupControls((decade) => decade);
    // on veut lancer tout de suite l'affichage pour cette décennie
    this.updateDataForDecade(initialDecade).then((data) => {
      this.data = data;
      this.updateVisualization();
    });
  }

  async updateDataForDecade(decade) {
    // 1. Charger le JSON
    const decades = await d3.json("/data-true/decades.json");
    // 2. Trouver l'entrée correspondante
    const entry = decades.find((d) => d["start-year"] === decade);
    const rated = Array.isArray(entry?.["genres-rating"])
      ? entry["genres-rating"]
      : [];
    // 3. Liste fixe de tous les genres
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
    const maxVal = allGenres.length;
    // 4. Construire le mapping nom → score (12 = plus populaire, 0 = absent)
    const dataMap = {};
    allGenres.forEach((g, idx) => {
      const rank = rated.indexOf(g);
      dataMap[g] = rank >= 0 ? maxVal - rank : 0;
    });
    // 5. Retourner au format attendu
    return [{ data: dataMap }];
  }

  updateVisualization() {
    if (!this.data) return;
    d3.select("#chart").datum(this.data).call(this.chart);
  }
  async handleGenreClick(genre) {
    // Afficher le panneau latéral
    document.getElementById("visualization-container").classList.add("w-1/2");
    document.getElementById("details-panel").classList.add("slide-in");
    document.getElementById("app").classList.add("details-open");

      console.log("Chargement des données pour le genre:", genreName);
      
      // Mettre à jour le contenu
      if (this.detailsPanel) {
        this.detailsPanel.update(genreData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du genre:", error);
      // Afficher un message d'erreur ou utiliser des données par défaut
      if (this.detailsPanel) {
        const formattedGenreName = genre.name.charAt(0).toUpperCase() + genre.name.slice(1);
        this.detailsPanel.update({
          "genre-name": formattedGenreName,
          description: [
            {
              "start-date": "Information non disponible",
              "start-place": "Information non disponible",
              influences: "Information non disponible",
            },
          ],
          "top-cooccurrences": [],
          subgenres: [],
          artists: [
            {
              name: `Artiste ${formattedGenreName}`,
              popularity: 80,
              image: "src/asset/images/artisteA.jpeg",
              genres: [formattedGenreName]
            }
          ]
        });
      }
    }
  }
}

new MusicVisualizer();
