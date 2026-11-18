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

runQuery(genesQuery).then(rows => {
  console.log(rows);
  drawBarChart(countPerSubtype(rows), "genes-chart");
  showTable(rows, "genes-table", "Gene", "geneLabel");
});

runQuery(drugsQuery).then(rows => {
  console.log(rows);
  drawBarChart(countPerSubtype(rows), "drugs-chart");
  showTable(rows, "drugs-table", "Drug", "drugLabel");
});