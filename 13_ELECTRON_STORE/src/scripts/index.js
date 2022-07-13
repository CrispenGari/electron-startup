document.addEventListener("DOMContentLoaded", async () => {
  console.log(api.cpus);
  await api.getSystemVersion("System Version").then((res) => console.log(res));
});
