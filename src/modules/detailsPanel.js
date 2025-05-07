import * as d3 from 'd3';

export function setupDetailsPanel() {
    function createInfluencesChart(influences) {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = document.getElementById('influences-chart').clientWidth - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        // Nettoyer le conteneur
        d3.select('#influences-chart').html('');

        const svg = d3.select('#influences-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Échelles
        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .range([height, 0]);

        // Données
        x.domain(influences.map(d => d['subgenre-name']));
        y.domain([0, 100]);

        // Axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        svg.append('g')
            .call(d3.axisLeft(y));

        // Barres
        svg.selectAll('.bar')
            .data(influences)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d['subgenre-name']))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.percent))
            .attr('height', d => height - y(d.percent))
            .attr('fill', '#9F7AEA');
    }

    function createArtistsGrid(artists) {
        const container = document.getElementById('artists-grid');
        container.innerHTML = ''; // Nettoyer le conteneur

        artists.forEach(artist => {
            const artistCard = document.createElement('div');
            artistCard.className = 'bg-gray-700 rounded-lg p-4 genre-item';
            artistCard.innerHTML = `
                <h4 class="font-bold mb-2">${artist['artist-name']}</h4>
                <div class="text-sm text-gray-300">
                    ${artist.songs.slice(0, 3).join(', ')}
                    ${artist.songs.length > 3 ? '...' : ''}
                </div>
            `;
            container.appendChild(artistCard);
        });
    }

    function updateSpotifyPlayer(genre) {
        // À implémenter : intégration avec l'API Spotify
        const container = document.getElementById('spotify-player');
        container.innerHTML = `
            <div class="bg-gray-700 rounded-lg p-4">
                <p class="text-center text-gray-300">
                    Playlist ${genre} à venir...
                </p>
            </div>
        `;
    }

    return {
        update(genreData) {
            // Mise à jour du titre et de la description
            document.getElementById('genre-title').textContent = genreData['genre-name'];
            document.getElementById('genre-decade').textContent = 
                `${genreData.origin['start-decade']}s - ${genreData.origin.region}`;
            document.getElementById('genre-description').textContent = genreData.description;

            // Mise à jour des graphiques et contenus
            createInfluencesChart(genreData.influences || []);
            createArtistsGrid(genreData.artists || []);
            updateSpotifyPlayer(genreData['genre-name']);
        }
    };
}