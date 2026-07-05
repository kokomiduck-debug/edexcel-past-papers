// Subject Code to Name Mapping
const SUBJECT_MAP = {
  '4AC1': 'Accounting',
  '4CH1': 'Chemistry',
  '4EC1': 'Economics',
  '4EB1': 'English Language B',
  '4XES2': 'English as Second Language 0',
  '4ET1': 'English Literature',
  '4PM1': 'Further Pure Mathematics',
  '4MA1': 'Mathematics A',
  '4MB1': 'Mathematics B',
  '4PH1': 'Physics'
};

// Subject Cover Cover Class helper
function getCoverClass(code) {
  const classes = {
    '4AC1': 'cover-accounting',
    '4CH1': 'cover-chemistry',
    '4EC1': 'cover-economics',
    '4EB1': 'cover-english-b',
    '4XES2': 'cover-esl',
    '4ET1': 'cover-english-lit',
    '4PM1': 'cover-math-further',
    '4MA1': 'cover-math-a',
    '4MB1': 'cover-math-b',
    '4PH1': 'cover-physics'
  };
  return classes[code] || 'cover-physics';
}

// Application State
let papersData = [];
let activeCourses = []; // Activated subject codes
let currentPage = 'dashboard'; // 'dashboard', 'landing', 'papers'
let currentSubjectCode = ''; // e.g. '4PM1'
let searchQuery = '';

// DOM Elements
const globalSearchInput = document.getElementById('global-search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

// Navigation triggers
const logoHomeLink = document.getElementById('logo-home-link');
const navDashboardLink = document.getElementById('nav-dashboard-link');
const sidebarDashboardBtn = document.getElementById('sidebar-dashboard-btn');
const sidebarResourcesBtn = document.getElementById('sidebar-resources-btn');
const sidebarPapersBtn = document.getElementById('sidebar-papers-btn');
const courseMenuTitle = document.getElementById('course-menu-title');

// View sections
const dashboardView = document.getElementById('dashboard-view');
const landingView = document.getElementById('landing-view');
const papersView = document.getElementById('papers-view');

// Course lists and grid
const coursesGridList = document.getElementById('courses-grid-list');
const dashboardEmptyPanel = document.getElementById('dashboard-empty-panel');
const addCourseTopBtn = document.getElementById('add-course-top-btn');
const addCoursePanelBtn = document.getElementById('add-course-panel-btn');

// Modals
const addCourseModal = document.getElementById('add-course-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalSubjectsList = document.getElementById('modal-subjects-list');

// Init application on load
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupEventListeners();
  fetchPapersCatalog();
});

// Setup Light/Dark Theme toggle
function setupTheme() {
  const savedTheme = localStorage.getItem('theme-mode') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateThemeIcon(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });
}

function updateThemeIcon(isDark) {
  if (isDark) {
    // Sun icon for dark-mode active (to switch to light mode)
    themeIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    // Moon icon for light-mode active (to switch to dark mode)
    themeIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation hooks
  logoHomeLink.addEventListener('click', (e) => { e.preventDefault(); navigateTo('dashboard'); });
  navDashboardLink.addEventListener('click', (e) => { e.preventDefault(); navigateTo('dashboard'); });
  sidebarDashboardBtn.addEventListener('click', () => navigateTo('dashboard'));
  
  sidebarResourcesBtn.addEventListener('click', () => {
    if (currentSubjectCode) navigateTo('landing', currentSubjectCode);
  });
  
  sidebarPapersBtn.addEventListener('click', () => {
    if (currentSubjectCode) navigateTo('papers', currentSubjectCode);
  });

  // Global search bar
  globalSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
    
    // If the user searches globally, force them to search papers view
    if (searchQuery.length > 0) {
      if (currentPage !== 'papers') {
        // If searching without subject, default to first active course or open papers
        const defaultSubject = currentSubjectCode || activeCourses[0] || 'all';
        navigateTo('papers', defaultSubject);
      } else {
        renderPapersList();
      }
    } else {
      if (currentPage === 'papers') {
        renderPapersList();
      }
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    globalSearchInput.focus();
    if (currentPage === 'papers') {
      renderPapersList();
    }
  });

  // Add Course Modals
  addCourseTopBtn.addEventListener('click', openAddCourseModal);
  addCoursePanelBtn.addEventListener('click', openAddCourseModal);
  modalCloseBtn.addEventListener('click', closeAddCourseModal);
  
  // Close modal on background click
  addCourseModal.addEventListener('click', (e) => {
    if (e.target === addCourseModal) closeAddCourseModal();
  });

  // Subject landing sub-links triggers
  document.getElementById('landing-view-papers-btn').addEventListener('click', () => {
    navigateTo('papers', currentSubjectCode);
  });
  
  document.getElementById('view-notes-btn').addEventListener('click', () => {
    alert("Revision notes for " + SUBJECT_MAP[currentSubjectCode] + " are coming soon!");
  });

  document.getElementById('download-spec-btn').addEventListener('click', () => {
    alert("Specification document downloading for syllabus " + currentSubjectCode + "...");
  });
}

// Fetch database papers
async function fetchPapersCatalog() {
  try {
    const response = await fetch('papers-catalog.json');
    if (!response.ok) {
      throw new Error('Database file is missing.');
    }
    papersData = await response.json();
    
    // Load activated courses
    loadActivatedCourses();
    
    // Render Dashboard
    renderDashboard();
  } catch (e) {
    console.warn('Failed to load past papers database:', e);
    papersData = [];
    loadActivatedCourses();
    renderDashboard();
  }
}

// Load course activations from local storage and scan directory files
function loadActivatedCourses() {
  const autoActive = [...new Set(papersData.map(p => p.subjectCode).filter(Boolean))];
  
  let savedActive = [];
  try {
    const parsed = JSON.parse(localStorage.getItem('activated_subjects'));
    if (Array.isArray(parsed)) savedActive = parsed;
  } catch (e) {}

  // Merge auto-active courses with manually activated courses
  activeCourses = [...new Set([...autoActive, ...savedActive])];
}

// Render Dashboard View
function renderDashboard() {
  coursesGridList.innerHTML = '';
  
  if (activeCourses.length === 0) {
    dashboardEmptyPanel.style.display = 'flex';
    return;
  }
  
  dashboardEmptyPanel.style.display = 'none';

  // Render course card for each active course code
  activeCourses.forEach(code => {
    const name = SUBJECT_MAP[code] || code;
    const coverClass = getCoverClass(code);
    const count = papersData.filter(p => p.subjectCode === code).length;

    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="course-card-top">
        <span>EDEXCEL IGCSE</span>
        <span>${count} document${count === 1 ? '' : 's'}</span>
      </div>
      <div class="course-card-body">
        <div class="course-cover ${coverClass}">
          ${code}
        </div>
        <div class="course-info">
          <span class="course-badge">IGCSE • Edexcel</span>
          <h3>${name}</h3>
        </div>
        <div class="course-links">
          <button class="course-link-btn" data-action="notes">
            <span>Revision Notes</span>
            <span>&rarr;</span>
          </button>
          <button class="course-link-btn" data-action="papers">
            <span>Past Papers</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    `;

    // Bind navigation buttons inside cards
    card.querySelector('[data-action="notes"]').addEventListener('click', () => {
      navigateTo('landing', code);
    });
    
    card.querySelector('[data-action="papers"]').addEventListener('click', () => {
      navigateTo('papers', code);
    });

    coursesGridList.appendChild(card);
  });
}

// Open course activator modal selector
function openAddCourseModal() {
  modalSubjectsList.innerHTML = '';
  addCourseModal.classList.add('open');

  // Find all subjects in mapping that are NOT active yet
  const inactiveKeys = Object.keys(SUBJECT_MAP).filter(code => !activeCourses.includes(code));
  
  if (inactiveKeys.length === 0) {
    modalSubjectsList.innerHTML = '<p style="text-align:center; padding: 1.5rem; font-size:0.85rem; color:var(--text-secondary);">All subjects are currently active on your dashboard.</p>';
    return;
  }

  inactiveKeys.forEach(code => {
    const name = SUBJECT_MAP[code];
    const item = document.createElement('div');
    item.className = 'modal-add-item';
    item.innerHTML = `
      <span class="code">${code}</span>
      <span class="name">${name}</span>
      <span class="modal-add-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </span>
    `;

    item.addEventListener('click', () => {
      activateCourse(code);
    });

    modalSubjectsList.appendChild(item);
  });
}

function closeAddCourseModal() {
  addCourseModal.classList.remove('open');
}

function activateCourse(code) {
  if (!activeCourses.includes(code)) {
    activeCourses.push(code);
    
    // Save activated subjects to localstorage (excluding auto-detected ones if desired, but saving all is safe)
    localStorage.setItem('activated_subjects', JSON.stringify(activeCourses));
    
    renderDashboard();
    closeAddCourseModal();
    navigateTo('landing', code); // Land on the newly added course page!
  }
}

// Navigation router logic
function navigateTo(page, subjectCode = '') {
  currentPage = page;
  currentSubjectCode = subjectCode;

  // 1. Reset active views
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active-view'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));

  // 2. Load the correct page section
  if (page === 'dashboard') {
    dashboardView.classList.add('active-view');
    sidebarDashboardBtn.classList.add('active');
    
    // Hide Course-specific sidebar submenu triggers
    sidebarResourcesBtn.style.display = 'none';
    sidebarPapersBtn.style.display = 'none';
    courseMenuTitle.style.display = 'none';
    
    renderDashboard();
  } 
  else if (page === 'landing') {
    landingView.classList.add('active-view');
    sidebarResourcesBtn.classList.add('active');
    
    // Show course sidebar submenu
    sidebarResourcesBtn.style.display = 'flex';
    sidebarPapersBtn.style.display = 'flex';
    courseMenuTitle.style.display = 'block';
    
    // Set Sidebar titles
    const subName = SUBJECT_MAP[subjectCode] || subjectCode;
    courseMenuTitle.textContent = `${subjectCode} Course`;

    // Populate Page titles & Specification bar
    document.getElementById('landing-title').textContent = `Edexcel IGCSE ${subName} Revision`;
    document.getElementById('landing-spec-label').textContent = `Specification ${subjectCode}`;
    
    // Update breadcrumb crumb names
    const breadcrumbs = document.getElementById('landing-breadcrumbs');
    breadcrumbs.querySelector('.current-crumb').textContent = subName;

    // Bind landing home breadcrumb
    breadcrumbs.querySelector('.home-crumb').onclick = (e) => {
      e.preventDefault();
      navigateTo('dashboard');
    };
  } 
  else if (page === 'papers') {
    papersView.classList.add('active-view');
    sidebarPapersBtn.classList.add('active');
    
    sidebarResourcesBtn.style.display = 'flex';
    sidebarPapersBtn.style.display = 'flex';
    courseMenuTitle.style.display = 'block';
    
    const subName = SUBJECT_MAP[subjectCode] || subjectCode;
    courseMenuTitle.textContent = `${subjectCode} Course`;
    
    // Page Title
    document.getElementById('papers-title').textContent = `Past Papers Edexcel IGCSE ${subName}`;
    document.getElementById('papers-code-badge').textContent = `Exam code: ${subjectCode}`;

    // Breadcrumbs
    const breadcrumbs = document.getElementById('papers-breadcrumbs');
    const subCrumb = document.getElementById('papers-subject-crumb');
    subCrumb.textContent = subName;
    subCrumb.onclick = (e) => {
      e.preventDefault();
      navigateTo('landing', subjectCode);
    };
    breadcrumbs.querySelector('.home-crumb').onclick = (e) => {
      e.preventDefault();
      navigateTo('dashboard');
    };

    renderPapersList();
  }

  // Scroll main view back to top
  document.querySelector('.main-content').scrollTop = 0;
}

// Render dynamic Past papers view grouped by Year and variant card
function renderPapersList() {
  const wrapper = document.getElementById('years-sections-wrapper');
  wrapper.innerHTML = '';
  
  if (!currentSubjectCode) return;

  // Filter papers for this subject
  let filtered = papersData.filter(p => p.subjectCode === currentSubjectCode);

  // If text query is active, filter papers
  if (searchQuery) {
    filtered = filtered.filter(paper => {
      const matchText = `${paper.displayName} ${paper.subjectName} ${paper.subjectCode} ${paper.year} ${paper.session} ${paper.fileName}`.toLowerCase();
      return matchText.includes(searchQuery);
    });
  }

  if (filtered.length === 0) {
    document.getElementById('no-papers-matched').style.display = 'flex';
    return;
  }
  
  document.getElementById('no-papers-matched').style.display = 'none';

  // Group papers by Year, then by Variant card
  const groupedYears = groupPapersByVariant(filtered);
  const sortedYears = Object.keys(groupedYears).sort((a, b) => b.localeCompare(a)); // Descending order

  sortedYears.forEach(yearKey => {
    const yearGroup = groupedYears[yearKey];
    
    // Create Year level wrapper panel
    const yearBlock = document.createElement('div');
    yearBlock.className = 'year-level-block';
    yearBlock.innerHTML = `
      <div class="year-progress-header">
        <h3>${yearKey}</h3>
        <span class="progress-text-badge" id="progress-text-${currentSubjectCode}-${yearKey.replace(/\s+/g, '_')}">0/0 completed</span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" id="progress-fill-${currentSubjectCode}-${yearKey.replace(/\s+/g, '_')}"></div>
        </div>
      </div>
      <div class="papers-grid">
        <!-- Variant Cards go here -->
      </div>
    `;

    const grid = yearBlock.querySelector('.papers-grid');
    const sortedVariants = Object.keys(yearGroup).sort();

    sortedVariants.forEach(vLabel => {
      const variant = yearGroup[vLabel];
      const card = document.createElement('div');
      card.className = 'paper-variant-card';
      
      // Determine subtitle and code details
      const subInfo = variant.qp ? `${variant.qp.session} ${variant.qp.year} • ${variant.subjectCode}/${variant.qp.filePath.split('/').pop().split('_')[1] || ''}` 
                    : variant.ms ? `${variant.ms.session} ${variant.ms.year} • ${variant.subjectCode}/${variant.ms.filePath.split('/').pop().split('_')[1] || ''}`
                    : `${variant.year} • ${variant.subjectCode}`;

      // LocalStorage Key for score
      const scoreKey = `score_${variant.subjectCode}_${yearKey.replace(/\s+/g, '_')}_${vLabel.replace(/\s+/g, '_')}`;
      let scoreVal = '';
      let totalVal = '90'; // default max score
      
      try {
        const saved = JSON.parse(localStorage.getItem(scoreKey));
        if (saved) {
          scoreVal = saved.score || '';
          totalVal = saved.total || '90';
        }
      } catch (e) {}

      // QP and MS buttons HTML
      const qpBtnHtml = variant.qp ? `<a href="${variant.qp.filePath}" target="_blank" class="outline-action-btn btn-qp">Question Paper</a>` : '';
      const msBtnHtml = variant.ms ? `<a href="${variant.ms.filePath}" target="_blank" class="outline-action-btn btn-ms">Mark Scheme</a>` : '';

      // Collapsible downloads html
      let collapsibleHtml = '';
      if (variant.others.length > 0) {
        collapsibleHtml = `
          <div class="collapsible-downloads">
            <button class="collapse-trigger-btn">
              More downloads
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="collapsible-content">
              ${variant.others.map(o => `
                <a href="${o.filePath}" target="_blank" class="collapsed-download-link">
                  <span>${o.docTypeLabel}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <h4 class="paper-variant-card-title">${vLabel}</h4>
        <span class="paper-variant-card-subtitle">${subInfo}</span>
        
        <!-- Score Tracker box panel -->
        <div class="score-tracker-box">
          <span class="score-label">Your score</span>
          <div class="score-inputs">
            <input type="text" class="score-num-input score-val-field" value="${scoreVal}" placeholder="-">
            <span>/</span>
            <input type="text" class="score-num-input score-total-field" value="${totalVal}">
          </div>
        </div>

        <div class="card-buttons-stack">
          ${qpBtnHtml}
          ${msBtnHtml}
        </div>

        ${collapsibleHtml}
      `;

      // Score input fields keyup changes
      const valField = card.querySelector('.score-val-field');
      const totalField = card.querySelector('.score-total-field');

      const onScoreInput = () => {
        const score = valField.value.trim();
        const total = totalField.value.trim();
        savePaperScore(variant.subjectCode, yearKey, vLabel, score, total);
      };

      valField.addEventListener('input', onScoreInput);
      totalField.addEventListener('input', onScoreInput);

      // Collapsible Menu Expand toggle click
      const collBtn = card.querySelector('.collapse-trigger-btn');
      if (collBtn) {
        collBtn.addEventListener('click', () => {
          card.classList.toggle('open-downloads');
        });
      }

      grid.appendChild(card);
    });

    wrapper.appendChild(yearBlock);
    
    // Update progress numbers and progress fill sizes initial
    updateYearProgress(currentSubjectCode, yearKey, yearBlock);
  });
}

// Group papers list by Year and Variant Card
function groupPapersByVariant(papers) {
  const groupedYears = {};
  
  papers.forEach(paper => {
    let yearKey = paper.year;
    if (paper.session && paper.session !== 'Other') {
      const cleanSession = paper.session.replace('/', ' ');
      yearKey = `${cleanSession} ${paper.year}`;
    }
    
    if (!groupedYears[yearKey]) {
      groupedYears[yearKey] = {};
    }
    
    // Extract base variant label (e.g. "Paper 1 (1P)")
    const variantLabel = paper.displayName.split(' - ')[0] || 'Paper';
    
    if (!groupedYears[yearKey][variantLabel]) {
      groupedYears[yearKey][variantLabel] = {
        label: variantLabel,
        qp: null,
        ms: null,
        others: [],
        subjectCode: paper.subjectCode,
        year: paper.year,
        session: paper.session
      };
    }
    
    const vObj = groupedYears[yearKey][variantLabel];
    if (paper.docTypeCategory === 'QP') {
      vObj.qp = paper;
    } else if (paper.docTypeCategory === 'MS') {
      vObj.ms = paper;
    } else {
      vObj.others.push(paper);
    }
  });
  
  return groupedYears;
}

// Save score and recalculate progress indicators
function savePaperScore(subjectCode, yearKey, variantLabel, score, total) {
  const key = `score_${subjectCode}_${yearKey.replace(/\s+/g, '_')}_${variantLabel.replace(/\s+/g, '_')}`;
  
  if (score === '') {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify({ score, total: total || '90' }));
  }
  
  updateYearProgress(subjectCode, yearKey);
}

// Calculate score tracking counts and fill bars
function updateYearProgress(subjectCode, yearKey, containerBlock = null) {
  // Find the year block in the page
  const cleanId = `${subjectCode}-${yearKey.replace(/\s+/g, '_')}`;
  const textEl = containerBlock ? containerBlock.querySelector(`#progress-text-${cleanId}`) : document.getElementById(`progress-text-${cleanId}`);
  const fillEl = containerBlock ? containerBlock.querySelector(`#progress-fill-${cleanId}`) : document.getElementById(`progress-fill-${cleanId}`);
  
  if (!textEl || !fillEl) return;

  // Filter subject papers for this year
  const subjectPapers = papersData.filter(p => p.subjectCode === subjectCode);
  const yearGrouped = groupPapersByVariant(subjectPapers)[yearKey] || {};
  const totalVariants = Object.keys(yearGrouped).length;
  
  let completedCount = 0;
  
  Object.keys(yearGrouped).forEach(vLabel => {
    const key = `score_${subjectCode}_${yearKey.replace(/\s+/g, '_')}_${vLabel.replace(/\s+/g, '_')}`;
    const scoreVal = localStorage.getItem(key);
    if (scoreVal) {
      completedCount++;
    }
  });

  textEl.textContent = `${completedCount}/${totalVariants} completed`;
  
  const pct = totalVariants > 0 ? (completedCount / totalVariants) * 100 : 0;
  fillEl.style.width = `${pct}%`;
}
