class Player {
  #name;

  #gameboard;

  constructor(name, gameboard) {
    if (!name || !gameboard) throw new Error("Argument is missing");
    this.#name = name;
    this.#gameboard = gameboard;
  }

  getName = () => this.#name;

  getGameboard = () => this.#gameboard;
}

export default Player;
