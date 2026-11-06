# Genes and Drugs Linked to Focal Epilepsy
This project is a web-page based visualisation tool developed for the course 'Programming in the Life Sciences' at Maastricht University. It explores which genes and which drugs are linked to focal epilepsy, using open data from Wikidata.
## 1. My Research Question
Which genes and which drugs are linked to focal epilepsy?
## 2. Aim of this Project
My goal is to make the relationship between focal epilepsy, genes and drugs visible and explorable for users who are not familiar with raw data, by turning complex tables into intuitive visualisations that make patterns easier to understand.
The website answers the research question by:
- collecting structured data on focal epilepsy, its genes and its drugs from Wikidata.
- visualising these genes and drugs in an interactive way.
- allowing users to explore which genes and drugs are connected to which type of focal epilepsy.
## 3. Data Source
All the data of this project is traceable to Wikidata, which is a collaborative and open knowledge database.
### 3.1 Data Collection
I used SPARQL endpoints to query Wikidata and retrieve:
- genes that are associated with focal epilepsy
- drugs that are used to treat focal epilepsy
- the subtypes of focal epilepsy these genes and drugs are linked to
The SPARQL queries are executed from my JavaScript code. The returned data is then cleaned and transformed into the format required for the visualisation.
### 3.2 Analysis
To answer the research question, I focused on two aspects:
- Which genes are linked to focal epilepsy? → identified via the SPARQL queries on Wikidata.
- Which drugs are linked to focal epilepsy? → identified via the SPARQL queries on Wikidata.

Their connections are then shown by:
- the genes and drugs connected to each subtype of focal epilepsy
- genes and drugs that are shared between several subtypes
- the number of genes and drugs per subtype
