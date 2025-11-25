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

function convertToISO(dateStr, timeStr) {
  const [day, month, year] = dateStr.split("/");
  const isoString = new Date(`${year}-${month}-${day}T${timeStr}:00`).toISOString();
  return isoString;
}


async function createCalendarEvent() {
  const capsuleName = document.getElementById("capsuleName").value;

  // Get current date in DD-MM-YYYY format
  const now = new Date();
  const startDate = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const startTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const endDate = document.getElementById("endDate").value;
  const endTime = document.getElementById("endTime").value;

  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Please fill in all date/time fields.");
    return;
  }

  const event = {
    summary: capsuleName,
    start: {
      dateTime: convertToISO(startDate, startTime),
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
}
