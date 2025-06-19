// Mobile menu toggle
const mobileToggle = document.querySelector(".mobile-toggle");
const navMenu = document.querySelector(".nav-menu");

mobileToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close menu when clicking a link
const navLinks = document.querySelectorAll(".nav-menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartIcon = document.getElementById("cartIcon");
const cartCount = document.querySelector(".cart-count");
const cartModal = document.getElementById("cartModal");
const closeModal = document.querySelector(".close");
const continueShopping = document.getElementById("continueShopping");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart function
function addToCart(productId, name, price, image) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: parseFloat(price),
      image: image,
      quantity: 1,
    });
  }

  updateCartCount();
  showNotification(`${name} added to cart!`);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  // Add styles
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "var(--primary)";
  notification.style.color = "white";
  notification.style.padding = "15px 25px";
  notification.style.borderRadius = "5px";
  notification.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  notification.style.zIndex = "2000";
  notification.style.opacity = "0";
  notification.style.transform = "translateY(20px)";
  notification.style.transition = "all 0.3s ease";

  // Trigger reflow to enable transition
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Render cart items
function renderCartItems() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
              <i class="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
            </div>
          `;
    cartTotal.textContent = "R0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <div class="cart-item-img">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <div class="cart-item-price">R${item.price.toFixed(2)}</div>
              <div class="cart-item-actions">
                <button class="quantity-btn minus" data-id="${
                  item.id
                }">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${
                  item.id
                }">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
              </div>
            </div>
            <div class="cart-item-total">
              R${itemTotal.toFixed(2)}
            </div>
          `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `R${total.toFixed(2)}`;

  // Add event listeners to new buttons
  document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const item = cart.find((item) => item.id === id);
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter((item) => item.id !== id);
      }
      renderCartItems();
      updateCartCount();
    });
  });

  document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const item = cart.find((item) => item.id === id);
      item.quantity += 1;
      renderCartItems();
      updateCartCount();
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      cart = cart.filter((item) => item.id !== id);
      renderCartItems();
      updateCartCount();
    });
  });
}

// Event listeners for Add to Cart buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    const productId = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = e.target.dataset.price;
    const image = e.target.dataset.image;
    addToCart(productId, name, price, image);
  });
});

// Open cart modal
cartIcon.addEventListener("click", () => {
  renderCartItems();
  cartModal.style.display = "flex";
});

// Close cart modal
closeModal.addEventListener("click", () => {
  cartModal.style.display = "none";
});

continueShopping.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Checkout button
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout!");
  cart = [];
  updateCartCount();
  cartModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterForm.querySelector("input").value;
  showNotification(`Thank you for subscribing with ${email}!`);
  newsletterForm.reset();
});

// Contact form submission
const contactForm = document.querySelector(".contact-form form");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showNotification("Thank you for your message! We'll get back to you soon.");
  contactForm.reset();
});

// Initialize cart count
updateCartCount();
