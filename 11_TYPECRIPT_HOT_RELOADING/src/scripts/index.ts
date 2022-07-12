console.log("Hello electron.ts from renderer.");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Cors Count: ", api.threads);
  console.log("System Version: ", await api.getSystemVersion(""));
});
