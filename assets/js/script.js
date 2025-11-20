document.addEventListener("DOMContentLoaded", () => {
  const headers = [
    {
      title: "Home",
      description:
        "A warm overview of your active capsules, upcoming unseals, and recent memories.",
    },
    {
      title: "Preserve a Moment",
      description:
        "Create a new capsule — write, upload, and set a future unseal date.",
    },
    {
      title: "Edit Your Moment",
      description:
        "Edit capsule content, change unlock date, or update attachments before sealing.",
    },
    {
      title: "My Moments",
      description:
        "Access your saved and sealed capsules — view, edit, or reopen.",
    },
    {
      title: "Moments Last",
      description: "Look back on the memories you’ve held close.",
    },
  ];

  function renderHeaderInfo(title) {
    const container = document.getElementById("pageHeader");
    const page = headers.find((c) => c.title === title);

    if (page && container) {
      container.innerHTML = `
      <h2>${page.title}</h2>
      <p style="color: var(--color-gray)">${page.description}</p>
    `;
    } else if (container) {
      container.innerHTML = `<p>Info not found</p>`;
    }
  }

  const titleFromPHP = document.documentElement.dataset.title;
  renderHeaderInfo(titleFromPHP);

  const sealedBtn = document.getElementById("sealed-button");
  const unsealedBtn = document.getElementById("unsealed-button");

  // Sealed or Unsealed Logic
  if (sealedBtn && unsealedBtn) {
    sealedBtn.addEventListener("click", (e) => {
      e.preventDefault();

      sealedBtn.classList.add("button_small");
      sealedBtn.classList.remove("button_no_fill_small");

      unsealedBtn.classList.add("button_no_fill_small");
      unsealedBtn.classList.remove("button_small");
    });

    unsealedBtn.addEventListener("click", (e) => {
      e.preventDefault();

      unsealedBtn.classList.add("button_small");
      unsealedBtn.classList.remove("button_no_fill_small");

      sealedBtn.classList.add("button_no_fill_small");
      sealedBtn.classList.remove("button_small");
    });
  }
});

const fileInput = document.getElementById("moment_media");
const customButton = document.getElementById("upload_media");
const fileStatus = document.getElementById("file_status");
const canvas = document.getElementById("canvas");

if (fileInput && customButton && fileStatus && canvas) {
  const ctx = canvas.getContext("2d");

  // Open file dialog when custom button is clicked
  customButton.addEventListener("click", () => fileInput.click());

  // Show selected file name
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileStatus.textContent = "";
    } else {
      fileStatus.textContent = "No file chosen";
    }
  });

  // Handle Image Preview on Canvas
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Crop center square
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img,
            sx,
            sy,
            size,
            size,
            0,
            0,
            canvas.width,
            canvas.height
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}