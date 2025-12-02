console.log("Script home.js carregado");

// ========================
// 🔐 Verifica token JWT
// ========================
const token = localStorage.getItem('token');
console.log("Token JWT do localStorage:", token);

if (!token) {
    console.warn("Token não encontrado! Redirecionando para login...");
    window.location.href = "login.html";
}

// ========================
// 🧑 Carregar dados do perfil do usuário
// ========================
async function carregarPerfil() {
    try {
        const response = await fetch('/api/perfil', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erro ao carregar perfil");

        const user = await response.json();
        console.log("Perfil carregado:", user);

        // Nome no submenu
        const nomeEl = document.querySelector(".user-info h2");
        if (nomeEl) nomeEl.textContent = user.nome;

        // Foto no submenu
        const fotoSub = document.querySelector(".user-info img");
        if (fotoSub) {
            fotoSub.src = user.foto ? `/imagens/${user.foto}` : "../../imagens/cara.png";
        }

        // Foto do topo (ícone)
        const fotoTop = document.querySelector(".user-pic");
        if (fotoTop) {
            fotoTop.src = user.foto ? `/imagens/${user.foto}` : "../../imagens/cara.png";
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

// ========================
// 📂 Menu suspenso
// ========================
const subMenu = document.getElementById("subMenu");

function toggleMenu() {
    subMenu.classList.toggle("open-menu");
}

// ========================
// 🚪 Logout
// ========================
document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

// ========================
// 🚀 Inicialização
// ========================
carregarPerfil();
