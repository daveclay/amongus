/************************************************
 * Tests
 ************************************************/
import {
  expect,
  describe
} from "./testing"

import {ArrayUtils} from "./utils";
import {movePlayerToRoom} from "./redux/mutators";

describe("ArrayUtils", () => {
  let a = ["A", "B", "C"]
  let result = ArrayUtils.allExcept(a, "B")
  expect(result).to_equal(["A", "C"])
})

describe(movePlayerToRoom, () => {
  let playerToMove = {
    name: "Baz"
  }
  let state = {
    rooms: [
      {
        name: "FooRoom",
        playerNames: [
          "Zip"
        ]
      },
      {
        name: "BarRoom",
        playerNames: [
          playerToMove.name,
          "Zang"
        ]
      }
    ]
  }
  movePlayerToRoom(state, playerToMove, "FooRoom")
  expect(state.rooms[0].playerNames).to_equal(["Zip", "Baz"])
  expect(state.rooms[1].playerNames).to_equal(["Zang"])
})

