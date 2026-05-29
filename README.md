# Tuin Perfect Website

Professionele website voor Tuin Perfect - een tuinaanleg en onderhoud bedrijf. Deze website is geoptimaliseerd voor traditionele webhosting (mijn.host).

## Website structuur

```
├── index.html          # Homepage
├── diensten.html       # Diensten pagina
├── projecten.html      # Projecten/Portfolio pagina
├── contact.html        # Contact pagina
├── css/
│   └── style.css      # Geconsolideerde stylesheet
├── js/
│   └── main.js        # JavaScript functionaliteit
└── images/
    ├── logo.jpeg      # Origineel logo
    ├── flyer-1.jpg    # Flyer afbeeldingen
    ├── flyer-2.jpg
    ├── flyer-3.jpg
    ├── flyer-4.jpg
    ├── flyer-5.jpg
    └── flyer-6.jpg
```

## Upload instructies voor mijn.host

### 1. Voorbereiding
- Zorg dat je een FTP client hebt geïnstalleerd (bijv. FileZilla, Cyberduck)
- Of gebruik de File Manager in het mijn.host control panel

### 2. Bestanden uploaden
1. Log in op je mijn.host account
2. Ga naar "File Manager" of verbind via FTP met je hosting
3. Navigeer naar de `public_html` map (of `www` map)
4. Upload ALLE bestanden en mappen:
   - Alle `.html` bestanden in de root
   - De `css/` map met `style.css`
   - De `js/` map met `main.js`
   - De `images/` map met alle afbeeldingen

### 3. Structuur controleren
Na uploaden moet de structuur er zo uitzien op de server:
```
public_html/
├── index.html
├── diensten.html
├── projecten.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    ├── logo.jpeg
    └── flyer-*.jpg
```

### 4. Testen
- Ga naar je domein (bijv. www.tuinperfect.nl)
- Test alle pagina's: Home, Diensten, Projecten, Contact
- Test de navigatie op desktop en mobiel
- Test het contactformulier

## Contactgegevens op website

De website bevat de volgende contactgegevens:
- **Telefoon:** 06 8535 0145
- **E-mail:** tuinperfect@gmail.com
- **Werkgebied:** Door heel Nederland

## Technische details

- **Type:** Statische HTML/CSS/JS website
- **Responsive:** Ja, mobile-first design
- **Browsers:** Chrome, Firefox, Safari, Edge (laatste 2 versies)
- **Geen server-side:** Werkt op elke standaard webhosting

## Features

- ✅ Mobiel responsive design
- ✅ Werkende navigatie tussen pagina's
- ✅ Contactformulier met validatie
- ✅ Before/After vergelijking slider
- ✅ Geoptimaliseerde afbeeldingen
- ✅ Origineel Tuin Perfect logo
- ✅ Professionele kleuren en typografie

## Aanpassingen maken

### Contactgegevens wijzigen
Bewerk `contact.html` en zoek naar:
```html
<a href="tel:0685350145">06 8535 0145</a>
<a href="mailto:tuinperfect@gmail.com">tuinperfect@gmail.com
```

### Afbeeldingen vervangen
1. Upload nieuwe afbeeldingen naar `images/`
2. Bewerk de HTML bestanden en wijzig de `src` attributen

### Kleuren aanpassen
Bewerk `css/style.css` - de CSS variabelen staan bovenaan:
```css
--color-primary-container: #ffd700;  /* Geel */
--color-surface: #121414;            /* Donkergrijs */
```

## Ondersteuning

Voor vragen over de website of hosting:
- mijn.host helpdesk via je account
- Deze website is gebouwd voor onderhoudsvriendelijkheid

---

© 2024 Tuin Perfect - Netjes & Snel
