// Small compatibility fix: export subscribeUser as an alias for registerUser
import * as signalR from "@microsoft/signalr";

const DEFAULT_API_BASE = process.env.REACT_APP_API_BASE_URL || "https://localhost:7283";
const HUB_PATH = "/notificationHub";

let connection = null;
const listeners = new Set();
let reconnecting = false;

function hubUrl() {
  return `${DEFAULT_API_BASE.replace(/\/$/, "")}${HUB_PATH}`;
}

function ensureConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl(), {
      accessTokenFactory: () => localStorage.getItem("token") || ""
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.on("ReceiveNotification", (payload) => {
    for (const cb of Array.from(listeners)) {
      try { cb(payload); } catch (err) { /* swallow handler errors */ }
    }
  });

  connection.onreconnecting((err) => {
    reconnecting = true;
    console.warn("SignalR reconnecting", err);
  });

  connection.onreconnected(() => {
    reconnecting = false;
    console.log("SignalR reconnected");
    try {
      const userId = localStorage.getItem("userId");
      if (userId) connection.invoke("Register", userId).catch(() => {});
    } catch {}
  });

  connection.onclose((err) => {
    reconnecting = false;
    console.warn("SignalR closed", err);
  });

  return connection;
}

export async function startConnection() {
  const conn = ensureConnection();
  if (conn.state === signalR.HubConnectionState.Connected ||
      conn.state === signalR.HubConnectionState.Connecting) {
    return conn;
  }

  try {
    await conn.start();
    console.log("SignalR connected");
    const userId = localStorage.getItem("userId");
    if (userId) {
      await conn.invoke("Register", userId).catch(() => {});
    }
    return conn;
  } catch (err) {
    console.error("SignalR start error:", err);
    return conn;
  }
}

export async function stopConnection() {
  if (!connection) return;
  try {
    if (connection.state === signalR.HubConnectionState.Connected) {
      await connection.stop();
      console.log("SignalR stopped");
    }
  } catch (err) {
    console.error("SignalR stop error:", err);
  }
}

export function onNotificationReceived(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function offNotificationReceived(callback) {
  listeners.delete(callback);
}

export async function registerUser(userId) {
  const conn = ensureConnection();
  if (conn.state !== signalR.HubConnectionState.Connected) {
    await startConnection();
  }
  try {
    await conn.invoke("Register", userId);
    console.log("Registered connection for user", userId);
  } catch (err) {
    console.error("Register invoke failed:", err);
  }
}

// Compatibility alias: some files import `subscribeUser`
export const subscribeUser = registerUser;

export default {
  startConnection,
  stopConnection,
  onNotificationReceived,
  offNotificationReceived,
  registerUser,
  subscribeUser
};