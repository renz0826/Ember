// ==========================================
// PART 1: GOOGLE API CONFIGURATION
// ==========================================
const CLIENT_ID =
  "409681759338-7ei6hol6qsbfhakjbve1jp2mbg6ct9qk.apps.googleusercontent.com";
const API_KEY = "AIzaSyDT-iOvQSyMCMswPI94LQBPg8Afibdje28";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;
let gapiInited = false;
let gisInited = false;

// ==========================================
// PART 2: INITIALIZATION LOGIC
// ==========================================

// Triggered when window finishes loading
window.onload = function () {
  // 1. Init Custom Calendar
  initCustomCalendar();

  // 2. Init Google Libraries
  // We use try-catch to prevent crashing if scripts failed to load
  try {
    gapi.load("client", initializeGapiClient);
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // Defined later in handleAuthClick
    });
    gisInited = true;
    console.log("Google Identity Services (GIS) Loaded");
  } catch (err) {
    console.error(
      "Error loading Google Scripts. Check your network or API keys.",
      err
    );
  }
};

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  console.log("GAPI Client Loaded");
}

// ==========================================
// PART 3: AUTHENTICATION & EVENT CREATION
// ==========================================

async function handleAuthClick() {
  // Safety Check
  if (!gapiInited || !gisInited) {
    alert("Google API not ready yet. Please refresh the page.");
    return;
  }

  tokenClient.callback = async (resp) => {
    if (resp.error) {
      throw resp;
    }
    await createCalendarEvent();
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    await createCalendarEvent();
  }
}

async function createCalendarEvent() {
  const capsuleName = document.getElementById("capsuleName").value;
  const startDate = document.getElementById("startDate").value;
  const startTime = document.getElementById("startTime").value;
  const endDate = document.getElementById("endDate").value;
  const endTime = document.getElementById("endTime").value;

  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Please fill in all date/time fields.");
    return;
  }

  const event = {
    summary: capsuleName,
    start: {
      dateTime: `${startDate}T${startTime}:00`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: `${endDate}T${endTime}:00`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };

  try {
    const request = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("Success!", request);
    alert("Event created successfully!");
    window.open(request.result.htmlLink, "_blank");
  } catch (err) {
    console.error("Error creating event:", err);
    alert("Failed to create event. Check console for details.");
  }
}

// ==========================================
// PART 4: CUSTOM CALENDAR UI LOGIC
// ==========================================

function initCustomCalendar() {
  const monthYear = document.getElementById("month_year");
  const week = document.querySelector(".calendar_week");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const grid = document.querySelector(".calendar_grid");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let date = new Date();

  // Handle Title Logic
  const container = document.getElementById("calendar");
  // Fallback if dataset is empty
  const titleFromPHP = container.dataset.title || "Preserve a Moment";

  function renderCalendarUse(title) {
    const setTitle = [
      { title: "Preserve a Moment", useCase: "Seal Until..." },
      { title: "Edit Your Moment", useCase: "Seal Until..." },
    ];
    const setDate = document.getElementById("setDate");
    const page = setTitle.find((c) => c.title === title);

    if (page) {
      setDate.innerHTML = `<h3 style="margin-bottom: 20px">${page.useCase}</h3><hr>`;
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
}
