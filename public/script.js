// Initialize item ID for unique identification
let itemId = 0; 
let totalreturned = 0; // Track total returned items

// Function to toggle forms for Add, Search, and User Search
document.getElementById('showAddForm').addEventListener('click', function() {
    document.getElementById('add-things-form').style.display = 'block';
    document.getElementById('search-things-form').style.display = 'none';
    document.getElementById('user-search-form').style.display = 'none';
});

document.getElementById('showSearchForm').addEventListener('click', function() {
    document.getElementById('add-things-form').style.display = 'none';
    document.getElementById('search-things-form').style.display = 'block';
    document.getElementById('user-search-form').style.display = 'none';
});

document.getElementById('showUserSearchForm').addEventListener('click', function() {
    document.getElementById('add-things-form').style.display = 'none';
    document.getElementById('search-things-form').style.display = 'none';
    document.getElementById('user-search-form').style.display = 'block';
    displayUserDashboard(); // Call to display user items and claims in the dashboard
});

// Handle form submissions for adding items
document.getElementById('addForm').onsubmit = async (e) => {
    e.preventDefault();

    const item = {
        id: itemId++, // Assign a unique ID to each item
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        country: document.getElementById('country').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        category: document.getElementById('category').value,
        thingName: document.getElementById('thingName').value,
        image: URL.createObjectURL(document.getElementById('imageUpload').files[0]),
        claims: [] // Initialize claims array
    };

    let storedItems = JSON.parse(localStorage.getItem('items')) || [];
    storedItems.push(item);
    localStorage.setItem('items', JSON.stringify(storedItems));

    alert('Item added successfully!');
    document.getElementById('addForm').reset();
    updateTotalItems();
};

// Function to update total count of added items
function updateTotalItems() {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    document.getElementById('tc').textContent = `Total Items Added: ${storedItems.length}`;
}

// Load total count when page loads
window.onload = function() {
    updateTotalItems();
};

// Handle search functionality
document.getElementById('searchForm').onsubmit = async (e) => {
    e.preventDefault();

    const queryParams = {
        country: document.getElementById('search-country').value,
        state: document.getElementById('search-state').value,
        category: document.getElementById('search-category').value,
    };

    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const resultContainer = document.getElementById('search-results');
    resultContainer.innerHTML = ''; // Clear previous results

    const results = storedItems.filter(item =>
        item.country === queryParams.country &&
        item.state === queryParams.state &&
        item.category === queryParams.category
    );

    if (results.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No results found.';
        resultContainer.appendChild(noResults);
    } else {
        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = result.image; // Use local image preview
            card.appendChild(img);

            const thingName = document.createElement('h3');
            thingName.textContent = result.thingName;
            card.appendChild(thingName);

            const category = document.createElement('p');
            category.textContent = result.category;
            card.appendChild(category);

            const country = document.createElement('p');
            country.textContent = result.country;
            card.appendChild(country);

            const state = document.createElement('p');
            state.textContent = result.state;
            card.appendChild(state);

            const city = document.createElement('p');
            city.textContent = result.city;
            card.appendChild(city);

            const name = document.createElement('p');
            name.textContent = "found to: " +`${result.name}`;
            card.appendChild(name);

            const contact = document.createElement('p');
            contact.textContent = "contact no: "+result.contact;
            card.appendChild(contact);

            // Add Claim button
            const claimButton = document.createElement('button');
            claimButton.textContent = 'Claim';
            claimButton.onclick = () => {
                const claimantName = prompt('Enter your name:');
                const claimantContact = prompt('Enter your mobile number:');
                
                if (claimantName && claimantContact) {
                    const claimRequest = { name: claimantName, contact: claimantContact };
                    // Store claim request in localStorage
                    const itemIndex = storedItems.findIndex(item => item.id === result.id);
                    if (itemIndex !== -1) {
                        storedItems[itemIndex].claims.push(claimRequest);
                        localStorage.setItem('items', JSON.stringify(storedItems));
                        alert('Request sent to helper!');
                    }
                }
            };
            card.appendChild(claimButton);

            resultContainer.appendChild(card);
            resultContainer.classList.add("cardsprop")
        });
    }
};

// Display user items and claims in the dashboard
function displayUserDashboard() {
    const userContact = document.getElementById('user-contact').value;
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const userItems = storedItems.filter(item => item.contact === userContact);

    const resultContainer = document.getElementById('user-search-results');
    resultContainer.innerHTML = ''; // Clear previous results

    if (userItems.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No items found for this contact.';
        resultContainer.appendChild(noResults);
    } else {
        userItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = item.image;
            card.appendChild(img);

            const thingName = document.createElement('h3');
            thingName.textContent = item.thingName;
            card.appendChild(thingName);

            const claimsHeading = document.createElement('h4');
            claimsHeading.textContent = 'Claim Requests:';
            card.appendChild(claimsHeading);

            // Display claim requests
            if (item.claims.length === 0) {
                const noClaims = document.createElement('p');
                noClaims.textContent = 'No claims for this item.';
                card.appendChild(noClaims);
            } else {
                item.claims.forEach(claim => {
                    const claimItem = document.createElement('p');
                    claimItem.textContent = `Name: ${claim.name} requested for claim, Contact: ${claim.contact}`;
                    claimItem.style.color="red"
                    card.appendChild(claimItem);
                });
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Return';
            deleteButton.addEventListener('click', function() {
                deleteItem(item.id); // Call deleteItem with the item's ID
            });
            card.appendChild(deleteButton);

            resultContainer.appendChild(card);
        });
    }
}

// Delete item function
function deleteItem(itemId) {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    
    // Filter out the item with the matching ID
    const updatedItems = storedItems.filter(storedItem => storedItem.id !== itemId);
    localStorage.setItem('items', JSON.stringify(updatedItems));

    // Increment total items returned
    totalreturned += 1;
    document.getElementById('tr').textContent = `Total Items Returned: ${totalreturned}`;

    // Update total items added
    updateTotalItems();

    // Refresh user search results after deletion
    displayUserDashboard(); // Re-display the dashboard to show updated items
}

// Handle user dashboard form submission
document.getElementById('userSearchForm').onsubmit = function(e) {
    e.preventDefault();
    displayUserDashboard(); // Show user items based on contact
};

