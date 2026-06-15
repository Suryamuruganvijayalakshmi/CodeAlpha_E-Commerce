// ===== PRODUCT DATA =====
// All 6 sample products stored here
const products = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 1299,
    desc: "Short desc",
    fullDesc: "Crystal clear audio with active noise cancellation. Up to 24 hours battery life with the charging case. IPX5 water resistant — perfect for workouts and commutes.",
    emoji: "🎧"
  },
  {
    id: 2,
    name: "Laptop Stand",
    price: 899,
    desc: "Aluminium adjustable stand",
    fullDesc: "Premium aluminium build with adjustable height settings. Improves posture and keeps your laptop cool by allowing better airflow. Folds flat for easy carrying.",
    emoji: "💻"
  },
  {
    id: 3,
    name: "USB-C Hub",
    price: 1499,
    desc: "7-in-1 multiport adapter",
    fullDesc: "7-in-1 USB-C hub with HDMI 4K output, 3x USB-A ports, SD card reader, and 100W PD charging pass-through. Plug and play, no drivers needed.",
    emoji: "🔌"
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: 2199,
    desc: "TKL layout, blue switches",
    fullDesc: "Tenkeyless mechanical keyboard with tactile blue switches. RGB backlight with 20 preset effects. Detachable braided USB-C cable. Great for coding and gaming.",
    emoji: "⌨️"
  },
  {
    id: 5,
    name: "Webcam HD",
    price: 1799,
    desc: "1080p 30fps with mic",
    fullDesc: "Full HD 1080p webcam with built-in noise-cancelling microphone. Wide-angle 90° lens, auto light correction. Clip mounts on any monitor or laptop screen easily.",
    emoji: "📷"
  },
  {
    id: 6,
    name: "Mouse Pad XL",
    price: 399,
    desc: "90x40cm extended desk mat",
    fullDesc: "Extra-large desk mat (90x40cm) that covers your entire desk. Smooth micro-weave surface for precise mouse tracking. Non-slip rubber base keeps it in place.",
    emoji: "🖱️"
  }
];


// ===== CART FUNCTIONS (using localStorage) =====

// Get cart from localStorage (returns array)
function getCart() {
  const cartData = localStorage.getItem('shopcart_cart');
  return cartData ? JSON.parse(cartData) : [];
}

// Save cart back to localStorage
function saveCart(cart) {
  localStorage.setItem('shopcart_cart', JSON.stringify(cart));
}

// Add a product to cart
function addToCart(productId, quantity) {
  const qty = quantity || 1;
  let cart = getCart();

  // Check if product already in cart
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex !== -1) {
    // Product exists — increase quantity
    cart[existingIndex].quantity += qty;
  } else {
    // New product — find it from products array and add
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        quantity: qty
      });
    }
  }

  saveCart(cart);
  updateCartCount();
  showToast('"' + products.find(p => p.id === productId).name + '" added to cart!');
}

// Remove item from cart by product id
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

// Update quantity of a cart item
function updateCartQty(productId, change) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      // Remove if qty goes to 0
      cart = cart.filter(i => i.id !== productId);
    }
  }
  saveCart(cart);
}

// Get total number of items in cart (for navbar badge)
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count badge in navbar
function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}


// ===== USER AUTH FUNCTIONS (using localStorage) =====

// Get all registered users
function getUsers() {
  const data = localStorage.getItem('shopcart_users');
  return data ? JSON.parse(data) : [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('shopcart_users', JSON.stringify(users));
}

// Register a new user
function registerUser(name, email, password) {
  const users = getUsers();
  // Check if email already registered
  const exists = users.find(u => u.email === email);
  if (exists) {
    return { success: false, message: 'Email already registered. Please login.' };
  }
  users.push({ name, email, password });
  saveUsers(users);
  return { success: true, message: 'Account created! You can now login.' };
}

// Login a user
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Save session
    localStorage.setItem('shopcart_session', JSON.stringify({ name: user.name, email: user.email }));
    return { success: true, message: 'Login successful! Redirecting...' };
  }
  return { success: false, message: 'Wrong email or password. Please try again.' };
}

// Get logged-in user
function getCurrentUser() {
  const session = localStorage.getItem('shopcart_session');
  return session ? JSON.parse(session) : null;
}

// Logout user
function logoutUser() {
  localStorage.removeItem('shopcart_session');
}


// ===== TOAST NOTIFICATION =====
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  // Hide after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}


// ===== LOGIN PAGE FUNCTIONS =====
function setupLoginPage() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const msgBox = document.getElementById('auth-message');

  if (!tabLogin || !tabRegister || !loginForm || !registerForm) return;

  // Tab switching
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    msgBox.textContent = '';
    msgBox.style.display = 'none';
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    msgBox.textContent = '';
    msgBox.style.display = 'none';
  });

  // Handle login form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      showAuthMessage('Please fill in all fields.', 'error');
      return;
    }

    const result = loginUser(email, password);
    showAuthMessage(result.message, result.success ? 'success' : 'error');

    if (result.success) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  });

  // Handle register form
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirmPassword = document.getElementById('register-confirm-password').value.trim();

    if (!name || !email || !password || !confirmPassword) {
      showAuthMessage('Please fill in all fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAuthMessage('Passwords do not match.', 'error');
      return;
    }

    const result = registerUser(name, email, password);
    showAuthMessage(result.message, result.success ? 'success' : 'error');

    if (result.success) {
      registerForm.reset();
      setTimeout(() => {
        tabLogin.click();
      }, 1500);
    }
  });
}

function showAuthMessage(message, type) {
  const msgBox = document.getElementById('auth-message');
  if (!msgBox) return;
  msgBox.textContent = message;
  msgBox.className = 'message ' + type;
  msgBox.style.display = 'block';
}


// ===== ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  // Update cart count badge whenever a page loads
  updateCartCount();

  // Update login link in navbar based on session
  const loginLink = document.getElementById('login-nav-link');
  const user = getCurrentUser();
  if (loginLink && user) {
    loginLink.textContent = 'Hi, ' + user.name.split(' ')[0];
  }

  // Setup login page if we're on login.html
  const pagePath = window.location.pathname;
  if (pagePath.includes('login.html')) {
    setupLoginPage();
  }
});