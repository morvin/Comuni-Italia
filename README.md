# Comuni Italiani

Un sito web semplice per esplorare i comuni italiani, organizzati per regioni e province.

## Caratteristiche

- Visualizzazione delle regioni italiane
- Navigazione alle province di una regione selezionata
- Elenco dei comuni di una provincia selezionata
- Pagina di dettaglio per ogni comune con informazioni complete
- Link alle notizie Google per ogni comune
- Lettura diretta dei dati da un file CSV ospitato su GitHub

## Struttura del Progetto

- `index.html` - Pagina principale con l'elenco delle regioni
- `province.html` - Pagina che mostra le province di una regione selezionata
- `comuni.html` - Pagina che mostra i comuni di una provincia selezionata
- `comune.html` - Pagina di dettaglio di un singolo comune
- `css/style.css` - Stili CSS per tutte le pagine
- `js/main.js` - Codice JavaScript per la gestione dei dati e della navigazione

## Fonte Dati

Il sito utilizza i dati dei comuni italiani dal seguente file CSV:
[https://raw.githubusercontent.com/morvin/dati-comuni/refs/heads/main/comuni_italiani_abitantia.csv](https://raw.githubusercontent.com/morvin/dati-comuni/refs/heads/main/comuni_italiani_abitantia.csv)

## Come Utilizzare

1. Clona questo repository
2. Apri `index.html` nel tuo browser
3. Naviga tra regioni, province e comuni

Oppure visita la versione online del sito (se disponibile).

## Sviluppo Locale

Per eseguire il sito localmente:

```bash
# Utilizzando Python
python -m http.server 8000

# Oppure con Node.js
npx serve
```

Quindi apri `http://localhost:8000` nel tuo browser.
