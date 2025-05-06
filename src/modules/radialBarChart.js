import * as d3 from "d3";

function radialBarChart() {
  // Variables configurables
  let margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var barHeight = 100;
  var reverseLayerOrder = false;
  var barColors = undefined;
  var capitalizeLabels = false;
  var domain = [0, 100];
  var tickValues = undefined;
  var colorLabels = false;
  var tickCircleValues = [];
  var transitionDuration = 1000;

  // Variables internes
  var numBars = null;
  var barScale = null;
  var keys = null;
  var labelRadius = 0;

  function init(d) {
    // Définir l'échelle pour le graphique
    barScale = d3.scaleLinear().domain(domain).range([0, barHeight]);

    // Récupère les clés de l'objet data
    keys = Object.keys(d[0].data);
    numBars = keys.length;

    labelRadius = barHeight * 1.025;
  }

  function svgRotate(a) {
    return "rotate(" + a + ")";
  }

  function svgTranslate(x, y) {
    return "translate(" + x + "," + y + ")";
  }

  // Initialisation du graphique
  function initChart(container) {
    var g = d3
      .select(container)
      .append("svg")
      .style("width", 2 * barHeight + margin.left + margin.right + "px")
      .style("height", 2 * barHeight + margin.top + margin.bottom + "px")
      .style("background", "black")
      .append("g")
      .classed("radial-barchart", true)
      .attr(
        "transform",
        svgTranslate(margin.left + barHeight, margin.top + barHeight)
      );

    // Cercles de repère aux tick values spécifiées
    g.append("g")
      .classed("tick-circles", true)
      .selectAll("circle")
      .data(tickCircleValues)
      .enter()
      .append("circle")
      .attr("r", function (d) {
        return barScale(d);
      })
      .style("fill", "none")
      .style("stroke", "white");
  }

  function renderOverlays(container) {
    var g = d3.select(container).select("svg g.radial-barchart");

    // Spokes
    g.append("g")
      .classed("spokes", true)
      .selectAll("line")
      .data(keys)
      .enter()
      .append("line")
      .attr("y2", -barHeight)
      .attr("transform", function (d, i) {
        return svgRotate((i * 360) / numBars);
      })
      .style("stroke", "white"); // Change la couleur des lignes en blanc

    // Axe
    var axisScale = d3.scaleLinear().domain(domain).range([0, -barHeight]);
    var axis = d3.axisRight(axisScale);
    if (tickValues) {
      axis.tickValues(tickValues);
    }
    g.append("g").classed("axis", true).call(axis).style("color", "white"); // Change la couleur de l'axe en blanc

    // Cercle extérieur
    g.append("circle")
      .attr("r", barHeight)
      .classed("outer", true)
      .style("fill", "none")
      .style("stroke", "white"); // Change la couleur du cercle extérieur en blanc

    // Labels
    var labels = g.append("g").classed("labels", true);

    labels
      .append("defs")
      .append("path")
      .attr("id", "label-path")
      .attr(
        "d",
        "m0 " +
          -labelRadius +
          " a" +
          labelRadius +
          " " +
          labelRadius +
          " 0 1,1 -0.01 0"
      );

    labels
      .selectAll("text")
      .data(keys)
      .enter()
      .append("text")
      .style("text-anchor", "middle")
      .style("fill", "white") // Change la couleur des labels en blanc
      .append("textPath")
      .attr("xlink:href", "#label-path")
      .attr("startOffset", function (d, i) {
        return (i * 100) / numBars + 50 / numBars + "%";
      })
      .text(function (d) {
        return capitalizeLabels ? d.toUpperCase() : d;
      })
      .style("fill", "white"); // Change aussi la couleur du texte sur le path
  }

  function chart(selection) {
    selection.each(function (d) {
      init(d);

      if (reverseLayerOrder) d.reverse();

      var g = d3.select(this).select("svg g.radial-barchart");

      // Vérifie si le graphique existe déjà
      var update = !g.empty();

      if (!update) initChart(this);

      g = d3.select(this).select("svg g.radial-barchart");

      // Gestion des couches (enter/exit/update)
      var layers = g.selectAll("g.layer").data(d);

      layers
        .enter()
        .append("g")
        .attr("class", function (d, i) {
          return "layer-" + i;
        })
        .classed("layer", true);

      layers.exit().remove();

      // Gestion des segments
      var segments = layers.selectAll("path").data(function (d) {
        return Object.values(d.data);
      });

      // Sélection des nouveaux segments
      var segmentsEnter = segments
        .enter()
        .append("path")
        .style("fill", function (d, i) {
          if (!barColors) return;
          return barColors[i % barColors.length];
        });

      // Fusionner la sélection enter avec la sélection update
      segments = segmentsEnter.merge(segments);

      segments.exit().remove();

      segments
        .transition()
        .duration(transitionDuration)
        .attr(
          "d",
          d3.arc().innerRadius(0).outerRadius(or).startAngle(sa).endAngle(ea)
        );

      if (!update) renderOverlays(this);
    });
  }

  // Fonctions d'arc
  function or(d, i) {
    return barScale(d);
  }
  function sa(d, i) {
    return (i * 2 * Math.PI) / numBars;
  }
  function ea(d, i) {
    return ((i + 1) * 2 * Math.PI) / numBars;
  }

  // Getters/Setters
  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.barHeight = function (_) {
    if (!arguments.length) return barHeight;
    barHeight = _;
    return chart;
  };

  chart.reverseLayerOrder = function (_) {
    if (!arguments.length) return reverseLayerOrder;
    reverseLayerOrder = _;
    return chart;
  };

  chart.barColors = function (_) {
    if (!arguments.length) return barColors;
    barColors = _;
    return chart;
  };

  chart.capitalizeLabels = function (_) {
    if (!arguments.length) return capitalizeLabels;
    capitalizeLabels = _;
    return chart;
  };

  chart.domain = function (_) {
    if (!arguments.length) return domain;
    domain = _;
    return chart;
  };

  chart.tickValues = function (_) {
    if (!arguments.length) return tickValues;
    tickValues = _;
    return chart;
  };

  chart.colorLabels = function (_) {
    if (!arguments.length) return colorLabels;
    colorLabels = _;
    return chart;
  };

  chart.tickCircleValues = function (_) {
    if (!arguments.length) return tickCircleValues;
    tickCircleValues = _;
    return chart;
  };

  chart.transitionDuration = function (_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return chart;
  };

  return chart;
}

export default radialBarChart;
