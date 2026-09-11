import { defaultRules } from "./keeps.js";
import { updateState, loadState } from "./storage.js";

export function createRoom({ code, role, size, name }) {
  return {
    code,
    role,
    size: Number(size) || 4,
    status: role === "host" ? "hosting" : "connecting",
    members: [{ id: "self", name, host: role === "host" }],
    error: "",
    qr: "",
    rules: defaultRules(),
  };
}

export function upsertMember(room, member) {
  const idx = room.members.findIndex((item) => item.id === member.id || item.name === member.name);
  if (idx >= 0) room.members[idx] = { ...room.members[idx], ...member };
  else room.members.push(member);
}

export function dropMember(room, id) {
  room.members = room.members.filter((item) => item.id !== id);
}

export function rememberCode(code) {
  updateState((state) => {
    state.lastRoomCode = code;
  });
}

export function lastCode() {
  return loadState().lastRoomCode || "";
}

export function rosterNames(room) {
  return (room?.members || []).map((item) => item.name).filter(Boolean);
}
