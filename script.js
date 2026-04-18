//You can edit ALL of the code here
function setup() {
	const allEpisodes = getAllEpisodes();
	console.log(allEpisodes);
	makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
	const rootElem = document.getElementById("root");
	// rootElem.innerHTML = "";
	const main = document.getElementById("main");
	for (const episode of episodeList) {
		const episodeCard = makeEpisodeCard(episode);
		main.appendChild(episodeCard);
	}
}
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

function formatTitle(episode) {
	const seasonCode = String(episode.season).padStart(2, "0");
	const episodeCode = String(episode.number).padStart(2, "0");
	const formattedTitle = `${episode.name} - S${seasonCode}E${episodeCode}`;
	return formattedTitle;
}

window.onload = setup;
