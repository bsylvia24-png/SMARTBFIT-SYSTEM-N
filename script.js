// ===== Smart Fit System - Main JavaScript =====

// ===== Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu
                hamburger?.classList.remove('active');
                navLinks?.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// ===== Authentication System =====
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.checkSession();
        this.initAuthLinks();
        this.initLogout();
    }
    
    loadUsers() {
        const users = localStorage.getItem('smartfit_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers() {
        localStorage.setItem('smartfit_users', JSON.stringify(this.users));
    }
    
    saveSession(user) {
        localStorage.setItem('smartfit_session', JSON.stringify(user));
        this.currentUser = user;
        this.updateUI();
    }
    
    checkSession() {
        const session = localStorage.getItem('smartfit_session');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.updateUI();
        }
    }
    
    clearSession() {
        localStorage.removeItem('smartfit_session');
        this.currentUser = null;
        this.updateUI();
    }
    
    updateUI() {
        const authLinks = document.querySelector('.auth-links');
        const userProfile = document.querySelector('.user-profile');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (this.currentUser) {
            if (authLinks) authLinks.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                if (userNameDisplay) {
                    userNameDisplay.textContent = this.currentUser.name || 'User';
                }
            }
        } else {
            if (authLinks) authLinks.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }
    
    initAuthLinks() {
        // Switch between login and signup
        document.querySelectorAll('.switch-auth').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    initLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    authSystem.clearSession();
                    showNotification('Logged out successfully', 'info');
                    // Redirect to home
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
}

// Initialize Auth System
const authSystem = new AuthSystem();

// ===== Login Form =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Check credentials
        const users = authSystem.loadUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            authSystem.saveSession({ name: user.name, email: user.email });
            showNotification(`Welcome back, ${user.name}!`, 'success');
            
            // Redirect to marketplace
            setTimeout(() => {
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            
            loginForm.reset();
        } else {
            // Check if admin credentials
            if (email === 'admin@smartfit.com' && password === '123456') {
                authSystem.saveSession({ name: 'Admin', email: 'admin@smartfit.com', role: 'admin' });
                showNotification('Welcome Admin!', 'success');
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
                loginForm.reset();
            } else {
                showNotification('Invalid email or password', 'error');
            }
        }
    });
}

// ===== Signup Form =====
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const terms = document.getElementById('termsCheck').checked;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!terms) {
            showNotification('Please agree to the Terms of Service', 'error');
            return;
        }
        
        // Check if email already exists
        const users = authSystem.loadUsers();
        if (users.some(u => u.email === email)) {
            showNotification('Email already registered. Please login.', 'error');
            return;
        }
        
        // Create new user
        const newUser = { name, email, password, created: new Date().toISOString() };
        users.push(newUser);
        authSystem.saveUsers();
        
        showNotification('Account created successfully! Please login.', 'success');
        
        // Auto-login
        authSystem.saveSession({ name, email });
        signupForm.reset();
        
        // Redirect to marketplace
        setTimeout(() => {
            document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    });
}

// ===== Password Strength Checker =====
document.getElementById('signupPassword')?.addEventListener('input', function() {
    const password = this.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const levels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const colors = ['#dc3545', '#dc3545', '#ffc107', '#28a745', '#28a745'];
    
    const index = Math.min(strength, levels.length - 1);
    
    strengthBar.className = 'strength-bar';
    if (index >= 2) strengthBar.classList.add(['weak', 'weak', 'medium', 'strong', 'strong'][index]);
    strengthText.textContent = levels[index];
    strengthText.className = 'strength-text ' + ['weak', 'weak', 'medium', 'strong', 'strong'][index];
});

// ===== Toggle Password Visibility =====
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = document.querySelector(`#${inputId}`).closest('.password-input')?.querySelector('.toggle-password i');
    if (icon) {
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
}

// Make function globally accessible
window.togglePassword = togglePassword;

// ===== Fit Finder System =====
class FitFinder {
    constructor() {
        this.initRecommendation();
        this.initUnitToggle();
        this.initSaveFit();
    }
    
    initUnitToggle() {
        const unitSelect = document.getElementById('measurementSystem');
        if (!unitSelect) return;
        
        unitSelect.addEventListener('change', function() {
            const heightUnit = document.getElementById('heightUnit');
            const weightUnit = document.getElementById('weightUnit');
            const heightInput = document.getElementById('height');
            const weightInput = document.getElementById('weight');
            const chestInput = document.getElementById('chest');
            const waistInput = document.getElementById('waist');
            const hipsInput = document.getElementById('hips');
            const inseamInput = document.getElementById('inseam');
            
            if (this.value === 'imperial') {
                heightUnit.textContent = 'in';
                weightUnit.textContent = 'lbs';
                if (heightInput) heightInput.placeholder = '69';
                if (weightInput) weightInput.placeholder = '154';
                if (chestInput) chestInput.placeholder = '38';
                if (waistInput) waistInput.placeholder = '32';
                if (hipsInput) hipsInput.placeholder = '40';
                if (inseamInput) inseamInput.placeholder = '31';
            } else {
                heightUnit.textContent = 'cm';
                weightUnit.textContent = 'kg';
                if (heightInput) heightInput.placeholder = '175';
                if (weightInput) weightInput.placeholder = '70';
                if (chestInput) chestInput.placeholder = '95';
                if (waistInput) waistInput.placeholder = '80';
                if (hipsInput) hipsInput.placeholder = '100';
                if (inseamInput) inseamInput.placeholder = '78';
            }
        });
    }
    
    initRecommendation() {
        const button = document.getElementById('getFitRecommendation');
        if (!button) return;
        
        button.addEventListener('click', function() {
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const chest = parseFloat(document.getElementById('chest').value);
            const waist = parseFloat(document.getElementById('waist').value);
            const hips = parseFloat(document.getElementById('hips').value);
            const gender = document.getElementById('gender')?.value || 'male';
            const bodyType = document.getElementById('bodyType')?.value || 'average';
            
            // Validation
            if (!height || !weight || !chest || !waist || !hips) {
                showNotification('Please fill in all measurement fields', 'error');
                return;
            }
            
            // Calculate sizes based on measurements
            const sizes = this.calculateSizes(height, weight, chest, waist, hips, gender);
            const bmi = weight / ((height/100) ** 2);
            const bodyTypeResult = this.determineBodyType(bmi, waist, hips, gender);
            
            // Display results
            this.displayResults(sizes, bodyTypeResult, bodyType);
            showNotification('Fit recommendations generated!', 'success');
        });
    }
    
    calculateSizes(height, weight, chest, waist, hips, gender) {
        // Simple size calculation logic (enhanced with more factors)
        let topSize, bottomSize, dressSize, shoeSize;
        
        // Top size based on chest
        if (chest < 88) topSize = 'S';
        else if (chest < 96) topSize = 'M';
        else if (chest < 104) topSize = 'L';
        else if (chest < 112) topSize = 'XL';
        else topSize = 'XXL';
        
        // Bottom size based on waist
        if (gender === 'male') {
            if (waist < 72) bottomSize = '28';
            else if (waist < 77) bottomSize = '30';
            else if (waist < 82) bottomSize = '32';
            else if (waist < 87) bottomSize = '34';
            else if (waist < 92) bottomSize = '36';
            else bottomSize = '38+';
        } else {
            if (waist < 62) bottomSize = 'XS';
            else if (waist < 68) bottomSize = 'S';
            else if (waist < 74) bottomSize = 'M';
            else if (waist < 80) bottomSize = 'L';
            else if (waist < 86) bottomSize = 'XL';
            else bottomSize = 'XXL';
        }
        
        // Dress size based on hip and chest
        const avgMeasure = (chest + hips) / 2;
        if (avgMeasure < 88) dressSize = 'S';
        else if (avgMeasure < 96) dressSize = 'M';
        else if (avgMeasure < 104) dressSize = 'L';
        else if (avgMeasure < 112) dressSize = 'XL';
        else dressSize = 'XXL';
        
        // Shoe size based on height and gender
        if (gender === 'male') {
            shoeSize = Math.round((height / 6.5) + 5);
        } else {
            shoeSize = Math.round((height / 7) + 4);
        }
        shoeSize = Math.max(35, Math.min(48, shoeSize));
        
        return { topSize, bottomSize, dressSize, shoeSize };
    }
    
    determineBodyType(bmi, waist, hips, gender) {
        const whr = waist / hips;
        
        if (gender === 'male') {
            if (bmi < 18.5) return 'Slim';
            if (bmi < 25) return 'Athletic';
            if (bmi < 30) return 'Average';
            return 'Plus Size';
        } else {
            if (bmi < 18.5) return 'Slim';
            if (whr < 0.7) return 'Pear';
            if (whr < 0.8) return 'Hourglass';
            if (whr < 0.9) return 'Apple';
            return 'Plus Size';
        }
    }
    
    displayResults(sizes, bodyTypeResult, bodyType) {
        const resultsDiv = document.getElementById('fitResults');
        if (!resultsDiv) return;
        
        document.getElementById('topSize').textContent = sizes.topSize;
        document.getElementById('bottomSize').textContent = sizes.bottomSize;
        document.getElementById('dressSize').textContent = sizes.dressSize;
        document.getElementById('shoeSize').textContent = sizes.shoeSize;
        document.getElementById('bodyTypeResult').textContent = bodyTypeResult;
        
        // Fit advice based on body type
        const adviceMap = {
            'Slim': 'You have a slim body type. Fitted clothes and layering can add dimension to your frame.',
            'Athletic': 'You have an athletic body type. Consider fitting clothes that accentuate your shoulders and chest.',
            'Average': 'You have a balanced body type. Most standard sizes will fit you well.',
            'Pear': 'You have a pear-shaped body. Look for A-line skirts and dark-colored bottoms.',
            'Hourglass': 'You have an hourglass figure. Belted styles and stretchy fabrics work best.',
            'Apple': 'You have an apple-shaped body. V-neck tops and structured jackets will flatter you.',
            'Plus Size': 'You have a plus-size body. Look for quality fabrics and proper fitting garments.',
        };
        
        const advice = document.getElementById('fitAdvice');
        if (advice) {
            advice.querySelector('span').textContent = adviceMap[bodyTypeResult] || adviceMap[bodyType] || 'We\'ve found the perfect fit for you!';
        }
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    initSaveFit() {
        const saveButton = document.getElementById('saveFitResult');
        if (!saveButton) return;
        
        saveButton.addEventListener('click', function() {
            if (!authSystem.currentUser) {
                showNotification('Please login to save your fit results', 'error');
                document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            
            const fitData = {
                date: new Date().toISOString(),
                topSize: document.getElementById('topSize').textContent,
                bottomSize: document.getElementById('bottomSize').textContent,
                dressSize: document.getElementById('dressSize').textContent,
                shoeSize: document.getElementById('shoeSize').textContent,
                bodyType: document.getElementById('bodyTypeResult').textContent,
            };
            
            // Save to user's fit history
            const history = JSON.parse(localStorage.getItem('smartfit_history') || '[]');
            history.push({
                userId: authSystem.currentUser.email,
                ...fitData
            });
            localStorage.setItem('smartfit_history', JSON.stringify(history));
            
            showNotification('Fit results saved to your wardrobe!', 'success');
        });
    }
}

// Initialize Fit Finder
const fitFinder = new FitFinder();

// ===== Marketplace System =====
class Marketplace {
    constructor() {
        this.products = this.generateProducts();
        this.initFilters();
        this.renderProducts(this.products);
        this.initViewAll();
    }
    
    generateProducts() {
        return [
            { id: 1, name: 'Summer Floral Dress', category: 'dresses', vendor: 'Fashion Hub', 
              price: 49.99, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&h=300&q=80',
              verified: true, popular: true },
            { id: 2, name: 'Classic Denim Jacket', category: 'tops', vendor: 'Denim Co',
              price: 79.99, rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=400&h=300&q=80',
              verified: true, popular: true },
            { id: 3, name: 'Leather Sneakers', category: 'shoes', vendor: 'Step Style',
              price: 89.99, rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&h=300&q=80',
              verified: true, popular: false },
            { id: 4, name: 'High-Waist Jeans', category: 'bottoms', vendor: 'Denim Co',
              price: 59.99, rating: 4.6, reviews: 98, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=300&q=80',
              verified: true, popular: false },
            { id: 5, name: 'Silk Blouse', category: 'tops', vendor: 'Fashion Hub',
              price: 39.99, rating: 4.5, reviews: 67, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&h=300&q=80',
              verified: false, popular: false },
            { id: 6, name: 'Stiletto Heels', category: 'shoes', vendor: 'Step Style',
              price: 69.99, rating: 4.8, reviews: 134, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&h=300&q=80',
              verified: true, popular: true },
            { id: 7, name: 'Graphic Tee', category: 'tops', vendor: 'Urban Wear',
              price: 24.99, rating: 4.3, reviews: 45, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&h=300&q=80',
              verified: false, popular: false },
            { id: 8, name: 'Smart Watch', category: 'accessories', vendor: 'Tech Style',
              price: 149.99, rating: 4.9, reviews: 234, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&h=300&q=80',
              verified: true, popular: true },
        ];
    }
    
    renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.verified ? '<span class="product-badge verified"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                    ${product.popular ? '<span class="product-badge">Popular</span>' : ''}
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="vendor"><i class="fas fa-store"></i> ${product.vendor}</p>
                    <div class="product-rating">
                        ${this.generateStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add
                        </button>
                        <button class="btn btn-secondary view-product" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        grid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    if (!authSystem.currentUser) {
                        showNotification('Please login to add items to cart', 'error');
                        document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
                        return;
                    }
                    showNotification(`Added ${product.name} to cart!`, 'success');
                }
            });
        });
        
        grid.querySelectorAll('.view-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    showNotification(`Viewing ${product.name} details`, 'info');
                }
            });
        });
    }
    
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        
        return stars;
    }
    
    initFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const vendorFilter = document.getElementById('vendorFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        if (vendorFilter) {
            vendorFilter.addEventListener('change', () => this.applyFilters());
        }
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applyFilters());
        }
    }
    
    applyFilters() {
        let filtered = [...this.products];
        
        const category = document.getElementById('categoryFilter')?.value;
        const vendor = document.getElementById('vendorFilter')?.value;
        const sort = document.getElementById('sortFilter')?.value;
        
        // Category filter
        if (category && category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        
        // Vendor filter
        if (vendor && vendor !== 'all') {
            if (vendor === 'verified') {
                filtered = filtered.filter(p => p.verified);
            } else if (vendor === 'top-rated') {
                filtered = filtered.filter(p => p.rating >= 4.8);
            }
        }
        
        // Sort
        if (sort) {
            switch(sort) {
                case 'popular':
                    filtered.sort((a, b) => b.popular - a.popular);
                    break;
                case 'newest':
                    filtered.sort((a, b) => b.id - a.id);
                    break;
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }
        
        this.renderProducts(filtered);
    }
    
    initViewAll() {
        const viewAllBtn = document.getElementById('viewAllProducts');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', function() {
                showNotification('Loading all products...', 'info');
                // In production, this would load more products
            });
        }
    }
}

// Initialize Marketplace
const marketplace = new Marketplace();

// ===== Order Tracking System =====
class OrderTracker {
    constructor() {
        this.initTracking();
        this.generateSampleOrder();
    }
    
    generateSampleOrder() {
        const orderNumber = document.getElementById('trackedOrderNumber');
        const orderDate = document.getElementById('orderDate');
        const orderStatus = document.getElementById('orderStatus');
        
        if (orderNumber) orderNumber.textContent = 'SF-2026-001';
        if (orderDate) orderDate.textContent = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        if (orderStatus) {
            orderStatus.textContent = 'In Transit';
            orderStatus.className = 'order-status transit';
        }
    }
    
    initTracking() {
        const trackBtn = document.getElementById('trackOrder');
        const orderInput = document.getElementById('orderNumber');
        
        if (trackBtn) {
            trackBtn.addEventListener('click', function() {
                const orderNumber = orderInput?.value.trim();
                if (!orderNumber) {
                    showNotification('Please enter an order number', 'error');
                    return;
                }
                
                // Show tracking result
                const result = document.getElementById('trackingResult');
                if (result) {
                    result.style.display = 'block';
                    
                    // Update order number
                    document.getElementById('trackedOrderNumber').textContent = orderNumber;
                    
                    showNotification(`Tracking order ${orderNumber}...`, 'success');
                    
                    // Simulate loading
                    setTimeout(() => {
                        // Update progress steps
                        const steps = document.querySelectorAll('.progress-step');
                        steps.forEach((step, index) => {
                            if (index < 3) {
                                step.classList.add('active');
                            } else {
                                step.classList.remove('active');
                            }
                        });
                    }, 500);
                }
            });
        }
        
        // Enter key support
        if (orderInput) {
            orderInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    trackBtn?.click();
                }
            });
        }
    }
}

// Initialize Order Tracker
const orderTracker = new OrderTracker();

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-container');
    if (existing) existing.remove();
    
    // Create notification container
    const container = document.createElement('div');
    container.className = 'notification-container';
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    container.appendChild(notification);
    document.body.appendChild(container);
    
    // Show notification
    setTimeout(() => container.classList.add('show'), 10);
    
    // Auto dismiss
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 300);
    }, 4000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        container.classList.remove('show');
        setTimeout(() => container.remove(), 300);
    });
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-container {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        width: 100%;
    }
    
    .notification-container.show {
        transform: translateX(0);
    }
    
    .notification {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-radius: var(--border-radius-sm);
        background: white;
        box-shadow: var(--shadow-lg);
        border-left: 4px solid var(--primary);
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-success {
        border-left-color: var(--success);
    }
    .notification-error {
        border-left-color: var(--danger);
    }
    .notification-warning {
        border-left-color: var(--warning);
    }
    .notification-info {
        border-left-color: var(--info);
    }
    
    .notification i {
        font-size: 24px;
    }
    
    .notification-success i {
        color: var(--success);
    }
    .notification-error i {
        color: var(--danger);
    }
    .notification-warning i {
        color: var(--warning);
    }
    .notification-info i {
        color: var(--info);
    }
    
    .notification span {
        flex: 1;
        font-size: 14px;
        color: var(--text-dark);
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #999;
        transition: var(--transition);
        padding: 0 5px;
    }
    
    .notification-close:hover {
        color: var(--danger);
    }
    
    @media (max-width: 768px) {
        .notification-container {
            top: 80px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Ctrl + F: Focus on Fit Finder
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('fitfinder')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Ctrl + M: Focus on Marketplace
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Escape: Close notifications
    if (e.key === 'Escape') {
        const container = document.querySelector('.notification-container');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => container.remove(), 300);
        }
    }
});

// ===== Performance Optimization =====
// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

console.log('%c Smart Fit System 🚀 ', 'background: #6d2d57; color: white; padding: 10px 20px; border-radius: 5px; font-size: 20px; font-weight: bold;');
console.log('%c Find Your Perfect Fit! ', 'color: #6d2d57; font-size: 14px;');