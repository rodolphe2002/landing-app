document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {

          // Stocker un token ou flag local (selon ton backend)
      localStorage.setItem('adminAuth', 'true');
        // Redirection vers l’interface admin après login réussi
        window.location.href = '/admin.html';
        
   
      } else {
        document.getElementById('login-error').textContent = data.message;
      }
    } catch (err) {
      document.getElementById('login-error').textContent = "Erreur serveur.";
      console.error(err);
    }
  });




  
  