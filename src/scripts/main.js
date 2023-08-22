import AuidoVisualizer from "./audio_visualizer";

function main() {
  new AuidoVisualizer({
    querySelect : "canvas",
  });
}

document.addEventListener("DOMContentLoaded", main);
