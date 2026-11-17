const fileInput = document.querySelector("#fileInput");
const previewContainer = document.querySelector("#previewContainer");

let files = [];
fileInput.addEventListener("change", (event) => {
  files = Array.from(event.target.files);
  files.forEach((file) => {
    const fileURL = URL.createObjectURL(file);
    const fileCard = document.createElement("div");
    fileCard.classList.add("file-card");
    const img = document.createElement("img");
    img.src = fileURL;
    //remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      files = files.filter((f) => f !== file);
      fileCard.remove();
      const dataTransfer = new DataTransfer();
      files.forEach((file) => {
        dataTransfer.items.add(file);
      });
      fileInput.files = dataTransfer.files;
    });
    fileCard.appendChild(img);
    fileCard.appendChild(removeBtn);
    previewContainer.appendChild(fileCard);
  });
});
