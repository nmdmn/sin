export default class App {
  constructor(gui) {
    this.settings = {
      someSettingFrom0To1 : 0,
    };
    this.gui = gui;
    this.gui.add(this.settings, "someSettingFrom0To1", 0, 1, 0.1);
  }
}
