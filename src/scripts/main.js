import AuidoVisualizer from "./audio_visualizer";

function main() {
	new AuidoVisualizer({
		queryCanvas : "canvas",
		queryLoadingSreen : "#loading-screen",
		loadedClass : "loaded",
	});
}

document.addEventListener("DOMContentLoaded", main);
