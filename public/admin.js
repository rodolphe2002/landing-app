  // Configuration de base
    // const BASE_URL = "http://localhost:3000";
    const BASE_URL = "https://landing-app-1ke2.onrender.com";



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










// dasboard 






    // Chargement initial
    document.addEventListener('DOMContentLoaded', () => {
      initAdminMenu();
      chargerFormations();
      chargerInscriptions();
      initFormSubmissions();
      afficherFormations();
       afficherTemoignages(); // pour afficher automatiquement les témoignages

    });

    // Initialisation du menu admin
    function initAdminMenu() {
      const toggleBtn = document.getElementById('toggle-btn');
      const sidebar = document.querySelector('.sidebar');
      const dashboard = document.querySelector('.dashboard-container');
      const navLinks = document.querySelectorAll('.sidebar nav ul li a');
      
      // Toggle sidebar
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        dashboard.classList.toggle('active');
      });
      
      // Navigation entre sections
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Retirer la classe active de tous les liens
          navLinks.forEach(l => l.classList.remove('active'));
          
          // Ajouter la classe active au lien cliqué
          e.currentTarget.classList.add('active');
          
          // Fermer le menu mobile si ouvert
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            dashboard.classList.remove('active');
          }
        });
      });
    }

    // Charger les formations pour le select
    async function chargerFormations() {
      try {
        const res = await fetch(`${BASE_URL}/api/formations`);
        const data = await res.json();
        const select = document.getElementById('formation-select');
        
        // Vider les options existantes
        select.innerHTML = '<option value="" disabled selected>Sélectionnez une formation</option>';
        
        // Ajouter les nouvelles options
        data.forEach(formation => {
          const option = document.createElement('option');
          option.value = formation._id;
          option.textContent = formation.titre;
          select.appendChild(option);
        });
      } catch (err) {
        console.error("Erreur chargement formations :", err);
        showMessage("Erreur lors du chargement des formations", "error");
      }
    }

    // Charger les inscriptions
async function chargerInscriptions() {
  try {
    const res = await fetch(`${BASE_URL}/api/inscriptions`);
    const data = await res.json();
    const tbody = document.querySelector('#inscriptions-table tbody');
    
    // Vider le tableau
    tbody.innerHTML = "";

    // Ajouter les nouvelles lignes
    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.nom}</td>
        <td>${user.Whatsapp}</td>
        <td>${user.formation}</td>
        <td><button class="supprimer-btn" data-id="${user._id}">🗑️ Supprimer</button></td>
      `;
      tbody.appendChild(row);
    });

    // ✅ Ajouter les événements de suppression ici
    document.querySelectorAll('.supprimer-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm("Confirmer la suppression de cet inscrit ?")) {
          try {
            const res = await fetch(`${BASE_URL}/api/inscriptions/${id}`, {
              method: 'DELETE'
            });
            const result = await res.json();
            showMessage(result.message, "success");
            chargerInscriptions(); // Recharge la liste après suppression
          } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            showMessage("Erreur de suppression", "error");
          }
        }
      });
    });

  } catch (err) {
    console.error('Erreur de chargement des inscriptions :', err);
    showMessage("Erreur lors du chargement des inscriptions", "error");
  }
}


    // Initialiser les soumissions de formulaire
    function initFormSubmissions() {
      // Gestion du formulaire de formation
      document.querySelector('form[action="/api/formations"]').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
          const res = await fetch(`${BASE_URL}/api/formations`, {
            method: 'POST',
            body: formData
          });
          
          const result = await res.json();
          
          if (res.ok) {
            showMessage("Formation ajoutée avec succès !", "success");
            this.reset();
            chargerFormations(); // Recharger les formations pour le select
          } else {
            showMessage(result.message || "Erreur lors de l'ajout de la formation", "error");
          }
        } catch (err) {
          showMessage("Erreur de connexion au serveur", "error");
          console.error(err);
        }
      });
      
      // Gestion du formulaire de témoignage
      document.querySelector('form[action="/api/temoignages"]').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
          const res = await fetch(`${BASE_URL}/api/temoignages`, {
            method: 'POST',
            body: formData
          });
          
          const result = await res.json();
          
          if (res.ok) {
            showMessage("Témoignage ajouté avec succès !", "success");
            this.reset();
          } else {
            showMessage(result.message || "Erreur lors de l'ajout du témoignage", "error");
          }
        } catch (err) {
          showMessage("Erreur de connexion au serveur", "error");
          console.error(err);
        }
      });
      
      // Bouton de déconnexion
      document.getElementById('logout-btn').addEventListener('click', () => {
        // Ici, vous implémenteriez la logique de déconnexion
        showMessage("Déconnexion effectuée avec succès", "success");
        setTimeout(() => {
          // Redirection vers la page de connexion
          window.location.href = "./adminAuth.html";
        }, 1500);
      });
    }

    // Afficher les messages
    function showMessage(text, type) {
      const messageEl = document.getElementById('message');
      messageEl.textContent = text;
      messageEl.style.display = 'block';
      
      // Définir la couleur en fonction du type
      if (type === "success") {
        messageEl.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        messageEl.style.color = '#28a745';
        messageEl.style.border = '1px solid rgba(40, 167, 69, 0.3)';
      } else {
        messageEl.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        messageEl.style.color = '#dc3545';
        messageEl.style.border = '1px solid rgba(220, 53, 69, 0.3)';
      }
      
      // Cacher le message après 3 secondes
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }





    // Modifier une formation


    async function afficherFormations() {
  const res = await fetch(`${BASE_URL}/api/formations`);
  const data = await res.json();
  const tbody = document.querySelector('#table-formations tbody');
  tbody.innerHTML = "";

  data.forEach(f => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${f.titre}</td>
      <td>${f.duree}</td>
      <td>${f.prix} FCFA</td>
      <td>
        <button onclick="ouvrirModalFormation('${f._id}', '${f.titre}', '${f.duree}', '${f.prix}', \`${f.description}\`)">Modifier</button>
        <button onclick="supprimerFormation('${f._id}')">Supprimer</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function ouvrirModalFormation(id, titre, duree, prix, description) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-titre').value = titre;
  document.getElementById('edit-duree').value = duree;
  document.getElementById('edit-prix').value = prix;
  document.getElementById('edit-description').value = description;
  document.getElementById('modal-formation').classList.remove('hidden');
}

document.querySelector('.modal .close').addEventListener('click', () => {
  document.getElementById('modal-formation').classList.add('hidden');
});

document.getElementById('edit-formation-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const data = {
    titre: document.getElementById('edit-titre').value,
    duree: document.getElementById('edit-duree').value,
    prix: document.getElementById('edit-prix').value,
    description: document.getElementById('edit-description').value,
  };

  const res = await fetch(`${BASE_URL}/api/formations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    showMessage("Formation modifiée avec succès", "success");
    document.getElementById('modal-formation').classList.add('hidden');
    afficherFormations();
    chargerFormations();
  } else {
    showMessage("Erreur de modification", "error");
  }
});




// Supprimer une formation


async function supprimerFormation(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette formation ?")) return;

  const res = await fetch(`${BASE_URL}/api/formations/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    showMessage("Formation supprimée avec succès", "success");
    afficherFormations();
    chargerFormations();
  } else {
    showMessage("Erreur lors de la suppression", "error");
  }
}








// Affichage des témoignages
async function afficherTemoignages() {
  const res = await fetch(`${BASE_URL}/api/temoignages`);
  const data = await res.json();
  const tbody = document.querySelector('#table-temoignages tbody');
  tbody.innerHTML = "";

  data.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.nomClient}</td>
      <td>${t.message}</td>
      <td>
        <button onclick="ouvrirModalTemoignage('${t._id}', '${t.nom}', \`${t.message}\`)">Modifier</button>
        <button onclick="supprimerTemoignage('${t._id}')">Supprimer</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Ouvrir le modal de modification
function ouvrirModalTemoignage(id, nom, message) {
  document.getElementById('edit-temoignage-id').value = id;
  document.getElementById('edit-temoignage-nom').value = nom;
  document.getElementById('edit-temoignage-message').value = message;
  document.getElementById('modal-temoignage').classList.remove('hidden');
}

// Fermer le modal
document.querySelector('.close-temoignage').addEventListener('click', () => {
  document.getElementById('modal-temoignage').classList.add('hidden');
});

// Soumettre la modification
document.getElementById('edit-temoignage-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-temoignage-id').value;
  const data = {
    nom: document.getElementById('edit-temoignage-nom').value,
    message: document.getElementById('edit-temoignage-message').value,
  };

  const res = await fetch(`${BASE_URL}/api/temoignages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    showMessage("Témoignage modifié avec succès", "success");
    document.getElementById('modal-temoignage').classList.add('hidden');
    afficherTemoignages();
  } else {
    showMessage("Erreur de modification", "error");
  }
});

// Supprimer un témoignage
async function supprimerTemoignage(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce témoignage ?")) return;

  const res = await fetch(`${BASE_URL}/api/temoignages/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    showMessage("Témoignage supprimé avec succès", "success");
    afficherTemoignages();
  } else {
    showMessage("Erreur lors de la suppression", "error");
  }
}



document.getElementById('generate-pdf').addEventListener('click', async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/inscriptions`);
    const data = await res.json();

    // Initialise jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.text('Liste des Inscrits', 14, 20);

    // Préparer les lignes du tableau
    const rows = data.map((user, index) => [
      index + 1,
      user.nom,
      user.Whatsapp,
      user.formation
    ]);

    // Générer le tableau
    doc.autoTable({
      head: [['#', 'Nom', 'WhatsApp', 'Formation']],
      body: rows,
      startY: 30
    });

    // Télécharger le PDF
    doc.save('liste_inscrits.pdf');
  } catch (err) {
    console.error("Erreur lors de la génération du PDF :", err);
    showMessage("Erreur génération PDF", "error");
  }
});

