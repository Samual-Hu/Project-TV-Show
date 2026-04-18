function setup() {
  state.allEpisodes = getAllEpisodes();
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearchInput);
  render();
}

const state = {
  allEpisodes: [],
  searchWord: "",
};

function makeEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  const title = document.createElement("h2");
  const img = document.createElement("img");
  const summary = document.createElement("div");

  episodeCard.className = "episode-card";
  summary.className = "summary";

  title.textContent = formatTitle(episode);
  img.src = episode.image.medium;
  summary.innerHTML = episode.summary;

  episodeCard.appendChild(title);
  episodeCard.appendChild(img);
  episodeCard.appendChild(summary);

  return episodeCard;
}

function render() {
  const episodeSection = document.getElementById("episode-list");
  const episodeCount = document.getElementById("episode-count");
  episodeSection.textContent = "";

  const filteredEpisodes = state.allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(state.searchWord) ||
      episode.summary.toLowerCase().includes(state.searchWord),
  );

  episodeCount.textContent = `Displaying ${filteredEpisodes.length} / ${state.allEpisodes.length} episodes`;

  const episodeCards = filteredEpisodes.map((episode) =>
    makeEpisodeCard(episode),
  );

  episodeSection.append(...episodeCards);
}

function handleSearchInput(event) {
  state.searchWord = event.target.value.toLowerCase();
  render();
}

function formatTitle(episode) {
  const seasonCode = String(episode.season).padStart(2, "0");
  const episodeCode = String(episode.number).padStart(2, "0");
  return `${episode.name} - S${seasonCode}E${episodeCode}`;
}

window.onload = setup;
