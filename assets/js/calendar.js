document.addEventListener("DOMContentLoaded", () => {
  initCustomCalendar();
});

function initCustomCalendar() {
  const monthYear = document.getElementById("month_year");
  const week = document.querySelector(".calendar_week");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const grid = document.querySelector(".calendar_grid");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // Input field that stores the date for the database
  const endDateInput = document.getElementById("endDate");

  let date = new Date();
  let selectedDateObj = null;

  // --- 1. SETUP & PERMISSIONS ---
  const container = document.getElementById("calendar");
  if (!container) return; // Stop if no calendar on page

  // Get page title to determine behavior
  // We check the container first, then fallback to the document title
  const titleFromPHP =
    container.dataset.title || document.documentElement.dataset.title || "";

  // Define pages where the user can CLICK to change the date
  const interactivePages = ["Preserve a Moment", "Edit Your Moment"];
  const isInteractive = interactivePages.includes(titleFromPHP);

  // Add class for CSS styling (cursor pointer, hover effects)
  if (isInteractive) {
    grid.classList.add("interactive");
  }

  // --- 2. PRE-LOAD DATE (Fix for Edit/View Pages) ---
  // If the hidden input has a value (e.g. "2025-11-30"), load it immediately.
  if (endDateInput && endDateInput.value) {
    const parts = endDateInput.value.split("-");
    if (parts.length === 3) {
      // Create date (Note: Month is 0-indexed in JS, so subtract 1)
      // Format: Year, MonthIndex, Day
      selectedDateObj = new Date(parts[0], parts[1] - 1, parts[2]);

      // Move the calendar view to the month of the selected date
      date = new Date(selectedDateObj);
    }
  }

  // --- 3. HEADER TEXT LOGIC ---
  function renderCalendarUse(title) {
    const setDate = document.getElementById("setDate");
    if (!setDate) return;

    // Customize header based on page
    if (title === "Preserve a Moment" || title === "Edit Your Moment") {
      setDate.innerHTML = `
        <h3 style="margin-bottom: 20px">Seal Until...</h3>
        <hr>
        `;
    } else {
      // Default or View Page
      setDate.innerHTML = "";
    }
  }

  renderCalendarUse(titleFromPHP);

  // --- 4. RENDER FUNCTION ---
  function renderCalendar() {
    grid.innerHTML = "";

    // Render Weekdays
    let html = "";
    for (const day of days) {
      html += `<p>${day}</p>`;
    }
    week.innerHTML = html;

    // Update Month/Year Text
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Calculate Days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      grid.innerHTML += `<div></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();

      // Check for "Today"
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Check for "Selected" (The blue highlight)
      // We highlight if a selectedDateObj exists, regardless of page type
      let isSelected = false;
      if (selectedDateObj) {
        isSelected =
          day === selectedDateObj.getDate() &&
          month === selectedDateObj.getMonth() &&
          year === selectedDateObj.getFullYear();
      }

      let className = "";
      if (isToday) className += "today ";
      if (isSelected) className += "selected";

      grid.innerHTML += `<p class="${className.trim()}">${day}</p>`;
    }
  }

  // --- 5. CLICK LISTENER (Gated by Interactivity) ---
  grid.addEventListener("click", (e) => {
    // Stop immediately if this is a Read-Only page (View Moment)
    if (!isInteractive) return;

    if (e.target.tagName === "P" && e.target.textContent !== "") {
      const clickedDay = parseInt(e.target.textContent);

      // Update the internal object
      selectedDateObj = new Date(
        date.getFullYear(),
        date.getMonth(),
        clickedDay
      );

      // --- UPDATE HIDDEN INPUT FOR DATABASE ---
      const year = selectedDateObj.getFullYear();
      const month = String(selectedDateObj.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDateObj.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      if (endDateInput) {
        endDateInput.value = formattedDate;
        // console.log("Date updated to:", formattedDate);
      }

      // Re-render to show the new blue block
      renderCalendar();
    }
  });

  // --- 6. NAVIGATION LISTENERS ---
  prevBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  });

  // Initial Render
  renderCalendar();
}
