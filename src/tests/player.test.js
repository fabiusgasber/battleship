/* eslint-disable no-undef */
import Player from "../modules/player";
import Gameboard from "../modules/gameboard";

describe("tests player object creation", () => {
  test("player object holds correct name", () => {
    const gameboard = new Gameboard(10, 10);
    const player = new Player("user", gameboard);
    expect(player.getName()).toBe("user");
  });

  test("player object holds correct gameboard", () => {
    const gameboard = new Gameboard(10, 10);
    const anotherGameboard = new Gameboard(10, 10);
    const player = new Player("user", gameboard);
    expect(player.getGameboard()).toBe(gameboard);
    expect(player.getGameboard()).not.toBe(anotherGameboard);
  });

  test("throws error if no argument is given", () => {
    expect(() => new Player()).toThrow();
  });

  test("throws error if gameboard is missing", () => {
    expect(() => new Player("user")).toThrow();
  });
});
