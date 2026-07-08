// ============================
// WHATSAPP NUMBER
// ============================
const WHATSAPP_NUMBER = "916353598802";

// ============================
// MENU DATA
// ============================
const frankies = [
  { id: 1, name: "Paneer Tikka Frankie", desc: "Spicy paneer tikka with mint chutney & onions", price: 120, oldPrice: 150, img: "https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_IBqlJhoESehvMCNoNi3nD/48ba4693-5f3e-4be8-b0a1-652e24fca675.png", badge: "🔥 Bestseller", rating: 5 },
  { id: 2, name: "Veg Frankie",          desc: "Mixed veggies, carrots, cabbage with tangy chutneys",   price: 80,  oldPrice: 100, img: "https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_IBqlJhoESehvMCNoNi3nD/6daa7597-6fb5-4776-abf1-7665f25be62f.png", badge: "⭐ Popular",    rating: 4 },
  { id: 3, name: "Schezwan Frankie",     desc: "Spicy schezwan noodles wrapped in soft roti",           price: 110, oldPrice: 130, img: "https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_IBqlJhoESehvMCNoNi3nD/e76ab893-3b68-414a-b934-8209eff10d0c.png", badge: "🌶️ Spicy",     rating: 5 },
  { id: 4, name: "Aloo Masala Frankie",  desc: "Classic spicy potato filling with onions & chutney",   price: 70,  oldPrice: 90,  img: "https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_IBqlJhoESehvMCNoNi3nD/34d9ea59-84d1-487c-b43d-322407f5298e.png", badge: "💰 Budget",     rating: 4 },
  { id: 5, name: "Corn Cheese Frankie",  desc: "Sweet corn with melted cheese – kids favourite!",      price: 130, oldPrice: 160, img: "https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_IBqlJhoESehvMCNoNi3nD/f8501273-f3cd-43b7-850c-7c2a35e86051.png", badge: "🧀 Cheesy",     rating: 5 },
  { id: 6, name: "Cheese Burst Frankie", desc: "Loaded with extra cheese, veggies & special sauce",    price: 150, oldPrice: 180, img: "https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_IBqlJhoESehvMCNoNi3nD/2817b9dd-0572-4346-b7a9-591ba0c02a00.png", badge: "⭐ Premium",    rating: 5 },
];

let cart = {};
let selectedRating = 0;
let comboTarget = null; // { name, price }

// ============================
// RENDER MENU
// ============================
function renderMenu() {
  const menu = document.getElementById('menuGrid');
  menu.innerHTML = frankies.map((f, i) => {
    const stars = '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating);
    return `
      <div class="card reveal" style="animation-delay:${i * 0.08}s">
        <div class="card-img-wrap">
          <span class="badge">${f.badge}</span>
          <button class="fav" onclick="toggleFav(this)" aria-label="Favourite">
            <i class="far fa-heart"></i>
          </button>
          <img src="${f.img}" alt="${f.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="card-emoji" style="display:none">🌯</div>
        </div>
        <div class="card-body">
          <div class="rating">${stars} <span>(${f.rating}.0)</span></div>
          <h3>${f.name}</h3>
          <p class="desc">${f.desc}</p>
          <div class="card-footer">
            <span class="price">₹${f.price}<small>₹${f.oldPrice}</small></span>
            <div id="action-${f.id}">
              <button class="add-btn" onclick="addToCart(${f.id})">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
  observeReveal();
}

function toggleFav(btn) {
  const icon = btn.querySelector('i');
  icon.classList.toggle('far');
  icon.classList.toggle('fas');
  icon.style.color = icon.classList.contains('fas') ? '#e74c3c' : '';
}

// ============================
// CART
// ============================
function addToCart(id)         { cart[id] = (cart[id] || 0) + 1; updateUI(); }
function changeQty(id, delta)  { cart[id] = (cart[id] || 0) + delta; if (cart[id] <= 0) delete cart[id]; updateUI(); }

function updateUI() {
  frankies.forEach(f => {
    const el = document.getElementById('action-' + f.id);
    if (!el) return;
    el.innerHTML = cart[f.id]
      ? `<div class="qty-control">
           <button onclick="changeQty(${f.id},-1)">−</button>
           <span>${cart[f.id]}</span>
           <button onclick="changeQty(${f.id},+1)">+</button>
         </div>`
      : `<button class="add-btn" onclick="addToCart(${f.id})"><i class="fas fa-plus"></i> Add</button>`;
  });
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cartCount').textContent = total;
  renderCart();
}

function renderCart() {
  const itemsEl  = document.getElementById('cartItems');
  const totalEl  = document.getElementById('totalAmount');
  const ids      = Object.keys(cart);
  if (!ids.length) {
    itemsEl.innerHTML = `<div class="empty">🛒 Cart khaali hai! Kuch order karo 😋</div>`;
    totalEl.textContent = "Total: ₹0"; return;
  }
  let total = 0;
  itemsEl.innerHTML = ids.map(id => {
    const f   = frankies.find(x => x.id == id);
    const sub = f.price * cart[id]; total += sub;
    return `<div class="cart-item">
      <div class="cart-item-info"><b>${f.name}</b><small>₹${f.price} × ${cart[id]} = ₹${sub}</small></div>
      <div class="qty-control">
        <button onclick="changeQty(${f.id},-1)">−</button>
        <span>${cart[f.id]}</span>
        <button onclick="changeQty(${f.id},+1)">+</button>
      </div>
    </div>`;
  }).join('');
  totalEl.textContent = `Total: ₹${total}`;
}

function openCart()  { document.getElementById('cartModal').classList.add('active'); renderCart(); }
function closeCart() { document.getElementById('cartModal').classList.remove('active'); }

function placeOrder() {
  const name    = document.getElementById('custName').value.trim();
  const phone   = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const ids     = Object.keys(cart);
  if (!ids.length)               { alert("Pehle kuch frankie add karo! 🌯"); return; }
  if (!name || !phone || !address){ alert("Naam, mobile aur address fill karo 📝"); return; }
  let msg = `🌯 *NEW ORDER - Frankie Junction*%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  msg += `📞 *Phone:* ${phone}%0A`;
  msg += `📍 *Address:* ${address}%0A%0A`;
  msg += `🛒 *Order Details:*%0A`;
  let total = 0;
  ids.forEach(id => {
    const f   = frankies.find(x => x.id == id);
    const sub = f.price * cart[id]; total += sub;
    msg += `• ${f.name} × ${cart[id]} = ₹${sub}%0A`;
  });
  msg += `%0A💰 *Total: ₹${total}*%0A%0A🙏 Please confirm my order!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

// ============================
// COMBO MODAL
// ============================
function openComboModal(name, price) {
  comboTarget = { name, price };
  document.getElementById('comboModalSelected').textContent = `${name} — ₹${price}`;
  document.getElementById('comboForm').reset();
  document.getElementById('comboModal').classList.add('active');
}
function closeComboModal() {
  document.getElementById('comboModal').classList.remove('active');
}
function sendComboOrder() {
  const name     = document.getElementById('comboName').value.trim();
  const phone    = document.getElementById('comboPhone').value.trim();
  const location = document.getElementById('comboLocation').value.trim();
  if (!name || !phone || !location) { alert("Sabhi fields fill karo 📝"); return; }
  let msg = `🔥 *COMBO ORDER - Frankie Junction*%0A%0A`;
  msg += `📦 *Combo:* ${comboTarget.name}%0A`;
  msg += `💰 *Price:* ₹${comboTarget.price}%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  msg += `📞 *Phone:* ${phone}%0A`;
  msg += `📍 *Location:* ${location}%0A%0A`;
  msg += `🙏 Please confirm this combo order!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  closeComboModal();
}

// ============================
// FEEDBACK STAR RATING
// ============================
function initStars() {
  document.querySelectorAll('#starRating i').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      document.querySelectorAll('#starRating i').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.val) >= selectedRating);
      });
    });
  });
}

function sendFeedback() {
  const name    = document.getElementById('fbName').value.trim();
  const phone   = document.getElementById('fbPhone').value.trim();
  const item    = document.getElementById('fbItem').value.trim();
  const message = document.getElementById('fbMessage').value.trim();
  if (!name || !message) { alert("Please naam aur feedback message bharo 📝"); return; }
  if (!selectedRating)   { alert("Please rating select karo ⭐"); return; }
  let msg = `⭐ *FEEDBACK - Frankie Junction*%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  if (phone) msg += `📞 *Phone:* ${phone}%0A`;
  if (item)  msg += `🌯 *Frankie Tried:* ${item}%0A`;
  msg += `⭐ *Rating:* ${'⭐'.repeat(selectedRating)} (${selectedRating}/5)%0A%0A`;
  msg += `💬 *Message:*%0A${message}%0A%0A🙏 Thank you!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

// ============================
// SCROLL REVEAL
// ============================
function observeReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ============================
// COUNTER ANIMATION
// ============================
function animateCounters() {
  document.querySelectorAll('.stat-item h3[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current  = 0;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + suffix;
    }, 25);
  });
}

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  initStars();
  observeReveal();

  // Counter on stats bar visible
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); io.disconnect(); }
    }, { threshold: .5 });
    io.observe(statsBar);
  }

  // Close modals on overlay click
  document.getElementById('cartModal').addEventListener('click', e => {
    if (e.target.id === 'cartModal') closeCart();
  });
  const comboModal = document.getElementById('comboModal');
  if (comboModal) comboModal.addEventListener('click', e => {
    if (e.target.id === 'comboModal') closeComboModal();
  });
});
