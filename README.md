# La Ginesta — Guia Digital Premium

Guia digital premium per als hostes de La Ginesta. Transforma el contingut de Notion en una experiència web moderna, càlida i responsive — preparada per a QR i Vercel.

---

## Sobre el projecte

La Ginesta és un refugi camper artesanal. Aquesta web és la seva guia digital d'hostes: un producte dissenyat amb la mateixa cura amb la qual es va construir la furgoneta — sense plàstics, amb fusta, llum i senzillesa.

> *"No és només una Camper. És una manera de viure: Viatge, Natura i Confiança."*

---

## Estructura del projecte

```
la-ginesta-web/
│
├── index.html              # Web principal (guia completa)
├── style.css               # Sistema de disseny premium
├── script.js               # Interaccions, animacions, checklist
│
├── assets/
│   ├── images/             # Fotos reals de La Ginesta (Yescapa)
│   ├── logo/               # Logo oficial La Ginesta
│   ├── icons/              # Icones del projecte
│   └── mockups/            # Mockups de referència visual
│
├── docs/
│   ├── notion-export/      # Export HTML original de Notion (intacte)
│   ├── guides/             # Guies addicionals
│   ├── prompts/            # Prompts de construcció arxivats
│   ├── branding/           # Material de marca
│   └── planning/           # Planificació del projecte
│
├── videos/                 # Contingut de vídeo
└── qr/                     # Assets i configuració de codis QR
```

---

## Tecnologia

| Capa | Tecnologia |
|---|---|
| Estructura | HTML5 semàntic |
| Estils | CSS3 (custom properties, grid, flexbox) |
| Interacció | JavaScript vanilla (ES6+) |
| Fonts | Manrope + Caveat (Google Fonts) |
| Hosting | Vercel |

---

## Funcionalitats

- **Hero section** amb foto real i atmosfera emocional
- **Navegació** amb pills horitzontals actives per secció
- **Animacions** fade-in subtils amb Intersection Observer
- **Checklists interactives** amb persistència via localStorage
- **Vídeos integrats** (YouTube embed, lazy load)
- **Contactes d'emergència** amb botons tel: directes
- **Responsive perfecte** — dissenyat mobile-first
- **Header transparent** sobre hero, sòlid en scroll
- **Back to top** flotant
- **SEO i Open Graph** configurats

---

## Executar localment

No requereix cap build. Serveix directament amb qualsevol servidor estàtic:

```bash
# Opció 1: Python
python3 -m http.server 8000

# Opció 2: Node (npx)
npx serve .

# Opció 3: VS Code Live Server
# Instal·la l'extensió Live Server i fes clic a "Open with Live Server"
```

Obre `http://localhost:8000` al navegador.

---

## Desplegar a Vercel

```bash
# Via CLI
npm i -g vercel
vercel

# Via GitHub
# 1. Connecta el repositori a vercel.com
# 2. Framework: Other (Static)
# 3. Root: ./
# 4. Deploy
```

No requereix configuració addicional. Vercel detecta automàticament el `index.html` arrel.

---

## Branding i identitat visual

- **Paleta:** crema càlid `#F7F4EE` · verd fosc `#2F3A2F` · terracota `#C77B57` · oliva `#6F7B5E`
- **Tipografia:** Manrope (sans-serif premium) + Caveat (script per signatura)
- **Referència:** Airbnb Plus · boutique artesanal · slow living editorial

---

*Fet amb carinyu per a La Ginesta · Viatge · Natura · Confiança*
