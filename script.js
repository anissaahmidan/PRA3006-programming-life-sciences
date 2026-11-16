const endpoint = "https://query.wikidata.org/sparql";
const genesQuery = `
SELECT ?subtype ?subtypeLabel ?gene ?geneLabel WHERE {
  ?subtype wdt:P279* wd:Q7140388 .
  ?gene wdt:P2293 ?subtype .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
async function runQuery(query) {
  const url = endpoint + "?query=" + encodeURIComponent(query) + "&format=json";
  const response = await fetch(url);
  const data = await response.json();
  return data.results.bindings;
}
function showTable(rows, containerId) {
  let html = "<table><tr><th>Subtype</th><th>Gene</th></tr>";
  for (const row of rows) {
    html += "<tr><td>" + row.subtypeLabel.value + "</td><td>" + row.geneLabel.value + "</td></tr>";
  }
  html += "</table>";
  document.getElementById(containerId).innerHTML = html;
}
runQuery(genesQuery).then(rows => {
  console.log(rows);
  showTable(rows, "genes-table");
});