const PRIORITY_RADIUS_MILES = 10.004;

const KEY_DATES = [
  { title: '11+ registration opens', date: '2026-05-07', critical: true },
  { title: '11+ registration deadline', date: '2026-06-30', critical: true },
  { title: 'Access arrangements deadline', date: '2026-06-30', critical: true },
  { title: 'Access arrangements decisions', date: '2026-07-13', critical: false, prefix: 'Week commencing ' },
  { title: '11+ test invite letters', date: '2026-08-10', critical: false, prefix: 'Week commencing ' },
  { title: '11+ test dates', date: '2026-09-12', critical: true, displayOverride: '12–13 September 2026' },
  { title: '11+ results available', date: '2026-10-16', critical: true },
  { title: 'Secondary application deadline', date: '2026-10-31', critical: true },
  { title: 'Proof of address requested', date: '2026-12-01', critical: false, prefix: 'Week commencing ' },
  { title: 'Proof of address deadline', date: '2026-12-31', critical: true, time: '23:59' },
  { title: 'National Offer Day', date: '2027-03-01', critical: true },
];

const COUNTDOWN_TARGETS = [
  { label: 'Registration deadline', date: '2026-06-30' },
  { label: '11+ test dates', date: '2026-09-12' },
  { label: 'Proof of address deadline', date: '2026-12-31' },
  { label: 'National Offer Day', date: '2027-03-01' },
];

const STUDY_PLAN = [
  'Set weekly routine (same days and times).',
  'Complete 2 English/VR sessions.',
  'Complete 1 NVR session.',
  'Complete 1 Maths session.',
  'Review mistakes and set 3 focus topics.',
  'Complete one timed mixed paper this week.',
];

const EVIDENCE_ITEMS = [
  'Proof of address documents ready',
  'Open day notes saved',
  'Admissions call notes saved',
  '11+ registration confirmation saved',
  'Proof of address checklist completed',
];

const keyDatesList = document.getElementById('keyDatesList');
const keyDatesListTab = document.getElementById('keyDatesListTab');
const nextDeadlineCard = document.getElementById('nextDeadlineCard');
const setupState = document.getElementById('setupState');
const readinessBlock = document.getElementById('readinessBlock');
const countdownCards = document.getElementById('countdownCards');
const deadlineRisk = document.getElementById('deadlineRisk');
const studyPlan = document.getElementById('studyPlan');
const evidenceChecklist = document.getElementById('evidenceChecklist');
const splitOutput = document.getElementById('splitOutput');

const childName = document.getElementById('childName');
const catchmentChecked = document.getElementById('catchmentChecked');
const weeklyHours = document.getElementById('weeklyHours');
const budgetSlider = document.getElementById('budgetSlider');
const budgetOutput = document.getElementById('budgetOutput');
const parentNotes = document.getElementById('parentNotes');

function formatDateUK(dateStr) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${dateStr}T00:00:00`));
}

function displayDate(item) {
  if (item.displayOverride) return item.displayOverride;
  const base = formatDateUK(item.date);
  const withPrefix = item.prefix ? `${item.prefix}${base}` : base;
  return item.time ? `${withPrefix}, ${item.time}` : withPrefix;
}

function daysTo(dateStr) {
  const today = new Date();
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function statusTag(date) {
  const d = daysTo(date);
  if (d < 0) return 'completed';
  if (d <= 21) return 'upcoming';
  return 'future';
}

function renderNextDeadline() {
  const next = KEY_DATES.find((d) => daysTo(d.date) >= 0);
  if (!next) return;
  nextDeadlineCard.innerHTML = `
    <p class="small">Next key date</p>
    <h2>${displayDate(next)}</h2>
    <p>${next.title}</p>
  `;
}

function renderKeyDates() {
  const targets = [keyDatesList, keyDatesListTab].filter(Boolean);
  targets.forEach((targetList) => {
    targetList.innerHTML = '';
    KEY_DATES.forEach((item) => {
      const status = statusTag(item.date);
      const line = document.createElement('article');
      line.className = `date-item ${status} ${item.critical ? 'critical' : ''}`;
      line.innerHTML = `
        <div>
          <p class="date">${displayDate(item)}</p>
          <h3>${item.title}</h3>
        </div>
        <span class="pill">${status === 'completed' ? 'Completed' : status === 'upcoming' ? 'Upcoming' : 'Planned'}</span>
      `;
      targetList.appendChild(line);
    });
  });
}

function renderCountdowns() {
  countdownCards.innerHTML = '';
  COUNTDOWN_TARGETS.forEach((item) => {
    const d = daysTo(item.date);
    const card = document.createElement('article');
    card.className = 'count-card';
    card.innerHTML = `<h4>${item.label}</h4><p>${d < 0 ? 'Completed' : `${d} days`}</p><span>${formatDateUK(item.date)}</span>`;
    countdownCards.appendChild(card);
  });
}

function renderChecklist(container, list, storageKey) {
  const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
  container.innerHTML = '';
  list.forEach((item, idx) => {
    const label = document.createElement('label');
    label.className = `check-item ${state[idx] ? 'done' : ''}`;
    label.innerHTML = `<input type="checkbox" data-i="${idx}" ${state[idx] ? 'checked' : ''} /> ${item}`;
    container.appendChild(label);
  });

  container.querySelectorAll('input').forEach((cb) => {
    cb.addEventListener('change', () => {
      state[cb.dataset.i] = cb.checked;
      localStorage.setItem(storageKey, JSON.stringify(state));
      renderChecklist(container, list, storageKey);
      renderReadiness();
    });
  });
}

function renderSetupState() {
  const setupDone = {
    child: Boolean(childName.value.trim()),
    catchment: catchmentChecked.checked,
    hours: Number(weeklyHours.value) > 0,
  };
  const doneCount = Object.values(setupDone).filter(Boolean).length;

  if (doneCount < 3) {
    setupState.innerHTML = `
      <p><strong>Complete these 3 steps to get started.</strong></p>
      <ul>
        <li>${setupDone.child ? '✅' : '⬜'} Add child details</li>
        <li>${setupDone.catchment ? '✅' : '⬜'} Check catchment eligibility</li>
        <li>${setupDone.hours ? '✅' : '⬜'} Set weekly revision hours</li>
      </ul>
    `;
  } else {
    setupState.innerHTML = '<p class="small">Great start. Your planner is now personalised.</p>';
  }

  localStorage.setItem('setup-state', JSON.stringify({
    childName: childName.value,
    catchmentChecked: catchmentChecked.checked,
    weeklyHours: weeklyHours.value,
  }));
}

function renderReadiness() {
  const setupDone = Boolean(childName.value.trim()) && catchmentChecked.checked && Number(weeklyHours.value) > 0;
  if (!setupDone) {
    readinessBlock.innerHTML = '<p>You’re making a strong start. Finish the 3 setup steps above to unlock your readiness score.</p>';
    return;
  }

  const studyState = JSON.parse(localStorage.getItem('study-plan') || '{}');
  const evidenceState = JSON.parse(localStorage.getItem('evidence-checklist') || '{}');
  const done = [...Object.values(studyState), ...Object.values(evidenceState)].filter(Boolean).length;
  const total = STUDY_PLAN.length + EVIDENCE_ITEMS.length;
  const score = Math.round((done / total) * 100);

  let encouragement = 'You’ve made a strong start.';
  if (score < 40) encouragement = 'A few important steps still need attention.';
  if (score > 75) encouragement = 'You are in a strong position for upcoming deadlines.';

  const nextAction = !Object.values(evidenceState).some(Boolean)
    ? 'Next, confirm catchment and save proof of address notes.'
    : 'Next, keep your weekly revision checklist consistent.';

  readinessBlock.innerHTML = `
    <p class="score">Readiness score: ${score}%</p>
    <p>${encouragement}</p>
    <p>${nextAction}</p>
    <p class="small">Deadline Risk support: stay on top of upcoming key dates and evidence tasks.</p>
  `;
}

function renderRevisionSplit() {
  const total = Number(weeklyHours.value || 0);
  splitOutput.textContent = `English/VR: ${(total * 0.5).toFixed(1)}h • NVR: ${(total * 0.25).toFixed(1)}h • Maths: ${(total * 0.25).toFixed(1)}h`;
}

function renderRisk() {
  const urgent = KEY_DATES.filter((k) => {
    const d = daysTo(k.date);
    return d >= 0 && d <= 30;
  }).length;
  deadlineRisk.textContent = urgent >= 3
    ? 'Deadline Risk: High — multiple key milestones are within 30 days.'
    : urgent >= 1
      ? 'Deadline Risk: Medium — at least one key milestone is close.'
      : 'Deadline Risk: Low — no major milestones within 30 days.';
}

function enableNotifications() {
  if (!('Notification' in window)) return alert('Notifications are not supported in this browser.');
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') return;
    const next = KEY_DATES.find((k) => daysTo(k.date) >= 0);
    if (next) new Notification(`Next key date: ${next.title}`, { body: `${displayDate(next)}` });
  });
}

function downloadICS() {
  const events = KEY_DATES.map((k) => `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${k.date.replaceAll('-', '')}\nSUMMARY:${k.title}\nEND:VEVENT`).join('\n');
  const text = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LSS Planner//EN\n${events}\nEND:VCALENDAR`;
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lss-2027-key-dates.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function initTabs() {
  document.body.classList.add('js-tabs');
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  function activate(tabName) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tabName));
    panels.forEach((p) => p.classList.toggle('active', p.id === `tab-${tabName}`));
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
  });

  const initial = document.querySelector('.tab.active')?.dataset.tab || 'dashboard';
  activate(initial);
}

function updateBudgetOutput() {
  budgetOutput.textContent = `£${Number(budgetSlider.value).toLocaleString('en-GB')}`;
}

function createListingLinks(e) {
  e.preventDefault();
  const area = encodeURIComponent(document.getElementById('area').value.trim());
  const beds = document.getElementById('bedrooms').value || 3;
  const budget = budgetSlider.value;
  const links = [
    { name: 'Rightmove', href: `https://www.rightmove.co.uk/property-for-sale/find.html?searchLocation=${area}&maxPrice=${budget}&minBedrooms=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
    { name: 'Zoopla', href: `https://www.zoopla.co.uk/for-sale/property/${area}/?price_max=${budget}&beds_min=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
    { name: 'OnTheMarket', href: `https://www.onthemarket.com/for-sale/property/${area}/?max-price=${budget}&min-bedrooms=${beds}&radius=${PRIORITY_RADIUS_MILES}` },
  ];
  document.getElementById('listingLinks').innerHTML = links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer">Open ${l.name}</a>`).join('');
}

function hydrateSavedSetup() {
  const saved = JSON.parse(localStorage.getItem('setup-state') || '{}');
  childName.value = saved.childName || '';
  catchmentChecked.checked = Boolean(saved.catchmentChecked);
  weeklyHours.value = saved.weeklyHours || 8;
  parentNotes.value = localStorage.getItem('parent-notes') || '';
}

hydrateSavedSetup();
renderNextDeadline();
renderKeyDates();
renderCountdowns();
renderChecklist(studyPlan, STUDY_PLAN, 'study-plan');
renderChecklist(evidenceChecklist, EVIDENCE_ITEMS, 'evidence-checklist');
renderSetupState();
renderReadiness();
renderRevisionSplit();
renderRisk();
initTabs();
updateBudgetOutput();

[childName, catchmentChecked, weeklyHours].forEach((el) => {
  el.addEventListener('input', () => {
    renderSetupState();
    renderReadiness();
    renderRevisionSplit();
  });
});

document.getElementById('jumpCatchment').addEventListener('click', () => {
  document.querySelector('[data-tab="catchment"]').click();
});
parentNotes.addEventListener('input', () => localStorage.setItem('parent-notes', parentNotes.value));
budgetSlider.addEventListener('input', updateBudgetOutput);
document.getElementById('notifyBtn').addEventListener('click', enableNotifications);
document.getElementById('calendarBtn').addEventListener('click', downloadICS);
document.getElementById('listingForm').addEventListener('submit', createListingLinks);
document.getElementById('printStudyPlan').addEventListener('click', () => window.print());

setInterval(() => {
  renderNextDeadline();
  renderCountdowns();
  renderRisk();
  renderKeyDates();
}, 60 * 1000);
