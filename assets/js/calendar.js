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
  if (!gapiInited || !gisInited) {
    alert("Google API not ready yet. Please refresh the page.");
    throw new Error("gapi/gis not initialized");
  }

  return new Promise((resolve, reject) => {
    // Setup callback that will run when requestAccessToken completes
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        // user denied consent or an error occurred
        console.error("TokenClient callback error:", resp);
        return reject(resp);
      }

      try {
        const res = await createCalendarEvent(); // createCalendarEvent must return a promise
        resolve(res);
      } catch (err) {
        reject(err);
      }
    };

    // If there's no token, request access (this must run during user's click gesture)
    if (gapi.client.getToken() === null) {
      try {
        tokenClient.requestAccessToken({ prompt: "consent" });
        // requestAccessToken() will immediately return; resolution happens in tokenClient.callback
      } catch (err) {
        // If requestAccessToken throws synchronously (rare), reject
        reject(err);
      }
    } else {
      // token already exists — call createCalendarEvent directly and resolve/reject accordingly
      createCalendarEvent().then(resolve).catch(reject);
    }
  });
}

function convertToISO(dateString, timeString) {
  // dateString = "DD/MM/YYYY"
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}T${timeString}:00`;
}


async function createCalendarEvent() {
  const capsuleName = document.getElementById("moment_title").value;

  const now = new Date();
  const startDate = now.toLocaleDateString("en-GB"); 
  const startTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const endDate = document.getElementById("endDate").value;
  
  if (!endDate) {
    alert("Please fill in all date/time fields.");
    // Return a rejected Promise so upstream `await` can catch it
    return Promise.reject(new Error("Missing fields"));
  }

  const event = {
    summary: capsuleName,
    start: {
      dateTime: convertToISO(startDate, startTime),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: `${endDate}T00:00:00+08:00`, // already includes offset
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };

  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("Success!", response);
    alert("Event created successfully!");
    // open link in new tab
    if (response && response.result && response.result.htmlLink) {
      window.open(response.result.htmlLink, "_blank");
    }
    return response;
  } catch (err) {
    console.error("Error creating event:", err);
    alert("Failed to create event. Check console for details.");
    throw err; // for debug
  }
}

async function submitMoment(event) {
  event.preventDefault(); 

  const btn = document.getElementById("seal_moment");
  if (btn) btn.disabled = true;
  try {
    await handleAuthClick();

    // success -> now submit form to PHP
    document.getElementById("moment_form").submit();

  } catch (err) {
    console.error("Failed to create calendar event:", err);
    alert("Failed to create calendar event. Moment not submitted.");
  } finally {
    if (btn) btn.disabled = false;
  }
}

// override even if PHP output stays the same
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("seal_moment");
  if (!btn) return;
  // remove inline onclick (optional)
  btn.onclick = null;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    await submitMoment(e); // uses the same function above
  });
});

// ==========================================
// PART 4: CUSTOM CALENDAR UI LOGIC
// ==========================================

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
  // Fix: Added .trim() to remove accidental whitespace from PHP output
  const rawTitle =
    container.dataset.title || document.documentElement.dataset.title || "";
  const titleFromPHP = rawTitle.trim();

  // Define pages where the user can CLICK to change the date
  const interactivePages = ["Preserve a Moment", "Edit Your Moment"];
  const isInteractive = interactivePages.includes(titleFromPHP);

  // Add class for CSS styling (cursor pointer, hover effects)
  if (isInteractive) {
    grid.classList.add("interactive");
  }

  // --- 2. PRE-LOAD DATE (Fix for Edit/View Pages) ---
  if (endDateInput && endDateInput.value) {
    const parts = endDateInput.value.split("-");
    if (parts.length === 3) {
      // Create date (Note: Month is 0-indexed in JS)
      selectedDateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      // Move the calendar view to the month of the selected date
      date = new Date(selectedDateObj);
    }
  }

  // --- 3. HEADER TEXT LOGIC ---
  function renderCalendarUse(title) {
    const setDate = document.getElementById("setDate");
    if (!setDate) return; // Safety check

    // Fix: Use the array check instead of hardcoded strings
    if (interactivePages.includes(title)) {
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

      // Check for "Selected"
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
    // Stop immediately if this is a Read-Only page
    if (!isInteractive) return;

    if (e.target.tagName === "P" && e.target.textContent !== "") {
      const clickedDay = parseInt(e.target.textContent);

      // Build the clicked date object
    const clickedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      clickedDay
    );

    // Build today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // BLOCK if clicked date is earlier than today
    if (clickedDate < today) {
      console.warn("Past dates are not allowed.");
      return; // STOP here (do not set endDate)
    }

    // Continue as normal (valid future or today)
    selectedDateObj = clickedDate;

    const year = selectedDateObj.getFullYear();
    const month = String(selectedDateObj.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDateObj.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    // Set hidden input
    const endDateInput = document.getElementById("endDate");
    if (endDateInput) {
      endDateInput.value = formattedDate;
      console.log("Open date has been set to", formattedDate);
    // Stop immediately if this is a Read-Only page
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
      }

      // Re-render to show the new blue block
      renderCalendar();
    }

    renderCalendar();
    }}
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
