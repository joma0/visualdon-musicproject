export function setupControls(onDecadeChange) {
  const slider=document.getElementById('slider');
  const autoPlayButton=document.getElementById('auto-play');
  let autoPlayInterval=null;

  slider.addEventListener('input',()=>{
    const decade=2020-(slider.value-1)*10;
    onDecadeChange(decade);
  });

  autoPlayButton.addEventListener('click',()=>{
    if(autoPlayInterval){
      clearInterval(autoPlayInterval);
      autoPlayInterval=null;
      autoPlayButton.textContent='Auto Play';
      return;
    }
    slider.value='10';
    autoPlayButton.textContent='Stop';
    onDecadeChange(2020);
    autoPlayInterval=setInterval(()=>{
      if(slider.value>1){
        slider.value=parseInt(slider.value)-1;
        onDecadeChange(2020-(slider.value-1)*10);
      } else {
        clearInterval(autoPlayInterval);
        autoPlayInterval=null;
        autoPlayButton.textContent='Auto Play';
      }
    },3000);
  });
}