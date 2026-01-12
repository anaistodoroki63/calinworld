// =============== JWT decode ===============
function decodeJwtPayload(token){
    return JSON.parse(atob(token.split('.')[1]));
}

// =============== Local Storage ===============
const AUTH_KEY = 'calinworld-auth';
function getCurrentUser(){
    try { const raw = localStorage.getItem(AUTH_KEY); return raw ? JSON.parse(raw) : null; }
    catch(e){ return null; }
}
function setCurrentUser(u){ if (!u) localStorage.removeItem(AUTH_KEY); else localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }

// =============== UI ===============
function renderAuth(){
    const u = getCurrentUser();
    const btn = document.getElementById('authBtn');
    if (!btn) return;
    if (u && (u.email||u.name)){
        btn.classList.add('logged');
        btn.textContent = `Bonjour, ${u.name || u.email} • Déconnexion`;
    } else {
        btn.classList.remove('logged');
        btn.textContent = 'Se connecter';
    }
}

function handleCredentialResponse(response){
    const payload = decodeJwtPayload(response.credential);
    if (!payload){ alert('Connexion Google impossible'); return; }
    const user = {
        name: payload.name || payload.email,
        email: payload.email,
        picture: payload.picture
    };
    setCurrentUser(user);
    renderAuth();
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}


// =============== Events ===============
window.getCurrentUser = getCurrentUser;
window.addEventListener('load', ()=>{
    renderAuth();
    initGoogleSignIn();
});
