export function setupControls(onDecadeChange) {
  const slider = document.getElementById('slider');
  const autoPlayButton = document.getElementById('auto-play');
  const decadeLabel = document.getElementById('decade-label');
  const decadeDisplay = document.getElementById('decade-display');
  const decadeTitle = document.getElementById('decade-title');
  const decadeHistory = document.getElementById('decade-history');
  const decadeGenres = document.getElementById('decade-genres');
  let autoPlayInterval = null;
  let decadesData = null;

  const decades = [1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010];
  let currentDecadeIndex = parseInt(slider.value, 10) - 1;
  
  // Charger les données des décennies
  fetchDecadesData();
  
  // Initialiser l'affichage de la décennie
  updateDecadeDisplay();
  
  // Fonction pour charger les données des décennies
  async function fetchDecadesData() {
    try {
      const response = await fetch('/data-true/decades.json');
      decadesData = await response.json();
      updateDecadeContent();
    } catch (error) {
      console.error('Erreur lors du chargement des données des décennies:', error);
    }
  }
  // Variables pour le contrôle de la sensibilité du scroll
  let scrollAccumulator = 0;
  const scrollThreshold = 300; // Plus cette valeur est grande, moins le scroll est sensible
  let isScrolling = false;
  let scrollTimeout;
  
  // Initialiser la timeline de progression
  initTimelineDots();
  
  // Gestion du scrollytelling horizontal
  document.addEventListener('wheel', handleScroll, { passive: false });
  
  function initTimelineDots() {
    const timelineDots = document.querySelectorAll('.timeline-dot');
    timelineDots.forEach(dot => {
      const decade = parseInt(dot.getAttribute('data-decade'), 10);
      dot.addEventListener('click', () => {
        // Trouver l'index de la décennie cliquée
        const decadeIndex = decades.indexOf(decade);
        if (decadeIndex !== -1) {
          currentDecadeIndex = decadeIndex;
          slider.value = currentDecadeIndex + 1;
          updateDecadeDisplay();
          onDecadeChange(decades[currentDecadeIndex]);
          updateTimelineDots();
        }
      });
    });
    
    // Mettre à jour l'état initial des points de la timeline
    updateTimelineDots();
  }
  
  function updateTimelineDots() {
    const timelineDots = document.querySelectorAll('.timeline-dot');
    timelineDots.forEach(dot => {
      const dotDecade = parseInt(dot.getAttribute('data-decade'), 10);
      if (dotDecade === decades[currentDecadeIndex]) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  // Variable pour suivre les interactions
  let scrollInteractions = 0;
  
  // Fonction pour masquer l'indicateur de défilement
  function hideScrollIndicator() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = '0';
      setTimeout(() => {
        scrollIndicator.style.display = 'none';
      }, 500);
    }
  }
  // Fonction pour ajuster la taille du texte en fonction de la quantité de contenu
  function adjustTextSize() {
    if (!decadesData) return;
    
    const currentDecade = decadesData.find(d => d['start-year'] === decades[currentDecadeIndex]);
    if (!currentDecade) return;
    
    // Calculer la quantité de contenu
    const contentAmount = currentDecade.history.length;
    const contentLength = currentDecade.history.reduce((total, event) => total + event.body.length, 0);
    
    console.log(`Décennie ${decades[currentDecadeIndex]}s: ${contentAmount} événements, ${contentLength} caractères au total`);
    
    // Ajuster uniquement les classes de taille de texte, mais ne pas changer l'alignement
    decadeHistory.classList.remove('text-xs', 'text-sm', 'text-base');
    
    if (contentAmount > 5 || contentLength > 600) {
      // Beaucoup de contenu -> texte plus petit
      console.log('Beaucoup de contenu -> texte très petit');
      decadeHistory.classList.add('text-xs');
    } else if (contentAmount > 3 || contentLength > 400) {
      // Contenu moyen -> texte petit
      console.log('Contenu moyen -> texte petit');
      decadeHistory.classList.add('text-sm');
    } else {
      // Peu de contenu -> texte normal
      console.log('Peu de contenu -> texte normal');
      decadeHistory.classList.add('text-base');
    }
  }    function handleScroll(event) {
    // Vérifier si le panneau de détails est ouvert
    if (document.getElementById('app').classList.contains('details-open')) {
      // Si le panneau est ouvert, permettre le défilement normal (ne pas modifier l'événement)
      // Ceci permet de faire défiler le contenu du panneau de détails sans changer les décennies
      return;
    }
    
    // Empêcher le défilement par défaut (pour le scrollytelling)
    event.preventDefault();
    
    // Incrémenter le compteur d'interactions
    scrollInteractions++;
    
    // Si l'utilisateur a suffisamment interagi, masquer l'indicateur
    if (scrollInteractions >= 3) {
      hideScrollIndicator();
    }
    
    // Si on est déjà en train de traiter un scroll, on ignore
    if (isScrolling) return;
    
    // Accumuler la valeur du défilement
    scrollAccumulator += event.deltaY;
    
    // Débounce - attendre que l'utilisateur finisse de scroller
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Si l'accumulation dépasse le seuil dans une direction
      if (Math.abs(scrollAccumulator) >= scrollThreshold) {
        // Déterminer la direction
        const direction = scrollAccumulator > 0 ? 1 : -1;
        
        // Réinitialiser l'accumulateur
        scrollAccumulator = 0;
        
        // Empêcher les changements rapides successifs
        isScrolling = true;
        
        // Mettre à jour l'index de la décennie (direction inversée par rapport à l'original)
        const newIndex = Math.max(0, Math.min(decades.length - 1, currentDecadeIndex - direction));
        
        // Si l'index a changé, mettre à jour la visualisation
        if (newIndex !== currentDecadeIndex) {
          currentDecadeIndex = newIndex;
          slider.value = currentDecadeIndex + 1;
          
          // Animation visuelle pour le changement
          if (decadeDisplay) {
            decadeDisplay.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => {
              decadeDisplay.style.transform = 'translateX(-50%) scale(1)';
            }, 150);
          }
            // Animation du contenu textuel
          if (decadeTitle) {
            decadeTitle.style.opacity = '0';
            decadeTitle.style.transform = 'translateY(-20px)';
            
            // Pré-ajuster la taille du texte pour une transition plus fluide
            adjustTextSize();
            
            setTimeout(() => {
              // Mettre à jour les affichages
              updateDecadeDisplay();
              decadeTitle.style.opacity = '1';
              decadeTitle.style.transform = 'translateY(0)';
              
              // Mettre à jour les points de la timeline
              updateTimelineDots();
            }, 300);
          } else {
            // Mettre à jour les affichages
            updateDecadeDisplay();
            
            // Mettre à jour les points de la timeline
            updateTimelineDots();
          }
          
          // Mettre à jour le graphique
          onDecadeChange(decades[currentDecadeIndex]);
        }
        
        // Réinitialiser l'état de scroll après un délai
        setTimeout(() => {
          isScrolling = false;
        }, 50); // Délai entre les changements de décennie (en millisecondes)
      }
    }, 10); // Délai court pour le debounce (en millisecondes)
  }
    function updateDecadeDisplay() {
    // Mettre à jour le petit label sous le slider (toujours présent mais caché)
    if (decadeLabel) {
      decadeLabel.textContent = decades[currentDecadeIndex] + 's';
    }
    
    // Mettre à jour le grand affichage de la décennie
    if (decadeDisplay) {
      decadeDisplay.textContent = decades[currentDecadeIndex] + 's';
    }
    
    // Mettre à jour le contenu textuel de la décennie
    updateDecadeContent();
  }
    function updateDecadeContent() {
    if (!decadesData) return;
    
    const currentDecade = decadesData.find(d => d['start-year'] === decades[currentDecadeIndex]);
    if (!currentDecade) return;
    
    // Mettre à jour le titre de la décennie
    if (decadeTitle) {
      decadeTitle.textContent = `Les années ${decades[currentDecadeIndex]}`;
    }
    
    // Mettre à jour l'historique de la décennie
    if (decadeHistory) {
      decadeHistory.innerHTML = '';
      currentDecade.history.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.innerHTML = `
          <h3 class="text-xl font-semibold text-white">${event.title}</h3>
          <p class="text-gray-300 mt-2">${event.body}</p>
        `;
        decadeHistory.appendChild(eventElement);
        
        // Animation séquentielle des événements
        setTimeout(() => {
          eventElement.classList.add('visible');
        }, 100 * index);
      });
    }
      // Mettre à jour les genres de la décennie
    if (decadeGenres) {
      decadeGenres.innerHTML = '';
      const colors = [
        "#F40342", "#FD4102", "#FD7B03", "#FDBE00", "#E8FF0A", 
        "#02FF64", "#00FFF7", "#00C3FF", "#008CFF", "#7A00FF", 
        "#C900FF", "#FF00DC"
      ];
      
      currentDecade['genres-rating'].forEach((genre, index) => {
        const genreElement = document.createElement('span');
        genreElement.classList.add('px-3', 'py-1', 'rounded', 'text-white', 'font-medium');
        genreElement.style.backgroundColor = colors[index % colors.length];
        genreElement.style.setProperty('--index', index);
        genreElement.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
        
        // Ajouter un événement de clic pour filtrer ou mettre en évidence ce genre
        genreElement.addEventListener('click', () => {
          // Cette fonction pourrait être utilisée pour filtrer les données du graphique
          // ou pour ouvrir le panneau de détails sur ce genre
          document.getElementById('genre-title').textContent = genre;
          document.getElementById('details-panel').classList.add('slide-in');
          document.getElementById('visualization-container').classList.add('w-1/2');
        });
        
        decadeGenres.appendChild(genreElement);
      });
    }
    
    // Ajuster la taille du texte en fonction de la quantité de contenu
    adjustTextSize();
  }
  // Quand l'utilisateur lâche le slider (change), on met à jour le graphique
  slider.addEventListener('change', () => {
    currentDecadeIndex = parseInt(slider.value, 10) - 1;
    updateDecadeDisplay();
    updateTimelineDots();
    onDecadeChange(decades[currentDecadeIndex]);
    
    // Cacher l'indicateur de défilement après utilisation du slider
    hideScrollIndicator();
  });
  // Auto Play
  autoPlayButton.addEventListener('click', () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      autoPlayButton.textContent = 'Auto Play';
      return;
    }    // On commence à l'index 1 (1920s)
    currentDecadeIndex = 1;
    // Mettre à jour le slider + label
    slider.value = currentDecadeIndex + 1;
    updateDecadeDisplay();
    updateTimelineDots();
    
    // Cacher l'indicateur de défilement
    hideScrollIndicator();
    
    // Mettre à jour le graphique
    onDecadeChange(decades[currentDecadeIndex]);
    autoPlayButton.textContent = 'Stop';

    autoPlayInterval = setInterval(() => {
      currentDecadeIndex++;
      if (currentDecadeIndex < decades.length) {
        slider.value = currentDecadeIndex + 1;
        
        // Animation du contenu textuel
        if (decadeTitle) {
          decadeTitle.style.opacity = '0';
          decadeTitle.style.transform = 'translateY(-20px)';
          setTimeout(() => {            updateDecadeDisplay();
            decadeTitle.style.opacity = '1';
            decadeTitle.style.transform = 'translateY(0)';
            
            // Mettre à jour les points de la timeline
            updateTimelineDots();
          }, 300);
        } else {
          updateDecadeDisplay();
          
          // Mettre à jour les points de la timeline
          updateTimelineDots();
        }
        
        onDecadeChange(decades[currentDecadeIndex]);
      } else {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        autoPlayButton.textContent = 'Auto Play';
      }
    }, 3000);
  });

  // Retourne la valeur initiale (trigger graphique au load si besoin)
  return decades[currentDecadeIndex];
}