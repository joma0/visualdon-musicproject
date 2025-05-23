import * as d3 from "d3";
import radialBarChart from "./modules/radialBarChart.js";
import { setupDetailsPanel } from "./modules/detailsPanel.js";
import { setupControls } from "./modules/controls.js";
import { renderCooccurrenceChart } from './modules/cooccurrenceChart.js';
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
      document.getElementById("app").classList.remove("details-open");
    });
  }

  // Fonction helper pour convertir la valeur du slider en décennie
  getDecadeFromSliderValue(sliderValue) {
    const decades = [1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];
    const index = sliderValue - 1; // Le slider va de 1 à 11
    return decades[index];
    
    // déclenchement initial sur la valeur courante du slider
    const initialDecade = setupControls((decade) => decade);
    // on veut lancer tout de suite l'affichage pour cette décennie
    this.updateDataForDecade(initialDecade).then((data) => {
      this.data = data;
      this.updateVisualization();
    });
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
  async handleGenreClick(genre) {
    // Afficher le panneau latéral
    document.getElementById("visualization-container").classList.add("w-1/2");
    document.getElementById("details-panel").classList.add("slide-in");
    document.getElementById("app").classList.add("details-open");
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
          fusion: null,
          artists: [
            {
              "artist-name": "Black Sabbath",
              popularity: 20000,
              playlist: "",
            },
            {
              "artist-name": "Led Zeppelin",
              popularity: 100000,
              playlist: "",
            },
          ],
        },
        {
          "subgenre-name": "Speed Metal",
          description:
            "Caractérisé par une forte accélération du tempo. Le Power Metal et Thrash Metal en sont des dérivés.",
          playlist: "",
          fusion: null,
          artists: [
            {
              "artist-name": "Metallica",
              popularity: 28305806,
              playlist:
                "https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO1sJmec?utm_source=generator",
            },
            {
              "artist-name": "Exciter",
              popularity: 20981,
              playlist:
                "https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO0IGmUW?utm_source=generator",
            },
            {
              "artist-name": "Blind Guardian",
              popularity: 28305806,
              playlist: "",
            },
          ],
        },
        {
          "subgenre-name": "Glam Metal",
          description:
            "Se distingue par un style très spécifique chez les artistes (longs cheveux blonds, maquillage, etc.). Aussi connu comme Hair Metal ou Pop Metal",
          fusion: null,
          artists: [
            {
              "artist-name": "Twisted Sister",
              popularity: 1000,
              playlist: "",
            },
            {
              "artist-name": "Quiet Riot",
              popularity: 100000,
              playlist: "",
            },
            {
              "artist-name": "Ratt",
              popularity: 28305806,
              playlist: "",
            },
          ],
        },
        {
          "subgenre-name": "Crossover Thrash",
          description: "Fusion entre le Punk et le Metal",
          playlist: "",
          fusion: "Punk",
        },
        {
          "subgenre-name": "Doom Metal",
          description:
            "Caractérisé par un tempo lent, une musique lourdet et mélancolique et des paroles évoquant le désespoir.",
          fusion: "Punk",
          artists: [
            {
              "artist-name": "Saint Vitus",
              popularity: 2830545,
              playlist: "",
            },
            {
              "artist-name": "The Obsessed",
              popularity: 1,
              playlist: "",
            },
          ],
        },
        {
          "subgenre-name": "Death Metal",
          description:
            "Inspiré du Thrash Metal. Aborde des thématiques particlièrement violentes.",
          fusion: null,
          artists: [
            {
              "artist-name": "Possessed",
              popularity: 45785,
              playlist: "",
            },
            {
              "artist-name": "Obituary",
              popularity: 1,
              playlist: "",
            },
          ],
        },
        {
          "subgenre-name": "Grindcore",
          description:
            "Fusion entre le punk et le metal. Caractérisé par l'engagement politique (anti-consumérisme, végétarisme, droits des animaux).",
          fusion: "Punk",
          artists: [
            {
              "artist-name": "Nasum",
              popularity: 1,
              playlist: "",
            },
            {
              "artist-name": "Napalm Death",
              popularity: 1,
              playlist: "",
            },
            {
              "artist-name": "Brutal Truth",
              popularity: 1,
              playlist: "",
            },
          ],
        },
        {
          "subgenre-name": "Symphonic Metal",
          description:
            "Melange entre le Heavy Metal et des éléments de musique classique.",
          fusion: null,
          artists: [
            {
              "artist-name": "Nightwish",
              popularity: 1,
              playlist: "",
            },
            {
              "artist-name": "Within Temptation",
              popularity: 1,
              playlist: "",
            },
          ],
        },
      ],
    };
    // Mettre à jour le contenu
    /*if (this.detailsPanel) {
      this.detailsPanel.update(genreData);
    }*/
    renderCooccurrenceChart(genreData["top-cooccurrences"]);
  }
}

new MusicVisualizer();