// Frankie Junction - Main Application

// WhatsApp number with country code
const WHATSAPP_NUMBER = "916359915993";

// Backend API URL
const API_BASE_URL = "https://frankie-ka8z.onrender.com/api";

// Menu data
const frankies = [
  {
    id: 1,
    name: "Paneer Tikka Frankie",
    desc: "Spicy paneer tikka with mint chutney & onions",
    price: 120,
    oldPrice: 150,
    img: "images/paneer-tikka.jpg",
    badge: "🔥 Bestseller",
    rating: 5
  },
  {
    id: 2,
    name: "Veg Frankie",
    desc: "Mixed veggies, carrots, cabbage with tangy chutneys",
    price: 80,
    oldPrice: 100,
    img: "images/veg-frankie.jpg",
    badge: "⭐ Popular",
    rating: 4
  },
  {
    id: 3,
    name: "Schezwan Frankie",
    desc: "Spicy schezwan noodles wrapped in soft roti",
    price: 110,
    oldPrice: 130,
    img: "images/schezwan.jpg",
    badge: "🌶️ Spicy",
    rating: 5
  },
  {
    id: 4,
    name: "Aloo Masala Frankie",
    desc: "Classic spicy potato filling with onions & chutney",
    price: 70,
    oldPrice: 90,
    img: "images/aloo-masala.jpg",
    badge: "💰 Budget",
    rating: 4
  },
  {
    id: 5,
    name: "Corn Cheese Frankie",
    desc: "Sweet corn with melted cheese – kids favourite!",
    price: 130,
    oldPrice: 160,
    img: "images/corn-cheese.jpg",
    badge: "🧀 Cheesy",
    rating: 5
  },
  {
    id: 6,
    name: "Cheese Burst Frankie",
    desc: "Loaded with extra cheese, veggies & special sauce",
    price: 150,
    oldPrice: 180,
    img: "images/cheese-burst.jpg",
    badge: "⭐ Premium",
    rating: 5
  }
];

// Cart storage
let cart = {};
let selectedRating = 0;
let comboTarget = null;

// Render menu items
function renderMenu() {
  const menu = document.getElementById("menuGrid");
  if (!menu) return;

  menu.innerHTML = frankies.map((f, i) => {
    const stars = "★".repeat(f.rating) + "☆".repeat(5 - f.rating);
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
            <span class="price">₹${f.price} <small>₹${f.oldPrice}</small></span>
            <div id="action-${f.id}">
              <button class="add-btn" onclick="addToCart(${f.id})">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  observeReveal();
}

// Toggle favourite button
function toggleFav(btn) {
  const icon = btn.querySelector("i");
  icon.classList.toggle("far");
  icon.classList.toggle("fas");
  icon.style.color = icon.classList.contains("fas") ? "#e74c3c" : "";
}

// Add item to cart
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateUI();
}

// Change quantity
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateUI();
}

// Update UI after cart changes
function updateUI() {
  frankies.forEach(f => {
    const el = document.getElementById("action-" + f.id);
    if (!el) return;

    if (cart[f.id]) {
      el.innerHTML = `
        <div class="qty-control">
          <button onclick="changeQty(${f.id}, -1)">−</button>
          <span>${cart[f.id]}</span>
          <button onclick="changeQty(${f.id}, 1)">+</button>
        </div>
      `;
    } else {
      el.innerHTML = `
        <button class="add-btn" onclick="addToCart(${f.id})">
          <i class="fas fa-plus"></i> Add
        </button>
      `;
    }
  });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = totalItems;

  renderCart();
}

// Get cart total
function getCartTotal() {
  return Object.keys(cart).reduce((total, id) => {
    const f = frankies.find(x => x.id == id);
    if (!f) return total;
    return total + (f.price * cart[id]);
  }, 0);
}

// Render cart
function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalAmount");
  if (!itemsEl || !totalEl) return;

  const ids = Object.keys(cart);

  if (!ids.length) {
    itemsEl.innerHTML = `<div class="empty">🛒 Cart khaali hai! Kuch order karo 😋</div>`;
    totalEl.textContent = "Total: ₹0";
    return;
  }

  itemsEl.innerHTML = ids.map(id => {
    const f = frankies.find(x => x.id == id);
    if (!f) return "";
    const sub = f.price * cart[id];
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <b>${f.name}</b>
          <small>₹${f.price} × ${cart[id]} = ₹${sub}</small>
        </div>
        <div class="qty-control">
          <button onclick="changeQty(${f.id}, -1)">−</button>
          <span>${cart[f.id]}</span>
          <button onclick="changeQty(${f.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = `Total: ₹${getCartTotal()}`;
}

// Open cart modal
function openCart() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;
  modal.classList.add("active");
  renderCart();
}

// Close cart modal
function closeCart() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;
  modal.classList.remove("active");
}

// ============================================
// NORMAL PAYMENT WITH RAZORPAY
// ============================================
async function payWithRazorpay() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const amount = getCartTotal();

  if (!amount) {
    alert("Pehle cart mein Frankie add karo 🌯");
    return;
  }

  if (!name || !phone || !address) {
    alert("Naam, mobile aur address fill karo 📝");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) throw new Error("Backend Error: " + response.status);

    const data = await response.json();
    console.log("Razorpay Backend Response:", data);

    if (!data.success) {
      alert(data.message || "Razorpay order create nahi hua.");
      return;
    }

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Frankie Junction",
      description: "Frankie Order",
      order_id: data.orderId,
      // checkout_config_id: "config_TT5d2VwMkHyopJ",
      prefill: { name, contact: phone },
      theme: { color: "#ff6b35" },
      handler: async function (payment) {
        console.log("Payment Response:", payment);

        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();
          console.log("Payment Verification:", verifyData);

          if (!verifyData.success) {
            alert("Payment verification failed ❌");
            return;
          }

          alert("Payment successful! 🎉");

          // WhatsApp Message
          let msg = `🌯 *PAID ORDER - Frankie Junction*%0A%0A`;
          msg += `👤 *Name:* ${name}%0A`;
          msg += `📞 *Phone:* ${phone}%0A`;
          msg += `📍 *Address:* ${address}%0A%0A`;
          msg += `🛒 *Order Details:*%0A`;

          Object.keys(cart).forEach(id => {
            const f = frankies.find(x => x.id == parseInt(id));
            if (!f) return;
            const sub = f.price * cart[id];
            msg += `• ${f.name} × ${cart[id]} = ₹${sub}%0A`;
          });

          msg += `%0A💰 *Total Paid: ₹${amount}*%0A`;
          msg += `💳 *Payment ID:* ${payment.razorpay_payment_id}%0A`;
          msg += `🧾 *Order ID:* ${payment.razorpay_order_id}%0A%0A`;
          msg += `🙏 Please confirm my order!`;

          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

          cart = {};
          updateUI();
          closeCart();

        } catch (error) {
          console.error("Verification Error:", error);
          alert("Payment verify nahi ho paya.");
        }
      }
    };

    const razorpay = new Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);
      alert("Payment failed. Please try again.");
    });

    razorpay.open();

  } catch (error) {
    console.error("Razorpay Error:", error);
    alert("Payment start nahi ho paya. Browser Console check karo.");
  }
}

// ============================================
// COMBO PAYMENT WITH RAZORPAY
// ============================================
async function payWithRazorpayCombo() {
  const name = document.getElementById("comboName").value.trim();
  const phone = document.getElementById("comboPhone").value.trim();
  const address = document.getElementById("comboLocation").value.trim();
  const amount = comboTarget ? comboTarget.price : 0;

  if (!amount) {
    alert("Combo select nahi hua.");
    return;
  }

  if (!name || !phone || !address) {
    alert("Naam, mobile aur address fill karo 📝");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) throw new Error("Backend Error: " + response.status);

    const data = await response.json();
    console.log("Razorpay Backend Response:", data);

    if (!data.success) {
      alert(data.message || "Razorpay order create nahi hua.");
      return;
    }

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Frankie Junction",
      description: "Combo Order",
      order_id: data.orderId,
      // checkout_config_id: "config_TT5d2VwMkHyopJ",
      prefill: { name, contact: phone },
      theme: { color: "#ff6b35" },
      handler: async function (payment) {
        console.log("Payment Response:", payment);

        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();
          console.log("Payment Verification:", verifyData);

          if (!verifyData.success) {
            alert("Payment verification failed ❌");
            return;
          }

          alert("Payment successful! 🎉");

          // WhatsApp Message
          let msg = `🌯 *PAID COMBO ORDER - Frankie Junction*%0A%0A`;
          msg += `👤 *Name:* ${name}%0A`;
          msg += `📞 *Phone:* ${phone}%0A`;
          msg += `📍 *Address:* ${address}%0A%0A`;
          msg += `📦 *Combo:* ${comboTarget.name}%0A`;
          msg += `💰 *Total Paid: ₹${amount}*%0A`;
          msg += `💳 *Payment ID:* ${payment.razorpay_payment_id}%0A`;
          msg += `🧾 *Order ID:* ${payment.razorpay_order_id}%0A%0A`;
          msg += `🙏 Please confirm my order!`;

          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
          closeComboModal();

        } catch (error) {
          console.error("Verification Error:", error);
          alert("Payment verify nahi ho paya.");
        }
      }
    };

    const razorpay = new Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);
      alert("Payment failed. Please try again.");
    });

    razorpay.open();

  } catch (error) {
    console.error("Razorpay Error:", error);
    alert("Payment start nahi ho paya. Browser Console check karo.");
  }
}

// WhatsApp order
function placeOrder() {
  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("custPhone")?.value.trim();
  const address = document.getElementById("custAddress")?.value.trim();
  const ids = Object.keys(cart);

  if (!ids.length) {
    alert("Pehle kuch frankie add karo! 🌯");
    return;
  }

  if (!name || !phone || !address) {
    alert("Naam, mobile aur address fill karo 📝");
    return;
  }

  let msg = `🌯 *NEW ORDER - Frankie Junction*%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  msg += `📞 *Phone:* ${phone}%0A`;
  msg += `📍 *Address:* ${address}%0A%0A`;
  msg += `🛒 *Order Details:*%0A`;

  let total = 0;
  ids.forEach(id => {
    const f = frankies.find(x => x.id == id);
    if (!f) return;
    const sub = f.price * cart[id];
    total += sub;
    msg += `• ${f.name} × ${cart[id]} = ₹${sub}%0A`;
  });

  msg += `%0A💰 *Total: ₹${total}*%0A%0A`;
  msg += `🙏 Please confirm my order!`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

// Combo order
function openComboModal(name, price) {
  comboTarget = { name, price };
  const selected = document.getElementById("comboModalSelected");
  const form = document.getElementById("comboForm");
  const modal = document.getElementById("comboModal");

  if (selected) selected.textContent = `${name} — ₹${price}`;
  if (form) form.reset();
  if (modal) modal.classList.add("active");
}

function closeComboModal() {
  const modal = document.getElementById("comboModal");
  if (modal) modal.classList.remove("active");
}

function sendComboOrder() {
  const name = document.getElementById("comboName")?.value.trim();
  const phone = document.getElementById("comboPhone")?.value.trim();
  const location = document.getElementById("comboLocation")?.value.trim();

  if (!name || !phone || !location) {
    alert("Sabhi fields fill karo 📝");
    return;
  }

  if (!comboTarget) {
    alert("Combo select nahi hua.");
    return;
  }

  let msg = `🔥 *COMBO ORDER - Frankie Junction*%0A%0A`;
  msg += `📦 *Combo:* ${comboTarget.name}%0A`;
  msg += `💰 *Price:* ₹${comboTarget.price}%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  msg += `📞 *Phone:* ${phone}%0A`;
  msg += `📍 *Location:* ${location}%0A%0A`;
  msg += `🙏 Please confirm this combo order!`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  closeComboModal();
}

// Feedback
function initStars() {
  document.querySelectorAll("#starRating i").forEach(star => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.val);
      document.querySelectorAll("#starRating i").forEach(s => {
        s.classList.toggle("active", parseInt(s.dataset.val) >= selectedRating);
      });
    });
  });
}

function sendFeedback() {
  const name = document.getElementById("fbName")?.value.trim();
  const phone = document.getElementById("fbPhone")?.value.trim();
  const item = document.getElementById("fbItem")?.value.trim();
  const message = document.getElementById("fbMessage")?.value.trim();

  if (!name || !message) {
    alert("Please naam aur feedback message bharo 📝");
    return;
  }

  if (!selectedRating) {
    alert("Please rating select karo ⭐");
    return;
  }

  let msg = `⭐ *FEEDBACK - Frankie Junction*%0A%0A`;
  msg += `👤 *Name:* ${name}%0A`;
  if (phone) msg += `📞 *Phone:* ${phone}%0A`;
  if (item) msg += `🌯 *Frankie Tried:* ${item}%0A`;
  msg += `⭐ *Rating:* ${"⭐".repeat(selectedRating)} (${selectedRating}/5)%0A%0A`;
  msg += `💬 *Message:*%0A${message}%0A%0A`;
  msg += `🙏 Thank you!`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

// Scroll reveal animation
function observeReveal() {
  const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// Counter animation
function animateCounters() {
  document.querySelectorAll(".stat-item h3[data-target]").forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 25);
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  initStars();
  observeReveal();

  const statsBar = document.querySelector(".stats-bar");
  if (statsBar) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(statsBar);
  }

  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.addEventListener("click", e => {
      if (e.target.id === "cartModal") closeCart();
    });
  }

  const comboModal = document.getElementById("comboModal");
  if (comboModal) {
    comboModal.addEventListener("click", e => {
      if (e.target.id === "comboModal") closeComboModal();
    });
  }
});

