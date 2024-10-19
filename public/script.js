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

let totalreturned = 0;
document.getElementById('showUserSearchForm').addEventListener('click', function() {
    document.getElementById('add-things-form').style.display = 'none';
    document.getElementById('search-things-form').style.display = 'none';
    document.getElementById('user-search-form').style.display = 'block';
});

// Handle form submissions for adding items
document.getElementById('addForm').onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const item = {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        country: document.getElementById('country').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        category: document.getElementById('category').value,
        thingName: document.getElementById('thingName').value,
        image: URL.createObjectURL(document.getElementById('imageUpload').files[0]) // Local preview
    };

    let storedItems = JSON.parse(localStorage.getItem('items')) || [];
    storedItems.push(item);
    localStorage.setItem('items', JSON.stringify(storedItems));

    alert('Item added successfully!');
    document.getElementById('addForm').reset();

    // Update total count of items
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

// Handle search functionality for everyone
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
            name.textContent = result.name;
            card.appendChild(name);

            const contact = document.createElement('p');
            contact.textContent = result.contact;
            card.appendChild(contact);

            // Add Claim button
            const claimButton = document.createElement('button');
            claimButton.textContent = 'Claim';
            claimButton.onclick = () => {
                const claimantName = prompt('Enter your name:');
                const claimantContact = prompt('Enter your mobile number:');
                
                if (claimantName && claimantContact) {
                    alert('Request sent to helper!');

                    // Save the claim request
                    const claimRequest = {
                        item: result.thingName,
                        ownerName: result.name,
                        ownerContact: result.contact,
                        claimantName,
                        claimantContact
                    };

                    // Store claims in localStorage
                    let claims = JSON.parse(localStorage.getItem('claims')) || {};
                    claims[result.thingName] = claimRequest; // Use item name as key
                    localStorage.setItem('claims', JSON.stringify(claims));

                    // Display the claim request below the respective item
                    displayClaimRequest(card, claimRequest);
                } else {
                    alert('Claim request was not completed.');
                }
            };
            card.appendChild(claimButton);

            resultContainer.appendChild(card);
        });
    }
};

// Function to display the claim request below the respective item
function displayClaimRequest(card, claimRequest) {
    const claimInfo = document.createElement('div');
    claimInfo.className = 'claim-info';
    claimInfo.textContent = `${claimRequest.claimantName} (Contact: ${claimRequest.claimantContact}) has requested to claim this item.`;
    card.appendChild(claimInfo);
}

// Handle user search functionality based on contact number
document.getElementById('userSearchForm').onsubmit = function(e) {
    e.preventDefault();

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

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Return';
            deleteButton.addEventListener('click', function() {
                totalreturned += 1;
                document.getElementById('tr').textContent = `Total Items Returned: ${totalreturned}`;

                storedItems.splice(storedItems.indexOf(item), 1);
                localStorage.setItem('items', JSON.stringify(storedItems));
                updateTotalItems();
                document.getElementById('userSearchForm').onsubmit(e); // Refresh user search results
            });
            card.appendChild(deleteButton);

            // Check if there are any claims for this item
            const claims = JSON.parse(localStorage.getItem('claims')) || {};
            if (claims[item.thingName]) {
                displayClaimRequest(card, claims[item.thingName]);
            }

            resultContainer.appendChild(card);
        });
    }
};

// Function to update the user search results with claims
function updateUserSearchResults() {
    const claims = JSON.parse(localStorage.getItem('claims')) || {};
    const resultContainer = document.getElementById('user-search-results');
    resultContainer.innerHTML += '<h3>Claims Requested:</h3>'; // Header for claims

    if (Object.keys(claims).length === 0) {
        resultContainer.innerHTML += '<p>No claims requested.</p>';
    } else {
        for (const claimKey in claims) {
            const claim = claims[claimKey];
            const claimMessage = document.createElement('p');
            claimMessage.textContent = `${claim.claimantName} (Contact: ${claim.claimantContact}) requested to claim "${claim.item}" from ${claim.ownerName} (Contact: ${claim.ownerContact})`;
            resultContainer.appendChild(claimMessage);
        }
    }
}
