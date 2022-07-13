const dragzone = document.querySelector(".dropzone");
const message = document.querySelector("#message");

dragzone.addEventListener("dragover", (e) => {
  e.stopPropagation();
  e.preventDefault();

  message.innerText = "Drop file Here";
  dragzone.style.borderColor = "green";
});
dragzone.addEventListener("dragleave", (e) => {
  e.stopPropagation();
  e.preventDefault();
  message.innerText = "Drag and Drop files only";
  dragzone.style.borderColor = "gray";
});
dragzone.addEventListener("drop", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  dragzone.style.borderColor = "gray";

  if (e.dataTransfer.files.length) {
    message.innerText = e.dataTransfer.files.length + " items selected.";
  }
  for (const item of e.dataTransfer.files) {
    const isFile = await api.isFile(item.path);
    console.log(isFile);
    console.log(item.path);
    // do whatever you want to do with these files
  }
});
