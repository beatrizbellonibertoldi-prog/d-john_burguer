"use strict";

/* ════════════════════════════════════════════
   CONFIGURACOES — edite apenas aqui
════════════════════════════════════════════ */
const CONFIG = {
    whatsappNumber: "5517991489774",

    // Horario de funcionamento: so quinta-feira
    openDay:   4,   // 0=dom 1=seg 2=ter 3=qua 4=qui 5=sex 6=sab
    openHour:  19,
    closeHour: 22,
};

/* ════════════════════════════════════════════
   DADOS DOS PRODUTOS
════════════════════════════════════════════ */
const productsData = {
    tradicionais: [
        { id:1, name:"CHEESE BURGER", description:"Pao de brioche, maionese e hamburguer artesanal.", price:30.90, image:"../img/cheese-burguer.png" },
        { id:2, name:"CHEESE SALADA", description:"Pao de brioche, maionese, mucarela, alface e tomate.", price:35.90, image:"../img/cheese-salada.jpeg" },
        { id:3, name:"CHEESE SALADA EGG", description:"Pao de brioche, maionese, mucarela, alface, tomate e ovo.", price:37.90, image:"../img/cheese-salada-egg.png" },
        { id:4, name:"CHEESE SALADA BACON", description:"Pao de brioche, maionese, mucarela, alface, tomate e bacon.", price:38.90, image:"../img/cheese-salada-bacon.jpeg" },
        { id:5, name:"CHEESE EGG", description:"Pao de brioche, maionese, hamburguer, mucarela e ovo.", price:35.00, image:"../img/cheese-egg.png" },
        { id:6, name:"CHEESE BACON", description:"Pao de brioche, maionese, hamburguer, mucarela e bacon.", price:34.90, image:"../img/cheese-bacon.png" },
        { id:7, name:"CHEESE EGG BACON", description:"Pao de brioche, maionese, hamburguer, mucarela, ovo e bacon.", price:38.90, image:"../img/cheese-egg-bacon.png" },
        { id:8, name:"CHEESE TUDO", description:"Pao de brioche, maionese, hamburguer, mucarela, alface, tomate, ovo e bacon.", price:39.90, image:"../img/cheese-tudo.png" },
    ],

    especiais: [
        { id:9, name:"Fã House", description:"Pao de brioche, maionese verde, hamburguer, mucarela, rucula, tomate, cebola roxa e bacon.", price:41.90, image:"../img/djohn.jpeg" },
        { id:10, name:"CREAM CHEESE", description:"Pao de brioche, maionese verde, hamburguer, cream cheese, mucarela e tomate.", price:40.90, image:"../img/cream-cheese.jpeg" },
        { id:11, name:"CHEDDAR MELT", description:"Pao de brioche, maionese verde, hamburguer, cheddar e bacon.", price:40.90, image:"../img/cheddar-melt.jpeg" },
        { id:12, name:"COMBO KIDS", description:"Hamburguer 90g, mucarela e batata individual.", price:29.90, image:"../img/batata-frita.jpg" },
    ],

    adicionais: [
        { name:"Alface", price:2 },
        { name:"Rucula", price:2 },
        { name:"Tomate", price:2 },
        { name:"Cebola", price:2 },
        { name:"Bacon", price:5 },
        { name:"Ovo", price:3 },
        { name:"Cheddar", price:5 },
        { name:"Cream Cheese", price:5 },
        { name:"Mucarela", price:5 },
        { name:"Catupiry", price:6 },
        { name:"Maionese Verde", price:5 },
        { name:"Hamburguer 160g", price:15 },
    ],

    fritas: [
        { id:13, name:"Fritas Individual", price:9, image:"../img/batata-frita.jpg" },
        { id:14, name:"Fritas Media", price:15, image:"../img/batata-frita.jpg" },
        { id:15, name:"Fritas Grande", price:28, image:"../img/batata-frita.jpg" },
    ],

    bebidas: [
        { id:16, name:"Coca-Cola 350ml", price:7, image:"../img/coca-normal.jpeg" },
        { id:17, name:"Coca-Cola Zero 350ml", price:7, image:"../img/coca-cola-zero.jpeg" },
        { id:18, name:"Schweppes 350ml", price:7, image:"../img/schweppes.webp" },
    ],
};
/* ════════════════════════════════════════════
   ESTADO
════════════════════════════════════════════ */
let cart = loadCart();

// Salva dados do pedido para usar apos pagamento
let pendingOrder = {};

/* ════════════════════════════════════════════
   REFERENCIAS DOM
════════════════════════════════════════════ */
const cartModal   = document.getElementById("cartModal");
const addonsModal = document.getElementById("addonsModal");

const cartItemsEl = document.getElementById("cart-items");
const subtotalEl  = document.getElementById("subtotal");
const totalEl     = document.getElementById("total");
const cartCountEl = document.getElementById("cart-count");

/* ════════════════════════════════════════════
   UTILITARIOS
════════════════════════════════════════════ */
function fmt(value) {
    return "R$ " + value.toFixed(2).replace(".", ",");
}

function saveCart() {
    try { sessionStorage.setItem("djohn_cart", JSON.stringify(cart)); } catch(_) {}
}

function loadCart() {
    try { return JSON.parse(sessionStorage.getItem("djohn_cart")) || []; } catch(_) { return []; }
}

/* ════════════════════════════════════════════
   TOAST
════════════════════════════════════════════ */
function showToast(msg, type = "success") {
    const colors = {
        success: { bg:"#2e1a1a", border:"#6b2424", color:"#f4b8b8", icon:"✓" },
        error:   { bg:"#3b1c1c", border:"#6b2424", color:"#f4b8b8", icon:"!" },
        info:    { bg:"#1a1a2e", border:"#2d2d6a", color:"#b8b8f4", icon:"i" },
    };
    const c = colors[type] || colors.success;
    const t = document.createElement("div");
    t.style.cssText = `
        display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:12px;
        background:${c.bg};border:1px solid ${c.border};color:${c.color};
        font-size:0.88em;font-weight:600;font-family:'DM Sans',sans-serif;
        box-shadow:0 8px 24px rgba(0,0,0,0.5);
        opacity:0;transform:translateX(24px);
        transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
        pointer-events:none;max-width:300px;
    `;
    t.innerHTML = `<span style="font-size:1em;font-weight:900">${c.icon}</span> ${msg}`;
    document.getElementById("toast-container").appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        t.style.opacity = "1"; t.style.transform = "translateX(0)";
    }));
    setTimeout(() => {
        t.style.opacity = "0"; t.style.transform = "translateX(24px)";
        setTimeout(() => t.remove(), 320);
    }, 2800);
}

/* ════════════════════════════════════════════
   STATUS BAR — so quinta das 19h as 22h
════════════════════════════════════════════ */
function updateStatusBar() {
    const bar  = document.getElementById("status-bar");
    const text = document.getElementById("status-text");
    const now  = new Date();
    const day  = now.getDay();
    const hour = now.getHours();

    const isOpen = day === CONFIG.openDay &&
                   hour >= CONFIG.openHour &&
                   hour <  CONFIG.closeHour;

    if (isOpen) {
        bar.className = "status-bar open";
        text.textContent = "Abertos agora  |  Quinta-feira das 19h as 22h";
    } else {
        bar.className = "status-bar closed";
        text.textContent = "Fechado no momento  |  Abrimos toda quinta das 19h as 22h";
    }
}

/* ════════════════════════════════════════════
   RENDERIZACAO DOS PRODUTOS
════════════════════════════════════════════ */
function renderProducts() {
    // Cards ja estao no HTML — apenas inicializa os botoes e animacoes
    document.querySelectorAll(".card").forEach((card, i) => {
        const product = {
            id:          Number(card.dataset.id),
            name:        card.dataset.name,
            description: card.dataset.description || "",
            price:       parseFloat(card.dataset.price),
        };
        const hasAddons = card.dataset.hasAddons === "true";

        // Animacao de entrada
        card.style.cssText += `opacity:0;transform:translateY(24px);transition:opacity 0.45s ease ${i*60}ms,transform 0.45s ease ${i*60}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.opacity = "1"; card.style.transform = "translateY(0)";
        }));

        // Botao
        const btn = card.querySelector("button");
        if (btn) {
            btn.addEventListener("click", () =>
                hasAddons ? openAddonsModal(product) : addToCart(product)
            );
        }
    });
}

/* ════════════════════════════════════════════
   MODAL ADICIONAIS
════════════════════════════════════════════ */
function openAddonsModal(product) {
    document.getElementById("modal-product-name").textContent = product.name;
    document.getElementById("modal-base-price").textContent   = "A partir de " + fmt(product.price);

    const list = document.getElementById("addons-list");
    list.innerHTML = "";
    list.dataset.basePrice = product.price;

    productsData.adicionais.forEach(addon => {
        list.innerHTML += `
            <label>
                <div style="display:flex;align-items:center;gap:10px">
                    <input type="checkbox" data-name="${addon.name}" data-price="${addon.price}">
                    <span>${addon.name}</span>
                </div>
                <span style="color:var(--red-light);font-weight:600;font-size:0.85em">+ ${fmt(addon.price)}</span>
            </label>
        `;
    });

    list.addEventListener("change", () => {
        const base = parseFloat(list.dataset.basePrice) || 0;
        let extra = 0;
        list.querySelectorAll("input:checked").forEach(c => extra += Number(c.dataset.price));
        document.getElementById("modal-base-price").textContent = "Total: " + fmt(base + extra);
    });

    addonsModal.dataset.product = JSON.stringify(product);
    addonsModal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeAddonsModal() {
    addonsModal.classList.remove("open");
    document.body.style.overflow = "";
}

function confirmAddons() {
    const product  = JSON.parse(addonsModal.dataset.product);
    const selected = [];
    let finalPrice = product.price;

    document.querySelectorAll("#addons-list input:checked").forEach(box => {
        selected.push({ name: box.dataset.name, price: Number(box.dataset.price) });
        finalPrice += Number(box.dataset.price);
    });

    addToCart({ ...product, addons: selected, finalPrice });
    closeAddonsModal();
}

/* ════════════════════════════════════════════
   CARRINHO
════════════════════════════════════════════ */
function addToCart(product) {
    const existing = cart.find(item =>
        item.id === product.id &&
        JSON.stringify(item.addons || []) === JSON.stringify(product.addons || [])
    );

    if (existing) {
        existing.quantity++;
        showToast("+" + existing.quantity + " " + product.name + " no carrinho");
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(product.name + " adicionado!");
    }

    saveCart();
    updateCart();
    animateCartBtn();

    if (cart.length === 1 && cart[0].quantity === 1) openCart();
}

function animateCartBtn() {
    const btn = document.querySelector(".cart-btn");
    if (!btn) return;
    btn.classList.remove("added");
    void btn.offsetWidth;
    btn.classList.add("added");
}

function updateCart() {
    cartItemsEl.innerHTML = "";
    let subtotal = 0, count = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div style="text-align:center;padding:32px 0;color:var(--text-muted)">
                <div style="font-size:2.5em;margin-bottom:8px">🛒</div>
                <p style="font-size:0.9em">Seu carrinho esta vazio</p>
            </div>`;
    }

    cart.forEach((item, idx) => {
        const itemTotal = (item.finalPrice || item.price) * item.quantity;
        subtotal += itemTotal;
        count    += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-details">
                <strong>${item.quantity}x ${item.name}</strong>
                ${item.addons && item.addons.length ? `<div class="addons">+ ${item.addons.map(a=>a.name).join(", ")}</div>` : ""}
            </div>
            <div class="cart-item-controls">
                <span class="price">${fmt(itemTotal)}</span>
                <button onclick="decreaseQty(${idx})" title="Diminuir">-</button>
                <button onclick="increaseQty(${idx})" title="Aumentar">+</button>
                <button onclick="removeItem(${idx})" title="Remover" style="font-size:0.8em">X</button>
            </div>
        `;
        cartItemsEl.appendChild(div);
    });

    subtotalEl.textContent  = fmt(subtotal);
    totalEl.textContent     = fmt(subtotal);
    cartCountEl.textContent = count;
    saveCart();
}

function increaseQty(i) { cart[i].quantity++; updateCart(); }

function decreaseQty(i) {
    if (cart[i].quantity > 1) { cart[i].quantity--; }
    else { cart.splice(i, 1); }
    updateCart();
}

function removeItem(i) {
    const name = cart[i].name;
    cart.splice(i, 1);
    updateCart();
    showToast(name + " removido", "info");
}

function clearCart() {
    if (!cart.length) return;
    if (!confirm("Deseja limpar todos os itens do carrinho?")) return;
    cart = [];
    updateCart();
    showToast("Carrinho limpo", "info");
}

function openCart()   { cartModal.classList.add("open");    document.body.style.overflow = "hidden"; }
function closeCart()  { cartModal.classList.remove("open"); document.body.style.overflow = ""; }
function toggleCart() { cartModal.classList.contains("open") ? closeCart() : openCart(); }

/* ════════════════════════════════════════════
   VALIDACAO DE CAMPOS
════════════════════════════════════════════ */
function setError(id, on) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = on ? "rgba(220,80,80,0.6)" : "";
    el.style.boxShadow   = on ? "0 0 0 3px rgba(220,80,80,0.12)" : "";
    el.style.background  = on ? "rgba(220,80,80,0.06)" : "";
}

/* ════════════════════════════════════════════
   ENVIAR PEDIDO DIRETO AO WHATSAPP
════════════════════════════════════════════ */
function sendToWhatsApp() {
    const name    = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const notes   = document.getElementById("order-notes").value.trim();

    setError("customer-name", false);
    setError("customer-address", false);

    let err = false;

    if (!name) {
        setError("customer-name", true);
        showToast("Informe seu nome.", "error");
        err = true;
    }

    if (!address) {
        setError("customer-address", true);
        if (!err) showToast("Informe o endereco.", "error");
        err = true;
    }

    if (err) return;

    if (!cart.length) {
        showToast("Adicione itens ao carrinho.", "error");
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += (item.finalPrice || item.price) * item.quantity;
    });

    const lines = [];

    lines.push("PEDIDO FÃ BURGUER");
    lines.push("------------------------------");
    lines.push("");

    cart.forEach(item => {
        const price = (item.finalPrice || item.price) * item.quantity;
        lines.push(item.quantity + "x " + item.name + " — " + fmt(price));

        if (item.addons && item.addons.length) {
            lines.push("   Adicionais: " + item.addons.map(a => a.name).join(", "));
        }
    });

    lines.push("");
    lines.push("------------------------------");
    lines.push("SUBTOTAL DOS ITENS: " + fmt(subtotal));
    lines.push("TAXA DE ENTREGA: A calcular");
    lines.push("TOTAL FINAL: A confirmar com a entrega");
    lines.push("------------------------------");
    lines.push("");
    lines.push("Nome: " + name);
    lines.push("Endereco para entrega: " + address);

    if (notes) {
        lines.push("Observacoes: " + notes);
    }

    lines.push("");
    lines.push("Por favor, calcular a taxa de entrega para este endereco.");
    lines.push("Aguardando confirmacao do valor final pelo WhatsApp.");

    const message = encodeURIComponent(lines.join("\n"));
    window.open("https://wa.me/" + CONFIG.whatsappNumber + "?text=" + message, "_blank");

    cart = [];
    pendingOrder = {};
    saveCart();
    updateCart();

    closeCart();

    showToast("Pedido enviado para o WhatsApp!", "success");
}

/* ════════════════════════════════════════════
   BOTAO VOLTAR AO TOPO
════════════════════════════════════════════ */
function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 300);
    });
}

/* ════════════════════════════════════════════
   NAV ATIVA NO SCROLL
════════════════════════════════════════════ */
function initActiveNav() {
    const sections = document.querySelectorAll("main section[id]");
    const links    = document.querySelectorAll(".main-nav a");
    if (!sections.length || !links.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(link => {
                    const active = link.getAttribute("href") === "#" + entry.target.id;
                    link.style.color = active ? "var(--white)" : "";
                });
            }
        });
    }, { rootMargin:"-40% 0px -55% 0px" });

    sections.forEach(s => obs.observe(s));
}

/* ════════════════════════════════════════════
   FECHAR MODAIS COM ESC E CLIQUE FORA
════════════════════════════════════════════ */
function initModalEvents() {
    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;
        if (cartModal.classList.contains("open")) closeCart();
        else if (addonsModal.classList.contains("open")) closeAddonsModal();
    });

    addonsModal.addEventListener("click", e => { if (e.target === addonsModal) closeAddonsModal(); });
    cartModal.addEventListener("click",   e => { if (e.target === cartModal)   closeCart(); });
}

/* ════════════════════════════════════════════
   LIMPAR ERROS AO DIGITAR
════════════════════════════════════════════ */
function initFieldValidation() {
    ["customer-name","customer-address"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", () => setError(id, false));
    });
}

/* ════════════════════════════════════════════
   RODAPE — ANO DINAMICO
════════════════════════════════════════════ */
function initFooterYear() {
    const el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
}

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCart();
    updateStatusBar();
    initBackToTop();
    initActiveNav();
    initModalEvents();
    initFieldValidation();
    initFooterYear();

    // Atualiza status a cada minuto
    setInterval(updateStatusBar, 60_000);
});
