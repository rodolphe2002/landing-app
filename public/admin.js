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
          `;
          tbody.appendChild(row);
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