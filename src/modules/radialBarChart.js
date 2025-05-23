/* src/modules/radialBarChart.js */
import * as d3 from 'd3';

export default function radialBarChart() {
  // Configurables
  let capitalizeLabels = true;
  let barColors = ['#B66199','#9392CB','#76D9FA','#BCE3AD','#FFD28C','#F2918B'];
  let domain = [0,12];
  let tickCircleValues = [2, 4, 6, 8, 10, 12]; // Cercles de séparation aux paliers pairs
  let colorLabels = false;
  let transitionDuration = 800;
  let clickCallback = null;

  function chart(selection) {
    selection.each(function(dataArr) {
      const data = Object.entries(dataArr[0].data).map(([name,value])=>({name,value}));
      const numBars = data.length;
      const barHeight = Math.min(window.innerWidth, window.innerHeight) * 0.3;
      const size = barHeight * 2;
      const margin = {top: 20, right: 20, bottom: 20, left: 20};
      const radius = barHeight;
      const labelRadius = radius * 1.025;

      // Select or create SVG
      let svg = d3.select(this).select('svg');
      let isNew = svg.empty();

      if (isNew) {
        svg = d3.select(this)
          .append('svg')
          .attr('width', size + margin.left + margin.right)
          .attr('height', size + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left + radius},${margin.top + radius})`)
          .classed('radial-barchart', true);
      } else {
        svg = svg.select('g.radial-barchart');
      }

      // Scales
      const barScale = d3.scaleLinear().domain(domain).range([0, barHeight]);

      // On supprime les cercles d'ici pour les mettre après les barres

      // Layers
      let layers = svg.selectAll('g.layer')
        .data([data]);

      layers = layers.enter()
        .append('g')
        .classed('layer', true)
        .merge(layers);

      // Arcs
      const arcGen = d3.arc();

      const arcs = layers.selectAll('path')
        .data(d => d, d => d.name); // use 'name' as key

      arcs.enter()
        .append('path')
        .style('fill', (d,i) => barColors[i % barColors.length])
        .style('cursor', 'pointer')
        .on('click',(event,d) => clickCallback && clickCallback(d))
        .merge(arcs)
        .transition()
        .duration(transitionDuration)
        .attrTween('d', function(d, i) {
            const start = (i * 2 * Math.PI) / numBars;
            const end = ((i + 1) * 2 * Math.PI) / numBars;
            const previous = this.__prevValue__ ?? 0;
            const interp = d3.interpolate(previous, d.value);
            this.__prevValue__ = d.value;
            return t => {
                const r = barScale(interp(t));
                return d3.arc()({ innerRadius: 0, outerRadius: r, startAngle: start, endAngle: end });
            };
        });

      arcs.exit().remove();

      // Tick Circles - Cercles de séparation par-dessus les barres
      let tickCirclesGroup = svg.select('g.tick-circles');
      if (tickCirclesGroup.empty()) {
        tickCirclesGroup = svg.append('g').classed('tick-circles', true);
      }
      
      const tickCircles = tickCirclesGroup.selectAll('circle')
        .data(tickCircleValues);
      
      tickCircles.enter()
        .append('circle')
        .merge(tickCircles)
        .attr('r', d => barScale(d))
        .style('fill', 'none')
        .style('stroke', 'rgba(255,255,255,0.6)') // Plus visible
        .style('stroke-width', '2px')
        .style('stroke-dasharray', '4,4') // Ligne pointillée plus marquée
        .style('pointer-events', 'none'); // Les cercles ne bloquent pas les clics

      // Overlays (only on first render)
      if (isNew) {
        const overlays = svg.append('g').classed('overlays', true);
        
        // Spokes - lignes de séparation radiales
        overlays.append('g').classed('spokes', true)
          .selectAll('line')
          .data(data)
          .enter().append('line')
          .attr('y2', -barHeight)
          .attr('transform', (_,i) => `rotate(${(360/numBars)*i})`)
          .style('stroke', 'rgba(255,255,255,0.2)')
          .style('stroke-width', '1px');
        
        // Axe retiré - on garde seulement les cercles de séparation et les lignes radiales

        // Outer circle - cercle extérieur
        overlays.append('circle')
          .attr('r', barHeight)
          .classed('outer', true)
          .style('fill', 'none')
          .style('stroke', 'rgba(255,255,255,0.4)')
          .style('stroke-width', '2px');
      }

      // Labels (only on first render)
      if (isNew) {
        const labelsG = svg.append('g').classed('labels', true);
        const defs = labelsG.append('defs');
        defs.append('path')
          .attr('id', 'label-path')
          .attr('d', `M0,${-labelRadius} A${labelRadius},${labelRadius} 0 1,1 -0.01,${-labelRadius}`);

        labelsG.selectAll('text')
          .data(data)
          .enter().append('text')
          .style('text-anchor', 'middle')
          .style('fill', (_,i) => colorLabels ? barColors[i % barColors.length] : '#fff')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .append('textPath')
          .attr('xlink:href', '#label-path')
          .attr('startOffset', (_,i) => `${i * 100 / numBars + 50/numBars}%`)
          .text(d => capitalizeLabels ? d.name.toUpperCase() : d.name);
      }

    });
  }

  // Getters/setters
  chart.capitalizeLabels = function(v) { if(!arguments.length) return capitalizeLabels; capitalizeLabels=v; return chart; };
  chart.barColors = function(v) { if(!arguments.length) return barColors; barColors=v; return chart; };
  chart.domain = function(v) { if(!arguments.length) return domain; domain=v; return chart; };
  chart.tickCircleValues = function(v) { if(!arguments.length) return tickCircleValues; tickCircleValues=v; return chart; };
  chart.colorLabels = function(v) { if(!arguments.length) return colorLabels; colorLabels=v; return chart; };
  chart.transitionDuration = function(v) { if(!arguments.length) return transitionDuration; transitionDuration=v; return chart; };
  chart.onClick = function(cb) { if(!arguments.length) return clickCallback; clickCallback=cb; return chart; };

  // Compatibility stubs
  chart.barHeight = function(v) { return chart; };
  chart.reverseLayerOrder = function(v) { return chart; };
  chart.tickValues = function(v) { return chart; };

  return chart;
}