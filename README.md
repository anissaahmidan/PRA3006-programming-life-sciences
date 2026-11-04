# PRA3006-programming-life-sciences
## Research question
Which genes and which drugs are linked to focal epilepsy?
## Query
### DRAFT v1 (work in progress)
#### Question: which genes and drugs are linked to focal epilepsy?

#### Step 1: started with genes only, to see if Wikidata has enough data
SELECT ?gene ?geneLabel WHERE {
  #### Q7140388 = focal epilepsy, P2293 = genetic association
  wd:Q7140388 wdt:P2293 ?gene .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 10
#### LIMIT 10 keeps the result small while I test

### TODO next:
 - add subtypes of focal epilepsy (P279*) to find more genes
 - add drugs (P2176) with UNION
 - count how many types each item is linked to (COUNT + GROUP BY)
 - not sure yet: why do some drugs have fewer links than genes?
