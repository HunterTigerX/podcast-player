import songsData from './data.js';
import searchId from './searchById.js';
import searchResults from './searchResponse.js';
import { convertMsToDate } from './utilities/convertDate.js';

const counter = document.getElementById('counter');
const searchBoxDom = document.getElementById('podcast__search');
const grid = document.getElementById('podcastGrid');
const returnMain = document.querySelector('.header__main');
const mainWrapper = document.querySelector('.main__wrapper');
const searchWrapper = document.getElementById('search__wrapper');
const id_page = document.querySelector('.id_page');

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
  renderSearchPage();
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

function renderPodcasts() {
  if (mainWrapper) {
    renderMainPage();
  }
}

function renderSearchPage() {
  if (counter && grid) {
    if (searchWrapper) {
      searchWrapper.style.display = 'flex';
    }

    grid.innerHTML = '';

    if (id_page) {
      id_page.innerHTML = '';
    }

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
      card.addEventListener('click', (e) => {
        renderIdPage(item.id);
      });

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

    if (mainWrapper) {
      mainWrapper.classList.add('search__page');
      mainWrapper.classList.remove('id__page', 'main__page');
    }

    // Podcast counter
    const count = searchResults.results.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

function renderIdPage(id: string) {
  if (counter && grid) {
    console.log('v3');
    // we opened the podcast list by id

    grid.innerHTML = '';
    // search not available on id page
    if (searchWrapper) {
      searchWrapper.style.display = 'none';
    }

    if (!searchId || !searchId.episodes) {
      counter.textContent = '0 podcasts';
      return;
    }

    const main = document.createElement('div');
    main.className = 'podcast-card';

    const preview = document.createElement('div');
    preview.className = 'preview';

    const preview__image = document.createElement('div');
    preview__image.className = 'preview__image';
    preview__image.style.backgroundImage = `url('${searchId.image}')`;

    const preview__description__wrapper = document.createElement('div');
    preview__description__wrapper.className = 'preview__description__wrapper';

    const preview__description__publisher = document.createElement('div');
    preview__description__publisher.className = 'preview__description__publisher';
    preview__description__publisher.textContent = searchId.publisher;

    const preview__description__channel_link = document.createElement('a');
    preview__description__channel_link.className = 'preview__description__channel_link';
    preview__description__channel_link.textContent = 'View Channel ›';
    preview__description__channel_link.href = searchId.extra.spotify_url || '#';
    preview__description__channel_link.target = '_blank';

    const preview__description__ad = document.createElement('div');
    preview__description__ad.className = 'preview__description__ad';
    preview__description__ad.textContent = "The future is here, and it's ad-free.";

    const preview__description__prices = document.createElement('div');
    preview__description__prices.className = 'preview__description__prices';
    preview__description__prices.textContent = '$9.99 a year';

    const preview__description__button = document.createElement('button');
    preview__description__button.className = 'preview__description__button';
    preview__description__button.textContent = 'Try Free';

    preview.append(
      preview__image,
      preview__description__publisher,

      preview__description__channel_link,
      preview__description__ad,
      preview__description__prices,
      preview__description__button
    );

    const podcast__description__wrapper = document.createElement('div');
    podcast__description__wrapper.className = 'podcast_description';

    const preview__description__title = document.createElement('h1');
    preview__description__title.className = 'preview__description__title';
    preview__description__title.textContent = searchId.title;

    const preview__description__publisher_big = document.createElement('h2');
    preview__description__publisher_big.className = 'preview__description__publisher_big';
    preview__description__publisher_big.textContent = searchId.publisher;

    const preview__description__rating = document.createElement('div');
    preview__description__rating.className = 'preview__description__rating';
    preview__description__rating.textContent = `★ ${searchId.listen_score / 10} ${searchId.language}`;

    const preview__description__text = document.createElement('div');
    preview__description__text.className = 'preview__description__text';
    preview__description__text.textContent = `${searchId.description}`;

    podcast__description__wrapper.append(
      preview__description__title,
      preview__description__publisher_big,
      preview__description__rating,
      preview__description__text
    );

    const top__page__wrapper = document.createElement('div');
    top__page__wrapper.classList.add('id_list_top_wrapper');
    top__page__wrapper.append(preview, podcast__description__wrapper);

    const episodesSection = document.createElement('div');
    episodesSection.className = 'episodes-section';

    const episodesTitle = document.createElement('h2');
    episodesTitle.className = 'episodes-section__title';

    const count = searchId.episodes.length;

    episodesTitle.textContent = `Episodes: ${count}`;
    episodesSection.append(episodesTitle);

    // We create cards and fill them with data
    searchId.episodes.forEach((item, index) => {
      const episodeItem = document.createElement('div');
      episodeItem.className = 'episode-item';

      const episodeDay = document.createElement('div');
      episodeDay.className = 'episode-item__day';
      episodeDay.textContent =
        `${convertMsToDate(item.pub_date_ms).date}. Duration: ${Math.round(item.audio_length_sec / 60)} min` ||
        '';

      const episodeTitle = document.createElement('div');
      episodeTitle.className = 'episode-item__title';
      const titleLink = document.createElement('a');
      titleLink.href = item.link || '#';
      titleLink.target = '_blank';
      titleLink.textContent = item.title;
      episodeTitle.append(titleLink);

      const episodeDescription = document.createElement('div');
      episodeDescription.className = 'episode-item__description';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.description || '';
      episodeDescription.textContent = tempDiv.textContent || 'No description';

      episodeItem.append(episodeDay, episodeTitle, episodeDescription);
      episodesSection.append(episodeItem);
    });

    main.append(top__page__wrapper, episodesSection);

    if (mainWrapper && id_page) {
      mainWrapper.classList.add('id__page');
      mainWrapper.classList.remove('main__page', 'search__page');
      id_page.append(main);
    }

    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

function renderMainPage() {
  if (grid && counter) {
    // clear main page when we return or clear search bar
    grid.innerHTML = '';

    if (id_page) {
      id_page.innerHTML = '';
    }

    if (searchWrapper) {
      searchWrapper.style.display = 'flex';
    }

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
      card.addEventListener('click', (e) => {
        renderIdPage(item.id);
      });

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
    if (mainWrapper) {
      mainWrapper.classList.add('main__page');
      mainWrapper.classList.remove('search__page', 'id__page');
    }
    // Podcast counter
    const count = songsData.podcasts.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

if (returnMain) {
  returnMain.addEventListener('click', (e) => {
    renderMainPage();
  });
}

if (searchBoxDom) {
  searchBoxDom.addEventListener('input', (e) => {
    if (e.target) {
      const target = e.target as HTMLTextAreaElement;
      if (target.value === '') {
        renderMainPage();
      } else {
        renderSearchPage();
        debounceFunction(makeAPICall, 200, target.value);
      }
    } else {
      console.log('Error in searchBoxDom');
    }
  });
}

renderPodcasts();
