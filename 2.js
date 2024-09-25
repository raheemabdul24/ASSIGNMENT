let cart = [];

// get data from api
async function fetchItems() {
    const response = await fetch('https://fakestoreapi.com/products');
    const items = await response.json();
    displayItems(items);
    return items;
}

// Display the items on the page
function displayItems(items) {
    const itemsContainer = document.querySelector('#items-container');
    itemsContainer.innerHTML = '';
    items.forEach(item => {
        itemsContainer.innerHTML += `
            <div class="item">
                <img src="${item.image}" alt="Image not Available">
                <h3>${item.title}</h3>
                <p>$${item.price}</p>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
            </div>`;
    });
}

async function addToCart(itemId) {
    const response = await fetch(`https://fakestoreapi.com/products/${itemId}`);
    const item = await response.json();
    const itemExists = cart.find(cartItem => cartItem.id === item.id);

    // Add item only if it is not already in the cart
    if (!itemExists) {
        const cartItem = {
            id: item.id,
            image: item.image,
            title: item.title,
            price: item.price,
            quantity: 1,
            total:item.price
        };
        cart.push(cartItem);
    } else {
        // If already in cart, just increase the quantity
        itemExists.quantity += 1;
        itemExists.total = itemExists.price * itemExists.quantity;
    }
    displayCart();
    scrollToCart();
}

// Display the cart items
function displayCart() {
    const cartContainer = document.querySelector('#cart-container');
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="Image not Available">
                <div class="cart-info">
                    <p><strong>${item.title}</strong></p>
                    <p>Price: $${item.total}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="cart-actions">
                    <button onclick="increaseQuantity(${item.id})">Increase</button>
                    <button class="decrease-button" onclick="decreaseQuantity(${item.id})">Decrease</button>
                    <button class="delete-button" onclick="deleteFromCart(${item.id})">Delete</button>
                </div>
            </div>`;
    });
}

// Increase the quantity of the item
function increaseQuantity(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += 1;
        item.total=item.quantity*item.price
    }
    displayCart();
}

// Decrease the quantity of the item
function decreaseQuantity(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.total=item.quantity*item.price
    } else if (item && item.quantity === 1) {
        deleteFromCart(itemId);
    }
    displayCart();
}

// Delete item from cart
function deleteFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    displayCart();
}

// Scroll to cart when an item is added
function scrollToCart() {
    const cartContainer = document.querySelector('#cart-container');
    cartContainer.scrollIntoView({ behavior: 'smooth' });
}

// Searching
function searchItems() {
    const searchTerm = document.querySelector('#search-input').value.toLowerCase();
    fetchItems().then(items => {
        const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchTerm));
        
        if (filteredItems.length === 0) {
            // Display 'No items found' message if no items match the searched term
            document.querySelector('#items-container').innerHTML = `<p style="font-size: 1.5rem; color: #ff0000;">No items found</p>`;
        } else {
            displayItems(filteredItems);
        }
    });
}

// Event listener for search button
document.querySelector('#search-button').addEventListener('click', searchItems);

// Fetch and display items on page load
fetchItems();
