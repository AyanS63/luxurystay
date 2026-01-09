import { io } from "socket.io-client";

// Connect to the server
const socket = io("http://localhost:5000");

console.log("Attempting to connect to socket server...");

socket.on("connect", async () => {
  console.log("✅ Socket connected successfully. ID:", socket.id);

  // Trigger the test notification via the API
  console.log("Triggering test notification via API...");
  try {
    const response = await fetch("http://localhost:5000/api/test-notification", {
      method: "POST",
    });
    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("❌ Failed to call API:", error.message);
  }
});

socket.on("new_booking", (data) => {
  console.log("✅ RECEIVED EVENT: new_booking");
  console.log("Data:", data);
  console.log("TEST PASSED. Closing connection.");
  socket.close();
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
  process.exit(1);
});

// Timeout if nothing happens
setTimeout(() => {
  console.error("❌ Timeout: Did not receive event within 10 seconds.");
  socket.close();
  process.exit(1);
}, 10000);
