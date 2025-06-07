const loginForm = document.getElementById('login-form');
const errorElement = document.getElementById('login-error');
const inputs = loginForm.querySelectorAll('input');
const submitBtn = loginForm.querySelector('button');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorElement.classList.remove('show');
  errorElement.textContent = '';

  // Animation chargement bouton
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
  submitBtn.disabled = true;

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value;

  try {
    // Envoi requête POST vers /api/login
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Stockage token ou flag (selon backend)
      localStorage.setItem('adminAuth', 'true');
      // Redirection vers interface admin
      window.location.href = '/admin.html';
    } else {
      // Affichage message d'erreur reçu
      errorElement.textContent = data.message || 'Erreur d’authentification.';
      errorElement.classList.add('show');
      // Animation erreur sur champs
      inputs.forEach(input => {
        input.style.borderColor = '#e74c3c';
        setTimeout(() => {
          input.style.borderColor = '';
        }, 2000);
      });
    }
  } catch (err) {
    errorElement.textContent = 'Erreur serveur.';
    errorElement.classList.add('show');
    console.error(err);
  } finally {
    // Réinitialiser bouton
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Animation d'entrée des champs au chargement de la page
inputs.forEach((input, index) => {
  input.style.opacity = '0';
  input.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    input.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease';
    input.style.opacity = '1';
    input.style.transform = 'translateY(0)';
  }, 300 + index * 200);
});
