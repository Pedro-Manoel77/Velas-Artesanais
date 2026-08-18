const velasEspirituais = [
  { nome: "Arruda",              cor: "#5F6F49" },
  { nome: "Sal Grosso",          cor: "#F6EEDD" },
  { nome: "Anil",                cor: "#274472" },
  { nome: "Calêndula",           cor: "#E0A733" },
  { nome: "Arruda + Sal Grosso", cor: "linear-gradient(90deg,#5F6F49,#F6EEDD)" },
  { nome: "Anil + Sal Grosso",   cor: "linear-gradient(90deg,#274472,#F6EEDD)" },
];

const aromasLatinhas = [
  "Malaleuca", "Lavanda", "Rosas", "Verbena e Limão Siciliano", "Alecrim", "Cascas e Folhas", "Laranja Doce"
];

const tabelaLatinhasSimples = [
  { qtd: 10, preco: 12 }, { qtd: 20, preco: 15 }, { qtd: 30, preco: 20 },
  { qtd: 40, preco: 23 }, { qtd: 50, preco: 27 }, { qtd: 60, preco: 33 },
  { qtd: 70, preco: 35 }, { qtd: 80, preco: 36 }, { qtd: 90, preco: 37 },
  { qtd: 100, preco: 46 },
];

const tabelaLatinhasPersonalizadas = [
  { qtd: 10, preco: 28 }, { qtd: 20, preco: 56 }, { qtd: 30, preco: 79 },
];

const PRECO_VELA_AROMATICA = 29;

function calcularPrecoEspiritual(qtd) {
  const tabela = { 1: 15, 2: 28, 3: 40, 4: 52 };
  if (tabela[qtd]) return tabela[qtd];
  if (qtd >= 5) return qtd * 13;
  return 0;
}

function montarGrid(lista, containerId, precoFn) {
  const container = document.getElementById(containerId);
  container.innerHTML = lista.map(item => `
    <div class="product-card">
      <div class="product-card__swatch" style="background:${item.cor || 'var(--gold-300)'}"></div>
      <p class="product-card__name">${item.nome}</p>
      <p class="product-card__price">${precoFn(item)}</p>
    </div>
  `).join("");
}

montarGrid(velasEspirituais, "grid-espirituais", () => "a partir de R$ 13,00");

const velasAromaticas = aromasLatinhas.map(nome => ({ nome }));
montarGrid(velasAromaticas, "grid-aromaticas", () => `R$ ${PRECO_VELA_AROMATICA.toFixed(2).replace(".", ",")}`);

function preencherSelectQuantidades(selectEl, tabela) {
  selectEl.innerHTML = tabela.map(l => `<option value="${l.qtd}">${l.qtd} unidades — R$ ${l.preco.toFixed(2).replace(".", ",")}</option>`).join("");
}
preencherSelectQuantidades(document.getElementById("qtd-latinha-simples"), tabelaLatinhasSimples);
preencherSelectQuantidades(document.getElementById("qtd-latinha-personalizada"), tabelaLatinhasPersonalizadas);

document.getElementById("tabela-latinhas-simples").innerHTML = tabelaLatinhasSimples.map(l => `
  <tr><td>${l.qtd} Unidades</td><td class="price-table__dots"></td><td>R$ ${l.preco.toFixed(2).replace(".", ",")}</td></tr>
`).join("");

document.getElementById("tabela-latinhas-personalizadas").innerHTML = tabelaLatinhasPersonalizadas.map(l => `
  <tr><td>${l.qtd} Unidades</td><td class="price-table__dots"></td><td>R$ ${l.preco.toFixed(2).replace(".", ",")}</td></tr>
`).join("");

document.getElementById("aromas-lista").innerHTML = aromasLatinhas.map(a => `<span class="aroma-chip">${a}</span>`).join("");
document.getElementById("aroma-latinha").innerHTML = aromasLatinhas.map(a => `<option value="${a}">${a}</option>`).join("");

const qtdEspiritualInput = document.getElementById("qtd-espiritual");
const precoEspiritualPreview = document.getElementById("preco-espiritual");

function atualizarPreviewEspiritual() {
  const qtd = Math.max(1, parseInt(qtdEspiritualInput.value) || 1);
  const total = calcularPrecoEspiritual(qtd);
  precoEspiritualPreview.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}
qtdEspiritualInput.addEventListener("input", atualizarPreviewEspiritual);
atualizarPreviewEspiritual();

let carrinho = []; // cada item: { descricao, preco }

function adicionarAoCarrinho(descricao, preco) {
  carrinho.push({ descricao, preco });
  renderizarCarrinho();
  abrirCarrinho();
}

function removerDoCarrinho(indice) {
  carrinho.splice(indice, 1);
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const listaEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");

  if (carrinho.length === 0) {
    listaEl.innerHTML = `<li class="cart__empty">Seu carrinho está vazio.</li>`;
  } else {
    listaEl.innerHTML = carrinho.map((item, i) => `
      <li class="cart-item">
        <div class="cart-item__info">
          <b>${item.descricao}</b>
        </div>
        <div class="cart-item__right">
          <span class="cart-item__price">R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
          <button class="cart-item__remove" data-remove="${i}">remover</button>
        </div>
      </li>
    `).join("");
  }

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
  totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  countEl.textContent = carrinho.length;
}

document.getElementById("cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  removerDoCarrinho(Number(btn.dataset.remove));
});

document.querySelectorAll("[data-add]").forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.dataset.add;

    if (tipo === "espiritual") {
      const qtd = Math.max(1, parseInt(qtdEspiritualInput.value) || 1);
      const essencia = document.getElementById("essencia-espiritual").value;
      const preco = calcularPrecoEspiritual(qtd);
      adicionarAoCarrinho(`Vela Espiritual (${essencia}) x${qtd}`, preco);
    }

    if (tipo === "latinha-simples") {
      const select = document.getElementById("qtd-latinha-simples");
      const linha = tabelaLatinhasSimples.find(l => l.qtd == select.value);
      adicionarAoCarrinho(`Latinha sem personalização — ${linha.qtd} un.`, linha.preco);
    }

    if (tipo === "latinha-personalizada") {
      const aroma = document.getElementById("aroma-latinha").value;
      const select = document.getElementById("qtd-latinha-personalizada");
      const linha = tabelaLatinhasPersonalizadas.find(l => l.qtd == select.value);
      adicionarAoCarrinho(`Latinha personalizada (${aroma}) — ${linha.qtd} un.`, linha.preco);
    }
  });
});

document.getElementById("grid-aromaticas").addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const nome = card.querySelector(".product-card__name").textContent;
  adicionarAoCarrinho(`Vela Aromática (${nome})`, PRECO_VELA_AROMATICA);
});

document.querySelectorAll("#grid-aromaticas .product-card").forEach(c => c.style.cursor = "pointer");

document.getElementById("clearCartBtn").addEventListener("click", () => {
  carrinho = [];
  renderizarCarrinho();
});

const NUMERO_WHATSAPP = "5532988553079";

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio. Adicione alguma vela antes de enviar o pedido ✨");
    return;
  }
  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
  let mensagem = "Olá! Gostaria de fazer o seguinte pedido na A Mística:%0A%0A";
  carrinho.forEach(item => {
    mensagem += `• ${item.descricao} — R$ ${item.preco.toFixed(2).replace(".", ",")}%0A`;
  });
  mensagem += `%0ATotal: R$ ${total.toFixed(2).replace(".", ",")}`;

  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensagem}`, "_blank");
});

const cartEl = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");

function abrirCarrinho() {
  cartEl.classList.add("is-open");
  cartOverlay.classList.add("is-open");
}
function fecharCarrinho() {
  cartEl.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
}

document.getElementById("cartToggle").addEventListener("click", abrirCarrinho);
document.getElementById("cartClose").addEventListener("click", fecharCarrinho);
cartOverlay.addEventListener("click", fecharCarrinho);

const navEl = document.getElementById("nav");
document.getElementById("navToggle").addEventListener("click", () => {
  navEl.classList.toggle("is-open");
});
navEl.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navEl.classList.remove("is-open")));

function gerarEstrelas(qtd = 60) {
  const container = document.getElementById("stars");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < qtd; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.top = Math.random() * 100 + "vh";
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
    frag.appendChild(s);
  }
  container.appendChild(frag);
}
gerarEstrelas();

renderizarCarrinho();