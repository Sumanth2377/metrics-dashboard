/* ─────────────────────────────────────────────────────
   LEARNIQ — WIDGET-TO-CHAT DASHBOARD
   app.js — All interaction logic
───────────────────────────────────────────────────── */

// SVG icon strings for context chip
const SVG_ICONS = {
  completion: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>`,
  learners:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  skillgap:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  atrisk:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

// AI avatar SVG (used in message bubbles)
const AI_AVATAR_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`;

// ═══════════════════════════════════════════════════
// WIDGET DATA  (mock content + AI responses)
// ═══════════════════════════════════════════════════
const WIDGETS = {
  completion: {
    title: 'Course Completion Rate',
    placeholder: 'Ask about completion rates, departments, or drop-off...',
    opener: 'Completion rate is at 73% this month, up 4% from last month. However, 3 departments (Finance, Legal, and Operations) are all below the 60% threshold. Want me to break down which courses are causing the most drop-off?',
    insightCard: { number: '73%', label: 'Monthly Completion Rate', trend: '↑ 4% vs last month', trendType: 'up' },
    responses: [
      {
        keywords: ['department', 'finance', 'legal', 'ops', 'operations', 'breakdown', 'below'],
        text: 'Finance is at **48%**, Legal at **52%**, and Operations at **57%**, all below the 60% threshold. The top drop-off point is Module 3 across all three departments. This suggests a content quality issue, not an engagement problem. Replacing the Module 3 assessment format alone has lifted completion by 11% in similar rollouts.'
      },
      {
        keywords: ['course', 'drop', 'causing', 'which', 'specific'],
        text: 'The top 3 courses with the highest drop-off are **Compliance 101** (42% completion), **Data Privacy Fundamentals** (51%), and **Leadership Essentials** (58%). All three share a trait: no interactive checkpoints in the first 20 minutes. Adding a single checkpoint at the 10-minute mark correlates with a 19% lift in completion industry-wide.'
      }
    ],
    fallbacks: [
      'Based on historical patterns, departments that receive 2 personalized nudge notifications per week see an average **18% improvement** in completion within 30 days. Want me to draft a recommended nudge schedule for your underperforming teams?',
      'The 73% rate puts you in the **top third** of companies on this platform. Even so, the 27% gap still represents roughly 340 employees who have not finished their assigned courses this month.',
      'Completion rates tend to dip in Q3 across most industries, typically by 8 to 12%. Organizations that run a short learning sprint campaign in weeks 1 and 2 of the quarter tend to recover that gap by month end.',
      'One lever that often goes unused: **manager visibility**. When managers receive a weekly completion summary for their direct reports, team completion rates rise by 22% on average within 6 weeks. Should I pull that report now?'
    ]
  },

  learners: {
    title: 'Weekly Active Learners',
    placeholder: 'Ask about learner trends, team adoption, or weekly patterns...',
    opener: 'Active learner count hit 1,284 this week, a 12% spike vs last week. The surge is primarily driven by the new Cybersecurity module launch. Engineering and Product teams lead adoption. Shall I identify which teams are lagging behind?',
    insightCard: { number: '1,284', label: 'Active Learners This Week', trend: '↑ 12% vs last week', trendType: 'up' },
    responses: [
      {
        keywords: ['team', 'lag', 'behind', 'low', 'hr', 'legal', 'which'],
        text: 'The teams with the lowest engagement this week: **HR** (23% active), **Legal** (31% active), and **Finance** (34% active). All three have missed their learning targets for 3 consecutive weeks. A 15-minute manager check-in prompt has re-engaged similar cohorts with a 64% success rate.'
      },
      {
        keywords: ['cybersecurity', 'module', 'surge', 'spike', 'launch'],
        text: 'The Cybersecurity module had a **91% start rate** and 78% completion in its first week, exceptional for a new course. The primary driver was the mandatory certification requirement tied to it. Voluntary courses average just 34% start rates by comparison. Tying learning to certification is the single highest-leverage mechanism on this platform.'
      }
    ],
    fallbacks: [
      'If current trends hold, you will cross **1,400 active learners** by next week, a new platform record. The key driver is the upcoming AI Fundamentals module, which already has a 340-person waitlist. Early access cohorts typically show 2.3x higher engagement in the first 4 weeks.',
      'The **12% week-over-week spike** is significant. In most organizations, spikes this size are driven by a single catalyst, usually a new mandatory course, a certification deadline, or a company-wide initiative. The Cybersecurity module accounts for roughly 60% of new sessions this week.',
      'Learner engagement peaks on **Tuesday and Wednesday mornings** based on session data. Scheduling nudge notifications for Tuesday at 9 AM could lift weekly active counts by another 6 to 9% without any new content.',
      'Organizations maintaining above **1,200 weekly active learners** see 31% higher skill gap reduction year-over-year. You are above that threshold now. The priority is keeping it consistent across all departments, not just Engineering.'
    ]
  },

  skillgap: {
    title: 'Skill Gap Index',
    placeholder: 'Ask about specific skills, departments, or how to reduce gaps...',
    opener: 'The current Skill Gap Index is 6.4 out of 10, with critical gaps in Data Literacy (8.1) and Cloud Infrastructure (7.9). These two domains alone account for 68% of the overall organizational gap. Want a department-by-department breakdown?',
    insightCard: { number: '6.4', label: 'Org Skill Gap Index (/10)', trend: '↑ Needs immediate action', trendType: 'down' },
    responses: [
      {
        keywords: ['data', 'literacy', 'analytics'],
        text: 'The Data Literacy gap (**8.1/10**) is concentrated in the Analytics and Operations teams. Only 12% of employees in these teams have completed any data course in the past 6 months. A targeted 4-week bootcamp could reduce the gap to approximately 5.5, the threshold below which project delivery speed typically improves by 15%.'
      },
      {
        keywords: ['cloud', 'infrastructure', 'aws', 'azure'],
        text: 'The Cloud Infrastructure gap (**7.9/10**) is highest in IT and Engineering. Six engineers are already on an AWS certification path with expected completion in about 45 days, which should reduce this to 6.8. Pairing them with peer-learning sessions could accelerate that timeline to 30 days.'
      }
    ],
    fallbacks: [
      'A gap index below **5.0** correlates with 23% higher project delivery speed in peer companies. At the current trajectory, you will hit 5.0 in approximately 8 months without intervention. With a focused upskilling push on Data Literacy and Cloud Infra, you could reach it in 4 months. Want me to model a sprint plan?',
      'The **Leadership gap (5.4/10)** is worth watching. It is the fastest-growing gap over the past quarter, up from 4.1 just 3 months ago. This typically signals mid-manager burnout or a wave of new team leads who have not completed leadership training yet.',
      'Peer benchmarking shows companies in your sector average a gap index of **4.2**. At 6.4, your skill gaps are significantly higher than industry peers. The fastest companies close this through blended learning: 40% structured courses, 60% on-the-job projects paired with mentorship.',
      'Quick win opportunity: **Leadership Essentials** is a 3-hour course that directly targets your Leadership gap. It has a 94% satisfaction rating on this platform and has been shown to reduce leadership gap scores by 1.2 points within 60 days of completion.'
    ]
  },

  atrisk: {
    title: 'At-Risk Employees',
    placeholder: 'Ask about at-risk employees, outreach strategies, or risk patterns...',
    opener: '14 employees are flagged at-risk this week, up from 9 last week. The primary signal is zero platform logins in the past 14 or more days. Finance and Legal have the highest concentration. Should I surface specific employees for immediate outreach?',
    insightCard: { number: '14', label: 'At-Risk Employees', trend: '↑ 5 from last week', trendType: 'down' },
    responses: [
      {
        keywords: ['finance', 'legal', 'department', 'team', 'concentration', 'who', 'which'],
        text: 'Finance has **6 at-risk employees**, Legal has **5**. Both teams show a classic re-engagement pattern: high login frequency 3 months ago followed by a sharp drop-off. Around 71% of employees with this pattern re-engage within 2 weeks when given a personalized prompt.'
      },
      {
        keywords: ['outreach', 'nudge', 'contact', 'reach', 'email', 'intervention', 'action', 'do'],
        text: 'Recommended outreach: **Day 1** sends a personalized email from their direct manager referencing their last course. **Day 3** sends an in-app notification with a curated 20-minute learning path. **Day 7** schedules a 15-minute check-in. This sequence has a **64% re-engagement rate** across 12 enterprise clients.'
      }
    ],
    fallbacks: [
      'The 14 at-risk employees represent approximately **$47K in wasted license spend** annually if they fully churn. Early intervention has an 8x ROI compared to re-onboarding after full churn. Acting within the first 21 days of inactivity is the critical window. After that, re-engagement rates drop by 58%.',
      'Interestingly, **8 of the 14 at-risk employees** were active learners just 6 weeks ago. They are not disengaged by nature; something changed. Common triggers include role changes, manager changes, or project overload. A quick 1:1 check-in conversation resolves this in most cases.',
      '**James T. (21 days inactive)** and **Sarah M. (18 days inactive)** are past the point where automated nudges work well. A direct message from their manager referencing something specific, like their last completed course, has a 3x higher re-engagement rate than generic outreach.',
      'Finance and Legal teams have the highest at-risk concentrations. Both carry heavier compliance training loads, which creates learning fatigue. Breaking their paths into micro-modules of 10 to 15 minutes has reduced churn by 41% in comparable organizations.'
    ]
  }
};

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
let activeWidgetId  = null;
let isStreaming     = false;
let streamInterval  = null;
const WIDGET_ORDER  = ['completion', 'learners', 'skillgap', 'atrisk'];

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  setHeaderDate();
  initCharts();
  bindWidgetEvents();
  bindChatEvents();
  bindKeyboardNav();
  bindLogoHome();
  bindAvatarDropdown();
  bindSettings();
  bindAtRiskModal();
  bindNotifBell();
  bindDatePicker();
});

function closeAllDropdowns() {
  document.getElementById('datepicker-dropdown')?.classList.add('hidden');
  document.getElementById('date-chip')?.classList.remove('active');
  document.getElementById('notif-dropdown')?.classList.add('hidden');
  document.getElementById('avatar-dropdown')?.classList.remove('open');
}

// ── Notification bell ─────────────────────────────────
function bindNotifBell() {
  const btn      = document.getElementById('notif-btn');
  const dropdown = document.getElementById('notif-dropdown');
  const dot      = document.getElementById('notif-dot');
  const markRead = document.getElementById('notif-mark-read');
  const wrapper  = btn?.closest('.notif-trigger-wrap');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyHidden = dropdown.classList.contains('hidden');
    closeAllDropdowns();
    if (isCurrentlyHidden) {
      dropdown.classList.remove('hidden');
    }
  });

  markRead?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    if (dot) dot.style.display = 'none';
    markRead.textContent = 'All read';
    markRead.disabled = true;
  });

  document.addEventListener('click', (e) => {
    if (wrapper && !wrapper.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dropdown.classList.add('hidden');
  });
}

// ── Date picker & historical data ────────────────────
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = null; // null = live mode

function bindDatePicker() {
  const chip     = document.getElementById('date-chip');
  const dropdown = document.getElementById('datepicker-dropdown');
  const prevBtn  = document.getElementById('cal-prev');
  const nextBtn  = document.getElementById('cal-next');
  const todayBtn = document.getElementById('cal-today-btn');
  const backBtn  = document.getElementById('hist-back-btn');

  if (!chip || !dropdown) return;

  // Initialize calendar to current month
  renderCalendar(calYear, calMonth);

  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyHidden = dropdown.classList.contains('hidden');
    closeAllDropdowns();
    if (isCurrentlyHidden) {
      dropdown.classList.remove('hidden');
      chip.classList.add('active');
    }
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar(calYear, calMonth);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = new Date();
    // Don't go past current month
    if (calYear < now.getFullYear() || (calYear === now.getFullYear() && calMonth < now.getMonth())) {
      calMonth++;
      if (calMonth > 11) { calMonth = 0; calYear++; }
      renderCalendar(calYear, calMonth);
    }
  });

  todayBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    resetToLive();
    dropdown.classList.add('hidden');
    chip.classList.remove('active');
  });

  backBtn?.addEventListener('click', () => {
    resetToLive();
  });

  // Close on outside click — check the wrapper div
  const calWrap = chip?.closest('.cal-trigger-wrap');
  document.addEventListener('click', (e) => {
    if (calWrap && !calWrap.contains(e.target)) {
      dropdown.classList.add('hidden');
      chip.classList.remove('active');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
      chip.classList.remove('active');
    }
  });
}

function renderCalendar(year, month) {
  const grid  = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month-label');
  const nextBtn = document.getElementById('cal-next');
  if (!grid || !label) return;

  const now        = new Date();
  const nowY       = now.getFullYear();
  const nowM       = now.getMonth();
  const nowD       = now.getDate();

  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  label.textContent = `${months[month]} ${year}`;

  // Disable next if we're at current month
  if (nextBtn) {
    nextBtn.disabled = (year === nowY && month === nowM);
  }

  // First day of month (0=Sun)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  grid.innerHTML = '';

  // Prev month filler days
  for (let i = firstDay - 1; i >= 0; i--) {
    const btn = document.createElement('button');
    btn.className = 'cal-day other-month';
    btn.textContent = daysInPrev - i;
    btn.disabled = true;
    grid.appendChild(btn);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d;
    const isToday   = (year === nowY && month === nowM && d === nowD);
    const isFuture  = new Date(year, month, d) > now;
    const isSelDate = selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth()    === month &&
      selectedDate.getDate()     === d;

    if (isToday)    btn.classList.add('today');
    if (isSelDate)  btn.classList.add('selected');
    if (isFuture) {
      btn.disabled = true;
    } else if (isToday) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetToLive();
        dropdown.classList.add('hidden');
        chip.classList.remove('active');
      });
    } else {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectHistoricalDate(new Date(year, month, d));
      });
    }
    grid.appendChild(btn);
  }

  // Next month filler days
  const totalCells = firstDay + daysInMonth;
  const remainder  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let d = 1; d <= remainder; d++) {
    const btn = document.createElement('button');
    btn.className = 'cal-day other-month';
    btn.textContent = d;
    btn.disabled = true;
    grid.appendChild(btn);
  }
}

function selectHistoricalDate(date) {
  selectedDate = date;
  const dropdown = document.getElementById('datepicker-dropdown');
  dropdown?.classList.add('hidden');
  document.getElementById('date-chip')?.classList.remove('active');

  // Update calendar to show selection
  renderCalendar(calYear, calMonth);

  // Update date chip label
  const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('header-date').textContent = label;

  // Show banner
  const banner = document.getElementById('historical-banner');
  const histLabel = document.getElementById('hist-date-label');
  if (banner && histLabel) {
    histLabel.textContent = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    banner.classList.remove('hidden');
  }

  // Apply historical snapshot
  const snap = getHistoricalSnapshot(date);
  applyWidgetSnapshot(snap);
}

function resetToLive() {
  selectedDate = null;
  document.getElementById('historical-banner')?.classList.add('hidden');

  // Reset date chip
  const now = new Date();
  const calY = now.getFullYear(), calM = now.getMonth();
  calYear  = calY;
  calMonth = calM;
  renderCalendar(calY, calM);
  document.getElementById('header-date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  // Remove historical mode from widgets
  document.querySelectorAll('.widget.historical-mode').forEach(w => w.classList.remove('historical-mode'));

  // Reset widgets to live values
  resetWidgets();
}

// ── Historical data engine ────────────────────────────
function getHistoricalSnapshot(date) {
  const now = new Date();
  const daysBack = Math.max(1, Math.floor((now - date) / 86400000));

  // Deterministic hash from date (same date always = same data)
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const h = ((y * 397 + m * 53 + d * 11) % 89);

  const completion = Math.max(55, Math.min(82, Math.round(73 - daysBack * 0.09 + (h % 9) - 4)));
  const learners   = Math.max(850, Math.round(1284 - daysBack * 8  + (h % 60) - 30));
  const skillGap   = Math.max(4.2, Math.round((6.4 - daysBack * 0.018 + (h % 8) * 0.05 - 0.2) * 10) / 10);
  const atRisk     = Math.max(3,   Math.round(14   - daysBack * 0.19 + (h % 7) - 3));

  return { completion, learners, skillGap, atRisk };
}

function applyWidgetSnapshot(snap) {
  // Mark all widgets as historical
  document.querySelectorAll('.widget').forEach(w => w.classList.add('historical-mode'));

  // 1. Course Completion
  const compVal   = document.querySelector('#widget-completion .stat-value');
  const donutPct  = document.querySelector('#widget-completion .donut-pct');
  const compTrend = document.querySelector('#widget-completion .stat-trend');
  if (compVal)   compVal.textContent = snap.completion + '%';
  if (donutPct)  donutPct.textContent = snap.completion + '%';
  if (compTrend) {
    const diff = snap.completion - 73;
    compTrend.textContent = (diff >= 0 ? '↑ ' : '↓ ') + Math.abs(diff) + '% vs today';
    compTrend.className   = 'stat-trend ' + (diff >= 0 ? 'up' : 'down');
  }
  if (chartCompletion) {
    chartCompletion.data.datasets[0].data = [snap.completion, 100 - snap.completion];
    chartCompletion.update();
  }

  // Proportionally scale Department Completion bars (Finance: 48%, Legal: 52%, Operations: 57%, Engineering: 89% live)
  const completionScale = snap.completion / 73;
  const compFills = document.querySelectorAll('#widget-completion .dept-bar-fill');
  const compPcts  = document.querySelectorAll('#widget-completion .dept-bar-pct');
  const compBases = [48, 52, 57, 89];
  compBases.forEach((base, idx) => {
    const newVal = Math.min(100, Math.round(base * completionScale));
    if (compFills[idx]) compFills[idx].style.width = newVal + '%';
    if (compPcts[idx]) {
      compPcts[idx].textContent = newVal + '%';
      compPcts[idx].className = 'dept-bar-pct' + (newVal < 60 ? ' below' : newVal >= 85 ? ' good' : '');
    }
    if (compFills[idx]) {
      compFills[idx].className = 'dept-bar-fill' + (newVal < 60 ? ' warn' : newVal >= 85 ? ' good' : ' ok');
    }
  });

  // 2. Weekly Active Learners
  const learnVal   = document.querySelector('#widget-learners .stat-value');
  const learnTrend = document.querySelector('#widget-learners .stat-trend');
  if (learnVal)   learnVal.textContent = snap.learners.toLocaleString();
  if (learnTrend) {
    const diff = snap.learners - 1284;
    learnTrend.textContent = (diff >= 0 ? '↑ ' : '↓ ') + Math.abs(diff).toLocaleString() + ' vs today';
    learnTrend.className   = 'stat-trend ' + (diff >= 0 ? 'up' : 'down');
  }
  if (chartLearners) {
    // Generate a matching historical trend for the last 7 weeks
    const base = snap.learners;
    chartLearners.data.datasets[0].data = [
      Math.round(base * 0.64),
      Math.round(base * 0.71),
      Math.round(base * 0.68),
      Math.round(base * 0.81),
      Math.round(base * 0.87),
      Math.round(base * 0.89),
      base
    ];
    chartLearners.update();
  }

  // Scale team active learners rows (Engineering 94%, Product 81%, Finance 34%, HR 23% live)
  const learnersScale = snap.learners / 1284;
  const teamFills = document.querySelectorAll('#widget-learners .team-stat-bar');
  const teamPcts  = document.querySelectorAll('#widget-learners .team-stat-pct');
  const teamBases = [94, 81, 34, 23];
  teamBases.forEach((base, idx) => {
    const newVal = Math.min(100, Math.round(base * learnersScale));
    if (teamFills[idx]) {
      teamFills[idx].style.width = newVal + '%';
      teamFills[idx].className = 'team-stat-bar' + (newVal < 35 ? ' low' : '');
    }
    if (teamPcts[idx]) {
      teamPcts[idx].textContent = newVal + '%';
      teamPcts[idx].className = 'team-stat-pct' + (newVal < 35 ? ' low' : '');
    }
  });

  // 3. Skill Gap Index
  const gapScore = document.querySelector('#widget-skillgap .score-display');
  if (gapScore) gapScore.innerHTML = snap.skillGap + '<span class="score-max">/10</span>';
  
  // Scale skill gap category bars (Data Literacy 81%, Cloud Infra 79%, Leadership 54% live)
  const gapScale = snap.skillGap / 6.4;
  const gapFills = document.querySelectorAll('#widget-skillgap .score-bar-fill');
  const gapVals  = document.querySelectorAll('#widget-skillgap .score-bar-value');
  const gapBases = [8.1, 7.9, 5.4];
  gapBases.forEach((base, idx) => {
    const newVal = Math.min(10, Math.round(base * gapScale * 10) / 10);
    const pctVal = Math.round(newVal * 10);
    if (gapFills[idx]) {
      gapFills[idx].style.width = pctVal + '%';
      gapFills[idx].className = 'score-bar-fill' + (newVal >= 7.0 ? ' danger' : ' warn');
    }
    if (gapVals[idx]) gapVals[idx].textContent = newVal.toFixed(1);
  });

  // Update You benchmark bar
  const youBar = document.querySelector('#widget-skillgap .benchmark-bar.you');
  const youVal = document.querySelector('#widget-skillgap .benchmark-val.you-val');
  if (youBar) youBar.style.width = Math.round(snap.skillGap * 10) + '%';
  if (youVal) youVal.textContent = snap.skillGap.toFixed(1);

  // 4. At-Risk Employees
  const riskVal   = document.querySelector('#widget-atrisk .stat-value');
  const riskTrend = document.querySelector('#widget-atrisk .stat-trend');
  if (riskVal)   riskVal.textContent = snap.atRisk;
  if (riskTrend) {
    const diff = snap.atRisk - 14;
    riskTrend.textContent = (diff >= 0 ? '↑ ' : '↓ ') + Math.abs(diff) + ' vs today';
    riskTrend.className   = 'stat-trend ' + (diff > 0 ? 'down' : 'up');
  }

  // Update table row active days (Sarah 18d, James 21d, Priya 15d)
  const rows = document.querySelectorAll('#widget-atrisk .risk-table tbody tr');
  const riskScale = snap.atRisk / 14;
  const riskDaysBases = [18, 21, 15];
  riskDaysBases.forEach((base, idx) => {
    if (rows[idx]) {
      const newDays = Math.max(14, Math.round(base * riskScale));
      const cells = rows[idx].querySelectorAll('td');
      if (cells && cells.length >= 3) {
        cells[2].textContent = newDays + 'd ago';
      }
    }
  });

  // Update department breakdown chips counts (Finance 6, Legal 5, Operations 3)
  const chipCounts = document.querySelectorAll('#widget-atrisk .risk-chip-count');
  const financeCount = Math.round(6 * riskScale);
  const legalCount = Math.round(5 * riskScale);
  const opsCount = Math.max(0, snap.atRisk - financeCount - legalCount);
  if (chipCounts[0]) chipCounts[0].textContent = financeCount;
  if (chipCounts[1]) chipCounts[1].textContent = legalCount;
  if (chipCounts[2]) chipCounts[2].textContent = opsCount;

  // Update "+X more" text
  const moreText = document.querySelector('#widget-atrisk .more-row');
  if (moreText) {
    const moreCount = Math.max(0, snap.atRisk - 3);
    moreText.innerHTML = `+${moreCount} more &nbsp;·&nbsp; <span class="view-all-link">View all →</span>`;
    // Rebind link since we replaced innerHTML
    const viewAllLink = moreText.querySelector('.view-all-link');
    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.stopPropagation();
        openAtRiskModal();
      });
    }
  }
}

function resetWidgets() {
  // 1. Completion
  const compVal   = document.querySelector('#widget-completion .stat-value');
  const donutPct  = document.querySelector('#widget-completion .donut-pct');
  const compTrend = document.querySelector('#widget-completion .stat-trend');
  if (compVal)   compVal.textContent   = '73%';
  if (donutPct)  donutPct.textContent  = '73%';
  if (compTrend) { compTrend.textContent = '↑ 4%'; compTrend.className = 'stat-trend up'; }
  if (chartCompletion) {
    chartCompletion.data.datasets[0].data = [73, 27];
    chartCompletion.update();
  }

  const compFills = document.querySelectorAll('#widget-completion .dept-bar-fill');
  const compPcts  = document.querySelectorAll('#widget-completion .dept-bar-pct');
  const compOriginals = [48, 52, 57, 89];
  compOriginals.forEach((val, idx) => {
    if (compFills[idx]) {
      compFills[idx].style.width = val + '%';
      compFills[idx].className = 'dept-bar-fill' + (val < 60 ? ' warn' : val >= 85 ? ' good' : ' ok');
    }
    if (compPcts[idx]) {
      compPcts[idx].textContent = val + '%';
      compPcts[idx].className = 'dept-bar-pct' + (val < 60 ? ' below' : val >= 85 ? ' good' : '');
    }
  });

  // 2. Learners
  const learnVal   = document.querySelector('#widget-learners .stat-value');
  const learnTrend = document.querySelector('#widget-learners .stat-trend');
  if (learnVal)   learnVal.textContent   = '1,284';
  if (learnTrend) { learnTrend.textContent = '↑ 12%'; learnTrend.className = 'stat-trend up'; }
  if (chartLearners) {
    chartLearners.data.datasets[0].data = [820, 910, 870, 1050, 1120, 1145, 1284];
    chartLearners.update();
  }

  const teamFills = document.querySelectorAll('#widget-learners .team-stat-bar');
  const teamPcts  = document.querySelectorAll('#widget-learners .team-stat-pct');
  const teamOriginals = [94, 81, 34, 23];
  teamOriginals.forEach((val, idx) => {
    if (teamFills[idx]) {
      teamFills[idx].style.width = val + '%';
      teamFills[idx].className = 'team-stat-bar' + (val < 35 ? ' low' : '');
    }
    if (teamPcts[idx]) {
      teamPcts[idx].textContent = val + '%';
      teamPcts[idx].className = 'team-stat-pct' + (val < 35 ? ' low' : '');
    }
  });

  // 3. Skill Gap
  const gapScore = document.querySelector('#widget-skillgap .score-display');
  if (gapScore) gapScore.innerHTML = '6.4<span class="score-max">/10</span>';
  
  const gapFills = document.querySelectorAll('#widget-skillgap .score-bar-fill');
  const gapVals  = document.querySelectorAll('#widget-skillgap .score-bar-value');
  const gapOriginals = [8.1, 7.9, 5.4];
  gapOriginals.forEach((val, idx) => {
    if (gapFills[idx]) {
      gapFills[idx].style.width = Math.round(val * 10) + '%';
      gapFills[idx].className = 'score-bar-fill' + (val >= 7.0 ? ' danger' : ' warn');
    }
    if (gapVals[idx]) gapVals[idx].textContent = val.toFixed(1);
  });

  const youBar = document.querySelector('#widget-skillgap .benchmark-bar.you');
  const youVal = document.querySelector('#widget-skillgap .benchmark-val.you-val');
  if (youBar) youBar.style.width = '64%';
  if (youVal) youVal.textContent = '6.4';

  // 4. At-Risk
  const riskVal   = document.querySelector('#widget-atrisk .stat-value');
  const riskTrend = document.querySelector('#widget-atrisk .stat-trend');
  if (riskVal)   riskVal.textContent   = '14';
  if (riskTrend) { riskTrend.textContent = '↑ 5 this week'; riskTrend.className = 'stat-trend down'; }

  const rows = document.querySelectorAll('#widget-atrisk .risk-table tbody tr');
  const riskDaysOriginals = [18, 21, 15];
  riskDaysOriginals.forEach((val, idx) => {
    if (rows[idx]) {
      const cells = rows[idx].querySelectorAll('td');
      if (cells && cells.length >= 3) {
        cells[2].textContent = val + 'd ago';
      }
    }
  });

  const chipCounts = document.querySelectorAll('#widget-atrisk .risk-chip-count');
  const chipOriginals = [6, 5, 3];
  chipOriginals.forEach((val, idx) => {
    if (chipCounts[idx]) chipCounts[idx].textContent = val;
  });

  const moreText = document.querySelector('#widget-atrisk .more-row');
  if (moreText) {
    moreText.innerHTML = `+11 more &nbsp;·&nbsp; <span class="view-all-link">View all →</span>`;
    const viewAllLink = moreText.querySelector('.view-all-link');
    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.stopPropagation();
        openAtRiskModal();
      });
    }
  }
}


// ── Logo → go home (clear context) ──────────────────
function bindLogoHome() {
  const logo = document.getElementById('logo-home');
  if (!logo) return;
  logo.addEventListener('click', () => {
    clearContext();
  });
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearContext(); }
  });
}

// ── Avatar → dropdown toggle ─────────────────────────
function bindAvatarDropdown() {
  const btn      = document.getElementById('avatar-btn');
  const dropdown = document.getElementById('avatar-dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyOpen = dropdown.classList.contains('open');
    closeAllDropdowns();
    if (!isCurrentlyOpen) {
      dropdown.classList.add('open');
    }
  });

  // Home item → clear context
  document.getElementById('dd-home')?.addEventListener('click', () => {
    dropdown.classList.remove('open');
    clearContext();
  });

  // Settings item → open settings panel
  document.getElementById('dd-settings')?.addEventListener('click', () => {
    dropdown.classList.remove('open');
    openSettings();
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });
}

// ── Settings panel ───────────────────────────────────
function openSettings() {
  document.getElementById('settings-overlay').classList.add('open');
  document.getElementById('settings-overlay').setAttribute('aria-hidden', 'false');
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
  document.getElementById('settings-overlay').setAttribute('aria-hidden', 'true');
}

function bindSettings() {
  // Close button
  document.getElementById('settings-close')?.addEventListener('click', closeSettings);

  // Click outside the panel → close
  document.getElementById('settings-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('settings-overlay')) closeSettings();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });

  // ── Individual toggles ──
  bindToggle('toggle-dark', (on) => {
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    updateChartsTheme(on);
  });

  bindToggle('toggle-compact', (on) => {
    document.getElementById('widgets-grid')?.classList.toggle('compact', on);
  });

  // Notification toggles — state only (no backend)
  bindToggle('toggle-alerts',  () => {});
  bindToggle('toggle-digest',  () => {});
  bindToggle('toggle-drop',    () => {});
  bindToggle('toggle-refresh', () => {});
}

// Helper: toggle button click handler
function bindToggle(id, onChange) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isOn = btn.classList.toggle('on');
    btn.setAttribute('aria-checked', String(isOn));
    onChange(isOn);
  });
}


function setHeaderDate() {
  const now = new Date();
  const short = now.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  document.getElementById('header-date').textContent = short;
}

// ═══════════════════════════════════════════════════
// CHARTS (Chart.js)
// ═══════════════════════════════════════════════════
// Store chart instances for theme updates
let chartCompletion = null;
let chartLearners   = null;

function initCharts() {
  Chart.defaults.color       = '#94a3b8';
  Chart.defaults.borderColor = '#e3e7ef';

  /* ── Donut: Course Completion ── */
  const ctx1 = document.getElementById('chart-completion').getContext('2d');
  chartCompletion = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [73, 27],
        backgroundColor: ['#2563eb', '#e3e7ef'],
        borderWidth: 0,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '74%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ctx.dataIndex === 0 ? ' Completed: 73%' : ' Remaining: 27%'
          }
        }
      }
    }
  });

  /* ── Bar: Weekly Active Learners ── */
  const ctx2 = document.getElementById('chart-learners').getContext('2d');
  chartLearners = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'],
      datasets: [{
        data: [820, 910, 870, 1050, 1120, 1145, 1284],
        backgroundColor: (ctx) => ctx.dataIndex === 6 ? '#2563eb' : '#dbeafe',
        borderRadius: 4,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#0f172a',
          bodyColor: '#334155',
          borderColor: '#e3e7ef',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => ` ${ctx.raw.toLocaleString()} active learners`
          }
        }
      },
      scales: {
        x: {
          grid:  { display: false },
          ticks: { font: { size: 9 }, color: '#94a3b8' }
        },
        y: { display: false }
      }
    }
  });
}

function updateChartsTheme(dark) {
  const barMuted   = dark ? '#374151' : '#dbeafe';
  const tickColor  = dark ? '#525252' : '#94a3b8';
  const tooltipBg  = dark ? '#1e1e1e' : '#ffffff';
  const tooltipTxt = dark ? '#f5f5f5' : '#0f172a';
  const tooltipBod = dark ? '#a3a3a3' : '#334155';
  const borderClr  = dark ? '#333333' : '#e3e7ef';
  const donutRing  = dark ? '#333333' : '#e3e7ef';

  if (chartLearners) {
    chartLearners.data.datasets[0].backgroundColor = (ctx) =>
      ctx.dataIndex === 6 ? '#2563eb' : barMuted;
    chartLearners.options.scales.x.ticks.color = tickColor;
    const tt = chartLearners.options.plugins.tooltip;
    tt.backgroundColor = tooltipBg;
    tt.titleColor = tooltipTxt;
    tt.bodyColor  = tooltipBod;
    tt.borderColor = borderClr;
    chartLearners.update();
  }

  if (chartCompletion) {
    chartCompletion.data.datasets[0].backgroundColor = ['#2563eb', donutRing];
    chartCompletion.update();
  }
}

// ═══════════════════════════════════════════════════
// WIDGET EVENTS
// ═══════════════════════════════════════════════════
function bindWidgetEvents() {
  document.querySelectorAll('.widget').forEach(widget => {
    widget.addEventListener('click', (e) => {
      selectWidget(widget.dataset.id, e);
    });

    widget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectWidget(widget.dataset.id, null);
      }
    });
  });
}

// ═══════════════════════════════════════════════════
// SELECT WIDGET  (the money function)
// ═══════════════════════════════════════════════════
function selectWidget(widgetId, event) {
  // Don't re-select or interrupt an active stream
  if (widgetId === activeWidgetId) return;
  if (isStreaming) cancelStream();

  activeWidgetId = widgetId;
  const widgetEl = document.getElementById(`widget-${widgetId}`);

  // ── 1. Ripple from click position ──
  if (event?.clientX) {
    const rect = widgetEl.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (event.clientX - rect.left) + 'px';
    ripple.style.top  = (event.clientY - rect.top)  + 'px';
    widgetEl.appendChild(ripple);
    setTimeout(() => ripple.remove(), 750);
  }

  // ── 2. Update widget visual states ──
  document.querySelectorAll('.widget').forEach(w => {
    const isActive = w.dataset.id === widgetId;
    w.classList.toggle('active',  isActive);
    w.classList.toggle('dimmed', !isActive);
  });

  // ── 3. Transition right panel ──
  transitionPanel(widgetId);
}

// ═══════════════════════════════════════════════════
// RIGHT PANEL TRANSITION
// ═══════════════════════════════════════════════════
function transitionPanel(widgetId) {
  const emptyState    = document.getElementById('empty-state');
  const chatInterface = document.getElementById('chat-interface');
  const contextBar    = document.getElementById('context-bar');
  const progressBar   = document.getElementById('progress-bar');
  const messages      = document.getElementById('messages');

  // ── Sweep progress bar ──
  progressBar.classList.remove('sweep');
  void progressBar.offsetWidth;           // force reflow
  progressBar.classList.add('sweep');

  const firstTime = chatInterface.classList.contains('hidden');

  if (firstTime) {
    // ── First widget selected: show chat ──
    emptyState.style.display = 'none';
    chatInterface.classList.remove('hidden');
    updateContextBar(widgetId);
    contextBar.classList.remove('slide-out');
    contextBar.classList.add('slide-in');
    messages.innerHTML = '';
    showOpener(widgetId);
  } else {
    // ── Switching widgets: update instantly without animations ──
    updateContextBar(widgetId);
    messages.innerHTML = '';
    showOpener(widgetId);
  }

  // ── Update input placeholder & focus ──
  const input = document.getElementById('chat-input');
  if (input) {
    input.placeholder = WIDGETS[widgetId].placeholder;
    input.focus();
  }
}

function updateContextBar(widgetId) {
  const data = WIDGETS[widgetId];
  // Inject SVG icon into context chip
  const chip = document.getElementById('context-chip');
  if (chip) chip.innerHTML = SVG_ICONS[widgetId] || '';
  document.getElementById('context-title').textContent = data.title;
  document.getElementById('context-time').textContent  =
    'Last updated: Today, ' +
    new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ═══════════════════════════════════════════════════
// OPENER — STREAMING AI MESSAGE
// ═══════════════════════════════════════════════════
function showOpener(widgetId) {
  const data     = WIDGETS[widgetId];
  const messages = document.getElementById('messages');

  const msgEl    = createAIMsgElement('');
  messages.appendChild(msgEl);

  const textSpan = msgEl.querySelector('.bubble-text');
  const cursor   = msgEl.querySelector('.stream-cursor');

  streamText(textSpan, data.opener, () => {
    // Stream complete: remove cursor, add insight card
    cursor.remove();
    isStreaming = false;

    if (data.insightCard) {
      const card = buildInsightCard(data.insightCard);
      msgEl.querySelector('.msg-bubble').appendChild(card);
    }

    scrollMessages();
  });
}

// ═══════════════════════════════════════════════════
// STREAMING TEXT EFFECT  (the signature touch)
// ═══════════════════════════════════════════════════
function streamText(element, text, onComplete) {
  const words = text.split(' ');
  let i = 0;
  element.textContent = '';
  isStreaming = true;

  streamInterval = setInterval(() => {
    if (i < words.length) {
      element.textContent += (i === 0 ? '' : ' ') + words[i];
      i++;
      scrollMessages();
    } else {
      clearInterval(streamInterval);
      streamInterval = null;
      if (onComplete) onComplete();
    }
  }, 32); // ~32ms per word ≈ natural reading pace
}

function cancelStream() {
  if (streamInterval) {
    clearInterval(streamInterval);
    streamInterval = null;
  }
  isStreaming = false;
}

// ═══════════════════════════════════════════════════
// CHAT  — SEND & RESPOND
// ═══════════════════════════════════════════════════
function bindChatEvents() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  sendBtn.addEventListener('click', handleSend);

  document.getElementById('clear-btn').addEventListener('click', clearContext);
}

function handleSend() {
  if (!activeWidgetId || isStreaming) return;

  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;

  input.value      = '';
  input.style.height = 'auto';

  // User bubble
  addUserBubble(text);

  // Skeleton → simulated AI response after 800ms
  const skeleton = addSkeleton();
  setTimeout(() => {
    skeleton.remove();
    const response = pickResponse(activeWidgetId, text);
    addAIBubble(response);
  }, 800);
}

// Track fallback rotation per widget (round-robin)
const responseHistory = {};

function pickResponse(widgetId, userText) {
  const lower    = userText.toLowerCase();
  const widget   = WIDGETS[widgetId];

  // Keyword match takes priority
  for (const r of widget.responses) {
    if (r.keywords.length > 0 && r.keywords.some(kw => lower.includes(kw))) {
      return r.text;
    }
  }

  // Rotate through fallbacks so answers never repeat
  const fallbacks = widget.fallbacks || [];
  if (fallbacks.length === 0) return widget.responses[widget.responses.length - 1].text;

  if (responseHistory[widgetId] === undefined) responseHistory[widgetId] = 0;
  const text = fallbacks[responseHistory[widgetId] % fallbacks.length];
  responseHistory[widgetId]++;
  return text;
}


// ═══════════════════════════════════════════════════
// DOM BUILDERS
// ═══════════════════════════════════════════════════
function createAIMsgElement(text) {
  const div = document.createElement('div');
  div.className = 'message ai';
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${AI_AVATAR_SVG}</div>
    <div class="msg-bubble">
      <span class="bubble-text">${escapeHtml(text)}</span><span class="stream-cursor" aria-hidden="true"></span>
    </div>`;
  return div;
}

function addUserBubble(text) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message user';
  div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  messages.appendChild(div);
  scrollMessages();
}

function addAIBubble(text) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message ai';
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${AI_AVATAR_SVG}</div>
    <div class="msg-bubble">${renderMarkdown(text)}</div>`;
  messages.appendChild(div);
  scrollMessages();
}

function addSkeleton() {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message ai';
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${AI_AVATAR_SVG}</div>
    <div class="msg-bubble">
      <div class="loading-skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>`;
  messages.appendChild(div);
  scrollMessages();
  return div;
}

function buildInsightCard({ number, label, trend, trendType }) {
  const div = document.createElement('div');
  div.className = 'insight-card';
  div.innerHTML = `
    <div class="insight-number">${number}</div>
    <div class="insight-meta">
      <span class="insight-label">${label}</span>
      <span class="insight-trend ${trendType}">${trend}</span>
    </div>`;
  return div;
}

// ═══════════════════════════════════════════════════
// CLEAR CONTEXT
// ═══════════════════════════════════════════════════
function clearContext() {
  cancelStream();
  activeWidgetId = null;

  document.querySelectorAll('.widget').forEach(w => {
    w.classList.remove('active', 'dimmed');
  });

  document.getElementById('chat-interface').classList.add('hidden');
  document.getElementById('empty-state').style.display = '';
  document.getElementById('messages').innerHTML = '';
}

// ═══════════════════════════════════════════════════
// KEYBOARD NAVIGATION  (↑↓ arrows cycle widgets)
// ═══════════════════════════════════════════════════
function bindKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (document.activeElement?.id === 'chat-input') return;

    const idx = activeWidgetId ? WIDGET_ORDER.indexOf(activeWidgetId) : -1;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = WIDGET_ORDER[(idx + 1) % WIDGET_ORDER.length];
      document.getElementById(`widget-${next}`).focus();
      selectWidget(next, null);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = WIDGET_ORDER[(idx - 1 + WIDGET_ORDER.length) % WIDGET_ORDER.length];
      document.getElementById(`widget-${prev}`).focus();
      selectWidget(prev, null);
    } else if (e.key === 'Escape' && activeWidgetId) {
      clearContext();
    }
  });
}

// Set per-widget placeholder on input focus
function setInputPlaceholder(widgetId) {
  const input = document.getElementById('chat-input');
  if (input && WIDGETS[widgetId]) {
    input.placeholder = WIDGETS[widgetId].placeholder || 'Ask about this metric…';
  }
}

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function scrollMessages() {
  const m = document.getElementById('messages');
  if (m) m.scrollTop = m.scrollHeight;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdown(text) {
  // Bold: **text** → <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Line breaks
  text = text.replace(/\n/g, '<br>');
  return text;
}

// ═══════════════════════════════════════════════════
// AT-RISK MODAL
// ═══════════════════════════════════════════════════
function bindAtRiskModal() {
  const modal     = document.getElementById('atrisk-modal');
  const closeBtn  = document.getElementById('atrisk-modal-close');
  const sendBtn   = document.getElementById('send-all-outreach');
  const viewAllLink = document.querySelector('.view-all-link');

  if (!modal) return;

  // "View all →" link inside the widget opens the modal
  if (viewAllLink) {
    viewAllLink.addEventListener('click', (e) => {
      e.stopPropagation(); // don't trigger widget selection
      openAtRiskModal();
    });
  }

  // Close button
  closeBtn?.addEventListener('click', closeAtRiskModal);

  // Click backdrop to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAtRiskModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeAtRiskModal();
  });

  // "Send outreach" button — show a brief confirmation
  sendBtn?.addEventListener('click', () => {
    sendBtn.textContent = '✓ Outreach sent to 9 employees';
    sendBtn.style.background = 'var(--green)';
    sendBtn.disabled = true;
    setTimeout(() => {
      sendBtn.textContent = 'Send outreach to all pending';
      sendBtn.style.background = '';
      sendBtn.disabled = false;
    }, 3000);
  });
}

function openAtRiskModal() {
  const modal = document.getElementById('atrisk-modal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeAtRiskModal() {
  const modal = document.getElementById('atrisk-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

