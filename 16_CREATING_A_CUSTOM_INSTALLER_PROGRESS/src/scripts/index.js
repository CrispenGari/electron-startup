const loadingTemplate = document.querySelector("[loading-template]");
const appTemplate = document.querySelector("[main-app-template]");

api.on("install/progress", (progress) => {
  if (progress >= 100) {
    document.body.innerHTML = "";
    document.body.appendChild(appTemplate.content.cloneNode(true));
    setInterval(async () => {
      await api.getCurrentLoad("System Version").then((res) => {
        const h1 = document.querySelector("h1");
        if (res > 50) {
          h1.style.color = "red";
        } else {
          h1.style.color = "cornflowerblue";
        }
        h1.innerText = res + "%";
      });
    }, 1000);
    document.querySelector(".close__btn").addEventListener("click", () => {
      alert("clicked");
      api.closeApp("close-app");
    });
  } else {
    document.body.appendChild(loadingTemplate.content.cloneNode(true));
  }
});
