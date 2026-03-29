//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes);
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  for (const episode of episodeList) {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const formattedTitle = `${episode.name} - S${seasonCode}E${episodeCode}`;
    const title = document.createElement("h2");
    title.textContent = formattedTitle;
    const img = document.createElement("img");
    img.src = episode.image.medium;
    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;
    episodeCard.appendChild(title);
    episodeCard.appendChild(img);
    episodeCard.appendChild(summary);
    rootElem.appendChild(episodeCard);
  }
}

window.onload = setup;
