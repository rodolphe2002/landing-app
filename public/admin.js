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