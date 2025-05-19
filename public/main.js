window.addEventListener('DOMContentLoaded', () => {
  chargerFormations();
  chargerInscriptions();
});




// page admin

// const toggleSide = document.getElementById('toggle-btn');
// const sidebar = document.querySelector('.sidebar');

// toggleSide.addEventListener('click', () => {
//   sidebar.classList.toggle('active');
// });


const toggleSide = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');

if (toggleSide && sidebar) {
  toggleSide.addEventListener('click', () => {
    sidebar.classList.toggle('active');

  });
}




async function chargerFormations() {
    try {
      const res = await fetch('/api/formations');
      const data = await res.json();

      const select = document.getElementById('formation-select');
      data.forEach(formation => {
        const option = document.createElement('option');
        option.value = formation._id; // IMPORTANT
        option.textContent = formation.titre;
        select.appendChild(option);
      });

    } catch (err) {
      console.error("Erreur chargement formations :", err);
    }
  }

  chargerFormations();



  // Fonction pour charger les inscriptions
  async function chargerInscriptions() {
    try {
      const res = await fetch('/api/inscriptions');
      const data = await res.json();
      const tbody = document.querySelector('#inscriptions-table tbody');
      tbody.innerHTML = ""; // On vide le tableau avant de le remplir

      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.nom}</td>
          <td>${user.Whatsapp}</td>
          <td>${user.formation}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error('Erreur de chargement des inscriptions :', err);
    }
  }

  // Appeler la fonction au chargement de la page
  window.addEventListener('DOMContentLoaded', chargerInscriptions);





















//   page landing



// menu toggle

const toggleClient= document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

toggleClient.addEventListener('click', () => {
  navMenu.classList.toggle('show');
 });





    // Fonction pour afficher le formulaire
    function openForm() {
        const form = document.getElementById("form-popup");
        form.style.display = (form.style.display === "none") ? "block" : "none";
      }
  
      // Charger les formations depuis le backend pour le formulaire de Création de formation 
      fetch('/api/formations')
        .then(res => res.json())
        .then(data => {
          const container = document.getElementById("formations-container");
  
          data.forEach(f => {
            // block c'est div qui a contemir nos formations

            const block = document.createElement("div");
            block.className = "formation";
  
            block.innerHTML = `
    <h2>${f.titre}</h2>
    <img src="${f.imageUrl}" alt="${f.titre}">
    <p>${f.description}</p>
    ${f.videoUrl ? `<iframe width="400" height="215" src="${f.videoUrl}" frameborder="0" allowfullscreen></iframe>` : ''}
    <p><strong>Prix :</strong> ${f.prix} FCFA</p>
    <p><strong>Durée :</strong> ${f.duree || "Non spécifiée"}</p>
    <p><strong>Niveau :</strong> ${f.niveau || "Tous niveaux"}</p>
    <p><strong>Catégorie :</strong> ${f.categorie || "Générale"}</p>
    <p><strong>Date de début :</strong> ${f.dateDebut ? new Date(f.dateDebut).toLocaleDateString() : "À venir"}</p>
  `;
  
  
            container.appendChild(block);
          });
        })
        .catch(err => console.error("Erreur chargement formations :", err));









        
      // Charger les témoignages depuis le backend
fetch('/api/temoignages')
.then(res => res.json())
.then(data => {
  const container = document.getElementById("temoignages-container");

  data.forEach(t => {
    const blockTemoignage = document.createElement("div");
    blockTemoignage.className = "temoignage";

    blockTemoignage.innerHTML = `
      <h3>${t.nomClient}</h3>
      <img src="${t.avatar}" alt="${t.nomClient}" width="100">
      <p>${t.message}</p>
    `;

    container.appendChild(blockTemoignage);
  });
})
.catch(err => console.error("Erreur chargement témoignages :", err));




// Envoi des informations aux backend

document.getElementById("inscription-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  try {
    const res = await fetch('/api/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message); // ou affichage stylisé
      this.reset();
    } else {
      alert(result.message || "Erreur lors de l'inscription.");
    }
  } catch (err) {
    alert("Erreur de connexion.");
    console.error(err);
  }
});



// logique des compteurs


const counters = document.querySelectorAll('.counter');

  const countUp = (el) => {
    const target = +el.getAttribute('data-target');
    let count = 0;
    const step = Math.ceil(target / 200); // ajuster la vitesse

    const updateCounter = () => {
      if (count < target) {
        count += step;
        el.textContent = count > target ? target : count;
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    };

    updateCounter();
  };

  const startCounting = () => {
    counters.forEach(counter => {
      countUp(counter);
    });
  };

  // Démarrer le comptage quand la section est visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting();
        observer.disconnect(); // arrêter l'observation après le premier déclenchement
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(document.querySelector('.stats-section'));
