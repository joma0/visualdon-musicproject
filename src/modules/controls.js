export function setupControls(onDecadeChange) {
  const slider = document.getElementById('slider');
  const autoPlayButton = document.getElementById('auto-play');
  let autoPlayInterval = null;

  const decades = [1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010];

  // Quand l'utilisateur lâche le slider (change), on met à jour le graphique
  slider.addEventListener('change', () => {
    const idx = parseInt(slider.value, 10) - 1;
    onDecadeChange(decades[idx]);
  });

  // Auto Play
  autoPlayButton.addEventListener('click', () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      autoPlayButton.textContent = 'Auto Play';
      return;
    }

    // On commence à l'index 10 (2010s)
    let currentIndex = 10;
    // Mettre à jour le slider + label
    slider.value = currentIndex + 1;
    slider.dispatchEvent(new Event('input'));  // seulement label
    // Mettre à jour le graphique
    onDecadeChange(decades[currentIndex]);
    autoPlayButton.textContent = 'Stop';

    autoPlayInterval = setInterval(() => {
      currentIndex--;
      if (currentIndex >= 0) {
        slider.value = currentIndex + 1;
        slider.dispatchEvent(new Event('input')); // label
        onDecadeChange(decades[currentIndex]);    // graphique
      } else {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        autoPlayButton.textContent = 'Auto Play';
      }
    }, 3000);
  });

  // Retourne la valeur initiale (trigger graphique au load si besoin)
  return parseInt(slider.value, 10) - 1;
}