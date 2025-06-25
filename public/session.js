// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://landing-app-1ke2.onrender.com";
    const slug = new URLSearchParams(window.location.search).get("slug");

    // Fonction pour animer les éléments au défilement
    function initAnimations() {
      const animatedElements = document.querySelectorAll('.animated-element');
      
      animatedElements.forEach(element => {
        gsap.fromTo(element, 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }

    async function chargerDetailsFormation() {
      try {
        // Afficher un loader pendant le chargement
        document.getElementById('formation-title').textContent = "Chargement...";
        
        const res = await fetch(`${BASE_URL}/api/sessions/${slug}`);
        if (!res.ok) throw new Error('Formation non trouvée');

        const data = await res.json();
        const formation = data.formation;
        const testimonials = data.testimonials;

        // Mettre à jour le contenu
        document.getElementById('formation-title').textContent = formation.titre;
        document.getElementById('formation-image').src = formation.imageUrl;
        document.getElementById('formation-image').alt = formation.titre;
        document.getElementById('formation-description').innerHTML = formation.description.replace(/\r\n/g, '<br>');
        document.getElementById('formation-duree').textContent = `Durée: ${formation.duree || 'Non spécifiée'}`;
        document.getElementById('formation-prix').textContent = `Prix: ${formation.prix} FCFA`;
        document.getElementById('formation-niveau').textContent = `Niveau: ${formation.niveau || 'Non spécifié'}`;
        document.getElementById('formation-date').textContent = `Date: ${formation.dateDebut ? new Date(formation.dateDebut).toLocaleDateString() : 'À définir'}`;

        // Mettre à jour la vidéo si disponible
        // const videoContainer = document.querySelector('.video-container');
        // if (formation.videoUrl) {
        //   videoContainer.innerHTML = `
        //     <iframe 
        //       src="${formation.videoUrl}" 
        //       width="100%" 
        //       height="400" 
        //       frameborder="0" 
        //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        //       allowfullscreen
        //       style="border-radius: 16px;"
        //     ></iframe>
        //   `;
        // }

        // Générer les témoignages
        const testimonialsContainer = document.getElementById('testimonials-container');
        testimonialsContainer.innerHTML = testimonials.map(t => `
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>${t.message}</p>
            </div>
            <div class="testimonial-author">
              <div class="testimonial-avatar">
                <img src="${t.avatar}" alt="Photo de ${t.nomClient}">
              </div>
              <div class="testimonial-info">
                <h4>${t.nomClient}</h4>
                <p>Ancien étudiant</p>
              </div>
            </div>
          </div>
        `).join('');

        // Initialiser les animations
        setTimeout(initAnimations, 300);
        
      } catch (err) {
        console.error("Erreur chargement détails :", err);
        document.getElementById('formation-title').textContent = "Erreur de chargement";
        document.getElementById('formation-description').textContent = "Nous n'avons pas pu charger les détails de cette formation. Veuillez réessayer plus tard.";
      }
    }

    // Menu toggle pour mobile
    document.querySelector('.menu-toggle').addEventListener('click', function() {
      document.querySelector('.nav').classList.toggle('active');
    });

    // Initialiser le formulaire flottant
    document.querySelector('.floating-btn').addEventListener('click', function() {
      const formPopup = document.getElementById('form-popup');
      if (formPopup) {
        formPopup.classList.toggle('active');
      }
    });



        // Formulaire d'inscription
   function initForm() {
  const floatingBtn = document.querySelector('.floating-btn');
  const formPopup = document.getElementById('form-popup');

  function toggleForm() {
    formPopup.classList.toggle('active');
    floatingBtn.style.transform = formPopup.classList.contains('active') ? 'rotate(135deg)' : 'rotate(0)';
  }

  window.toggleForm = toggleForm;

  // ✅ Ajoute le clic ici au lieu de "onclick" dans le HTML
  floatingBtn.addEventListener('click', toggleForm);

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



    window.addEventListener("DOMContentLoaded", chargerDetailsFormation);



  
  // Ouvre le formulaire quand on clique sur un bouton avec la classe 'open-form-btn'
  document.querySelectorAll('.open-form-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleForm();
    });
  });





  window.addEventListener("DOMContentLoaded", () => {
  chargerDetailsFormation();
  initForm(); // <-- ajoute cette ligne
});





