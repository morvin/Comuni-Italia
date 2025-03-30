// Configurazione
const CSV_URL = 'https://raw.githubusercontent.com/morvin/dati-comuni/refs/heads/main/comuni_italiani_abitantia.csv';

// Variabili globali per memorizzare i dati
let comuniData = [];
let regioni = [];

// Funzione principale che viene eseguita quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    // Determina quale pagina è attualmente caricata
    const currentPage = getCurrentPage();
    
    // Carica i dati CSV e poi inizializza la pagina appropriata
    fetchCSVData()
        .then(() => {
            switch(currentPage) {
                case 'index':
                    initRegioniPage();
                    break;
                case 'province':
                    initProvincePage();
                    break;
                case 'comuni':
                    initComuniPage();
                    break;
                case 'comune':
                    initComuneDetailPage();
                    break;
            }
        })
        .catch(error => {
            console.error('Errore durante il caricamento dei dati:', error);
            document.getElementById('loading').innerHTML = 'Errore durante il caricamento dei dati. Riprova più tardi.';
        });
});

// Funzione per determinare quale pagina è attualmente caricata
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('province.html')) return 'province';
    if (path.includes('comuni.html')) return 'comuni';
    if (path.includes('comune.html')) return 'comune';
    return 'index';
}

// Funzione per recuperare e analizzare i dati CSV
async function fetchCSVData() {
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        const csvText = await response.text();
        parseCSVData(csvText);
        
        // Nascondi il messaggio di caricamento
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Errore durante il recupero dei dati CSV:', error);
        throw error;
    }
}

// Funzione per analizzare i dati CSV
function parseCSVData(csvText) {
    // Dividi il CSV in righe
    const rows = csvText.split('\n');
    
    // La prima riga contiene le intestazioni
    const headers = rows[0].split(',');
    
    // Mappa per tenere traccia delle regioni uniche
    const regioniMap = new Map();
    
    // Analizza ogni riga di dati (salta la prima riga di intestazione)
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === '') continue; // Salta le righe vuote
        
        const values = rows[i].split(',');
        
        // Crea un oggetto per rappresentare un comune
        const comune = {
            codiceRegione: values[0],
            progressivoComune: values[1],
            codiceComuneAlfanumerico: values[2],
            denominazione: values[3],
            denominazioneRegione: values[4],
            provincia: values[5],
            flagCapoluogo: values[6],
            siglaAutomobilistica: values[7],
            codiceComuneNumerico: values[8],
            codiceCatastale: values[9],
            numeroAbitanti: values[10]
        };
        
        // Aggiungi il comune all'array
        comuniData.push(comune);
        
        // Aggiungi la regione alla mappa se non esiste già
        if (!regioniMap.has(comune.denominazioneRegione)) {
            regioniMap.set(comune.denominazioneRegione, comune.codiceRegione);
        }
    }
    
    // Converti la mappa delle regioni in un array di oggetti
    regioni = Array.from(regioniMap).map(([nome, codice]) => ({ nome, codice }));
    
    // Ordina le regioni alfabeticamente
    regioni.sort((a, b) => a.nome.localeCompare(b.nome));
}

// Funzione per inizializzare la pagina delle regioni
function initRegioniPage() {
    const container = document.getElementById('regioni-container');
    
    // Crea un elemento div per la griglia
    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid';
    
    // Crea una card per ogni regione
    regioni.forEach(regione => {
        const card = document.createElement('div');
        card.className = 'regione-card';
        card.innerHTML = `<h2>${regione.nome}</h2>`;
        
        // Aggiungi un event listener per navigare alla pagina delle province
        card.addEventListener('click', () => {
            window.location.href = `province.html?regione=${encodeURIComponent(regione.nome)}&codice=${regione.codice}`;
        });
        
        gridDiv.appendChild(card);
    });
    
    container.appendChild(gridDiv);
}

// Funzione per inizializzare la pagina delle province
function initProvincePage() {
    // Ottieni i parametri dalla URL
    const urlParams = new URLSearchParams(window.location.search);
    const regioneNome = urlParams.get('regione');
    const regioneCodice = urlParams.get('codice');
    
    if (!regioneNome || !regioneCodice) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aggiorna il titolo della pagina
    document.querySelector('h1').textContent = `Province della ${regioneNome}`;
    
    // Filtra i comuni per la regione selezionata
    const comuniInRegione = comuniData.filter(comune => comune.codiceRegione === regioneCodice);
    
    // Crea una mappa delle province uniche nella regione
    const provinceMap = new Map();
    comuniInRegione.forEach(comune => {
        if (!provinceMap.has(comune.provincia)) {
            provinceMap.set(comune.provincia, comune.siglaAutomobilistica);
        }
    });
    
    // Converti la mappa delle province in un array
    const province = Array.from(provinceMap).map(([nome, sigla]) => ({ nome, sigla }));
    
    // Ordina le province alfabeticamente
    province.sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Ottieni il container per le province
    const container = document.getElementById('province-container');
    
    // Crea un elemento div per la griglia
    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid';
    
    // Crea una card per ogni provincia
    province.forEach(provincia => {
        const card = document.createElement('div');
        card.className = 'provincia-card';
        card.innerHTML = `<h2>${provincia.nome} (${provincia.sigla})</h2>`;
        
        // Aggiungi un event listener per navigare alla pagina dei comuni
        card.addEventListener('click', () => {
            window.location.href = `comuni.html?regione=${encodeURIComponent(regioneNome)}&provincia=${encodeURIComponent(provincia.nome)}`;
        });
        
        gridDiv.appendChild(card);
    });
    
    container.appendChild(gridDiv);
}

// Funzione per inizializzare la pagina dei comuni
function initComuniPage() {
    // Ottieni i parametri dalla URL
    const urlParams = new URLSearchParams(window.location.search);
    const regioneNome = urlParams.get('regione');
    const provinciaNome = urlParams.get('provincia');
    
    if (!regioneNome || !provinciaNome) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aggiorna il titolo della pagina
    document.querySelector('h1').textContent = `Comuni della provincia di ${provinciaNome}`;
    
    // Filtra i comuni per la provincia selezionata
    const comuniInProvincia = comuniData.filter(comune => 
        comune.denominazioneRegione === regioneNome && 
        comune.provincia === provinciaNome
    );
    
    // Ordina i comuni alfabeticamente
    comuniInProvincia.sort((a, b) => a.denominazione.localeCompare(b.denominazione));
    
    // Ottieni il container per i comuni
    const container = document.getElementById('comuni-container');
    
    // Crea un elemento div per la griglia
    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid';
    
    // Crea una card per ogni comune
    comuniInProvincia.forEach(comune => {
        const card = document.createElement('div');
        card.className = 'comune-card';
        card.innerHTML = `
            <h2>${comune.denominazione}</h2>
            <p>Abitanti: ${comune.numeroAbitanti}</p>
            ${comune.flagCapoluogo === '1' ? '<p><strong>Capoluogo di provincia</strong></p>' : ''}
        `;
        
        // Aggiungi un event listener per navigare alla pagina di dettaglio del comune
        card.addEventListener('click', () => {
            window.location.href = `comune.html?codice=${encodeURIComponent(comune.codiceComuneAlfanumerico)}`;
        });
        
        gridDiv.appendChild(card);
    });
    
    container.appendChild(gridDiv);
}

// Funzione per inizializzare la pagina di dettaglio del comune
function initComuneDetailPage() {
    // Ottieni i parametri dalla URL
    const urlParams = new URLSearchParams(window.location.search);
    const codiceComuneAlfanumerico = urlParams.get('codice');
    
    if (!codiceComuneAlfanumerico) {
        window.location.href = 'index.html';
        return;
    }
    
    // Trova il comune selezionato
    const comune = comuniData.find(c => c.codiceComuneAlfanumerico === codiceComuneAlfanumerico);
    
    if (!comune) {
        window.location.href = 'index.html';
        return;
    }
    
    // Aggiorna il titolo della pagina
    document.querySelector('h1').textContent = comune.denominazione;
    
    // Ottieni il container per i dettagli del comune
    const container = document.getElementById('comune-details-container');
    
    // Crea un elemento div per i dettagli
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'comune-details';
    
    // Popola i dettagli del comune
    detailsDiv.innerHTML = `
        <h2>${comune.denominazione}</h2>
        <p><strong>Regione:</strong> ${comune.denominazioneRegione}</p>
        <p><strong>Provincia:</strong> ${comune.provincia} (${comune.siglaAutomobilistica})</p>
        <p><strong>Codice Comune:</strong> ${comune.codiceComuneAlfanumerico}</p>
        <p><strong>Codice Catastale:</strong> ${comune.codiceCatastale}</p>
        <p><strong>Abitanti:</strong> ${comune.numeroAbitanti}</p>
        ${comune.flagCapoluogo === '1' ? '<p><strong>Capoluogo di provincia</strong></p>' : ''}
    `;
    
    // Aggiungi il div dei dettagli al container
    container.appendChild(detailsDiv);
    
    // Carica le notizie Google per il comune
    loadGoogleNews(comune.denominazione, comune.denominazioneRegione);
}

// Funzione per caricare le notizie Google
function loadGoogleNews(comuneNome, regioneNome) {
    const newsContainer = document.getElementById('news-container');
    
    if (!newsContainer) return;
    
    // Crea un elemento div per il feed di notizie
    const newsDiv = document.createElement('div');
    newsDiv.className = 'news-feed';
    newsDiv.innerHTML = `
        <h3>Ultime notizie su ${comuneNome}</h3>
        <p>Per visualizzare le ultime notizie su ${comuneNome}, cerca su Google:</p>
        <a href="https://www.google.com/search?q=${encodeURIComponent(comuneNome + ' ' + regioneNome + ' notizie')}" target="_blank" class="news-link">
            Notizie su ${comuneNome}
        </a>
    `;
    
    newsContainer.appendChild(newsDiv);
}
