/* eslint-disable no-undef */
import  Ship from "../modules/ship";

describe("test ship object", () => {
  let ship;
  beforeEach(() => {
    ship = new Ship(3);
    return ship;
  });
  test("takes two proper hits", () => {
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
  });
  test("takes five proper hits", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(5);
  });
  test("ship of size 3 is sunk after 3 hits", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
  test("ship of size 2 is sunk after 2 hits", () => {
    ship = new Ship(2);
    expect(ship.isSunk()).toBeFalsy();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});
