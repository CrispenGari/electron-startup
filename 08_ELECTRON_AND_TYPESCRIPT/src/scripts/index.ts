console.log("Hello electron.ts from renderer.");

//@ts-expect-error
document.querySelector("h2").innerText = "Cors Count: " + api.threads;
