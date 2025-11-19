document.addEventListener("DOMContentLoaded", () => {
  const monthYear = document.getElementById("month_year");
  const week = document.querySelector(".calendar_week");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const grid = document.querySelector(".calendar_grid");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let date = new Date();
  
  let selectedDateObj = null;

  function renderCalendarUse(title) {
    const setTitle = [
      {
        title: "Preserve a Moment",
        useCase: "Seal Until...",
      },
      {
        title: "Edit Your Moment",
        useCase: "Seal Until...",
      },
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

  const titleFromPHP = document.documentElement.dataset.title;
  renderCalendarUse(titleFromPHP);

  function renderCalendar() {
    grid.innerHTML = "";

    // for days of the week
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

    // Fill empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      grid.innerHTML += `<div></div>`;
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      
      // Check if it is Today (Grey)
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Check if it is Selected (Highlight)
      let isSelected = false;
      if (selectedDateObj) {
          isSelected = 
            day === selectedDateObj.getDate() &&
            month === selectedDateObj.getMonth() &&
            year === selectedDateObj.getFullYear();
      }

      // Determine classes
      let className = "";
      if (isToday) className += "today ";
      if (isSelected) className += "selected";

      grid.innerHTML += `<p class="${className.trim()}">${day}</p>`;
    }
  }

  // Click event
  grid.addEventListener("click", (e) => {
    
    if (e.target.tagName === "P" && e.target.textContent !== "") {
        const clickedDay = parseInt(e.target.textContent);
        
        // Update object
        selectedDateObj = new Date(date.getFullYear(), date.getMonth(), clickedDay);
        
        // Re-render to apply the highlight class
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