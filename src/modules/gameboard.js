class Gameboard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.board = Array.from(Array(x), () => new Array(y).fill(null));
    this.ships = [];
    this.sunkenShips = [];
  }

  resetBoard() {
    this.board = Array.from(Array(this.x), () => new Array(this.y).fill(null));
    this.ships = [];
    this.sunkenShips = [];
  }

  #checkPlacement(ship, x, y, direction){
      for (let i = 0; i < ship.length; i += 1) {
        const checkX = direction === "h" ? x : x + i;
        const checkY = direction === "h" ? y + i : y;
        if (this.board[checkX]?.[checkY] && this.board[checkX]?.[checkY]?.hits !== undefined || 
          this.board[checkX - 1]?.[checkY]?.hits !== undefined ||
          this.board[checkX + 1]?.[checkY]?.hits !== undefined ||
          this.board[checkX]?.[checkY + 1]?.hits !== undefined ||
          this.board[checkX]?.[checkY - 1]?.hits !== undefined ||
          this.board[checkX - 1]?.[checkY + 1]?.hits !== undefined ||
          this.board[checkX - 1]?.[checkY - 1]?.hits !== undefined ||
          this.board[checkX + 1]?.[checkY + 1]?.hits !== undefined ||
          this.board[checkX + 1]?.[checkY - 1]?.hits !== undefined
        ) return false;
      }
      return true;
  }

  placeShip(ship, coordinates, direction) {
    this.#checkArguments(ship, coordinates, direction);
    const x = coordinates[0];
    const y = coordinates[1];
      for (let i = 0; i < ship.length; i += 1) {
        const checkX = direction === "h" ? x : x + i;
        const checkY = direction === "h" ? y + i : y;
        this.board[checkX][checkY] = ship;
      }
    this.ships.push(ship);
  }

  receiveAttack(coordinates) {
    const x = coordinates[0];
    const y = coordinates[1];
    const attackedField = this.board[x][y];
    if (
      attackedField &&
      typeof attackedField.hit === "function" &&
      attackedField.hits !== undefined
    ) {
      attackedField.hit();
      if (attackedField.isSunk()) this.sunkenShips.push(attackedField);
      this.board[x][y] = 1; // record hit
    } else if (attackedField === null) {
      this.board[x][y] = 0; // record missed shot
    } else if (attackedField === 0 || attackedField === 1) {
      throw new Error("Field has been attacked before. Try again.");
    }
  }

  allShipsSunk() {
    return this.sunkenShips.length > 0 && this.ships.length > 0 && this.sunkenShips.length === this.ships.length;
  }

  #checkArguments(ship, coordinates, direction) {
    if (!ship || !coordinates || !direction)
      throw new Error("Please provide every parameter");
    if (!Array.isArray(coordinates) || coordinates.length !== 2)
      throw new Error("Please provide coordinates in the format [x, y]");
    if (
      coordinates[0] > this.x ||
      coordinates[1] > this.y ||
      coordinates[0] < 0 ||
      coordinates[1] < 0
    )
      throw new Error(
        `Ship was placed out of bounds. Try again.`,
      );
    if (direction !== "h" && direction !== "v")
      throw new Error(
        "Please provide the direction as 'h' for horizontal or 'v' for vertical",
      );
    if (
      (direction === "h" && ship.length + coordinates[1] > this.y) ||
      (direction === "v" && ship.length + coordinates[0] > this.x)
    )
      throw new Error("Ship was placed out of bounds. Try again.");
      if(this.ships.length >= 5) throw new Error("Gameboard full. Reset first.")
      if(!this.#checkPlacement(ship, coordinates[0], coordinates[1], direction)) throw new Error("Oops! You can't place a ship next to another. Try a different position!");
  }
}

export default Gameboard;
