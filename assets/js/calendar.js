/* ==========================================
        PART 1: GOOGLE API CONFIGURATION
   ========================================== */

const CLIENT_ID ="409681759338-7ei6hol6qsbfhakjbve1jp2mbg6ct9qk.apps.googleusercontent.com";
const API_KEY = "AIzaSyDT-iOvQSyMCMswPI94LQBPg8Afibdje28";
const DISCOVERY_DOC ="https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;
let gapiInited = false;
let gisInited = false;

/* ==========================================
         PART 2: INITIALIZATION LOGIC
   ========================================== */

// Triggers when window finishes loading
window.onload = function () {
  // 1. Init Custom Calendar
  initCustomCalendar();

  // 2. Init Google Libraries
  // Try-catches prevent crashing if scripts failed to load
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

/* ==========================================
    PART 3: AUTHENTICATION & EVENT CREATION
   ========================================== */

async function handleAuthClick() {
  if (!gapiInited || !gisInited) {
    alert("Google API not ready yet. Please refresh the page.");
    throw new Error("gapi/gis not initialized");
  }

  return new Promise((resolve, reject) => {
    // Setup callback that will run when requestAccessToken completes
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        // User denied consent or error occurred
        console.error("TokenClient callback error:", resp);
        return reject(resp);
      }

      try {
        const res = await createCalendarEvent(); 
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
      // Else token already exists, call createCalendarEvent directly and resolve/reject accordingly
      createCalendarEvent().then(resolve).catch(reject);
    }
  });
}

function convertToISO(dateString, timeString) {
  // dateString = "DD/MM/YYYY" format
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}T${timeString}:00`;
}

async function createCalendarEvent() {
  const capsuleName = document.getElementById("moment_title").value;

  const now = new Date();
  const endDate = document.getElementById("endDate").value;

  if (!endDate) {
    alert("Please fill in all date/time fields.");
    // Returns a rejected promise so upstream `await` can catch it
    return Promise.reject(new Error("Missing fields"));
  }

  const event = {
    summary: capsuleName,
    start: {
      dateTime: `${endDate}T00:00:00+08:00`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: `${endDate}T23:59:00+08:00`,
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
    // Open link in new tab
    if (response && response.result && response.result.htmlLink) {
      window.open(response.result.htmlLink, "_blank");
    }
    return response;
  } catch (err) {
    console.error("Error creating event:", err);
    alert("Failed to create event. Check console for details.");
    throw err; // Debug message
  }
}

async function submitMoment(event) {
  event.preventDefault();

  const btn = document.getElementById("seal_moment");
  if (btn) btn.disabled = true;
  try {
    await handleAuthClick();

    // If successful, submit form to PHP
    document.getElementById("moment_form").submit();
  } catch (err) {
    console.error("Failed to create calendar event:", err);
    alert("Failed to create calendar event. Moment not submitted.");
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Override even if PHP output remains the same
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("seal_moment");
  if (!btn) return;
  btn.onclick = null;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    await submitMoment(e);
  });
});

/* ==========================================
       PART 4: CUSTOM CALENDAR UI LOGIC
   ========================================== */

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

  const container = document.getElementById("calendar");
  if (!container) return; // Stop if no calendar on page

  const titleFromPHP = (container.dataset.title || document.documentElement.dataset.title || "").trim();

  const interactivePages = ["Preserve a Moment", "Edit Your Moment"];
  const isInteractive = interactivePages.includes(titleFromPHP);
  if (isInteractive) grid.classList.add("interactive");

  if (endDateInput?.value) {
    const [y, m, d] = endDateInput.value.split("-");
    if (y && m && d) {
      selectedDateObj = new Date(y, m - 1, d);
      date = new Date(selectedDateObj);
    }
  }

  const setDate = document.getElementById("setDate");
  if (setDate && interactivePages.includes(titleFromPHP)) {
    setDate.innerHTML = `<h3 style="margin-bottom: 20px">Seal Until...</h3><hr>`;
  }

  function renderCalendar() {
    grid.innerHTML = "";
    week.innerHTML = days.map(d => `<p>${d}</p>`).join("");

    const year = date.getFullYear();
    const month = date.getMonth();
    monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    grid.innerHTML = "<div></div>".repeat(firstDay);

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected = selectedDateObj?.getDate() === day && selectedDateObj?.getMonth() === month && selectedDateObj?.getFullYear() === year;
      const cls = [isToday && "today", isSelected && "selected"].filter(Boolean).join(" ");
      grid.innerHTML += `<p class="${cls}">${day}</p>`;
    }
  }

  grid.addEventListener("click", (e) => {
    // Stop immediately if it is a read-only page
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

      // Block if clicked date is earlier than today
      if (clickedDate < today) {
        console.warn("Past dates are not allowed.");
        return;
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
        // Stop immediately if this is a read-only page
        if (!isInteractive) return;

        if (e.target.tagName === "P" && e.target.textContent !== "") {
          const clickedDay = parseInt(e.target.textContent);

          // Update the internal object
          selectedDateObj = new Date(
            date.getFullYear(),
            date.getMonth(),
            clickedDay
          );

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
      }
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

  // Initial Render
  renderCalendar();
}
