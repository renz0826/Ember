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
      selectedDateObj = new Date(
        date.getFullYear(),
        date.getMonth(),
        clickedDay
      );

      const year = selectedDateObj.getFullYear();

      const month = String(selectedDateObj.getMonth() + 1).padStart(2, "0");

      const day = String(selectedDateObj.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      // Find the hidden input by ID and set the value
      const endDateInput = document.getElementById("endDate");
      if (endDateInput) {
        endDateInput.value = formattedDate;
        console.log("Open date has been set to ", formattedDate); // Check console for this
      }

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

// Calendar API
const CLIENT_ID =
  "409681759338-7ei6hol6qsbfhakjbve1jp2mbg6ct9qk.apps.googleusercontent.com";
const API_KEY = "AIzaSyDT-iOvQSyMCMswPI94LQBPg8Afibdje28";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function signIn() {
  return gapi.auth2.getAuthInstance().signIn();
}

gapi.load("client:auth2", initClient);

function gapiInit() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
    });
  });
}

// 1. Variable Declaration (Ensure these match your HTML IDs)
const startDateInput = document.getElementById("startDate");
const startTimeInput = document.getElementById("startTime");
const endDateInput = document.getElementById("endDate");
const endTimeInput = document.getElementById("endTime");
const capsuleNameInput = document.getElementById("capsuleName");

// ... (Your API Key and Client ID setup remains the same) ...

async function addCalendarEvent() {
  // 2. Fix: Wait for sign-in to complete before proceeding
  try {
    await gapi.auth2.getAuthInstance().signIn();
  } catch (error) {
    console.error("Error signing in", error);
    return;
  }

  // 3. Fix: format the dates correctly
  // ERROR IN YOUR CODE: You wrote `{startDate}`. It must be `${startDate}`
  const startDatetime = `${startDateInput.value}T${startTimeInput.value}:00`;
  const endDateTime = `${endDateInput.value}T${endTimeInput.value}:00`;

  // 4. Fix: Remove the nested function definition.
  // You had 'function addCalendarEvent' INSIDE 'function addCalendarEvent'.

  const event = {
    summary: capsuleNameInput.value,
    start: {
      dateTime: startDatetime,
      timeZone: "Asia/Manila", // Recommended: Hardcode your timezone or detect it
    },
    end: {
      dateTime: endDateTime,
      timeZone: "Asia/Manila",
    },
  };

  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
    })
    .then((res) => {
      console.log("Capsule Sealed!", res);
      alert("Event created successfully!");
    })
    .catch((err) => {
      console.error("Error creating event", err);
    });
}

// Ex.
// function createEvent() {
//     const event = {
//         summary: "Meeting with Team",
//         location: "Online",
//         description: "Discuss project updates",
//         start: {
//             dateTime: "2025-01-01T10:00:00+08:00",
//             timeZone: "Asia/Manila",
//         },
//         end: {
//             dateTime: "2025-01-01T11:00:00+08:00",
//             timeZone: "Asia/Manila",
//         },
//     };

//     gapi.client.calendar.events.insert({
//         calendarId: "primary",
//         resource: event,
//     }).then(response => {
//         console.log("Event created:", response);
//         alert("Event created! 🎉");
//     });
//}
