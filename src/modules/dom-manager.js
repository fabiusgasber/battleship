import Player from "./player";
import Gameboard from "./gameboard";
import Ship from "./ship";
import "../styles.css";

const domManager = (() => {
  let user = null;
  let computer = null;
  const main = document.querySelector("main");
  const header = document.querySelector("header");
  const gameInfo = document.querySelector("#game-info");
  let test = null;

  const getShips = () => [
    new Ship(5),
    new Ship(4),
    new Ship(3),
    new Ship(3),
    new Ship(2),
  ];

  const rotateShips = (e) => {
    if (e && e.target.getAttribute("id") === "rotate-btn") {
      const container = document.querySelector(".user-ships");
      container?.classList?.toggle("rotate-container");
      const ships = Array.from(document.querySelectorAll(".ship-container"));
      if (ships) {
        ships.forEach((ship) => ship.classList.toggle("rotate"));
      }
    }
  };

  const placeRandomShips = (player) => {
    getShips().forEach((ship) => {
      let placed = false;
      while (!placed) {
        let randomX = Math.floor(Math.random() * 10);
        let randomY = Math.floor(Math.random() * 10);
        const direction = Math.floor(Math.random() * 2) === 1 ? "h" : "v";
        if (
          (direction === "h" && ship.length + randomY >= 10) ||
          (direction === "v" && ship.length + randomX >= 10) ||
          player?.getGameboard().board[randomX][randomY] instanceof Ship
        )
          continue;
        try {
          player?.getGameboard().placeShip(ship, [randomX, randomY], direction);
          placed = true;
        } catch (error) {
          if (player === user) gameInfo.textContent = error.message;
        }
      }
    });
  };

  const randomizeShips = (e) => {
    if (e && e.target.getAttribute("id") === "random-btn") {
      const test = document.querySelector("#reset-btn");
      test.click();
      placeRandomShips(user);
      renderGameboard();
      checkBeginPossible();
    }
  };

  const checkBeginPossible = () => {
    if (user.getGameboard().ships.length === getShips().length) {
      gameInfo.textContent = "Press start to play...";
    }
  };

  const resetGame = (e) => {
    if (e && e.target.getAttribute("id") === "reset-btn") {
      user.getGameboard().resetBoard();
      computer.getGameboard().resetBoard();
      test = createUserShips();
      gameInfo.textContent = "User place your ships...";
      if (!computer.getGameboard().ships.length) placeRandomShips(computer);
    }
    renderGameboard();
    main.append(test);
  };

  const createButton = (text, id) => {
    const btn = document.createElement("button");
    btn.setAttribute("id", id);
    btn.textContent = text;
    return btn;
  };

  const beginGame = (e) => {
    if (e && e.target.getAttribute("id") === "start-btn") {
      takeTurns(true);
    }
  };

  let draggedShip = null;
  let dragged = null;

  const handleDragOver = (e) => {
    const gameboard = e.target.closest(".gameboard");
    if (gameboard && gameboard.getAttribute("id") === "user-gameboard")
      e.preventDefault();
  };

  const handleMouseDown = (e) => {
    if (e.target.classList.contains("ship-part")) draggedShip = e.target;
  };

  const handleDragStart = (e) => {
    dragged = e.target;
  };

  const handleDrop = (e) => {
    try {
      let { uiBoard, colIndex, rowIndex } = getGameboardInfos(e);
      if (
        uiBoard.getAttribute("id") === "user-gameboard" &&
        dragged &&
        draggedShip
      ) {
        e.preventDefault();
        const children = Array.from(dragged.children);
        const length = parseInt(dragged.getAttribute("length"));
        if (
          document.querySelector(".ship-container").classList.contains("rotate")
        ) {
          gameInfo.textContent = "User place your ships...";
          rowIndex = parseInt(rowIndex) - children.indexOf(draggedShip);
          colIndex = parseInt(colIndex);
          user
            .getGameboard()
            .placeShip(new Ship(length), [rowIndex, colIndex], "v");
        } else if (
          !document
            .querySelector(".ship-container")
            .classList.contains("rotate")
        ) {
          gameInfo.textContent = "User place your ships...";
          rowIndex = parseInt(rowIndex);
          colIndex = parseInt(colIndex) - children.indexOf(draggedShip);
          user
            .getGameboard()
            .placeShip(new Ship(length), [rowIndex, colIndex], "h");
        }
      }
      test = dragged.parentNode;
      dragged.parentNode.removeChild(dragged);
      renderGameboard();
      main.append(test);
      checkBeginPossible();
    } catch (error) {
      gameInfo.textContent = error.message;
    }
  };

  const setUpEventListeners = (main, nav) => {
    main.addEventListener("dragstart", handleDragStart);
    main.addEventListener("mousedown", handleMouseDown);
    main.addEventListener("dragover", handleDragOver);
    main.addEventListener("drop", handleDrop);
    nav.addEventListener("click", rotateShips);
    nav.addEventListener("click", beginGame);
    nav.addEventListener("click", randomizeShips);
    nav.addEventListener("click", resetGame);
  };

  const createUserShips = () => {
    const userShips = document.createElement("div");
    userShips.classList.add("user-ships");
    for (let i = 0; i < getShips().length; i += 1) {
      const container = document.createElement("div");
      container.classList.add("ship-container");
      container.setAttribute("draggable", true);
      container.setAttribute("length", getShips()[i].length);
      for (let j = 0; j < getShips()[i].length; j += 1) {
        const ship = document.createElement("div");
        ship.classList.add("ship-part");
        container.append(ship);
      }
      userShips.append(container);
    }
    return userShips;
  };

  const createCell = (attr, index) => {
    const field = document.createElement("div");
    field.setAttribute("class", attr);
    field.setAttribute(attr, index);
    return field;
  };

  const isEnd = () =>
    computer.getGameboard().allShipsSunk() ||
    user.getGameboard().allShipsSunk();

  const addFieldStyles = (field, hidden, container) => {
    if (field instanceof Ship && !hidden) {
      container.classList.add("ship-part");
    } else if (field === 0) {
      container.classList.add("miss");
    } else if (field === 1) {
      container.classList.add("hit");
    }
  };

  const computerAttack = () => {
    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);
    const userBoard = user.getGameboard();
    try {
      userBoard.receiveAttack([randomX, randomY]);
      takeTurns(true);
    } catch (error) {
      takeTurns(false);
    }
  };

  const userAttack = (e) => {
    try {
      const { uiBoard, rowIndex, colIndex } = getGameboardInfos(e);
      if (uiBoard.getAttribute("id") === "computer-gameboard") {
        const computerBoard = computer.getGameboard();
        computerBoard.receiveAttack([rowIndex, colIndex]);
        takeTurns(false);
      }
    } catch (error) {
      takeTurns(true);
    }
  };

  const createGameboard = (player, hidden) => {
    const uiGameboard = document.createElement("div");
    uiGameboard.setAttribute("class", "gameboard");
    uiGameboard.setAttribute(
      "id",
      `${player.getName().toLowerCase()}-gameboard`,
    );
    const { board } = player.getGameboard();
    board.forEach((row, rowIndex) => {
      const rowDiv = createCell("row", rowIndex);
      uiGameboard.append(rowDiv);
      row.forEach((_, colIndex) => {
        const colDiv = createCell("col", colIndex);
        rowDiv.append(colDiv);
        addFieldStyles(board[rowIndex][colIndex], hidden, colDiv);
      });
    });
    return uiGameboard;
  };

  const getGameboardInfos = (e) => {
    const row = e.target.closest(".row");
    const col = e.target.closest(".col");
    const uiBoard = e.target.closest(".gameboard");
    if (!row || !col || !uiBoard) throw new Error("Click at the board");
    const rowIndex = row.getAttribute("row");
    const colIndex = col.getAttribute("col");
    return {
      uiBoard,
      rowIndex,
      colIndex,
    };
  };

  const createNav = () => {
    const nav = document.createElement("nav");
    nav.append(createButton("Rotate", "rotate-btn"));
    nav.append(createButton("Random", "random-btn"));
    nav.append(createButton("Reset", "reset-btn"));
    nav.append(createButton("Start", "start-btn"));
    return nav;
  };

  const renderGameboard = () => {
    main.replaceChildren();
    main.append(createGameboard(user, false));
    main.append(createGameboard(computer, true));
  };

  const takeTurns = (userTurn) => {
    main.removeEventListener("click", userAttack);
    if (
      user.getGameboard().ships.length === getShips().length &&
      computer.getGameboard().ships.length === getShips().length
    ) {
      if (userTurn && !isEnd()) {
        gameInfo.textContent = "Waiting for user to make turn...";
        main.addEventListener("click", userAttack);
      } else if (!userTurn && !isEnd()) {
        main.removeEventListener("click", userAttack);
        gameInfo.textContent = "Waiting for computer to make turn...";
        setTimeout(() => computerAttack(), 300);
      } else if (isEnd()) {
        main.removeEventListener("click", userAttack);
        if (user.getGameboard().allShipsSunk()) {
          gameInfo.textContent = "Computer wins!";
        } else if (computer.getGameboard().allShipsSunk()) {
          gameInfo.textContent = "User wins!";
        }
        gameInfo.textContent += " Press reset or random to restart!";
      }
      renderGameboard();
    }
  };

  const startGame = () => {
    user = new Player("User", new Gameboard(10, 10));
    computer = new Player("Computer", new Gameboard(10, 10));
    placeRandomShips(computer);
    const nav = createNav();
    header.append(nav);
    setUpEventListeners(main, nav);
    renderGameboard();
    test = createUserShips();
    main.append(test);
  };

  return { startGame };
})();

export default domManager;
