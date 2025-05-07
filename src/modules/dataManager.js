// Cache pour les données des genres
let genreDataCache = new Map();

export async function fetchGenreData(genreName) {
    // Vérifier le cache d'abord
    if (genreDataCache.has(genreName)) {
        return genreDataCache.get(genreName);
    }

    try {
        // Charger les données depuis le fichier JSON correspondant
        const response = await fetch(`/data-test/${genreName.toLowerCase()}.json`);
        if (!response.ok) throw new Error(`Erreur lors du chargement des données pour ${genreName}`);
        
        const data = await response.json();
        
        // Mettre en cache les données
        genreDataCache.set(genreName, data);
        
        return data;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Retourner des données factices en cas d'erreur
        return {
            'genre-name': genreName,
            'description': 'Description non disponible',
            'origin': {
                'start-decade': '1950',
                'region': 'Non spécifié'
            },
            'influences': [],
            'artists': []
        };
    }
}

export async function fetchDecadeData(decade) {
    try {
        // Charger les données de la décennie depuis le fichier decades.json
        const response = await fetch('/data-true/decades.json');
        if (!response.ok) throw new Error('Erreur lors du chargement des données des décennies');
        
        const data = await response.json();
        return data[decade] || {};
    } catch (error) {
        console.error('Erreur lors du chargement des données de la décennie:', error);
        return {};
    }
}

export function processGenreData(rawData) {
    // Transformer les données brutes en format utilisable par la visualisation
    return {
        name: rawData['genre-name'],
        value: rawData.popularity || 5,
        details: {
            description: rawData.description,
            origin: rawData.origin,
            influences: rawData.influences,
            artists: rawData.artists
        }
    };
}