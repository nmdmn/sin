import AuidoVisualizer from "./audio_visualizer";

function main() {
	new AuidoVisualizer({
		queryCanvas : "canvas",
		queryLoadingSreen : "loading-screen",
		loadedClass : "loaded",
		loadingClass : "loading",
		playButton : "play-button",
		playerStart : "to-play",
		playerStop : "stop",
	});
}

document.addEventListener("DOMContentLoaded", main);
