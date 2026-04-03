const deadlines = [
  {
    title: "11+ registration opens",
    date: "2026-05-01",
    note: "Set a same-day reminder and submit early to avoid last-minute issues.",
  },
  {
    title: "11+ registration closes",
    date: "2026-06-30",
    note: "Critical hard deadline from policy (late applications have constraints).",
  },
  {
    title: "Test invitation packs start",
    date: "2026-08-10",
    note: "Check emails/post daily after this date.",
  },
  {
    title: "Chase Warwickshire Admissions if no invitation pack",
    date: "2026-08-17",
    note: "Contact elevenplus@warwickshire.gov.uk if no pack received by 14 Aug.",
  },
  {
    title: "11+ test month starts",
    date: "2026-09-01",
    note: "Keep the whole month clear until your allocated test date is confirmed.",
  },
  {
    title: "Secondary school preference deadline",
    date: "2026-10-31",
    note: "Submit your Common Application Form to your local authority.",
  },
  {
    title: "National Offer Day",
    date: "2027-03-01",
    note: "Offers released by your local authority.",
  },
];

const powerMoves = [
  "Register on day 1 and keep PDF/email proof of submission.",
  "Book weekly prep slots (Maths, English, VR, NVR) until test date.",
  "Take one timed mixed-paper every weekend from June 2026.",
  "Attend school open events and log questions about admissions evidence.",
  "Prepare proof-of-address documents in case you move into catchment.",
  "Shortlist 8-12 realistic properties and set alerts in all three portals.",
  "Track commute times to Lawrence Sheriff School at school-run hours.",
];

const deadlineList = document.getElementById("deadlineList");
const powerMovesContainer = document.getElementById("powerMoves");

function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(`${dateStr}T00:00:00`);
  const ms = target - new Date(now.toISOString().slice(0, 10));
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function renderDeadlines() {
  deadlineList.innerHTML = "";
  deadlines.forEach((d) => {
    const diff = daysUntil(d.date);
    const item = document.createElement("div");
    item.className = `deadline-item ${diff >= 0 && diff <= 45 ? "soon" : ""}`;
    item.innerHTML = `
      <div><strong>${d.title}</strong> <span class="tag">${d.date}</span></div>
      <div>${d.note}</div>
      <div class="small">${diff < 0 ? `${Math.abs(diff)} days ago` : `${diff} days left`}</div>
    `;
    deadlineList.appendChild(item);
  });
}

function renderPowerMoves() {
  const state = JSON.parse(localStorage.getItem("powerMovesState") || "{}");
  powerMovesContainer.innerHTML = "";
  powerMoves.forEach((task, idx) => {
    const wrapper = document.createElement("label");
    wrapper.className = `check-item ${state[idx] ? "done" : ""}`;
    wrapper.innerHTML = `
      <input type="checkbox" ${state[idx] ? "checked" : ""} data-index="${idx}" />
      ${task}
    `;
    powerMovesContainer.appendChild(wrapper);
  });

  powerMovesContainer.querySelectorAll("input").forEach((cb) => {
    cb.addEventListener("change", () => {
      state[cb.dataset.index] = cb.checked;
      localStorage.setItem("powerMovesState", JSON.stringify(state));
      renderPowerMoves();
    });
  });
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Notification permission denied.");
    return;
  }

  const upcoming = deadlines.filter((d) => {
    const diff = daysUntil(d.date);
    return diff >= 0 && diff <= 14;
  });

  if (!upcoming.length) {
    new Notification("No deadlines in the next 14 days", {
      body: "You’re ahead. Keep your prep cadence going.",
    });
    return;
  }

  upcoming.forEach((item) => {
    new Notification(`LSS Reminder: ${item.title}`, {
      body: `${item.date} • ${item.note}`,
    });
  });
}

function makeICS() {
  const events = deadlines
    .map(
      (d) => `BEGIN:VEVENT
DTSTART;VALUE=DATE:${d.date.replaceAll("-", "")}
DTEND;VALUE=DATE:${d.date.replaceAll("-", "")}
SUMMARY:${d.title}
DESCRIPTION:${d.note}
END:VEVENT`
    )
    .join("\n");

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LSS Planner//EN
${events}
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lss-2027-deadlines.ics";
  link.click();
  URL.revokeObjectURL(url);
}

function createListings(event) {
  event.preventDefault();
  const area = encodeURIComponent(document.getElementById("area").value.trim());
  const minBudget = document.getElementById("minBudget").value || "0";
  const maxBudget = document.getElementById("maxBudget").value;
  const bedrooms = document.getElementById("bedrooms").value || "3";
  const radius = document.getElementById("radius").value || "10";

  const links = [
    {
      name: "Rightmove",
      url: `https://www.rightmove.co.uk/property-for-sale/find.html?searchLocation=${area}&minPrice=${minBudget}&maxPrice=${maxBudget}&minBedrooms=${bedrooms}&radius=${radius}`,
    },
    {
      name: "OnTheMarket",
      url: `https://www.onthemarket.com/for-sale/property/${area}/?min-price=${minBudget}&max-price=${maxBudget}&min-bedrooms=${bedrooms}&view=map-list`,
    },
    {
      name: "Zoopla",
      url: `https://www.zoopla.co.uk/for-sale/property/${area}/?price_min=${minBudget}&price_max=${maxBudget}&beds_min=${bedrooms}&radius=${radius}`,
    },
  ];

  document.getElementById("listingLinks").innerHTML = links
    .map(
      (l) =>
        `<a href="${l.url}" target="_blank" rel="noreferrer">Open ${l.name} search ↗</a>`
    )
    .join("");
}

document.getElementById("notifyBtn").addEventListener("click", enableNotifications);
document.getElementById("calendarBtn").addEventListener("click", makeICS);
document.getElementById("listingForm").addEventListener("submit", createListings);

renderDeadlines();
renderPowerMoves();
