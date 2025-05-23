### Thématique

Les genres musicaux : leurs origines, évolutions et influences

**Contexte**
Nous avons choisi de construire nous-même un jeu de données, à partir de différentes sources :

1. Des jeux de données existants

   - [Repo Github](https://github.com/trebi/music-genres-dataset)
     => Dataset de 1494 genres, chacun contenant 200 chansons
   - [Repo Github](https://github.com/voltraco/genres)
     => Un dataset JSON des genres musicaux
   - [Tagtraum](https://www.tagtraum.com/msd_genre_datasets.html)
     => Un site qui répertorie plusieurs dataset qui détermine pour chaque genre la proportion d'influence des autres genres

2. Des données textuelles issues de recherches sur le web (ou éventuellement d'autres ressources)
   - [Wikipedia](https://fr.wikipedia.org/wiki/Liste_de_styles_musicaux)
     => Liste de genres musicaux par ordre alphabétique (sans classification supplémentaire)
   - [Wikipedia](https://en.wikipedia.org/wiki/List_of_music_genres_and_styles)
     => Liste de genres musicaux classifiés sur plusieurs niveaux
   - [Musicmap](https://musicmap.info/)
     => Cartographie les genres et sous-genres musicaux, en mettant en avant leurs liens de parenté ainsi que leur apparition chronologique

Utilisation de l'IA :
Pour des questions d’optimisation, nous avons utilisé l’IA pour nous aider à construire notre jeu de données. Afin de nous assurer de la fiabilité de ce dernier, nous transmettons à l’IA des données issues de sources vérifiées, ainsi que la structure du JSON souhaitée. L'IA nous permet seulement de compléter les différentes propriétés plus rapidement.

**Description**
Notre jeu de données sera au format JSON et aurait la structure suivante :

decades.json

```json
[
  {
    "start-year": 0,
    "genres-rating": [""],
    "history": [
      {
        "title": "",
        "body": ""
      }
    ]
  }
]
```

Explication des propriétés :

- start-year : année de début (p.ex. 1910 pour la décennie 1910-1919)
- genres-rating : classement des genres en fonction de leur popularité
- history : liste de faits historiques marquants
  - title : titre du fait historique
  - body : paragraphe descriptif

genres.json

```json
[
  {
    "genre-name": "",
    "top-cooccurrences": [{ "genre": "", "score": 0 }],
    "subgenres": [
      {
        "subgenre-name": "",
        "fusion": null,
        "artists": [{ "artist-name": "", "popularity": 0 }]
      }
    ]
  }
]
```

Explication des propriétés :

- genres-name : nom du genre principal
- top-cooccurences : 5 autres genres apparaissant le plus souvent avec le genre dans un même morceau
- subgenres : liste de sous-genres
  - subgenre-name : nom du sous-genre
  - fusion : nom du genre fusionné ou null
  - artists : liste d’artistes
    - artist-name : nom de l’artiste
    - popularity : nombre d’auditeurs sur Spotify

Types de données :
La majorité de nos données seront des données qualitatives nominales, à l'exception des influences (pourcentages) qui seront des données quantitatives continues.

**But**
Nous souhaitons aborder les questions suivantes :

1. Une proposition de classification des principaux genres et de leurs sous-genres
2. Leur apparition et leur évolution (popularité) dans le temps
3. Les artistes et chansons phares de ces genres et sous-genres
4. Les correspondances (influences, fusions, origines, ...) entre les différents genres et sous-genres

Notre visualisation présente une partie explicative et une partie exploratoire :

1. La partie "scrollytelling" qui permet de naviguer parmi les décennies et de visualiser l'évolution des genres est explicative.
2. La partie qui permet de naviguer parmi les genres sur le graphique principal est plutôt exploratoire.

**Références**
Voici quelques références qui exploitent des données sur la même thématique :

[Musicmap](https://musicmap.info/)
=> Cartographie les genres et sous-genres musicaux, en mettant en avant leurs liens de parenté ainsi que leur apparition chronologique

[Dataviz](https://nellantn.github.io/dataviz/)
=> Représente la popularité des différents genres musicaux de 1958 à 2016 aux Etats-Unis.

[Million Song Dataset](https://shouvikmani.github.io/Million-Song-Dataset-Visualization/index.html)
=> Cherche à représenter visuellement les origines et les fusions des genres musicaux.

[Charting Sounds](https://chartingsounds.streamlit.app/)
=> Cartographie les différents genres et sous genres sous forme de carte interactive.

[Every Noise at Once](https://everynoise.com/everynoise1d.html)
=> Outre la représentation graphique qui n'est pas très pertinente, le site propose une playlist sur Spotify pour chaque genre ou sous-genre listé, et intègre un widget Spotify qui permet de lancer la playlist directement depuis le site.

### Wireframes

Lien vers le figma des wireframes :

https://www.figma.com/design/CrhqDq11NhtIeY0ujIa7Bm/VisualDon_Wireframes?node-id=0-1&t=uexNOGThkeToNuTn-1

Remarque : Des explications sont présentes dans les bulles de commentaires.
