/* =============================================
   ACOMPANHANTES
   ============================================= */
const btnAdicionar = document.querySelector(".btnAdcAcompanhante");
const boxAcompanhantes = document.querySelector("#acompanhanteBox");

btnAdicionar.addEventListener("click", () => {
    const novoAcompanhante = document.createElement("div");
    novoAcompanhante.classList.add("dadosAcompanhantes");

    novoAcompanhante.innerHTML = `
        <select class="selectAcompanhante">
            <option value="adulto">Adulto</option>
            <option value="crianca">Criança</option>
        </select>
        <input type="text" placeholder="Nome do acompanhante" class="acompanhanteName">
        <button class="deleteAcompanhante" title="Remover">🗑</button>
    `;

    boxAcompanhantes.appendChild(novoAcompanhante);

    novoAcompanhante.querySelector(".deleteAcompanhante")
        .addEventListener("click", () => {
            novoAcompanhante.style.animation = "none";
            novoAcompanhante.style.opacity = "0";
            novoAcompanhante.style.transform = "translateY(-8px)";
            novoAcompanhante.style.transition = "all 0.25s ease";
            setTimeout(() => novoAcompanhante.remove(), 250);
        });
});

/* =============================================
   MODAL DE LOGIN
   ============================================= */
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { ref, set, push, onValue, update } 
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const modal = document.getElementById("loginModal");

window.abrirLogin = function () {
    modal.classList.remove("hidden");
};

window.fecharLogin = function () {
    modal.classList.add("hidden");
};

window.fazerLogin = function () {
    const usuario  = document.getElementById("adminEmail").value;
    const password = document.getElementById("password").value;

    // LOGIN LOCAL CONFIGURADO PELO USUÁRIO
    if (usuario === "Admin" && password === "101224") {
        modal.classList.add("hidden");
        window.location.href = "admin.html";
        return;
    } else {
        alert("Login ou Senha incorretos! ❌\nPor favor, tente novamente.");
    }
};

/* =============================================
   COUNTDOWN — 25 de julho de 2026 às 15h00
   ============================================= */
function atualizarContagem() {
    const evento = new Date("2026-07-25T15:00:00");
    const agora  = new Date();
    const diff   = evento - agora;

    if (diff <= 0) {
        document.getElementById("dias").textContent    = "00";
        document.getElementById("horas").textContent   = "00";
        document.getElementById("minutos").textContent = "00";
        document.getElementById("segundos").textContent = "00";
        return;
    }

    const dias     = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas    = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("dias").textContent     = String(dias).padStart(2, "0");
    document.getElementById("horas").textContent    = String(horas).padStart(2, "0");
    document.getElementById("minutos").textContent  = String(minutos).padStart(2, "0");
    document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");
}

atualizarContagem();
setInterval(atualizarContagem, 1000);

/* =============================================
   CONFIRMAÇÃO DE PRESENÇA (LÓGICA DE SALVAMENTO)
   ============================================= */
const btnVai = document.querySelector(".btnVai");
let presenteSelecionadoTemporario = "Nenhum";

btnVai.addEventListener("click", () => {
    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const whatsapp = document.getElementById("tel").value;

    if (!nome || !email || !whatsapp) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    // Coletar acompanhantes
    const acompanhantes = [];
    const listaAcompanhantes = document.querySelectorAll(".dadosAcompanhantes");
    listaAcompanhantes.forEach(acc => {
        const tipo = acc.querySelector(".selectAcompanhante").value;
        const nomeAcc = acc.querySelector(".acompanhanteName").value;
        if (nomeAcc) {
            acompanhantes.push({ nome: nomeAcc, tipo: tipo });
        }
    });

    const novoConvidado = {
        nome,
        email,
        whatsapp,
        acompanhantes,
        presente: presenteSelecionadoTemporario,
        dataConfirmacao: new Date().toISOString()
    };

    // SALVAR NO FIREBASE (BANCO DE DADOS NA NUVEM)
    const convidadosRef = ref(db, 'convidados');
    const novoConvidadoRef = push(convidadosRef);
    set(novoConvidadoRef, novoConvidado)
        .then(() => {
            alert("🎉 Presença confirmada com sucesso! Obrigado por compartilhar este momento conosco. ❤️");
            
            // Limpar os campos após confirmar
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("tel").value = "";
            document.getElementById("acompanhanteBox").innerHTML = "";
            presenteSelecionadoTemporario = "Nenhum";
        })
        .catch((error) => {
            console.error("Erro ao salvar:", error);
            alert("Ocorreu um erro ao salvar sua presença. Por favor, tente novamente.");
        });
});

/* =============================================
   BOX DE PRODUTOS COM ESTOQUE (10 ITENS, 5 CADA)
   ============================================= */
const produtosEstoqueDefault = [
    { id: 1, nome: "Pacote de Fraldas P", estoque: 5, icone: "🧷" },
    { id: 2, nome: "Pacote de Fraldas M", estoque: 5, icone: "🧷" },
    { id: 3, nome: "Pacote de Fraldas G", estoque: 5, icone: "🧷" },
    { id: 4, nome: "Lenços Umedecidos", estoque: 5, icone: "🧼" },
    { id: 5, nome: "Pomada Anti-assadura", estoque: 5, icone: "🧴" },
    { id: 6, nome: "Kit Banho (Sabonete/Shampoo)", estoque: 5, icone: "🛁" },
    { id: 7, nome: "Body de Algodão", estoque: 5, icone: "👕" },
    { id: 8, nome: "Kit de Meias e Luvas", estoque: 5, icone: "🧤" },
    { id: 9, nome: "Manta de Bebê", estoque: 5, icone: "🛌" },
    { id: 10, nome: "Chocalho Divertido", estoque: 5, icone: "🧸" }
];

function renderizarProdutosEstoque(produtos) {
    const container = document.getElementById('grid-produtos-estoque');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Converter objeto do Firebase para array se necessário
    const listaProdutos = Array.isArray(produtos) ? produtos : Object.values(produtos);
    
    listaProdutos.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4 mb-4';
        
        const isEsgotado = prod.estoque <= 0;
        const estoqueBaixo = prod.estoque > 0 && prod.estoque <= 2;
        
        let statusClasse = 'estoque-disponivel';
        let statusTexto = `Estoque: <span class="badge-estoque-numero">${prod.estoque}</span>`;
        
        if (isEsgotado) {
            statusClasse = 'estoque-esgotado';
            statusTexto = 'Esgotado';
        } else if (estoqueBaixo) {
            statusClasse = 'estoque-baixo';
            statusTexto = `Últimas <span class="badge-estoque-numero">${prod.estoque}</span> unidades!`;
        }
        
        col.innerHTML = `
            <div class="produto-card-moderno ${isEsgotado ? 'esgotado' : ''}">
                <div class="produto-icon-wrapper">
                    ${prod.icone}
                </div>
                <div class="produto-info">
                    <h6 class="mb-1">${prod.nome}</h6>
                    <div class="estoque-status ${statusClasse}">
                        <i class="bi ${isEsgotado ? 'bi-x-circle' : 'bi-check-circle'}"></i> ${statusTexto}
                    </div>
                </div>
                <button class="btn btn-selecionar-produto" 
                    onclick="selecionarPresente(${prod.id}, ${prod.estoque}, '${prod.nome}')" ${isEsgotado ? 'disabled' : ''}>
                    ${isEsgotado ? 'Indisponível' : 'Presentear'}
                </button>
            </div>
        `;
        container.appendChild(col);
    });
}

// SINCRONIZAÇÃO EM TEMPO REAL COM O FIREBASE
const estoqueRef = ref(db, 'estoque');
onValue(estoqueRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        renderizarProdutosEstoque(data);
    } else {
        // Se o banco estiver vazio, inicializa com os valores padrão
        set(estoqueRef, produtosEstoqueDefault);
    }
});

window.selecionarPresente = function(id, estoqueAtual, nomeProduto) {
    if (estoqueAtual > 0) {
        const updates = {};
        // O Firebase usa índices 0-9 para o array de produtos
        updates[`/estoque/${id-1}/estoque`] = estoqueAtual - 1;
        
        update(ref(db), updates)
            .then(() => {
                presenteSelecionadoTemporario = nomeProduto;
                alert(`Você selecionou: ${nomeProduto}! ❤️\n\nAgora, por favor, preencha seus dados abaixo para confirmar sua presença.`);
                document.querySelector(".section-presenca").scrollIntoView({ behavior: 'smooth' });
            })
            .catch((error) => {
                console.error("Erro ao atualizar estoque:", error);
                alert("Ocorreu um erro ao selecionar o presente. Tente novamente.");
            });
    }
};
