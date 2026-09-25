// ===== Projects Data =====
// Ca să adaugi un proiect nou, adaugi încă un obiect în PROJECTS.
// UI-ul, cardul, pagina de detalii, galeria și butonul extern sunt generate automat.
//
// Câmpuri disponibile:
//   id            = ID unic
//   title         = titlul proiectului
//   category      = categoria proiectului
//   year          = anul
//   icon          = iconița de pe card (opțional)
//   images        = câte imagini vrei în galerie
//   youtubeId     = ID video YouTube (opțional)
//   shortDescription = descriere scurtă pentru card
//   description   = descrierea mare din pagina proiectului; poate avea rânduri noi
//   details       = carduri mici cu informații (opțional)
//   tags          = tehnologii / etichete
//   projectUrl    = link extern spre proiect
//   projectLabel  = textul butonului extern

const PROJECT_CATEGORY_INFO = {
  Websites: {
    description: 'Site-uri și proiecte web.'
  },
  Games: {
    description: 'Jocuri chestii trestii.'
  },
  Other: {
    description: 'Chestii care nu intră în altă categorie.'
  }
};

const PROJECTS = [
  {
    id: '18th-assistant',
    title: '18th Assistant [FiveM Hub]',
    category: 'Websites',
    year: '2026',
    icon: '',
    images: [
      'img/projects/p1/image%20(1).webp',
      'img/projects/p1/image%20(2).webp',
      'img/projects/p1/image%20(3).webp',
      'img/projects/p1/image%20(4).webp'
    ],
    shortDescription: 'Hub cu ghiduri, locații, informații și resurse pentru clanul 18th Street Gang, server FiveM B-HOOD.',
    description: `Un hub făcut pentru jucătorii clanului 18th, unde ghidurile, informațiile și resursele sunt structurate pe categorii pentru o navigare cât mai simplă și un acces cât mai rapid.

Site-ul a fost creat pentru membrii clanului 18th, în special pentru cei care sunt la început și încă nu știu toate lucrurile pe care le oferă jocul, dar și pentru jucătorii mai experimentați care vor să aibă informațiile importante la îndemână.
Proiectul este gândit să crească în timp, iar pe măsură ce apar idei și nevoi noi, vor fi adăugate și alte funcții, resurse și utilități.`,
    details: [
      {
        title: 'Ce este',
        text: 'Un site pentru ghiduri, resurse și informații utile.'
      },
      {
        title: 'Status',
        text: 'Activ - Actualizat ocazional.'
      },
      {
        title: 'Notițe',
        text: 'Totul este WiP.'
      }
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Web-site'],
    projectUrl: 'https://sica1205.github.io/18th-Assistant/',
    projectLabel: 'Accesează 18th Assistant'
  },

  // =====================================================================

  {
    id: 'arcade-snake',
    title: 'Arcade Snake',
    category: 'Games',
    year: '2025',
    icon: '',
    images: [
      'img/projects/p2/image%20(1).webp',
      'img/projects/p2/image%20(2).webp',
      'img/projects/p2/image%20(3).webp',
      'img/projects/p2/image%20(4).webp'
    ],
    shortDescription: 'Un Snake simplu făcut în browser, cu un vibe arcade.',
    description: `Arcade Snake este o versiune proprie a clasicului joc Snake, construită pentru a rula direct în browser, fără instalări sau alte dependențe.
    Jocul include moduri de dificultate de la Easy până la Extreme, fiecare cu o viteză diferită, precum și mecanici speciale precum Ghost, Fire, Shrink și Poison.
    Pe Extreme, sistemul de punctaj și efectele anumitor power-up-uri sunt modificate pentru a face jocul mai dificil și mai imprevizibil.

Este un mic proiect făcut mai mult de distracție și ca experiment, pornind de la o idee simplă și dusă puțin mai departe prin adăugarea propriilor mecanici și sisteme de gameplay.`,
    details: [
      {
        title: 'Ce este',
        text: 'Un joc Snake Arcade ce rulează direct in Browser, cu mai multe nivele de dificultate, fructe speciale și power-ups.'
      },
      {
        title: 'Status',
        text: 'Arhivat — nu mai este întreținut, dar rămâne disponibil și jucabil.'
      },
      {
        title: 'Notițe',
        text: 'Un proiect făcut for fun.'
      }
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Game'],
    projectUrl: 'https://sica1205.github.io/Arcade-Snake/',
    projectLabel: 'Joacă Arcade Snake'
  },

  // =====================================================================

  {
    id: 'bulgareasca-slots',
    title: 'Bulgareasca Calu Slots',
    category: 'Games',
    year: '2025',
    icon: '',
    images: [
      'img/projects/p3/image%20(1).webp',
      'img/projects/p3/image%20(2).webp',
      'img/projects/p3/image%20(3).webp',
      'img/projects/p3/image%20(4).webp'
    ],
    shortDescription: 'Un joc de tip Slots, doar că ai cai în loc de fructe.',
    description: `Bulgăreasca Calu' este un joc simplu de tip Slots (păcănea), făcut dintr-un inside joke pornit de la o melodie bulgărească de pe internet, numită „Bulgareasca Calu'”.
Gluma a degenerat puțin și, la un moment dat, a ajuns să existe și o păcănea pe tema asta. Cam asta e toată povestea.

Începi jocul cu 1000 de lei și, ca la orice Slots, îți poți alege bet-ul pe care vrei să-l folosești. Scopul este simplu: joacă, încearcă-ți norocul cât mai mult și fă un scor cât mai mare.

Iar dacă pierzi, poți să joci iar. Și iar. Și iar. Fără oprire.
`,
    details: [
      {
        title: 'Ce este',
        text: 'Păcanăle virtuale frate, ăstea sunt păcănele.'
      },
      {
        title: 'Status',
        text: 'Arhivat — nu mai este întreținut, dar rămâne disponibil și jucabil.'
      },
      {
        title: 'Notițe',
        text: 'Un proiect făcut for fun, nimic mai mult.'
      }
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Game'],
    projectUrl: 'https://sica1205.github.io/bulgareasca-slots/',
    projectLabel: `Joacă Bulgăreasca Calu'`
  },
];
