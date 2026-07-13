import type { AudioProgress, PodcastData, PodcastDetailResponse, SearchResponse } from './types.js';
import { convertMsToDate, convertTime } from './utilities/convert.js';
// import { Client } from 'podcast-api';

const overlay = document.getElementById('loading__overlay');
const counter = document.getElementById('counter');
const searchBoxDom = document.getElementById('podcast__search');
const grid = document.getElementById('podcastGrid');
const returnMain = document.querySelector('.header__main');
const returnHistory = document.querySelector('.header__saved');
const mainWrapper = document.querySelector('.main__wrapper');
const searchWrapper = document.getElementById('search__wrapper');
const id__page = document.querySelector('.id__page');
const audioPlayer = document.querySelector('.audio__player');
const audioData = audioPlayer as HTMLAudioElement;
const audioControls = document.querySelector('.audio__controls');
const audioProgress = document.querySelector('.audio__progress');
const progressData = audioProgress as HTMLInputElement;

const audioCurrentTime = document.querySelector('.current__time');
const audioTotalTime = document.querySelector('.total__time');
let timerId: number | undefined;

let searchResults: SearchResponse = {
  took: 0,
  count: 0,
  total: 0,
  results: [],
  next_offset: 0,
};

let searchId: PodcastDetailResponse = {
  id: '',
  rss: '',
  type: '',
  email: '',
  extra: {
    url1: '',
    url2: '',
    url3: '',
    spotify_url: '',
    youtube_url: '',
    linkedin_url: '',
    wechat_handle: '',
    patreon_handle: '',
    twitter_handle: '',
    facebook_handle: '',
    amazon_music_url: '',
    instagram_handle: '',
  },
  image: '',
  title: '',
  country: '',
  website: '',
  episodes: [],
  language: '',
  genre_ids: [],
  itunes_id: 0,
  publisher: '',
  thumbnail: '',
  is_claimed: false,
  description: '',
  looking_for: {
    guests: false,
    cohosts: false,
    sponsors: false,
    cross_promotion: false,
  },
  has_sponsors: false,
  listen_score: 0,
  total_episodes: 0,
  listennotes_url: '',
  audio_length_sec: 0,
  explicit_content: false,
  latest_episode_id: '',
  latest_pub_date_ms: 0,
  earliest_pub_date_ms: 0,
  has_guest_interviews: false,
  next_episode_pub_date: 0,
  update_frequency_hours: 0,
  listen_score_global_rank: '',
};

let songsData: PodcastData = {
  id: 0,
  name: '',
  total: 0,
  has_next: false,
  podcasts: [],
  parent_id: 0,
  page_number: 0,
  has_previous: false,
  listennotes_url: '',
  next_page_number: 0,
  previous_page_number: 0,
};

class App {
  async fetchPodcasts(): Promise<any> {
    const url =
      'https://listen-api-test.listennotes.com/api/v2/best_podcasts?sort=recent_published_first&page=1';
    return await this.fetch(url);
  }
  async searchPodcasts(query: string) {
    const url = `https://listen-api-test.listennotes.com/api/v2/search?q=${query}&type=podcast`;
    return await this.fetch(url);
  }
  async returnPodcastsList(id: string) {
    const url = `https://listen-api-test.listennotes.com/api/v2/podcasts/${id}`;
    return await this.fetch(url);
  }

  async fetch(url: string): Promise<any> {
    showLoading();
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      console.log(response);
      if (!response.ok) {
        alert(
          `HTTP error! status: ${response.status} Your are blocked for too many requests. You can try again later, you can use VPN, you can use another browser or the incognito mode`
        );
        console.warn(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch {
      alert(
        `HTTP error! Your are blocked for too many requests. You can try again later, you can use VPN, you can use another browser or the incognito mode`
      );
    } finally {
      hideLoading();
    }
  }
}

const podcastApiSearch = new App();

async function makeAPICall(value: string) {
  console.log('making api call');
  searchResults = await podcastApiSearch.searchPodcasts(value);
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
  // renderHistoryPage();
}

function renderSearchPage() {
  if (counter && grid) {
    if (searchWrapper) {
      searchWrapper.style.display = 'flex';
    }

    grid.innerHTML = '';

    if (id__page) {
      id__page.innerHTML = '';
    }

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
      mainWrapper.classList.remove('id__page', 'main__page', 'history__page');
    }

    // Podcast counter
    const count = searchResults.results.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

async function renderIdPage(id: string) {
  searchId = await podcastApiSearch.returnPodcastsList(id);
  if (counter && grid) {
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

      const buttonToFaf = document.createElement('button');
      buttonToFaf.textContent = 'Add to fav';
      buttonToFaf.classList.add('fav__button__episodes');
      const audioList = getAudioList();

      const savedList = {
        progress: 0,
        duration: 0,
        url: item.audio,
        host: searchId.publisher,
        title: item.title,
        image: item.image,
      };

      const filteredList = audioList.find((saved) => saved.url === item.audio);
      if (filteredList) {
        buttonToFaf.disabled = true;
      } else {
        buttonToFaf.disabled = false;
      }

      buttonToFaf.addEventListener('click', (e) => {
        addToAudioList(savedList);
        buttonToFaf.disabled = true;
      });

      const episodeTitle = document.createElement('div');
      episodeTitle.className = 'episode-item__title';
      const titleLink = document.createElement('a');
      titleLink.textContent = item.title;
      titleLink.addEventListener('click', (e) => {
        switchAudioTrack(item.audio);

        // returns false if exists in localstorage
        if (addToAudioList(savedList)) {
          if (audioData) {
            playAudioPlayer();
          }
        } else {
          restoreAudioPlayer(item.audio);
        }
      });
      episodeTitle.append(buttonToFaf, titleLink);

      const episodeDescription = document.createElement('div');
      episodeDescription.className = 'episode-item__description';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.description || '';
      episodeDescription.textContent = tempDiv.textContent || 'No description';

      episodeItem.append(episodeDay, episodeTitle, episodeDescription);
      episodesSection.append(episodeItem);
    });

    main.append(top__page__wrapper, episodesSection);

    if (mainWrapper && id__page) {
      mainWrapper.classList.add('id__page');
      mainWrapper.classList.remove('main__page', 'search__page', 'history__page');
      id__page.append(main);
    }

    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

async function renderMainPage() {
  songsData = await podcastApiSearch.fetchPodcasts();
  if (grid && counter) {
    // clear main page when we return or clear search bar
    grid.innerHTML = '';

    if (id__page) {
      id__page.innerHTML = '';
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
      mainWrapper.classList.remove('search__page', 'id__page', 'history__page');
    }
    // Podcast counter
    const count = songsData.podcasts.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

function renderHistoryPage() {
  const savedList = getAudioList();
  if (grid && counter) {
    // clear main page when we return or clear search bar
    grid.innerHTML = '';

    if (id__page) {
      id__page.innerHTML = '';
    }

    if (searchWrapper) {
      searchWrapper.style.display = 'none';
    }

    // Search bar is empty
    // We check if we have any cards in the data.ts
    if (!savedList || savedList.length === 0) {
      grid.innerHTML = '<p>Podcasts are missing</p>';
      counter.textContent = '0 podcasts';
      return;
    }

    savedList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.addEventListener('click', (e) => {
        if (e.target) {
          const target = e.target as HTMLTextAreaElement;

          if (!target.classList.contains('remove__button')) {
            if (audioData.src !== item.url) {
              switchAudioTrack(item.url);
              if (audioData) {
                restoreAudioPlayer(item.url);
              }
            } else {
              toggleAudioPlayer();
            }
          }
        }
      });

      const cover = document.createElement('div');
      cover.className = 'card__cover';

      if (item.image) {
        cover.style.backgroundImage = `url('${item.image}')`;
      } else {
        cover.style.backgroundImage = 'none';
      }

      const title = document.createElement('div');
      title.className = 'card__title';
      title.textContent = `${item.title} by ${item.host}` || '';

      const author = document.createElement('div');
      author.className = 'card__author';
      author.textContent = `${convertTime(item.progress)} / ${convertTime(item.duration)}` || '';

      const remove__from__fav = document.createElement('button');
      remove__from__fav.classList.add('preview__description__button', 'remove__button');
      remove__from__fav.innerText = 'Remove from fav';
      remove__from__fav.addEventListener('click', (e) => {
        removeAudioItem(item.url);
      });

      card.appendChild(cover);
      card.appendChild(title);
      card.appendChild(author);
      card.appendChild(remove__from__fav);
      grid.appendChild(card);
    });

    if (mainWrapper) {
      mainWrapper.classList.add('history__page');
      mainWrapper.classList.remove('id__page', 'main__page', 'search__page');
    }

    // Podcast counter
    const count = savedList.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? 'Podcast' : 'Podcasts';
    counter.textContent = `${count} ${word}`;
  }
}

if (returnMain) {
  returnMain.addEventListener('click', (e) => {
    renderMainPage();
  });
}

if (returnHistory) {
  returnHistory.addEventListener('click', (e) => {
    renderHistoryPage();
  });
}

if (searchBoxDom) {
  searchBoxDom.addEventListener('input', (e) => {
    if (e.target) {
      const target = e.target as HTMLTextAreaElement;
      if (target.value === '') {
        renderMainPage();
      } else {
        debounceFunction(makeAPICall, 200, target.value);
      }
    }
  });
}

async function toggleAudioPlayer() {
  if (audioData && audioData.src === '') {
    alert('no audio selected');
    return;
  } else {
    if (audioPlayer && audioControls) {
      if (audioData.paused) {
        showLoading();
        const playPromise = audioData.play();
        if (playPromise !== undefined) {
          playPromise
            .then(async () => {
              audioControls.textContent = 'Pause';
            })
            .catch((error) => {
              audioControls.textContent = 'Play';
            })
            .finally(() => {
              hideLoading();
            });
        }
        audioControls.textContent = 'Pause';
      } else {
        audioData.pause();
        audioControls.textContent = 'Play';
      }
    }
  }
}

async function playAudioPlayer() {
  if (audioPlayer && audioControls) {
    showLoading();
    const playPromise = audioData.play();
    if (playPromise !== undefined) {
      playPromise
        .then(async () => {
          audioControls.textContent = 'Pause';
        })
        .catch((error) => {
          audioControls.textContent = 'Play';
        })
        .finally(() => {
          hideLoading();
        });
    }
  }
}

async function restoreAudioPlayer(url: string) {
  const list = getAudioList();
  if (list) {
    const item = list.find((item) => item.url === url);
    if (item) {
      if (item.progress - 10 <= 0) {
        audioData.currentTime = 0;
      } else {
        audioData.currentTime = item.progress - 10;
      }
    }
  }
  if (audioPlayer && audioControls) {
    showLoading();
    const playPromise = audioData.play();

    if (playPromise !== undefined) {
      playPromise
        .then(async () => {
          audioControls.textContent = 'Pause';
        })
        .catch((error) => {
          audioControls.textContent = 'Play';
        })
        .finally(() => {
          hideLoading();
        });
    }
  }
}

function handleAudioTimeChange(timeChange: number) {
  audioData.currentTime = timeChange;
  if (audioCurrentTime) {
    audioCurrentTime.textContent = convertTime(timeChange);
  }
}

if (audioControls && audioProgress) {
  audioControls.addEventListener('click', (e) => {
    toggleAudioPlayer();
  });

  audioProgress.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    handleAudioTimeChange(Number(target.value));
  });

  audioProgress.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    handleAudioTimeChange(Number(target.value));
  });
}

function switchAudioTrack(link: string) {
  if (audioPlayer && audioCurrentTime && audioTotalTime) {
    audioData.src = link;
  }
}

audioData.addEventListener('loadedmetadata', () => {
  if (audioCurrentTime && audioTotalTime) {
    if (Math.floor(audioData.duration)) {
      progressData.max = String(Math.floor(audioData.duration));
    }

    const audioDataLS = getAudioList();
    if (audioDataLS) {
      const item = audioDataLS.find((item) => item.url === audioData.src);
      if (item) {
        item.duration = audioData.duration;
        saveAudioList(audioDataLS);
      }
    }

    audioCurrentTime.textContent = convertTime(audioData.currentTime);
    audioTotalTime.textContent = convertTime(audioData.duration);
  }
});

audioData.addEventListener('timeupdate', (event) => {
  if (audioCurrentTime && progressData) {
    audioCurrentTime.textContent = convertTime(audioData.currentTime);
    progressData.value = String(audioData.currentTime);

    const duration = String(audioData.duration) === 'NaN' ? 0 : audioData.duration;
    const currentTime = String(audioData.currentTime) === 'NaN' ? 0 : audioData.currentTime;

    updateAudioProgress(audioData.src, currentTime);
    saveLocalProgress(audioData.src, currentTime);
  }
});

audioData.addEventListener('pause', (event) => {
  if (audioControls) {
    audioControls.textContent = 'Play';
  }
});

audioData.addEventListener('play', (event) => {
  if (audioControls) {
    audioControls.textContent = 'Pause';
  }
});

function getAudioList(): AudioProgress[] {
  const data = localStorage.getItem('audioProgressList');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveAudioList(list: AudioProgress[]) {
  localStorage.setItem('audioProgressList', JSON.stringify(list));
}

function removeAudioItem(url: string) {
  const list = getAudioList();
  const initialLength = list.length;
  const filteredList = list.filter((item) => item.url !== url);

  if (filteredList.length === initialLength) {
    console.warn(`Элемент с url "${url}" не найден`);
    return false;
  }

  saveAudioList(filteredList);
  renderHistoryPage();
}

function saveLocalProgress(url: string, newProgress: number) {
  const audioData = getAudioList();
  if (audioData) {
    const item = audioData.find((item) => item.url === url);
    if (item) {
      item.progress = newProgress;
      saveAudioList(audioData);
    }
  }
}

function updateAudioProgress(url: string, newProgress: number) {
  const audioData = getAudioList();

  if (audioData) {
    const item = audioData.find((item) => item.url === url);

    if (mainWrapper && mainWrapper.classList.contains('history__page')) {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        const coverElement = card.querySelector('.card__cover');
        if (coverElement) {
          const bgImage = (coverElement as HTMLElement).style.backgroundImage;

          const cardUrl = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
          if (cardUrl === item?.image) {
            const timerElement = card.querySelector('.card__author');
            if (timerElement) {
              timerElement.innerHTML = `${convertTime(newProgress)} / ${convertTime(item.duration)}`;
            }
          }
        }
      });
    }
  }
}

function addToAudioList(data: AudioProgress): boolean {
  const list = getAudioList();
  const exists = list.some((item) => {
    return item.url === data.url;
  });

  if (!exists) {
    list.push(data);
    saveAudioList(list);
    return true;
  } else {
    return false;
  }
}

function showLoading() {
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function hideLoading() {
  if (overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

renderPodcasts();
