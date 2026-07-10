import songsData from './data.js';
import searchResults from './searchResponce.js';
import { type PodcastData } from './types.js';

const grid = document.getElementById('podcastGrid');
const counter = document.getElementById('counter');
let searchBoxDom = document.getElementById('podcast__search');

let timerId: number | undefined;

// class App {
//   fetchPodcasts(query: string | void): void {

// const url = query ? `https://listen-api-test.listennotes.com/api/v2/search?q=${query}&type=podcast` :
//   "https://listen-api-test.listennotes.com/api/v2/best_podcasts?sort=recent_published_first&page=1";

//     fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     })
//       .then((res) => res.json())
//       .then((json) => console.log(json));
//   }
// }

// const podcastApiSearch = new App();

function fetchPodcasts(query: string | void): void {
  console.log(query);
}
fetchPodcasts();

function makeAPICall(value: string) {
  // const search__results = podcastApiSearch.fetchPodcasts(value)
  console.log('Search executed', value);
}

let debounceFunction = function (
  func: (value: string) => void,
  delay: number | undefined,
  value: string
) {
  // Cancels the setTimeout method execution
  clearTimeout(timerId);

  // Executes the func after delay time.
  timerId = setTimeout(() => func(value), delay);
};

if (searchBoxDom) {
  searchBoxDom.addEventListener('input', (e) => {
    if (e.target) {
      const target = e.target as HTMLTextAreaElement;
      debounceFunction(makeAPICall, 200, target.value);
    } else {
      console.log('Error in searchBoxDom');
    }
  });
}

function renderPodcasts() {
  if (grid && counter && searchBoxDom) {
    grid.innerHTML = '';
    const searchValue = (searchBoxDom as HTMLInputElement).value;
    console.log(searchValue);

    if (searchValue) {
      renderSearchPage();
    } else {
      renderMainPage();
    }
  } else {
    console.error('Grid or Counter is missing on the page');
  }
}

function renderSearchPage() {
  if (grid && counter) {
    console.log('v1');
    // We have text in the search bar
    // We check if we have any cards in the data.ts
    if (!searchResults || !searchResults.results) {
      grid.innerHTML = '<p>Podcasts are missing</p>';
      counter.textContent = '0 podcasts';
      return;
    }
    // We create cards and fill them with data
    searchResults.results.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      const cover = document.createElement('div');
      cover.className = 'card__cover';

      if (item.image) {
        cover.style.backgroundImage = `url('${item.image}')`;
      } else {
        console.log(`Image ling is missing for the image ${index}`);
        cover.style.backgroundImage = 'none';
      }

      const title = document.createElement('div');
      title.className = 'card__title';
      title.textContent = item.title_original || '';

      const author = document.createElement('div');
      author.className = 'card__author';
      author.textContent = item.podcast.publisher_original || '';

      card.appendChild(cover);
      card.appendChild(title);
      card.appendChild(author);
      grid.appendChild(card);
    });

    // Podcast counter
    const count = searchResults.results.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

function renderMainPage() {
  if (grid && counter) {
    // Search bar is empty
    // We check if we have any cards in the data.ts
    if (!songsData || !songsData.podcasts) {
      grid.innerHTML = '<p>Podcasts are missing</p>';
      counter.textContent = '0 podcasts';
      return;
    }
    // We create cards and fill them with data
    songsData.podcasts.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      const cover = document.createElement('div');
      cover.className = 'card__cover';

      if (item.image) {
        cover.style.backgroundImage = `url('${item.image}')`;
      } else {
        console.log(`Image ling is missing for the image ${index}`);
        cover.style.backgroundImage = 'none';
      }

      const title = document.createElement('div');
      title.className = 'card__title';
      title.textContent = item.title || '';

      const author = document.createElement('div');
      author.className = 'card__author';
      author.textContent = item.publisher || '';

      card.appendChild(cover);
      card.appendChild(title);
      card.appendChild(author);
      grid.appendChild(card);
    });

    // Podcast counter
    const count = songsData.podcasts.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}
renderPodcasts();
