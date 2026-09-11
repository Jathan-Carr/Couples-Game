import { loadState, updateState } from "./storage.js";

export function getPlayerName() {
  return loadState().player.name.trim();
}

export function setPlayerName(name) {
  updateState((state) => {
    state.player.name = name.trim();
  });
}

export function getPlayer2Name() {
  return loadState().lastGuest.player2.trim();
}

export function setPlayer2Name(name) {
  updateState((state) => {
    state.lastGuest.player2 = name.trim();
  });
}
