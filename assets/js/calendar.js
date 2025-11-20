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
