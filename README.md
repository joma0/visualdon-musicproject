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
Pour des questions d’optimisation, nous prévoyons utiliser l’IA pour nous aider à construire notre jeu de données. Afin de nous assurer de la fiabilité de ce dernier, nous transmettrons à l’IA des données issues de sources vérifiées, ainsi que la structure du JSON souhaitée. L'IA nous permettra seulement de compléter les différentes propriétés plus rapidement.

**Description**
Notre jeu de données sera au format JSON et aurait la structure suivante :

```json
{
  "supergenre-name": "",
  "description": "",
  "genres": [
    {
      "genre-name": "",
      "description": "",
      "subgenres": [
        {
          "subgenre-name": "",
          "description": "",
          "origin": {
            "start-decade": "",
            "region": ""
          },
          "artists": [
            {
              "artist-name": "",
              "songs": []
            }
          ],
          "influences": [
            {
              "subgenre-name": "",
              "percent": 100
            }
          ]
        }
      ]
    }
  ]
}
```

Types de données :
La majorité de nos données seront des données qualitatives nominales, à l'exception des influences (pourcentages) qui seront des données quantitatives continues.

Elément optionnel :
Nous envisageons aussi d'ajouter une propriété "popularité" qui serait constituée d'une note (en pourcent) par décennie. Cette note serait calculée d'après la popularité des chansons et des artistes d'un certain sous-genre pendant une décennie en particulier. Il s'agirait là également de données quantitatives continues. L'ajout de cette propriété dépendra des données qu'il sera possible de récolter.

```json
{
  "decade": "",
  "percent": 100
}
```

**But**
Nous souhaitons aborder les questions suivantes :

1. Une proposition de classification des principaux genres et de leurs sous-genres
2. Leur apparition et leur évolution (popularité) dans le temps
3. Les artistes et chansons phares de ces genres et sous-genres
4. Les correspondances (influences, fusions, origines, ...) entre les différents genres et sous-genres

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
