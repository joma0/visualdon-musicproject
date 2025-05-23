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
      .tickValues([2, 4, 6, 8, 10, 12])
      .tickCircleValues([2, 4, 6, 8, 10, 12])
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

  async init() {
    this.detailsPanel = setupDetailsPanel();
    
    // Récupérer la valeur initiale du slider
    const slider = document.getElementById("slider");
    const initialDecade = this.getDecadeFromSliderValue(parseInt(slider.value, 10));
    
    // Charger et afficher les données initiales
    this.data = await this.updateDataForDecade(initialDecade);
    this.updateVisualization();
    
    // Configurer les contrôles avec le callback
    setupControls(async (decade) => {
      this.data = await this.updateDataForDecade(decade);
      this.updateVisualization();
    });
    
    // Configurer le bouton de fermeture du panneau
    document.getElementById("close-panel").addEventListener("click", () => {
      document
        .getElementById("visualization-container")
        .classList.remove("w-1/2");
      document.getElementById("details-panel").classList.remove("slide-in");
    });
  }

  // Fonction helper pour convertir la valeur du slider en décennie
  getDecadeFromSliderValue(sliderValue) {
    const decades = [1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];
    const index = sliderValue - 1; // Le slider va de 1 à 11
    return decades[index];
  }

  async updateDataForDecade(decade) {
    try {
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
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // Retourner des données par défaut en cas d'erreur
      const defaultData = {};
      const allGenres = [
        "hip-hop", "pop", "electronic", "r&b", "rock", "country",
        "metal", "reggae", "punk", "funk", "jazz", "blues",
      ];
      allGenres.forEach(genre => {
        defaultData[genre] = Math.floor(Math.random() * 12);
      });
      return [{ data: defaultData }];
    }
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