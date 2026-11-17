/* NEW: Configure PDF.js worker */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const fileInput = document.querySelector("#fileInput");
const previewContainer = document.querySelector("#previewContainer");

let files = [];

fileInput.addEventListener("change", (event) => {
  files = Array.from(event.target.files);

  // CHANGED: async added to handle PDF rendering
  files.forEach(async (file) => {
    // Create a file URL
    const fileURL = URL.createObjectURL(file);

    //  Create the common file card
    const fileCard = document.createElement("div");
    fileCard.classList.add("file-card");

    // Create remove button for both file types
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", () => {
      files = files.filter((f) => f !== file);

      fileCard.remove();

      // Update actual FileList rather than DOM
      const dataTransfer = new DataTransfer();

      files.forEach((file) => {
        dataTransfer.items.add(file);
      });

      fileInput.files = dataTransfer.files;

      // Release the temporary file URL
      URL.revokeObjectURL(fileURL);
    });
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = fileURL;

      fileCard.appendChild(img);
    } else if (file.type === "application/pdf") {
      // Create canvas for PDF thumbnail
      const canvas = document.createElement("canvas");

      // Load the PDF
      try {
        const pdf = await pdfjsLib.getDocument(fileURL).promise;

        // Get the first page
        const page = await pdf.getPage(1);

        // Calculate page dimensions
        const originalViewport = page.getViewport({ scale: 1 });

        const scale = 180 / originalViewport.width;

        const viewport = page.getViewport({ scale });

        // Set canvas dimensions
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Get canvas drawing context
        const context = canvas.getContext("2d");

        // Render PDF page onto canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Add canvas to file card
        fileCard.appendChild(canvas);
      } catch (error) {
        console.error("Error loading PDF:", error);
        fileCard.textContent = "Unable to preview PDF";
      }
    }

    // Append common elements
    fileCard.appendChild(removeBtn);
    previewContainer.appendChild(fileCard);
  });
});
