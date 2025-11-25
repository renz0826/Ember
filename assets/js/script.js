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
      description:
        "Look back on the memories you’ve held close.",
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
  if (titleFromPHP) renderHeaderInfo(titleFromPHP);
});

const fileInput = document.getElementById("moment_media");
const customButton = document.getElementById("upload_media");
const fileStatus = document.getElementById("file_status");
const canvas = document.getElementById("canvas");

if (customButton && fileInput) {
  customButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      if (fileStatus) fileStatus.textContent = "";
    } else {
      if (fileStatus) fileStatus.textContent = "No file chosen";
    }
  });

  if (canvas) {
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
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnSealed = document.getElementById("filter-sealed");
  const btnUnsealed = document.getElementById("filter-unsealed");
  const allMoments = document.querySelectorAll(".moment_container");

  if (btnSealed && btnUnsealed) {
    
    // Switch button visual style
    function setActiveButton(activeBtn, inactiveBtn) {
      activeBtn.classList.remove("button_no_fill_small");
      activeBtn.classList.add("button_small");
      
      inactiveBtn.classList.remove("button_small");
      inactiveBtn.classList.add("button_no_fill_small");
    }

    // Hide/Show items based on data-status
    function filterMoments(status) {
      allMoments.forEach((moment) => {
        // If the status = the button, show it
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