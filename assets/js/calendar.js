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
const CLIENT_ID = "409681759338-7ei6hol6qsbfhakjbve1jp2mbg6ct9qk.apps.googleusercontent.com";
const API_KEY = "AIzaSyDT-iOvQSyMCMswPI94LQBPg8Afibdje28";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function signIn() {
    return gapi.auth2.getAuthInstance().signIn();
}

gapi.load('client:auth2', initClient);

function gapiInit() {
    gapi.load("client:auth2",  () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
        });
    });
}

// Takes User input
const startDate = document.getElementById("startDate").value;
const startTime = document.getElementById("startTime").value;

const endDate = document.getElementById("endDate").value;
const endTime = document.getElementById("endTime").value;

const capsuleName = document.getElementById("capsuleName").value;

// Converts into Google Calendar ISO format
const startDatetime = `{startDate}T${startTime}:00`;
const endDateTime = `{endDate}T${endTime}:00`;

async function addCalendarEvent() {
  await signIn(); // ← required
  // Create Event 
  function addCalendarEvent() {
    gapi.client.calendar.events.insert({
      calendarId: "primary",
        resource: {
          summary: capsuleName,
          start: {
            dateTime: startDatetime,
            //timezone:  
          },
          end: {
            dateTime: endDateTime,
            //timezone
          }
        }
      }).then(res => {
        console.log("Capsule Sealed!", res.result);
    });
  }
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
