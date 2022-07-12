document.addEventListener("DOMContentLoaded", () => {
  setInterval(async () => {
    await api.getSystemVersion("System Version").then((res) => {
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
    api.closeApp("close-app");
  });
});
