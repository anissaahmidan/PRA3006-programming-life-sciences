const endpoint = "https://query.wikidata.org/sparql";

const genesQuery = `
SELECT ?subtype ?subtypeLabel ?gene ?geneLabel WHERE {
  ?subtype wdt:P279* wd:Q7140388 .
  ?gene wdt:P2293 ?subtype .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

const drugsQuery = `
SELECT ?subtype ?subtypeLabel ?drug ?drugLabel WHERE {
  ?subtype wdt:P279* wd:Q7140388 .
  ?subtype wdt:P2176 ?drug .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

async function runQuery(query) {
  const url = endpoint + "?query=" + encodeURIComponent(query) + "&format=json";
  const response = await fetch(url);
  const data = await response.json();
  return data.results.bindings;
}

function showTable(rows, containerId, header, column) {
  let html = "<table><tr><th>Subtype</th><th>" + header + "</th></tr>";
  for (const row of rows) {
    html += "<tr><td>" + row.subtypeLabel.value + "</td><td>" + row[column].value + "</td></tr>";
  }
  html += "</table>";
  document.getElementById(containerId).innerHTML = html;
}

function countPerSubtype(rows) {
  const counts = d3.rollup(
    rows,
    group => group.length,
    row => row.subtypeLabel.value
  );
  return Array.from(counts, ([subtype, count]) => ({ subtype: subtype, count: count }))
    .sort((a, b) => b.count - a.count);
}

function drawBarChart(data, containerId) {
  // space around the chart (big left margin for the long subtype names)
  const margin = { top: 10, right: 30, bottom: 30, left: 330 };
  const totalWidth = document.getElementById(containerId).clientWidth;
  const width = totalWidth - margin.left - margin.right;
  const height = data.length * 30;

  const svg = d3.select("#" + containerId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.subtype))
    .range([0, height])
    .padding(0.2);

  svg.append("g").call(d3.axisLeft(y));
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(d3.max(data, d => d.count)));

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => y(d.subtype))
    .attr("width", d => x(d.count))
    .attr("height", y.bandwidth())
}

if (document.getElementById("genes-chart")) {
  runQuery(genesQuery).then(rows => {
    console.log(rows);
    drawBarChart(countPerSubtype(rows), "genes-chart");
    showTable(rows, "genes-table", "Gene", "geneLabel");
  });
}

if (document.getElementById("drugs-chart")) {
  runQuery(drugsQuery).then(rows => {
    console.log(rows);
    drawBarChart(countPerSubtype(rows), "drugs-chart");
    showTable(rows, "drugs-table", "Drug", "drugLabel");
  });
}

function buildNetwork(geneRows, drugRows) {
  const nodes = [];
  const links = [];
  const seen = new Set(); // names that already have a node

  function addNode(name, type) {
    if (!seen.has(name)) {
      seen.add(name);
      nodes.push({ id: name, type: type });
    }
  }

  for (const row of geneRows) {
    addNode(row.subtypeLabel.value, "subtype");
    addNode(row.geneLabel.value, "gene");
    links.push({ source: row.subtypeLabel.value, target: row.geneLabel.value });
  }

  for (const row of drugRows) {
    addNode(row.subtypeLabel.value, "subtype");
    addNode(row.drugLabel.value, "drug");
    links.push({ source: row.subtypeLabel.value, target: row.drugLabel.value });
  }

  return { nodes: nodes, links: links };
}

function drawNetwork(network, containerId) {
  const width = document.getElementById(containerId).clientWidth;
  const height = 700;

  function space(d) {
    if (d.type === "subtype") {
      return d.id.length * 3.2;
    }
    return 14;
  }

  const svg = d3.select("#" + containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const tooltip = d3.select("#tooltip");

  const link = svg.append("g")
    .selectAll("line")
    .data(network.links)
    .enter()
    .append("line")
    .attr("class", "link");

  const node = svg.append("g")
    .selectAll("circle")
    .data(network.nodes)
    .enter()
    .append("circle")
    .attr("r", d => d.type === "subtype" ? 12 : 7)
    .attr("class", d => d.type)
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1).text(d.id + " (" + d.type + ")");
      link.classed("highlight", l => l.source === d || l.target === d);
    })
    .on("mousemove", event => {
      tooltip.style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
      link.classed("highlight", false);
    })
    .call(d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));

  const label = svg.append("g")
    .selectAll("text")
    .data(network.nodes.filter(d => d.type === "subtype"))
    .enter()
    .append("text")
    .attr("class", "network-label")
    .attr("text-anchor", "middle")
    .text(d => d.id);

  const simulation = d3.forceSimulation(network.nodes)
    .force("link", d3.forceLink(network.links).id(d => d.id).distance(45))
    .force("charge", d3.forceManyBody().strength(-60))
    .force("collide", d3.forceCollide().radius(d => space(d)))
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.08))
    .on("tick", () => {
      node.attr("cx", d => d.x = Math.max(space(d), Math.min(width - space(d), d.x)))
        .attr("cy", d => d.y = Math.max(20, Math.min(height - 30, d.y)));

      link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      label.attr("x", d => d.x)
        .attr("y", d => d.y + 26);
    });
}