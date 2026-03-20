const API_BASE = 'http://localhost:3000';

async function fetchProducts(endpoint, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    // Show a loading message while waiting for the database
    grid.innerHTML = '<p style="color: #00ff87; grid-column: 1/-1; text-align: center;">Loading gear...</p>';

    try {
        const response = await fetch(`${API_BASE}/api/${endpoint}`);
        const products = await response.json();
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found in database.</p>';
            return;
        }

        grid.innerHTML = ''; 

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Adjusting path to match your server static setup
            const imageSrc = `${API_BASE}/${product.image_path}`; 

            card.innerHTML = `
                <div class="p-img-wrap">
                    <img src="${imageSrc}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=Reload+Server'">
                </div>
                <div class="p-info">
                    <h3 class="p-name">${product.name}</h3>
                    <p class="p-sub">${product.sub || 'Official Gear'}</p>
                    <div class="p-price">₹${product.price}</div>
                    <button class="add-btn">+ ADD TO CART</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<p style="color: #ff3b3b; grid-column: 1/-1; text-align: center;">Failed to connect to server.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // These IDs now match your HTML exactly
    fetchProducts('jerseys', 'jerseyGrid');
    fetchProducts('boots', 'bootsGrid');
    fetchProducts('balls', 'ballsGrid'); 
});