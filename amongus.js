const END_ROOM_PHASE_TIMEOUT = 100;
const END_TASK_PHASE_TIMEOUT = 100;
const END_VOTE_PHASE_TIMEOUT = 200;

let availableComputerPlayers = [
  "Funk", "Foo", "Grandpop", "Grandma", "Preston", "Mouth", "Crayon"
];

let availableImages = [
  "blue",
  "darkgreen",
  "green",
  "lightblue",
  "orange",
  "pink",
  "red",
  "white"
];

const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
}

const sample = (array) => {
  return array[randomIndex(array)];
}

const pluckRandom = (array) => {
  return array.splice(randomIndex(array), 1);
}

const newFromTemplate = (template) => {
  let element = template.cloneNode(true);
  element.classList.remove("hidden");
  element.attributes.removeNamedItem("id");
  return element;
};

const game = new Game();

