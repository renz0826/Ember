document.addEventListener("DOMContentLoaded", () => {
  const monthYear = document.getElementById("month_year");
  const week = document.querySelector(".calendar_week");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const grid = document.querySelector(".calendar_grid");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let date = new Date();
  let selectedDateObj = null;

  // Get current page title
  const titleFromPHP = document.documentElement.dataset.title;

  // Pages allow interaction
  const allowedPages = ["Preserve a Moment", "Edit Your Moment"];
  const isInteractive = allowedPages.includes(titleFromPHP);

  // Add specific class if interactive (Enables CSS hover/pointer)
  if (isInteractive) {
    grid.classList.add("interactive");
  }

  function renderCalendarUse(title) {
    const setTitle = [
      { title: "Preserve a Moment", useCase: "Seal Until..." },
      { title: "Edit Your Moment", useCase: "Seal Until..." },
    ];
    const setDate = document.getElementById("setDate");
    const page = setTitle.find((c) => c.title === title);

    if (page && setDate) {
      setDate.innerHTML = `
        <h3 style="margin-bottom: 20px">${page.useCase}</h3>
        <hr>
        `;
    }
  }

  renderCalendarUse(titleFromPHP);

  function renderCalendar() {
    grid.innerHTML = "";

    let html = "";
    for (const day of days) {
      html += `<p>${day}</p>`;
    }
    week.innerHTML = html;

    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      grid.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      
      // Always calculate Today
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Only calculate Selected if we are in Interactive Mode
      let isSelected = false;
      if (isInteractive && selectedDateObj) {
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

  // Gate the Click Listener
  grid.addEventListener("click", (e) => {
    // If not on allowed page, stop immediately
    if (!isInteractive) return;

    if (e.target.tagName === "P" && e.target.textContent !== "") {
        const clickedDay = parseInt(e.target.textContent);
        selectedDateObj = new Date(date.getFullYear(), date.getMonth(), clickedDay);
        renderCalendar();
    }
  });

  prevBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
});