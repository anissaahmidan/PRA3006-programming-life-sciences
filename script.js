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

runQuery(genesQuery).then(rows => {
  console.log(rows);
  showTable(rows, "genes-table", "Gene", "geneLabel");
});

runQuery(drugsQuery).then(rows => {
  console.log(rows);
  showTable(rows, "drugs-table", "Drug", "drugLabel");
});