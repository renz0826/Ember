document.addEventListener("DOMContentLoaded", () => {
  const monthYear = document.getElementById("month_year");
  const week = document.querySelector(".calendar_week");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const grid = document.querySelector(".calendar_grid");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let date = new Date();

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

    if (page) {
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
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      grid.innerHTML += `<p class="${isToday ? "today" : ""}">${day}</p>`;
    }
  }

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
