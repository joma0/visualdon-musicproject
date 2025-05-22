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
  }

  init() {
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
    });
    // déclenchement initial sur la valeur courante du slider
    const initialDecade = setupControls((value) => value);
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

  handleGenreClick(genre) {
    // Afficher le panneau latéral
    document.getElementById("visualization-container").classList.add("w-1/2");
    document.getElementById("details-panel").classList.add("slide-in");

    const genreData = {
      "genre-name": "Metal",
      description: [
        {
          "start-date": "Fin des années 1960",
          "start-place": "Etats-Unis, Royaume-Uni",
          influences: "Hard Rock, Blues, Musique classique",
        },
      ],
      "top-cooccurrences": [
        { genre: "Rock", score: 0.15228632 },
        { genre: "Heavy metal", score: 0.041959934 },
        { genre: "Hard Rock", score: 0.030640494 },
        { genre: "Death Metal", score: 0.01812337 },
        { genre: "Alternative", score: 0.017985925 },
      ],
      subgenres: [
        {
          "subgenre-name": "Classic Metal",
          description: "",
          playlist:
            "https://open.spotify.com/embed/playlist/6hwN2nguilymRKbsbFMEef?utm_source=generator",
          fusion: null,
        },
        {
          "subgenre-name": "Power Metal",
          description: "",
          playlist: "",
          fusion: null,
        },
        {
          "subgenre-name": "Glam Metal",
          description: "",
          playlist: "",
          fusion: null,
        },
        {
          "subgenre-name": "NWOBHM",
          description: "",
          playlist: "",
          fusion: null,
        },
        {
          "subgenre-name": "Crossover Thrash",
          description: "",
          playlist: "",
          fusion: "Punk",
        },
        {
          "subgenre-name": "Doom Metal",
          description: "",
          playlist: "",
          fusion: null,
        },
        {
          "subgenre-name": "Death Metal",
          description: "",
          playlist: "",
          fusion: null,
        },
        {
          "subgenre-name": "Grindcore",
          description: "",
          playlist: "",
          fusion: "Punk",
        },
        {
          "subgenre-name": "Symphonic Metal",
          description: "",
          playlist: "",
          fusion: "Electronic",
        },
        {
          "subgenre-name": "Nu Metal",
          description: "",
          playlist: "",
          fusion: null,
        },
      ],
    };

    // Mettre à jour le contenu
    if (this.detailsPanel) {
      this.detailsPanel.update(genreData);
    }
  }
}

new MusicVisualizer();
