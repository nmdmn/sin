import App from "./app.js";

function main() {
  const app = new App(settings => {
    // setup
    settings["clearColor"] = 0x121212;
  });

  app.start(dT => {
    // update
    console.log(dT);
  });
}

main();
