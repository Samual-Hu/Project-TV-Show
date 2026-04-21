async function setup() {
	const episodeList = document.getElementById("episode-list");
	const searchInput = document.getElementById("search-input");
	const episodeSelector = document.getElementById("episode-selector");
	const showSelector = document.getElementById("show-selector");

	try {
		episodeList.innerHTML = "<h2>Select a show from the dropdown</h2>";

		const shows = await fetchShows();

		state.allShows = shows.toSorted((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
		);
		searchInput.addEventListener("input", handleSearchInput);
		episodeSelector.addEventListener("change", handleEpisodeSelect);
		showSelector.addEventListener("change", handleShowSelect);
		populateShowSelector();
	} catch (error) {
		episodeList.innerHTML = `<h2>Sorry, an error occurred: ${error.message}</h2>`;
	}
}

const state = {
	allShows: [],
	allEpisodes: [],
	episodesByShowId: {},
	selectedShowId: "",
	searchWord: "",
};

const SHOWS_URL = "https://api.tvmaze.com/shows";

async function fetchShows() {
	const response = await fetch(SHOWS_URL);

	if (!response.ok) {
		throw new Error("Failed to fetch shows");
	}
	return await response.json();
}

async function fetchEpisodes(showId) {
	const response = await fetch(`${SHOWS_URL}/${showId}/episodes`);

	if (!response.ok) {
		throw new Error("Failed to fetch episodes");
	}

	return await response.json();
}

function populateShowSelector() {
	const showSelector = document.getElementById("show-selector");

	const options = state.allShows.map((show) => {
		const option = document.createElement("option");
		option.value = `${show.id}`;
		option.textContent = `${show.name}`;
		return option;
	});

	showSelector.append(...options);
}

function populateEpisodeSelector() {
	const episodeSelector = document.getElementById("episode-selector");
	episodeSelector.innerHTML = '<option value="">Select an episode</option>';

	const options = state.allEpisodes.map((episode) => {
		const option = document.createElement("option");
		option.value = `episode-${episode.id}`;
		option.textContent = formatTitle(episode);
		return option;
	});

	episodeSelector.append(...options);
}

function makeEpisodeCard(episode) {
	const episodeCard = document.createElement("div");
	const title = document.createElement("h2");
	const summary = document.createElement("div");

	episodeCard.className = "episode-card";
	episodeCard.id = `episode-${episode.id}`;
	summary.className = "summary";

	title.textContent = formatTitle(episode);
	episodeCard.appendChild(title);

	// as some episodes of About a Boy, and possibly other shows, don't have images, I've added a fail safe option to create the element only if the image is available.
	if (episode.image && episode.image.medium) {
		const img = document.createElement("img");
		img.src = episode.image.medium;
		img.alt = `Screenshot from ${episode.name}`;
		episodeCard.appendChild(img);
	}

	summary.innerHTML = episode.summary || "<p>No summary available</p>";
	episodeCard.appendChild(summary);

	return episodeCard;
}

function render() {
	const episodeSection = document.getElementById("episode-list");
	const episodeCount = document.getElementById("episode-count");
	episodeSection.innerHTML = "";

	const filteredEpisodes = state.allEpisodes.filter(
		(episode) =>
			episode.name.toLowerCase().includes(state.searchWord) ||
			(episode.summary || "").toLowerCase().includes(state.searchWord), // added failsafe in case summary is ever empty
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

async function handleShowSelect(event) {
	const episodeList = document.getElementById("episode-list");
	state.selectedShowId = event.target.value;
	state.searchWord = "";
	document.getElementById("search-input").value = "";

	if (state.episodesByShowId[state.selectedShowId]) {
		state.allEpisodes = state.episodesByShowId[state.selectedShowId];

		populateEpisodeSelector();
		render();
	} else {
		try {
			episodeList.innerHTML = "<h2>Loading data from TVMaze...</h2>";
			const episodes = await fetchEpisodes(state.selectedShowId);

			state.allEpisodes = episodes;

			state.episodesByShowId[state.selectedShowId] = episodes;

			populateEpisodeSelector();
			render();
		} catch (error) {
			episodeList.innerHTML = `<p>Sorry, an error occurred: ${error.message}</p>`;
		}
	}
}

function handleEpisodeSelect(event) {
	const selectedEpisodeId = event.target.value;

	if (selectedEpisodeId === "") return;

	const selectedEpisode = document.getElementById(selectedEpisodeId);

	if (selectedEpisode) {
		selectedEpisode.scrollIntoView({ behavior: "smooth", block: "start" });
	}
}

function formatTitle(episode) {
	const seasonCode = String(episode.season).padStart(2, "0");
	const episodeCode = String(episode.number).padStart(2, "0");
	return `${episode.name} - S${seasonCode}E${episodeCode}`;
}

window.onload = setup;
