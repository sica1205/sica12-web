const aboutCards = [
  {
    className: 'large',
    html: `
      <h3>Care-i treaba cu site-ul asta?</h3>
      <p>Nu știu exact ce aș putea să spun aici fără să sune ca o descriere de portofoliu. Faza e destul de simplă: am vrut să am un site al meu.</p>
      <p>Mi s-a părut tare rău de tot ideea de a avea un loc pe internet făcut de mine, cu porcariile pe care le-am făcut de-a lungul timpului. Mai mult ca un achievement personal decât ca ceva de care aveam neapărat nevoie.  </p>
    
      <p>Nu sunt vreun developer hardcore și nici nu pretind că știu să fac totul singur de la zero. De multe ori mă bazez destul de mult pe AI ca să mă ajute cu partea tehnică, să-mi explice lucruri sau să mă scoată din diverse probleme. În schimb, îmi place foarte mult partea de creație și faptul că pot să iau o idee și să încerc să o transform în ceva care poate ajunge să funcționeze.</p>
    
      <p>Proiectele de aici, inclusiv site-ul ăsta, sunt în mare parte, rezultatul experimentelor mele din timpul liber.</p>
      <p>Cam asta e tot. Nothing fancy, really.</p>
      `
  },
  {
html: `<span class="about-label">ISTORIC</span>
<strong>Data creării site-ului</strong>
<p>Site-ul a fost creat inițial pe 28 aprilie 2026, ca prima versiune a acestui proiect, însă a fost refăcut complet pe 7 septembrie 2026.
</p>`
  },
  {
    html: `<span class="about-label">PERSPECTIVE</span><strong>“What you make becomes a part of you.”</strong><p>ツ</p>`
  },
  {
    className: 'contact-card',
    html: `
      <span class="about-label">CONTACT</span>
      <div class="contact-links">
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=elratones1999@gmail.com" target="_blank" rel="noopener">Email ↗</a>
        <a href="https://www.youtube.com/@sica1229" target="_blank" rel="noopener">YouTube ↗</a>
      </div>
    `
  }
];

function renderAbout() {
  const view = document.getElementById('aboutView');
  if (!view) return;

  view.innerHTML = `
    <header class="view-header detail-enter detail-enter-header">
      <button class="back-btn" onclick="showView(homeView)">← Înapoi</button>
      <div>
        <span class="eyebrow">03 · ABOUT</span>
        <h2>Despre site, și altele</h2>
        <p>Puțin context sau ceva de genul..</p>
      </div>
    </header>

    <div class="about-layout">
      ${aboutCards.map((card, index) => `
        <article
          class="about-card ${card.className || ''} stagger-in"
          style="animation-delay:${0.12 + index * 0.09}s"
        >${card.html}</article>
      `).join('')}
    </div>
  `;
}

renderAbout();
