import * as d3 from 'd3';

export default function radialBarChart() {
  // Configurables
  let capitalizeLabels = true;
  let barColors = ['#B66199','#9392CB','#76D9FA','#BCE3AD','#FFD28C','#F2918B'];
  let domain = [0,12];
  let tickCircleValues = [1,2,3,4,5,6,7,8,9,10,11];
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

      // Tick Circles (only on first render)
      if (isNew) {
        const tickCircles = svg.append('g').classed('tick-circles', true);
        tickCircleValues.forEach(d => {
          tickCircles.append('circle')
            .attr('r', barScale(d))
            .style('fill', 'none');
        });
      }

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

            // 🔧 Smooth transition from previous value
            const previous = this.__prevValue__ ?? 0;
            const interp = d3.interpolate(previous, d.value);
            this.__prevValue__ = d.value;

            return t => {
                const r = barScale(interp(t));
                return d3.arc()({ innerRadius: 0, outerRadius: r, startAngle: start, endAngle: end });
            };
        });

      arcs.exit().remove();

      // Overlays (only on first render)
      if (isNew) {
        const overlays = svg.append('g').classed('overlays', true);
        // spokes
        overlays.append('g').classed('spokes', true)
          .selectAll('line')
          .data(data)
          .enter().append('line')
          .attr('y2', -barHeight)
          .attr('transform', (_,i) => `rotate(${(360/numBars)*i})`)
          .style('stroke', 'rgba(255,255,255,0.2)');
        // axis
        const axisScale = d3.scaleLinear().domain(domain).range([0, -barHeight]);
        overlays.append('g').classed('axis', true)
          .call(d3.axisRight(axisScale).ticks(5));
        // outer circle
        overlays.append('circle')
          .attr('r', barHeight)
          .classed('outer', true)
          .style('fill', 'none');
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
