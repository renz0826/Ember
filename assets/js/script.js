/* ==========================================
                  MAIN SCRIPT 
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Pre-define headers 
  const HEADERS = new Map([
    ["Home", {
      title: "Home",
      description: "A warm overview of your active capsules, upcoming unseals, and recent memories."
    }],
    ["Preserve a Moment", {
      title: "Preserve a Moment",
      description: "Create a new capsule — write, upload, and set a future unseal date."
    }],
    ["Edit Your Moment", {
      title: "Edit Your Moment",
      description: "Edit capsule content, change unlock date, or update attachments before sealing."
    }],
    ["My Moments", {
      title: "My Moments",
      description: "Access your saved and sealed capsules — view, edit, or reopen."
    }],
  ]);

  /* ==========================================
            HEADER RENDERING LOGIC
   ========================================== */

  function renderHeaderInfo(title) {
    const pageHeaderContainer = document.getElementById("pageHeader");
    const rootElement = document.documentElement; // For dataset access

    if (!pageHeaderContainer) return;

    // Checks static map first
    const page = HEADERS.get(title);

    if (page) {
      pageHeaderContainer.innerHTML = `
        <h3>${page.title}</h3>
        <p style="color: var(--color-gray)">${page.description}</p>
      `;
    }
    // If not static, check for dynamic overrides from PHP
    else {
      const { title: dynamicTitle, description: dynamicDesc = "" } = rootElement.dataset;

      if (dynamicTitle) {
        pageHeaderContainer.innerHTML = `
          <h2>${dynamicTitle}</h2>
          <small style="color: var(--color-gray)">${dynamicDesc}</small>
        `;
      } else {
        pageHeaderContainer.innerHTML = `<p>Info not found</p>`;
      }
    }
  }

  // Initial call for header
  if (pageHeaderContainer) {
    renderHeaderInfo(rootElement.dataset.title);
  }

  /* ==========================================
                  FILE UPLOAD LOGIC
     ========================================== */

  const fileInput = document.getElementById("moment_media");
  const customButton = document.getElementById("upload_media");
  const fileStatus = document.getElementById("file_status");
  const canvas = document.getElementById("canvas");

  if (customButton && fileInput) {
    // Open file dialog when custom button is clicked
    customButton.addEventListener("click", () => fileInput.click());

    // Handles file selection
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      const hasFile = fileInput.files.length > 0;

      // Update status text and clear canvas if needed
      if (fileStatus) {
        fileStatus.textContent = hasFile ? "" : "No file chosen";
      }

      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Always clear on change

        if (hasFile && file.type.startsWith("image/")) {
          // Draw Image to Canvas
          const reader = new FileReader();

          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              // Center crop logic
              const size = Math.min(img.width, img.height);
              const sx = (img.width - size) / 2;
              const sy = (img.height - size) / 2;

              ctx.drawImage(
                img, sx, sy, size, size, // Source (center crop)
                0, 0, canvas.width, canvas.height // Destination (full canvas)
              );
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }

  /* ==========================================
            FILTER LOGIC (SEAL/UNSEAL)
     ========================================== */

  const btnSealed = document.getElementById("filter-sealed");
  const btnUnsealed = document.getElementById("filter-unsealed");
  const allMoments = document.querySelectorAll(".moment_container");

  if (btnSealed && btnUnsealed) {
    const activeClass = "button_small";
    const inactiveClass = "button_no_fill_small";

    function setActiveButton(activeBtn, inactiveBtn) {
      activeBtn.classList.remove(inactiveClass);
      activeBtn.classList.add(activeClass);

      inactiveBtn.classList.remove(activeClass);
      inactiveBtn.classList.add(inactiveClass);
    }

    function filterMoments(status) {
      const isSealed = status === "sealed";
      
      allMoments.forEach((moment) => {
        // Use a single line to determine display style
        const display = moment.dataset.status === status ? "block" : "none";
        moment.style.display = display;

        // Logic to show/hide the edit button
        const editBtn = moment.querySelector("a.action");
        if (editBtn) {
          // Edit button is only visible for 'sealed' moments that are currently being shown
          editBtn.style.display = (isSealed && display === "block") ? "" : "none";
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

    // Initial load: Check the class of btnSealed to set the initial filter state
    // Run filterMoments only if allMoments exist to prevent errors
    if (allMoments.length > 0) {
      if (btnSealed.classList.contains(activeClass)) {
        filterMoments("sealed");
      } else {
        filterMoments("unsealed");
      }
    }
  }

  /* ==========================================
               POPUP/MODAL LOGIC
     ========================================== */


  // Uses event delegation for better performance and future-proofing
  document.body.addEventListener("click", (e) => {
    // Check for Open Button
    const openButton = e.target.closest(".action[data-moment-id]");
    if (openButton) {
      e.preventDefault();
      const momentId = openButton.dataset.momentId;
      const popUp = document.getElementById(`modal-${momentId}`);
      if (popUp) {
        popUp.style.display = "flex";
      }
      return; // Handled click, exit
    }

    // Check for close button
    const closeButton = e.target.closest(".close-modal-btn");
    if (closeButton) {
      e.preventDefault();
      // Find the closest parent with the modal class
      const modal = closeButton.closest(".delete-modal"); 
      if (modal) {
        modal.style.display = "none";
      }
    }
  });

});