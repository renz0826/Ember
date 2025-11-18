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

    if (page) {
      container.innerHTML = `
      <h2>${page.title}</h2>
      <p style="color: var(--color-gray)">${page.description}</p>
    `;
    } else {
      container.innerHTML = `<p>Info not found</p>`;
    }
  }

  const titleFromPHP = document.documentElement.dataset.title;
  renderHeaderInfo(titleFromPHP);
});

const fileInput = document.getElementById("moment_media");
const customButton = document.getElementById("upload_media");
const fileStatus = document.getElementById("file_status");

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

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
