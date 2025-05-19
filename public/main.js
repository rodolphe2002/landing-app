const BASE_URL = "https://landing-app-1ke2.onrender.com";

window.addEventListener('DOMContentLoaded', () => {
  chargerFormations();
  chargerInscriptions();
});

// Page admin
const toggleSide = document.getElementById('toggle-btn');
const sidebar = document.querySelector('.sidebar');

if (toggleSide && sidebar) {
  toggleSide.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

async function chargerFormations() {
  try {
    const res = await fetch(`${BASE_URL}/api/formations`);
    const data = await res.json();

    const select = document.getElementById('formation-select');
    data.forEach(formation => {
      const option = document.createElement('option');
      option.value = formation._id;
      option.textContent = formation.titre;
      select.appendChild(option);
    });

  } catch (err) {
    console.error("Erreur chargement formations :", err);
  }
}

// Fonction pour charger les inscriptions
async function chargerInscriptions() {
  try {
    const res = await fetch(`${BASE_URL}/api/inscriptions`);
    const data = await res.json();
    const tbody = document.querySelector('#inscriptions-table tbody');
    tbody.innerHTML = "";

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

window.addEventListener('DOMContentLoaded', chargerInscriptions);

// Page landing - Menu toggle
const toggleClient = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

toggleClient.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

// Affichage du formulaire
function openForm() {
  const form = document.getElementById("form-popup");
  if (form) {
    form.style.display = (form.style.display === "none") ? "block" : "none";
  }
}

// Charger les formations depuis le backend
fetch(`${BASE_URL}/api/formations`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("formations-container");

    data.forEach(f => {
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

// Charger les témoignages
fetch(`${BASE_URL}/api/temoignages`)
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

// Envoi des informations au backend
document.getElementById("inscription-form").addEventListener("submit", async function (e) {
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
    } else {
      alert(result.message || "Erreur lors de l'inscription.");
    }
  } catch (err) {
    alert("Erreur de connexion.");
    console.error(err);
  }
});

// Logique des compteurs
const counters = document.querySelectorAll('.counter');

const countUp = (el) => {
  const target = +el.getAttribute('data-target');
  let count = 0;
  const step = Math.ceil(target / 200);

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounting();
      observer.disconnect();
    }
  });
}, {
  threshold: 0.5
});

observer.observe(document.querySelector('.stats-section'));




// pour rediriger l'admin s'il n'est pas authentifié


// Vérifie si l’utilisateur est authentifié
document.addEventListener('DOMContentLoaded', () => {
  const isAuth = localStorage.getItem('adminAuth');
  if (isAuth !== 'true') {
    // Rediriger vers la page de login si non authentifié
    window.location.href = '/adminAuth.html';
  }
});

// code de deconnexion

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('adminAuth');
  window.location.href = '/adminAuth.html';
});

