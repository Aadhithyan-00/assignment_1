// Art data
const artworks = [
    {
        id: 1,
        title: "Starry Night",
        artist: "Vincent van Gogh",
        year: 1889,
        category: "Post-Impressionism",
        description: "A swirling night sky over a French village, featuring bold brushstrokes and vivid colors that capture the artist's emotional intensity.",
        image: "https://pplx-res.cloudinary.com/image/upload/v1761001586/pplx_project_search_images/4e75b2a3ea74fe9b9e5b31d9e3e8eb82412024a1.png",
        similarArtIds: [3, 4]
    },
    {
        id: 2,
        title: "Mona Lisa",
        artist: "Leonardo da Vinci",
        year: 1503,
        category: "Renaissance",
        description: "The world's most famous portrait, featuring a woman with an enigmatic smile set against a dreamy landscape.",
        image: "https://pplx-res.cloudinary.com/image/upload/v1755418867/pplx_project_search_images/e5c0bd36ee93cb35c3758b2200db87d359e72129.png",
        similarArtIds: [5, 1]
    },
    {
        id: 3,
        title: "The Scream",
        artist: "Edvard Munch",
        year: 1893,
        category: "Expressionism",
        description: "An iconic image of modern anxiety and existential dread, showing a figure on a bridge with a swirling, dramatic sky.",
        image: "https://pplx-res.cloudinary.com/image/upload/v1761286161/pplx_project_search_images/d215088dae3848f4aa415740042ca6aeec52380f.png",
        similarArtIds: [4, 1]
    },
    {
        id: 4,
        title: "Guernica",
        artist: "Pablo Picasso",
        year: 1937,
        category: "Cubism",
        description: "A powerful anti-war painting depicting the suffering caused by the bombing of Guernica during the Spanish Civil War.",
        image: "https://pplx-res.cloudinary.com/image/upload/v1755769356/pplx_project_search_images/f131fffdc75e896e7e5cbcb65800add07a4f1d9c.png",
        similarArtIds: [3, 2]
    },
    {
        id: 5,
        title: "Girl with a Pearl Earring",
        artist: "Johannes Vermeer",
        year: 1665,
        category: "Dutch Golden Age",
        description: "Often called the 'Mona Lisa of the North,' this intimate portrait captures a girl in exotic dress with a luminous pearl earring.",
        image: "https://pplx-res.cloudinary.com/image/upload/v1757580533/pplx_project_search_images/7c9fa508422c6d09fbc1d9d86689e8746a42b2da.png",
        similarArtIds: [2, 3]
    }
];

// Current page state
let currentPage = 'home';
let currentArtwork = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavbarScroll();
    setupFormHandlers();
});

function initializeApp() {
    showPage('home');
    populateGallery();
    updateNavbarActive();
}

// Page navigation
function showPage(pageName, artworkId = null) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Handle special cases
        if (pageName === 'gallery') {
            populateGallery();
        } else if (pageName === 'artDetail' && artworkId) {
            showArtworkDetail(artworkId);
        }
        
        // Update navbar
        updateNavbarActive();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add animation classes
        addPageAnimations(targetPage);
    }
}

function updateNavbarActive() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate current page link
    const currentLink = document.querySelector(`[onclick="showPage('${currentPage}')"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

function addPageAnimations(page) {
    const animatedElements = page.querySelectorAll('.fade-in, .fade-in-delay, .slide-in-left, .slide-in-right, .zoom-in');
    animatedElements.forEach(element => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = null;
    });
}

// Gallery functions
function populateGallery() {
    const grid = document.getElementById('artworkGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    artworks.forEach((artwork, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 col-sm-12';
        
        const delay = index * 100;
        
        col.innerHTML = `
            <div class="card artwork-card h-100 zoom-in" style="animation-delay: ${delay}ms" onclick="showArtworkDetail(${artwork.id})">
                <div class="position-relative">
                    <img src="${artwork.image}" class="card-img-top" alt="${artwork.title}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${artwork.title}</h5>
                        <p class="card-text text-light">
                            <small>by ${artwork.artist}</small><br>
                            <small>${artwork.year} • ${artwork.category}</small>
                        </p>
                        <button class="btn btn-light btn-sm mt-2">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(col);
    });
}

// Artwork detail functions
function showArtworkDetail(artworkId) {
    const artwork = artworks.find(art => art.id === artworkId);
    if (!artwork) return;
    
    currentArtwork = artwork;
    
    // Update artwork details
    document.getElementById('artDetailImage').src = artwork.image;
    document.getElementById('artDetailImage').alt = artwork.title;
    document.getElementById('artDetailTitle').textContent = artwork.title;
    document.getElementById('artDetailArtist').textContent = artwork.artist;
    document.getElementById('artDetailYear').textContent = artwork.year;
    document.getElementById('artDetailCategory').textContent = artwork.category;
    document.getElementById('artDetailDescription').textContent = artwork.description;
    
    // Populate similar artworks
    populateSimilarArtworks(artwork.similarArtIds);
    
    // Show the art detail page
    showPage('artDetail');
}

function populateSimilarArtworks(similarIds) {
    const container = document.getElementById('similarArtworks');
    if (!container) return;
    
    container.innerHTML = '';
    
    similarIds.forEach(id => {
        const similarArtwork = artworks.find(art => art.id === id);
        if (similarArtwork) {
            const similarDiv = document.createElement('div');
            similarDiv.className = 'similar-artwork mb-3';
            similarDiv.onclick = () => showArtworkDetail(similarArtwork.id);
            
            similarDiv.innerHTML = `
                <img src="${similarArtwork.image}" alt="${similarArtwork.title}" class="mb-2">
                <div class="px-2">
                    <h6 class="fw-bold mb-1">${similarArtwork.title}</h6>
                    <p class="text-muted small mb-0">by ${similarArtwork.artist}</p>
                    <p class="text-muted small">${similarArtwork.year}</p>
                </div>
            `;
            
            container.appendChild(similarDiv);
        }
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Form handlers
function setupFormHandlers() {
    // Login form
    const loginForm = document.querySelector('#loginPage form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (email && password) {
                alert('Login successful! Welcome back.');
                showPage('gallery');
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Signup form
    const signupForm = document.querySelector('#signupPage form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (name && email && password && confirmPassword) {
                if (password === confirmPassword) {
                    alert('Account created successfully! Welcome to Artisan Gallery.');
                    showPage('gallery');
                } else {
                    alert('Passwords do not match.');
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
}

// Image loading optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }
}

// Smooth animations for better UX
function addSmoothTransitions() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Search functionality (bonus feature)
function searchArtworks(query) {
    const filteredArtworks = artworks.filter(artwork => 
        artwork.title.toLowerCase().includes(query.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(query.toLowerCase()) ||
        artwork.category.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredArtworks;
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentPage === 'artDetail') {
        showPage('gallery');
    }
});

// Initialize lazy loading and smooth transitions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        lazyLoadImages();
        addSmoothTransitions();
    }, 500);
});

// Utility functions
function getArtworkById(id) {
    return artworks.find(artwork => artwork.id === id);
}

function getAllArtists() {
    return [...new Set(artworks.map(artwork => artwork.artist))];
}

function getArtworksByCategory(category) {
    return artworks.filter(artwork => artwork.category === category);
}

// Export functions for potential external use
window.showPage = showPage;
window.showArtworkDetail = showArtworkDetail;