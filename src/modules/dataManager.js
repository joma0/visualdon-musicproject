let genreDataCache = new Map();

export async function fetchGenreData(genreName) {
  if (genreDataCache.has(genreName)) return genreDataCache.get(genreName);
  try {
    const res = await fetch(`/data-test/${genreName.toLowerCase()}.json`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    genreDataCache.set(genreName, data);
    return data;
  } catch {
    return {
      "genre-name": genreName,
      description: "N/A",
      origin: { "start-decade": "1950", region: "N/A" },
      influences: [],
      artists: [],
    };
  }
}

export async function fetchDecadeData(decade) {
  try {
    // Charger les données de la décennie depuis le fichier decades.json
    const response = await fetch("/data-true/decades.json");
    if (!response.ok)
      throw new Error("Erreur lors du chargement des données des décennies");

    const data = await response.json();
    return data[decade] || {};
  } catch (error) {
    console.error(
      "Erreur lors du chargement des données de la décennie:",
      error
    );
    return {};
  }
}

export function processGenreData(rawData) {
  // Transformer les données brutes en format utilisable par la visualisation
  return {
    name: rawData["genre-name"],
    value: rawData.popularity || 5,
    details: {
      description: rawData.description,
      origin: rawData.origin,
      influences: rawData.influences,
      artists: rawData.artists,
    },
  };
}
