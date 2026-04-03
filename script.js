const KEY_DATES = [
  { title: '11+ registration opens', date: '2026-05-01', type: 'deadline' },
  { title: '11+ registration closes', date: '2026-06-30', type: 'deadline' },
  { title: 'Invitation packs begin', date: '2026-08-10', type: 'milestone' },
  { title: 'Chase pack if not received', date: '2026-08-17', type: 'action' },
  { title: '11+ exam month begins', date: '2026-09-01', type: 'exam' },
  { title: 'CAF deadline', date: '2026-10-31', type: 'deadline' },
  { title: 'National Offer Day', date: '2027-03-01', type: 'offer' },
  { title: 'Target school start (Year 7)', date: '2027-09-01', type: 'start' },
];

const DASHBOARD_TARGETS = [
  { id: 'exam', label: 'Exam Month Starts', date: '2026-09-01' },
  { id: 'reg_close', label: 'Registration Closes', date: '2026-06-30' },
  { id: 'caf', label: 'CAF Deadline', date: '2026-10-31' },
  { id: 'offer', label: 'Offer Day', date: '2027-03-01' },
];

const STUDY_PLAN = [
  { month: 'Month 1', items: ['Baseline assessment in English/VR, NVR, Maths', 'Create weekly timetable: 50% English/VR, 25% NVR, 25% Maths', 'Start vocabulary and comprehension log'] },
  { month: 'Month 2', items: ['2 timed English/VR sets per week', '1 timed NVR set per week', '1 timed Maths set per week'] },
  { month: 'Month 3', items: ['Increase mixed-topic timed sessions to 3 weekly', 'Review and patch weak topics from error log', 'Begin pressure practice (strict timings)'] },
  { month: 'Month 4', items: ['Sit full-length mock every 2 weeks', 'Analyse mock performance by section weighting', 'Refine exam-day routine'] },
  { month: 'Month 5', items: ['Weekly full mock under exam conditions', 'Focus on speed + accuracy drills', 'Consolidate high-yield topics'] },
  { month: 'Month 6', items: ['Final revision cycle based on error patterns', 'Lighter workload week before test date', 'Pack exam essentials and route-check test centre'] },
];

const PRIORITY_RADIUS_MILES = 10.004;

const POWER_MOVES = [
  'Submit registration early and save proof immediately.',
  'Track all admissions emails in one dedicated inbox label/folder.',
  'Prepare proof-of-address documents in case you move into catchment.',
  'Use weighted prep hours: 50% English/VR, 25% NVR, 25% Maths.',
  'Build a shortlist of realistic backup schools before CAF submission.',
  'Set price-drop and new-listing alerts on all three property portals.',
  'Do test-centre dry run at school-run traffic time.',
  'Maintain calm routine: sleep, nutrition, and light revision before exam.',
];

const countdownCards = document.getElementById('countdownCards');
const timeline = document.getElementById('timeline');
const studyPlanEl = document.getElementById('studyPlan');
const powerMovesEl = document.getElementById('powerMoves');
const budgetSlider = document.getElementById('budgetSlider');
const budgetOutput = document.getElementById('budgetOutput');
const readinessScoreEl = document.getElementById('readinessScore');
const readinessBarEl = document.getElementById('readinessBar');
const riskStatusEl = document.getElementById('riskStatus');
const riskBarEl = document.getElementById('riskBar');
const weeklyHoursEl = document.getElementById('weeklyHours');
const splitOutputEl = document.getElementById('splitOutput');
const parentNotesEl = document.getElementById('parentNotes');

function diffParts(targetDate) {
  const now = new Date();
  const target = new Date(`${targetDate}T00:00:00`);
  const delta = target - now;

  if (delta <= 0) {
    return { over: true, days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  return { over: false, days, hours, minutes };
}

function renderCountdowns() {
  countdownCards.innerHTML = '';
  DASHBOARD_TARGETS.forEach((target) => {
    const t = diffParts(target.date);
    const card = document.createElement('article');
    card.className = 'count-card';
    card.innerHTML = t.over
      ? `<h3>${target.label}</h3><p class="big">Completed</p><p>${target.date}</p>`
      : `<h3>${target.label}</h3><p class="big">${t.days}d ${t.hours}h ${t.minutes}m</p><p>${target.date}</p>`;
    countdownCards.appendChild(card);
  });
}

function renderTimeline() {
  timeline.innerHTML = '';
  KEY_DATES
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((event) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `<span>${event.date}</span><strong>${event.title}</strong>`;
      timeline.appendChild(item);
    });
}

function renderChecklist(id, source, container) {
  const state = JSON.parse(localStorage.getItem(id) || '{}');
  container.innerHTML = '';

  source.forEach((entry, i) => {
    if (typeof entry === 'string') {
      const label = document.createElement('label');
      label.className = `check-item ${state[i] ? 'done' : ''}`;
      label.innerHTML = `<input type="checkbox" data-index="${i}" ${state[i] ? 'checked' : ''} /> ${entry}`;
      container.appendChild(label);
      return;
    }

    const group = document.createElement('div');
    group.className = 'month-group';
    group.innerHTML = `<h3>${entry.month}</h3>`;
    entry.items.forEach((task, j) => {
      const key = `${i}-${j}`;
      const label = document.createElement('label');
      label.className = `check-item ${state[key] ? 'done' : ''}`;
      label.innerHTML = `<input type="checkbox" data-index="${key}" ${state[key] ? 'checked' : ''} /> ${task}`;
      group.appendChild(label);
    });
    container.appendChild(group);
  });

  container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      state[cb.dataset.index] = cb.checked;
      localStorage.setItem(id, JSON.stringify(state));
      renderChecklist(id, source, container);
      computeReadiness();
    });
  });
}

async function enableNotifications() {
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Notification access denied.');
    return;
  }

  const upcoming = KEY_DATES.filter((item) => {
    const d = diffParts(item.date);
    return !d.over && d.days <= 14;
  });

  if (upcoming.length === 0) {
    new Notification('No key dates in the next 14 days', {
      body: 'You are currently ahead of schedule.',
    });
    return;
  }

  upcoming.forEach((item) => {
    new Notification(`LSS deadline: ${item.title}`, {
      body: `${item.date} is approaching soon.`,
    });
  });
}

function downloadICS() {
  const events = KEY_DATES.map((item) => `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${item.date.replaceAll('-', '')}\nSUMMARY:${item.title}\nEND:VEVENT`).join('\n');
  const payload = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LSS Mission Control//EN\n${events}\nEND:VCALENDAR`;
  const blob = new Blob([payload], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lss-key-dates.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function updateBudgetText() {
  budgetOutput.textContent = `£${Number(budgetSlider.value).toLocaleString('en-GB')}`;
}


function computeReadiness() {
  const studyState = JSON.parse(localStorage.getItem('study-plan-state') || '{}');
  const movesState = JSON.parse(localStorage.getItem('power-moves-state') || '{}');

  const totalStudyTasks = STUDY_PLAN.reduce((n, m) => n + m.items.length, 0);
  const doneStudy = Object.values(studyState).filter(Boolean).length;
  const doneMoves = Object.values(movesState).filter(Boolean).length;
  const totalMoves = POWER_MOVES.length;

  const readiness = Math.round(((doneStudy + doneMoves) / (totalStudyTasks + totalMoves)) * 100);
  readinessScoreEl.textContent = `${Number.isFinite(readiness) ? readiness : 0}%`;
  readinessBarEl.style.width = `${Number.isFinite(readiness) ? readiness : 0}%`;
}

function computeRisk() {
  const upcoming = KEY_DATES
    .map((d) => ({ ...d, diff: diffParts(d.date) }))
    .filter((d) => !d.diff.over && d.diff.days <= 30);

  let risk = 10;
  if (upcoming.length >= 3) risk = 90;
  else if (upcoming.length === 2) risk = 65;
  else if (upcoming.length === 1) risk = 35;

  riskBarEl.style.width = `${risk}%`;
  riskStatusEl.textContent = risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low';
}

function updateRevisionSplit() {
  const total = Number(weeklyHoursEl.value || 0);
  const evr = (total * 0.5).toFixed(1);
  const nvr = (total * 0.25).toFixed(1);
  const maths = (total * 0.25).toFixed(1);
  splitOutputEl.textContent = `English/VR: ${evr}h • NVR: ${nvr}h • Maths: ${maths}h`;
}

function hydrateNotes() {
  parentNotesEl.value = localStorage.getItem('parent-notes') || '';
  parentNotesEl.addEventListener('input', () => {
    localStorage.setItem('parent-notes', parentNotesEl.value);
  });
}

function createListingLinks(e) {
  e.preventDefault();
  const area = encodeURIComponent(document.getElementById('area').value.trim());
  const budget = budgetSlider.value;
  const beds = document.getElementById('bedrooms').value || '3';

  const links = [
    { name: 'Rightmove', href: `https://www.rightmove.co.uk/property-for-sale/find.html?searchLocation=${area}&maxPrice=${budget}&minBedrooms=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
    { name: 'Zoopla', href: `https://www.zoopla.co.uk/for-sale/property/${area}/?price_max=${budget}&beds_min=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
    { name: 'OnTheMarket', href: `https://www.onthemarket.com/for-sale/property/${area}/?max-price=${budget}&min-bedrooms=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
  ];

  document.getElementById('listingLinks').innerHTML = links
    .map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">Open ${link.name} search ↗</a>`)
    .join('');
}

document.getElementById('notifyBtn').addEventListener('click', enableNotifications);
document.getElementById('calendarBtn').addEventListener('click', downloadICS);
document.getElementById('listingForm').addEventListener('submit', createListingLinks);
budgetSlider.addEventListener('input', updateBudgetText);

updateBudgetText();
renderTimeline();
renderCountdowns();
renderChecklist('study-plan-state', STUDY_PLAN, studyPlanEl);
renderChecklist('power-moves-state', POWER_MOVES, powerMovesEl);
computeReadiness();
computeRisk();
updateRevisionSplit();
hydrateNotes();
weeklyHoursEl.addEventListener('input', updateRevisionSplit);
setInterval(() => {
  renderCountdowns();
  computeRisk();
}, 60 * 1000);
