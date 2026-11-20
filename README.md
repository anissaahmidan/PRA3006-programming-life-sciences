# PRA3006 : Focal Epilepsy

A small website made for my programming in the life sciences course that shows which genes and which drugs are linked to focal epilepsy and its subtypes. All the data comes live from Wikidata.

## 1. Research question

**Which genes and which drugs are linked to focal epilepsy and its subtypes, and which of them are shared between subtypes?**

## 2. Background

In focal epilepsy, seizures start in one area of the brain, for example the temporal or the frontal lobe. There are many subtypes. Some are caused by a change in a specific gene, and different subtypes are treated with different drugs.

I chose this topic because my bachelor thesis is also about epilepsy. I wanted to see what an open database like Wikidata knows about the genetics and the treatment of the different subtypes, and whether subtypes have genes or drugs in common.

## 3. How to use the website

1. Download this repository: either **Download ZIP**, then unzip it. Or clone it:
   ```
   git clone https://github.com/anissaahmidan/PRA3006-programming-life-sciences.git
   ```
2. Open `index.html` in a web browser.
3. Use the menu at the top to go to the different pages.

### The pages

| Page | What it shows |
|---|---|
| Home (`index.html`) | Introduction, the research question, what I found and how to use the site |
| Genes (`genes.html`) | Bar chart of the number of genes per subtype, and a table with every gene |
| Drugs (`drugs.html`) | Bar chart of the number of drugs per subtype, and a table with every drug |
| Network (`network.html`) | Interactive network of all subtypes, genes and drugs. Hover over a circle to see its name and its connections, and drag circles to move them |

## 4. Data

### 4.1 Source

All data comes from [Wikidata](https://www.wikidata.org), a free and open knowledge base that anyone can edit. I query it through its SPARQL endpoint: `https://query.wikidata.org/sparql`.

### 4.2 Queries

The queries are saved in the `queries` folder. Queries 2 and 3 are also written in `script.js`.

| Query | File | What it returns | Result (16 Nov 2026) |
|---|---|---|---|
| 1. Subtypes | `queries/query1_subtypes.rq` | Focal epilepsy and all its subtypes | 47 items |
| 2. Genes | `queries/query2_genes.rq` | Genes linked to focal epilepsy or one of its subtypes | 12 genes across 8 subtypes |
| 3. Drugs | `queries/query3_drug.rq` | Drugs used to treat focal epilepsy or one of its subtypes | 20 drugs across 4 subtypes (24 links) |

The Wikidata items and properties I use:

| Code | Meaning |
|---|---|
| `wd:Q7140388` | focal epilepsy |
| `wdt:P279` | subclass of. With `*` it also finds subclasses of subclasses, so all subtypes at any level |
| `wdt:P2293` | genetic association (gene linked to a disease) |
| `wdt:P2176` | drug or therapy used for treatment |

Query 1 finds all subtypes. Queries 2 and 3 start with the same line as query 1, and then look for the genes or the drugs of those subtypes.

## 5. How it works

1. `script.js` sends a SPARQL query to Wikidata with `fetch` and gets the results back as JSON.
2. For the bar charts, the rows are grouped per subtype and counted with `d3.rollup`.
3. The bar charts and the network are drawn with [d3.js](https://d3js.org) (version 7). The tables are built as HTML in JavaScript.
4. For the network, every subtype, gene and drug becomes a circle (a node), and every row from the queries becomes a line (a link). A drug that is linked to two subtypes gets one circle with two lines, which makes shared drugs easy to see. The circles are placed by a d3 force simulation.
5. `style.css` contains all the styling for every page.

## 6. Results

- **Genes:** no gene is shared between subtypes. Every gene is linked to only one subtype. Focal epilepsy itself has the most genes (4: ADCY9, PTPRD, SCN3A and ZNF385D).
- **Drugs:** some drugs are shared. Lamotrigine, carbamazepine and levetiracetam are each linked to more than one subtype. Focal epilepsy itself has the most drugs (13).
- Genes and drugs are mostly linked to different subtypes. Only focal epilepsy itself has both genes and drugs in Wikidata.

## 7. Limitations

- Wikidata is edited by volunteers, so the data is incomplete. Many subtypes have no genes or drugs at all, and some well-known drugs are missing. For example lacosamide, a common drug for focal seizures, is not in the results.
- Some labels are unusual. Levetiracetam is called "(S)-etiracetam" and carbamazepine is spelled "carbamazepin".
- "Generalized epilepsy-paroxysmal dyskinesia syndrome" shows up as a subtype of focal epilepsy, even though its name says generalised. This comes from how it is classified in Wikidata.
- The data is loaded live, so the results can change when someone edits Wikidata. The numbers in this README are from 16 November 2026.
- This website is for education only and is not medical advice.

## 8. Repository structure

```
index.html      home page
genes.html      genes page (bar chart and table)
drugs.html      drugs page (bar chart and table)
network.html    network page
script.js       all the JavaScript: queries, tables, bar charts, network
style.css       styling for all pages
queries/        the three SPARQL queries
LICENSE         GPL-3.0 license
README.md       this file
```

## 9. Tools

- HTML, CSS and JavaScript
- SPARQL, to query Wikidata
- [d3.js](https://d3js.org) version 7, for the charts and the network
- Git and GitHub, for version control

## 10. Use of AI

I used Claude to: 
- help me understand different sources that explain code and how to write them
- explain errors and parts of d3.js
- give feedback on the text
- formatting of `README.md`

## 11. Author and license

Made by Anissa Ahmidan, Maastricht University, 2026.
This project is licensed under the GPL-3.0 license, see `LICENSE`.
