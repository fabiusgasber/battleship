import Gameboard from "../modules/gameboard";
import Ship from "../modules/ship";

/* eslint-disable no-undef */
describe("test gameboard objects", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard(10, 10);
    return gameboard;
  });

  test("throws error if parameter is missing", () => {
    expect(() => gameboard.placeShip()).toThrow();
  });

  test("throws error if a different parameter is missing", () => {
    const ship = new Ship(5);
    expect(() => gameboard.placeShip(ship)).toThrow();
  });

  test("throws error if coordinates are in the wrong format", () => {
    const ship = new Ship(3);
    expect(() => gameboard.placeShip(ship, [3], "v")).toThrow();
  });

  test("throws error if direction has been wrongly specified", () => {
    const ship = new Ship(3);
    expect(() => gameboard.placeShip(ship, [3, 5], "vertical")).toThrow();
  });

  test("throws error if ship would fall out of bounds of gameboard", () => {
    const ship = new Ship(5);
    expect(() => gameboard.placeShip(ship, [6, 3], "v")).toThrow();
  });

  test("throws error if ship would fall out of bounds of gameboard", () => {
    const ship = new Ship(5);
    expect(() => gameboard.placeShip(ship, [3, 10], "h")).toThrow();
  });

  test("throws error if coordinates are too high", () => {
    const ship = new Ship(5);
    expect(() => gameboard.placeShip(ship, [3, 11], "h")).toThrow();
  });

  test("throws error if coordinates are too low", () => {
    const ship = new Ship(5);
    expect(() => gameboard.placeShip(ship, [-2, 5], "h")).toThrow();
  });

  test("places ship with length of three at [3, 6] horizontally", () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, [3, 6], "h");
    const shipPositions = [6, 7, 8];
    shipPositions.forEach((col) =>
      expect(gameboard.board[3][col]).toEqual(ship),
    );
    // check sorrounding areas, too
    expect(gameboard.board[3][5]).toBeNull(); // Left side
    expect(gameboard.board[3][9]).toBeNull(); // Right side
    expect(gameboard.board[4][6]).toBeNull(); // Above
    expect(gameboard.board[2][6]).toBeNull(); // Below
  });

  test("places ship with length of five at [2, 3] horizontally", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, [2, 3], "h");

    const shipPositions = [3, 4, 5, 6, 7]; // expected occupied fields
    shipPositions.forEach((col) =>
      expect(gameboard.board[2][col]).toEqual(ship),
    );
    // check sorrounding areas, too
    expect(gameboard.board[2][2]).toBeNull(); // Left side
    expect(gameboard.board[2][8]).toBeNull(); // Right side
    expect(gameboard.board[1][3]).toBeNull(); // Above
    expect(gameboard.board[3][3]).toBeNull(); // Below
  });

  test("places ship with length of 2 at [6, 3] vertically", () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, [6, 3], "v");

    const shipPositions = [6, 7]; // expected occupied fields
    shipPositions.forEach((row) =>
      expect(gameboard.board[row][3]).toEqual(ship),
    );
    // check sorrounding areas, too
    expect(gameboard.board[6][2]).toBeNull(); // Left side
    expect(gameboard.board[6][4]).toBeNull(); // Right side
    expect(gameboard.board[5][3]).toBeNull(); // Above
    expect(gameboard.board[8][3]).toBeNull(); // Below
  });

  test("checks whether the field is occupied when placing ship", () => {
    const ship = new Ship(2);
    const anotherShip = new Ship(3);
    gameboard.placeShip(ship, [6, 7], "v");
    expect(() => gameboard.placeShip(anotherShip, [6, 7], "h")).toThrow();
  });

  test("throws error when a missed field has been attacked twice", () => {
    gameboard.receiveAttack([6, 7]);
    expect(() => gameboard.receiveAttack([6, 7])).toThrow();
  });

  test("throws error when a ship has been attacked before and doesn't count it", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, [6, 3], "h");
    gameboard.receiveAttack([6, 7]);
    expect(() => gameboard.receiveAttack([6, 7])).toThrow();
    expect(ship.hits).toBe(1);
  });

  test("attacks ship correctly", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, [2, 3], "h");
    gameboard.receiveAttack([2, 5]);
    gameboard.receiveAttack([2, 3]);
    gameboard.receiveAttack([2, 7]);
    expect(ship.hits).toBe(3);
  });

  test("hit field receive value of 1 after sucessful hit", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, [2, 3], "h");
    gameboard.receiveAttack([2, 5]);
    expect(gameboard.board[2][5]).toBe(1);
  });

  test("hit field receive value of 0 after miss", () => {
    const ship = new Ship(5);
    gameboard.placeShip(ship, [2, 3], "h");
    gameboard.receiveAttack([2, 0]);
    expect(gameboard.board[2][0]).toBe(0);
  });

  test("records if all ships have been sunk", () => {
    const ship = new Ship(2);
    const anotherShip = new Ship(1);
    gameboard.placeShip(ship, [2, 3], "h");
    gameboard.placeShip(anotherShip, [6, 7], "v");
    expect(gameboard.allShipsSunk()).toBeFalsy();
    gameboard.receiveAttack([6, 7]);
    expect(gameboard.allShipsSunk()).toBeFalsy();
    gameboard.receiveAttack([2, 3]);
    expect(gameboard.allShipsSunk()).toBeFalsy();
    gameboard.receiveAttack([2, 4]);
    expect(gameboard.allShipsSunk()).toBeTruthy();
  });
});
