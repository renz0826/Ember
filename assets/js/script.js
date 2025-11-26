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
  ];

  function renderHeaderInfo(title) {
    const container = document.getElementById("pageHeader");

    // 1. Check static list first
    const page = headers.find((c) => c.title === title);

    if (page) {
      container.innerHTML = `
      <h2>${page.title}</h2>
      <p style="color: var(--color-gray)">${page.description}</p>
    `;
    }
    // 2. IF NOT IN STATIC LIST: Check for overrides from PHP (Data Attributes)
    else {
      const dynamicTitle = document.documentElement.dataset.title;
      const dynamicDesc = document.documentElement.dataset.description;

      if (dynamicTitle) {
        container.innerHTML = `
                <h2>${dynamicTitle}</h2>
                <p style="color: var(--color-gray)">${dynamicDesc || ""}</p>
            `;
      } else if (container) {
        container.innerHTML = `<p>Info not found</p>`;
      }
    }
  }

  // Check if pageHeader exists before running
  if (document.getElementById("pageHeader")) {
    const titleFromPHP = document.documentElement.dataset.title;
    renderHeaderInfo(titleFromPHP);
  }
});

/// --- FILE UPLOAD LOGIC ---
const fileInput = document.getElementById("moment_media");
const customButton = document.getElementById("upload_media");
const fileStatus = document.getElementById("file_status");
const canvas = document.getElementById("canvas");

if (customButton && fileInput) {
  // Open file dialog when custom button is clicked
  customButton.addEventListener("click", () => fileInput.click());

  // Handle file selection (Merged logic)
  fileInput.addEventListener("change", () => {
    // 1. Update Status Text
    if (fileInput.files.length > 0) {
      if (fileStatus) fileStatus.textContent = ""; // Clear "No file chosen" text
    } else {
      if (fileStatus) fileStatus.textContent = "No file chosen";
      // Optional: Clear canvas if no file is chosen
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return; // Stop processing if no file
    }

    // 2. Draw Image to Canvas
    if (canvas && fileInput.files[0]) {
      const file = fileInput.files[0];
      const ctx = canvas.getContext("2d");

      // Ensure the selected file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Calculate aspect ratio for center crop (Square)
            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            // Clear and Draw
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
    }
  });
}

// --- FILTER LOGIC (Sealed/Unsealed) ---
document.addEventListener("DOMContentLoaded", () => {
  const btnSealed = document.getElementById("filter-sealed");
  const btnUnsealed = document.getElementById("filter-unsealed");
  const allMoments = document.querySelectorAll(".moment_container");

  if (btnSealed && btnUnsealed) {
    function setActiveButton(activeBtn, inactiveBtn) {
      activeBtn.classList.remove("button_no_fill_small");
      activeBtn.classList.add("button_small");

      inactiveBtn.classList.remove("button_small");
      inactiveBtn.classList.add("button_no_fill_small");
    }

    function filterMoments(status) {
      allMoments.forEach((moment) => {
        if (moment.dataset.status === status) {
          moment.style.display = "block";
        } else {
          moment.style.display = "none";
        }
      });
    }

    btnSealed.addEventListener("click", () => {
      setActiveButton(btnSealed, btnUnsealed);
      filterMoments("sealed");
    });

    btnUnsealed.addEventListener("click", () => {
      setActiveButton(btnUnsealed, btnSealed);
      filterMoments("unsealed");
    });

    if (btnSealed.classList.contains("button_small")) {
      filterMoments("sealed");
    } else {
      filterMoments("unsealed");
    }
  }
});

// --- POPUP LOGIC (Corrected for Classes) ---
document.addEventListener("DOMContentLoaded", function () {
  // Select ALL buttons that have a moment ID attached
  const openButtons = document.querySelectorAll(".action[data-moment-id]"); // Updated selector

  openButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const momentId = this.dataset.momentId;
      const popUp = document.getElementById(`modal-${momentId}`);

      if (popUp) {
        popUp.style.display = "flex";
      }
    });
  });

  const cancelButtons = document.querySelectorAll(".close-modal-btn"); // Updated class selector
  cancelButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const modal = this.closest(".delete-modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });
});
