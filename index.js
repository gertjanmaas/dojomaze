import { RegisterPlayer, GetPlayerStatus, Shoot, Move } from "./client.js";

let lastDirection = -1;
const NAME = "Portal";

const STATIC_OBJECTS = ["Statue", "Boxes"];

let currentX,
  currentY = 0;

const EMPTY = " ";
const EXPLORED = "X";
const grid = {};

function mod(n, m) {
  return ((n % m) + m) % m;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function calculateNextCoordinates(newDirection) {
  let nextX = currentX;
  let nextY = currentY;
  switch (newDirection) {
    case 0:
      nextY++;
      break;
    case 1:
      nextX++;
      break;
    case 2:
      nextY--;
      break;
    case 3:
      nextX--;
      break;
  }
  return nextX, nextY;
}

function findNewDirection(distances, oldDirection) {
  // let unexploredDirections = [0, 1, 2, 3].map(i => grid[calculateNextCoordinates(oldDirection + i)] === undefined)
  let direction = mod(oldDirection + 1, 4);
  while (distances[direction] === 0) {
    direction = mod(direction - 1, 4);
  }
  return direction;
}

async function Loop(playerId) {
  const status = await GetPlayerStatus(playerId);

  console.log(status.data);
  const { entities, wallDistances } = status.data;

  const portals = entities.filter((e) => e.visual === "Portal");
  if (portals.length > 0) {
    const wait = await Move(
      playerId,
      portals[0].distances.findIndex((i) => i > 0)
    );
    await sleep(wait.data.frameTimeMilliseconds + 500);
  } else if (
    entities.filter((e) => e.name != NAME && !STATIC_OBJECTS.includes(e.visual))
      .length > 0
  ) {
    // shoot it!
    const entity = entities.find((e) => e.name != NAME);
    await Shoot(
      playerId,
      entity.distances.findIndex((i) => i > 0 && i < 3)
    );
    await sleep(2000);
  } else {
    let newDirection = -1;
    if (lastDirection != -1) {
      newDirection = findNewDirection(wallDistances, lastDirection);
      console.log(`Continuing, choosing: ${newDirection}`);
    } else {
      console.log("Starting, choosing first unblocked direction");
      newDirection = wallDistances.findIndex((i) => i > 0);
    }
    currentX, (currentY = calculateNextCoordinates(newDirection));
    grid[(currentX, currentY)] = EXPLORED;
    const wait = await Move(playerId, newDirection);
    lastDirection = newDirection;
    console.log(`Waiting for: ${wait.data.frameTimeMilliseconds + 500}`);
    await sleep(wait.data.frameTimeMilliseconds + 500);
  }
}

async function Start() {
  try {
    const resp = await RegisterPlayer(process.env.SUPER_SECRET_CLIENT_ID, NAME);
    const { playerId } = resp.data;
    console.log(`Player created: ${playerId}`);
    grid[(currentX, currentY)] = EXPLORED;
    await sleep(3000);
    while (true) {
      try {
        await Loop(playerId);
      } catch (e) {
        console.error(`Error in loop ${e}`);
        await sleep(2000);
      }
    }
  } catch (e) {
    console.error(`Unable to register player: ${e}`);
  }
}

Start();
