const BASE_URL = "https://landing-app-1ke2.onrender.com";

// Configuration de base
    // const BASE_URL = "http://localhost:3000";

    // Chargement initial
    document.addEventListener('DOMContentLoaded', () => {
      chargerFormations();
      chargerTemoignages();
      initMenuToggle();
      initScrollEffects();
      initForm();
      initCounters();
    });

    // Menu mobile
    function initMenuToggle() {
      const menuToggle = document.getElementById('menu-toggle');
      const navMenu = document.getElementById('nav-menu');
      
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ? 
          '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      });
    }

    // Effets de défilement
    function initScrollEffects() {
      // Header scroll effect
      const header = document.querySelector('.header');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });

      // Animation au défilement
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.formation-card, .stat-box, .testimonial-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      });
    }

    // Formulaire d'inscription
    function initForm() {
      const floatingBtn = document.querySelector('.floating-btn');
      const formPopup = document.getElementById('form-popup');
      
      function toggleForm() {
        formPopup.classList.toggle('active');
        floatingBtn.style.transform = formPopup.classList.contains('active') ? 'rotate(135deg)' : 'rotate(0)';
      }
      
      window.toggleForm = toggleForm;
      
      // Gestion de la soumission du formulaire
      document.getElementById('inscription-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        
        try {
          const res = await fetch(`${BASE_URL}/api/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          const result = await res.json();
          
          if (res.ok) {
            alert(result.message);
            this.reset();
            toggleForm();
          } else {
            alert(result.message || "Erreur lors de l'inscription.");
          }
        } catch (err) {
          alert("Erreur de connexion au serveur.");
          console.error(err);
        }
      });
    }

    // Compteurs animés
    function initCounters() {
      const counters = document.querySelectorAll('.counter');
      const speed = 200;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            counters.forEach(counter => {
              const target = +counter.getAttribute('data-target');
              const count = +counter.innerText;
              const increment = target / speed;
              
              if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 1);
              } else {
                counter.innerText = target;
              }
              
              function updateCounter() {
                const count = +counter.innerText;
                if (count < target) {
                  counter.innerText = Math.ceil(count + increment);
                  setTimeout(updateCounter, 1);
                } else {
                  counter.innerText = target;
                }
              }
            });
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(document.querySelector('.stats-section'));
    }

    // Charger les formations
    async function chargerFormations() {
      try {
        const res = await fetch(`${BASE_URL}/api/formations`);
        const formations = await res.json();
        const container = document.getElementById('formations-container');
        
        formations.forEach(formation => {
          const card = document.createElement('div');
          card.className = 'formation-card';
          card.innerHTML = `   <a href="/session.html?slug=${formation.slug}" class="session-link">

            <div class="formation-image">
              <img src="${formation.imageUrl}" alt="${formation.titre}">
            </div>
            <div class="formation-content">
              <h3>${formation.titre}</h3>
              <p>${formation.description.substring(0, 100)}...</p>
              <div class="formation-meta">
                <span><i class="fas fa-clock"></i> ${formation.duree || 'Flexible'}</span>
                <span><i class="fas fa-tag"></i> ${formation.prix} FCFA</span>
              </div>
            </div>
            </a>
          `;
          container.appendChild(card);
        });
      } catch (err) {
        console.error('Erreur de chargement des formations:', err);
      }
    }

    // Charger les témoignages
    async function chargerTemoignages() {
      try {
        const res = await fetch(`${BASE_URL}/api/temoignages`);
        const temoignages = await res.json();
        const container = document.getElementById('temoignages-container');
        
        temoignages.forEach(temoignage => {
          const card = document.createElement('div');
          card.className = 'testimonial-card';
          card.innerHTML = `
            <p class="testimonial-content">${temoignage.message}</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">
                <img src="${temoignage.avatar}" alt="${temoignage.nomClient}">
              </div>
              <div class="testimonial-info">
                <h4>${temoignage.nomClient}</h4>
                <p>Ancien élève</p>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
      } catch (err) {
        console.error('Erreur de chargement des témoignages:', err);
      }
    }








    