const API_KEY = "fabaff4f118e46b4bfd984a6090224fb";

window.addEventListener('load', () => fetchNews("World"));

async function fetchNews(query) {
    // Dynamically choosing date
    const today = new Date();
    const recentDate = new Date(today.setDate(today.getDate() - 4)); // 4 days ago
    const formattedDate = recentDate.toISOString().split("T")[0];
    const trustedDomains = [
  // Indian
  "bbc.co.uk",
  "thehindu.com",
  "timesofindia.indiatimes.com",
  "ndtv.com",
  "indiatoday.in",
  "hindustantimes.com",
  "economictimes.indiatimes.com",
  "livemint.com",
  "theprint.in",
  "scroll.in",
  "deccanherald.com",
  "telegraphindia.com",
  // Global
  "cnn.com",
  "reuters.com",
  "nytimes.com",
  "bbc.com",
  "theguardian.com",
  "forbes.com",
  "bloomberg.com",
  "aljazeera.com",
  "wsj.com",
  "npr.org",
  "abcnews.go.com",
  "cnbc.com",
  "time.com"
].join(",");


    const url = `https://newsapi.org/v2/everything?q=${query}&from=${formattedDate}&sortBy=publishedAt&domains=${trustedDomains}&apiKey=${API_KEY}`;



    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        if (data.status === "ok" && data.articles.length > 0) {
            bindData(data.articles);
        } else {
            showNoResultsMessage();
        }

    } catch (err) {
        console.error("Error fetching news:", err);
        showErrorMessage("Failed to fetch news.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        const newsImg = cardClone.querySelector("img");
        const newsTitle = cardClone.querySelector("#news-title");
        const newsDesc = cardClone.querySelector("#news-desc");
        const newsSource = cardClone.querySelector(".news-source");

        newsImg.src = article.urlToImage;
        newsImg.alt = article.title || "News Image";
        newsTitle.textContent = article.title || "No title";
        newsDesc.textContent = article.description || "No description";

        const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
            timeZone: "Asia/Kolkata"
        });
        newsSource.textContent = `${article.source.name} • ${date}`;

        cardClone.querySelector(".card").addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        cardsContainer.appendChild(cardClone);
    });
}

function showNoResultsMessage() {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = "<p style='text-align:center; font-weight:bold;'>No news articles found for the selected topic.</p>";
}

function showErrorMessage(msg) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = `<p style='text-align:center; color:red; font-weight:bold;'>${msg}</p>`;
}

// To search for news by clicking topic on navbar
let curSelectedNav = null;
function inNavItemClick(id) {
  fetchNews(id);

  const navItem = document.getElementById(id);
  if (curSelectedNav) {
    curSelectedNav.classList.remove('active');
  } 
  navItem.classList.add('active');
  curSelectedNav = navItem;
}

// To search for news using Search Button
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;

  fetchNews(query); 
  if (curSelectedNav) {
    curSelectedNav.classList.remove('active');
  }
  curSelectedNav = null;
});
