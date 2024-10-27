const apiKey = 'd0651a67490a4fd290723ac12309757f';
const newsFeed = document.getElementById('news-feed');
const loadingIndicator = document.getElementById('loading-indicator');
const loadMoreButton = document.getElementById('load-more-btn');
let currentPage = 1;
let isLoading = false;

// Fetch news articles from the News API 
const fetchNews = async (page) => {
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&page=${page}&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "ok") {
            console.log(`Fetched page ${page}:`, data.articles); // Log for debugging
            return data.articles;
        } else {
            console.error("API error:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch news:", error);
        return [];
    }
};

// Create a news article box
const createNewsBox = (article) => {
    const newsBox = document.createElement('div');
    newsBox.classList.add('news-box');

    // Add image if available
    if (article.urlToImage) {
        const image = document.createElement('img');
        image.classList.add('news-image');
        image.src = article.urlToImage;
        image.alt = article.title;
        newsBox.appendChild(image);
    }

    const title = document.createElement('div');
    title.classList.add('news-title-box');
    title.textContent = article.title;

    const description = document.createElement('p');
    description.classList.add('news-description');
    description.textContent = article.description || 'Description not available.';

    const link = document.createElement('a');
    link.classList.add('news-link');
    link.href = article.url;
    link.target = '_blank';
    link.textContent = 'Read more';

    newsBox.appendChild(title);
    newsBox.appendChild(description);
    newsBox.appendChild(link);

    return newsBox;
};

// Display articles and append them to the feed
const displayNews = (articles) => {
    articles.forEach(article => {
        const newsBox = createNewsBox(article);
        newsFeed.appendChild(newsBox);
    });
};

// Load initial articles on page load
const loadInitialNews = async () => {
    const articles = await fetchNews(currentPage);
    displayNews(articles);
};

// Load more news when the button is clicked
const loadMoreNews = async () => {
    if (isLoading) return; // Prevent multiple requests
    isLoading = true;
    currentPage += 1;

    loadingIndicator.style.display = 'block'; // Show loading indicator

    const articles = await fetchNews(currentPage);
    displayNews(articles);

    loadingIndicator.style.display = 'none'; // Hide loading indicator
    isLoading = false;
};

// Event listener for "Load More News" button
loadMoreButton.addEventListener('click', loadMoreNews);

// Load initial set of news articles on page load
loadInitialNews();

// Dark mode toggle functionality
const themeToggleButton = document.getElementById('theme-toggle');
const enableDarkMode = () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
};

const disableDarkMode = () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
};

themeToggleButton.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Load theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    enableDarkMode();
}
