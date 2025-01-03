const apiKey = 'AIzaSyDCraM1nUgJ6I5YTxIszhFQwHOEC8bgCTE'; // Your Google Custom Search API key
const cx = 'd77b59d0218ee43df'; // Your Custom Search Engine ID

// Get DOM elements
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const suggestionsBox = document.getElementById('suggestions-box');
const searchResultsContainer = document.getElementById('search-results');
const webTab = document.getElementById('web-tab');
const imagesTab = document.getElementById('images-tab');

let searchType = 'web'; // Default search type is "web"

// Function to fetch suggestions from the Google API
function fetchSuggestions(query) {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}&num=5`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displaySuggestions(data);
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
            suggestionsBox.style.display = 'none';
        });
}

// Function to display suggestions in the dropdown
function displaySuggestions(data) {
    if (data.items) {
        suggestionsBox.innerHTML = ''; // Clear previous suggestions

        data.items.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = item.title;
            suggestionItem.onclick = () => {
                searchBar.value = item.title; // Set the clicked suggestion to the search bar
                suggestionsBox.style.display = 'none'; // Hide suggestions box
                performSearch(); // Perform search automatically after selecting suggestion
            };
            suggestionsBox.appendChild(suggestionItem);
        });

        suggestionsBox.style.display = 'block'; // Show suggestions box
    } else {
        suggestionsBox.style.display = 'none';
    }
}

// Function to perform the search based on selected type (Web or Images)
function performSearch() {
    const query = searchBar.value;
    if (query) {
        const apiUrl = searchType === 'web'
            ? `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`
            : `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}&searchType=image`; // Images search URL

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });

        // Hide suggestions box and show results
        suggestionsBox.style.display = 'none';
        searchResultsContainer.style.display = 'block'; // Show results container
    }
}

// Function to display the search results
function displayResults(data) {
    searchResultsContainer.innerHTML = ''; // Clear previous results
    if (data.items) {
        data.items.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            const title = document.createElement('h3');
            const link = document.createElement('a');
            link.href = item.link;
            link.target = '_blank';
            link.textContent = item.title;
            title.appendChild(link);

            const snippet = document.createElement('p');
            snippet.textContent = item.snippet;

            resultItem.appendChild(title);
            resultItem.appendChild(snippet);

            // Display image if in "Images" tab
            if (searchType === 'images' && item.pagemap && item.pagemap.cse_image) {
                const image = document.createElement('img');
                image.src = item.pagemap.cse_image[0].src; // Image URL
                image.alt = item.title;
                image.style.width = '100%';
                resultItem.appendChild(image);
            }

            searchResultsContainer.appendChild(resultItem);
        });
    } else {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

// Event listener for search bar input (real-time suggestions)
searchBar.addEventListener('input', () => {
    const query = searchBar.value;
    if (query.length > 2) {
        fetchSuggestions(query); // Fetch suggestions if query length > 2
    } else {
        suggestionsBox.style.display = 'none'; // Hide suggestions box if query is too short
    }
});

// Event listener for the search button click
searchButton.addEventListener('click', performSearch);

// Event listeners for switching between "Web" and "Images" tabs
webTab.addEventListener('click', () => {
    searchType = 'web';
    webTab.classList.add('active');
    imagesTab.classList.remove('active');
    searchResultsContainer.style.display = 'none'; // Hide results on tab switch
    suggestionsBox.style.display = 'none'; // Hide suggestions box
});

imagesTab.addEventListener('click', () => {
    searchType = 'images';
    imagesTab.classList.add('active');
    webTab.classList.remove('active');
    searchResultsContainer.style.display = 'none'; // Hide results on tab switch
    suggestionsBox.style.display = 'none'; // Hide suggestions box
});
