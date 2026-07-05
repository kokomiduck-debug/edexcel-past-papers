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

// Get Max Mark for a past paper variant
function getPaperMaxMark(subjectCode, displayName) {
  const name = displayName.toLowerCase();
  
  if (subjectCode === '4AC1') { // Accounting
    if (name.includes('paper 1') || name.includes('1p') || name.includes('01')) return 100;
    if (name.includes('paper 2') || name.includes('2p') || name.includes('02')) return 50;
    return 100;
  }
  if (subjectCode === '4CH1') { // Chemistry
    if (name.includes('paper 1') || name.includes('1c') || name.includes('1p')) return 110;
    if (name.includes('paper 2') || name.includes('2c') || name.includes('2p')) return 70;
    return 110;
  }
  if (subjectCode === '4EC1') { // Economics
    if (name.includes('paper 1') || name.includes('1c') || name.includes('01')) return 80;
    if (name.includes('paper 2') || name.includes('2c') || name.includes('02')) return 80;
    return 80;
  }
  if (subjectCode === '4EB1') { // English Language B
    return 100;
  }
  if (subjectCode === '4ET1') { // English Literature
    if (name.includes('paper 1') || name.includes('1p') || name.includes('01')) return 90;
    if (name.includes('paper 2') || name.includes('2p') || name.includes('02')) return 60;
    return 90;
  }
  if (subjectCode === '4XES2') { // ESL
    if (name.includes('reading') || name.includes('unit 1')) return 60;
    if (name.includes('listening') || name.includes('unit 2')) return 60;
    if (name.includes('writing') || name.includes('unit 3')) return 60;
    if (name.includes('speaking') || name.includes('unit 4')) return 60;
    return 60;
  }
  if (subjectCode === '4PM1') { // Further Pure Mathematics
    if (name.includes('paper 1') || name.includes('1p') || name.includes('01')) return 100;
    if (name.includes('paper 2') || name.includes('2p') || name.includes('02')) return 100;
    return 100;
  }
  if (subjectCode === '4MA1') { // Mathematics A Higher
    if (name.includes('paper 1') || name.includes('1h')) return 100;
    if (name.includes('paper 2') || name.includes('2h')) return 100;
    return 100;
  }
  if (subjectCode === '4MB1') { // Mathematics B
    if (name.includes('paper 1') || name.includes('1p') || name.includes('01')) return 100;
    if (name.includes('paper 2') || name.includes('2p') || name.includes('02')) return 200;
    return 100;
  }
  if (subjectCode === '4PH1') { // Physics
    if (name.includes('paper 1') || name.includes('1p') || name.includes('01')) return 110;
    if (name.includes('paper 2') || name.includes('2p') || name.includes('02')) return 70;
    return 110;
  }
  return 100; // default fallback
}

// Calculate Grade Band based on Edexcel cash-in UMS/raw overall boundaries
function calculateGrade(subjectCode, totalScore) {
  const boundaries = {
    '4AC1': [
      { grade: '9', mark: 125 },
      { grade: '8', mark: 112 },
      { grade: '7', mark: 100 },
      { grade: '6', mark: 84 },
      { grade: '5', mark: 69 },
      { grade: '4', mark: 54 },
      { grade: '3', mark: 40 },
      { grade: '2', mark: 26 },
      { grade: '1', mark: 12 }
    ],
    '4CH1': [
      { grade: '9', mark: 136 },
      { grade: '8', mark: 114 },
      { grade: '7', mark: 92 },
      { grade: '6', mark: 79 },
      { grade: '5', mark: 67 },
      { grade: '4', mark: 55 },
      { grade: '3', mark: 43 },
      { grade: '2', mark: 32 },
      { grade: '1', mark: 21 }
    ],
    '4EC1': [
      { grade: '9', mark: 117 },
      { grade: '8', mark: 107 },
      { grade: '7', mark: 98 },
      { grade: '6', mark: 90 },
      { grade: '5', mark: 83 },
      { grade: '4', mark: 76 },
      { grade: '3', mark: 64 },
      { grade: '2', mark: 52 },
      { grade: '1', mark: 40 }
    ],
    '4EB1': [
      { grade: '9', mark: 69 },
      { grade: '8', mark: 63 },
      { grade: '7', mark: 58 },
      { grade: '6', mark: 54 },
      { grade: '5', mark: 51 },
      { grade: '4', mark: 48 },
      { grade: '3', mark: 37 },
      { grade: '2', mark: 27 },
      { grade: '1', mark: 17 }
    ],
    '4ET1': [
      { grade: '9', mark: 124 },
      { grade: '8', mark: 116 },
      { grade: '7', mark: 109 },
      { grade: '6', mark: 95 },
      { grade: '5', mark: 82 },
      { grade: '4', mark: 69 },
      { grade: '3', mark: 52 },
      { grade: '2', mark: 35 },
      { grade: '1', mark: 18 }
    ],
    '4XES2': [
      { grade: '9', mark: 216 },
      { grade: '8', mark: 192 },
      { grade: '7', mark: 168 },
      { grade: '6', mark: 144 },
      { grade: '5', mark: 120 },
      { grade: '4', mark: 96 },
      { grade: '3', mark: 72 },
      { grade: '2', mark: 48 },
      { grade: '1', mark: 24 }
    ],
    '4PM1': [
      { grade: '9', mark: 166 },
      { grade: '8', mark: 141 },
      { grade: '7', mark: 117 },
      { grade: '6', mark: 93 },
      { grade: '5', mark: 70 },
      { grade: '4', mark: 47 },
      { grade: '3', mark: 35 }
    ],
    '4MA1': [
      { grade: '9', mark: 166 },
      { grade: '8', mark: 136 },
      { grade: '7', mark: 107 },
      { grade: '6', mark: 86 },
      { grade: '5', mark: 65 },
      { grade: '4', mark: 45 },
      { grade: '3', mark: 35 }
    ],
    '4MB1': [
      { grade: '9', mark: 247 },
      { grade: '8', mark: 211 },
      { grade: '7', mark: 176 },
      { grade: '6', mark: 145 },
      { grade: '5', mark: 114 },
      { grade: '4', mark: 84 },
      { grade: '3', mark: 69 }
    ],
    '4PH1': [
      { grade: '9', mark: 140 },
      { grade: '8', mark: 125 },
      { grade: '7', mark: 110 },
      { grade: '6', mark: 100 },
      { grade: '5', mark: 90 },
      { grade: '4', mark: 80 },
      { grade: '3', mark: 64 },
      { grade: '2', mark: 49 },
      { grade: '1', mark: 34 }
    ]
  };

  const list = boundaries[subjectCode];
  if (!list) return '';

  for (let i = 0; i < list.length; i++) {
    if (totalScore >= list[i].mark) {
      return list[i].grade;
    }
  }
  return 'U';
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
const searchResultsDropdown = document.getElementById('search-results-dropdown');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

// Navigation triggers & Drawer
const logoHomeLink = document.getElementById('logo-home-link');
const sidebarDashboardBtn = document.getElementById('sidebar-dashboard-btn');
const sidebarResourcesBtn = document.getElementById('sidebar-resources-btn');
const sidebarPapersBtn = document.getElementById('sidebar-papers-btn');
const sidebarProfileBtn = document.getElementById('sidebar-profile-btn');
const courseMenuTitle = document.getElementById('course-menu-title');

const navResourcesBtn = document.getElementById('nav-resources-btn');
const resourcesDrawerOverlay = document.getElementById('resources-drawer-overlay');
const resourcesDrawerPanel = document.getElementById('resources-drawer-panel');

// Sidebar Collapse elements
const sidebarHideMenuBtn = document.getElementById('sidebar-hide-menu-btn');
const sidebarToggleHandle = document.getElementById('sidebar-toggle-handle');
const workspaceFrame = document.querySelector('.workspace-frame');

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

const profileModal = document.getElementById('profile-modal');
const profileModalCloseBtn = document.getElementById('profile-modal-close-btn');
const profileUsernameInput = document.getElementById('profile-username-input');
const profileStatsText = document.getElementById('profile-stats-text');
const saveProfileBtn = document.getElementById('save-profile-btn');

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
  sidebarDashboardBtn.addEventListener('click', () => navigateTo('dashboard'));
  
  sidebarResourcesBtn.addEventListener('click', () => {
    if (currentSubjectCode) navigateTo('landing', currentSubjectCode);
  });
  
  sidebarPapersBtn.addEventListener('click', () => {
    if (currentSubjectCode) navigateTo('papers', currentSubjectCode);
  });

  // Global Resources slide-out drawer trigger
  navResourcesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resourcesDrawerOverlay.classList.add('open');
  });

  resourcesDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === resourcesDrawerOverlay) {
      resourcesDrawerOverlay.classList.remove('open');
    }
  });

  // Click on drawer subjects list
  document.querySelectorAll('#resources-drawer-overlay a[data-subject]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const code = a.getAttribute('data-subject');
      navigateTo('papers', code);
      resourcesDrawerOverlay.classList.remove('open');
    });
  });

  // Sidebar Hide menu toggle operations
  sidebarHideMenuBtn.addEventListener('click', () => {
    workspaceFrame.classList.add('sidebar-collapsed');
    sidebarToggleHandle.style.display = 'flex';
  });

  sidebarToggleHandle.addEventListener('click', () => {
    workspaceFrame.classList.remove('sidebar-collapsed');
    sidebarToggleHandle.style.display = 'none';
  });

  // Global search autocomplete dropdown
  globalSearchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    clearSearchBtn.style.display = val.length > 0 ? 'flex' : 'none';
    renderSearchDropdown(val);
  });

  // Handle enter key on search input (go to first result)
  globalSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const firstItem = searchResultsDropdown.querySelector('.search-dropdown-item');
      if (firstItem) {
        firstItem.click();
      }
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResultsDropdown.style.display = 'none';
    globalSearchInput.focus();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-center-search')) {
      searchResultsDropdown.style.display = 'none';
    }
  });

  // Add Course Modals
  addCourseTopBtn.addEventListener('click', openAddCourseModal);
  addCoursePanelBtn.addEventListener('click', openAddCourseModal);
  modalCloseBtn.addEventListener('click', closeAddCourseModal);
  
  addCourseModal.addEventListener('click', (e) => {
    if (e.target === addCourseModal) closeAddCourseModal();
  });

  // Profile Modal operations
  sidebarProfileBtn.addEventListener('click', openProfileModal);
  profileModalCloseBtn.addEventListener('click', closeProfileModal);
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfileModal();
  });
  saveProfileBtn.addEventListener('click', saveProfileName);

  // Subject landing papers trigger
  document.getElementById('landing-view-papers-btn').addEventListener('click', () => {
    navigateTo('papers', currentSubjectCode);
  });

  document.getElementById('download-spec-btn').addEventListener('click', () => {
    alert("Specification document downloading for syllabus " + currentSubjectCode + "...");
  });

  // Top navigation Resources dropdown bindings
  document.querySelectorAll('.dropdown-submenu-content a[data-subject]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const code = a.getAttribute('data-subject');
      navigateTo('papers', code);
    });
  });

  document.getElementById('dropdown-notes-link').addEventListener('click', (e) => {
    e.preventDefault();
    alert("Learning Hub revision resources are coming soon!");
  });

  document.getElementById('dropdown-about-link').addEventListener('click', (e) => {
    e.preventDefault();
    alert("10A* Prep Space - Built to guide you to 10 A*s in your Edexcel IGCSE exams!");
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

// Load course activations from local storage
function loadActivatedCourses() {
  let savedActive = [];
  try {
    const parsed = JSON.parse(localStorage.getItem('activated_subjects'));
    if (Array.isArray(parsed)) savedActive = parsed;
  } catch (e) {}

  activeCourses = savedActive;
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
          <button class="course-link-btn" data-action="papers">
            <span>Past Papers</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    `;

    // Bind navigation buttons inside cards
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
    navigateTo('papers', code); // Land directly on the newly added course papers page!
  }
}

// Navigation router logic
function navigateTo(page, subjectCode = '') {
  currentPage = page;
  currentSubjectCode = subjectCode;

  // Clear global search query state on navigation
  searchQuery = '';
  globalSearchInput.value = '';
  clearSearchBtn.style.display = 'none';
  searchResultsDropdown.style.display = 'none';

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
    
    // Auto collapse sidebar on dashboard
    workspaceFrame.classList.add('sidebar-collapsed');
    sidebarToggleHandle.style.display = 'none';

    const username = localStorage.getItem('profile-username');
    dashboardView.querySelector('h2').textContent = username ? `${username}'s courses` : 'My courses';

    renderDashboard();
  } 
  else if (page === 'landing') {
    landingView.classList.add('active-view');
    sidebarResourcesBtn.classList.add('active');
    
    // Show course sidebar submenu
    sidebarResourcesBtn.style.display = 'flex';
    sidebarPapersBtn.style.display = 'flex';
    courseMenuTitle.style.display = 'block';

    // Auto expand sidebar on landing
    workspaceFrame.classList.remove('sidebar-collapsed');
    sidebarToggleHandle.style.display = 'none';
    
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

    // Auto expand sidebar on papers
    workspaceFrame.classList.remove('sidebar-collapsed');
    sidebarToggleHandle.style.display = 'none';
    
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

      const maxMark = getPaperMaxMark(variant.subjectCode, vLabel);

      card.innerHTML = `
        <h4 class="paper-variant-card-title">${vLabel}</h4>
        <span class="paper-variant-card-subtitle">${subInfo}</span>
        
        <!-- Score Tracker box panel -->
        <div class="score-tracker-box">
          <span class="score-label">Your score</span>
          <div class="score-inputs">
            <input type="text" class="score-num-input score-val-field" value="${scoreVal}" placeholder="-">
            <span class="max-mark-label">/ ${maxMark}</span>
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

      const onScoreInput = () => {
        const score = valField.value.trim();
        savePaperScore(variant.subjectCode, yearKey, vLabel, score, maxMark);
      };

      valField.addEventListener('input', onScoreInput);

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
  let totalScore = 0;
  let totalMax = 0;

  Object.keys(yearGrouped).forEach(vLabel => {
    const key = `score_${subjectCode}_${yearKey.replace(/\s+/g, '_')}_${vLabel.replace(/\s+/g, '_')}`;
    const max = getPaperMaxMark(subjectCode, vLabel);
    totalMax += max;
    
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.score !== '') {
          completedCount++;
          totalScore += parseFloat(parsed.score) || 0;
        }
      } catch (e) {}
    }
  });

  if (completedCount === totalVariants && totalVariants > 0) {
    const grade = calculateGrade(subjectCode, totalScore);
    textEl.innerHTML = `${completedCount}/${totalVariants} completed &bull; <strong>Score: ${totalScore}/${totalMax}</strong> &bull; <strong style="color:var(--primary-purple)">Grade: ${grade}</strong>`;
  } else {
    textEl.innerHTML = `${completedCount}/${totalVariants} completed &bull; Score: ${totalScore}/${totalMax} &bull; <span style="color:var(--text-muted)">Grade: Pending</span>`;
  }
  
  const pct = totalVariants > 0 ? (completedCount / totalVariants) * 100 : 0;
  fillEl.style.width = `${pct}%`;
}

// Render the search autocomplete dropdown list matching subject codes and names
function renderSearchDropdown(query) {
  searchResultsDropdown.innerHTML = '';
  
  if (!query) {
    searchResultsDropdown.style.display = 'none';
    return;
  }

  // Filter subjects in mapped list (active or inactive)
  const matches = Object.keys(SUBJECT_MAP).filter(code => {
    const name = SUBJECT_MAP[code].toLowerCase();
    const searchVal = query.toLowerCase();
    return code.toLowerCase().includes(searchVal) || name.includes(searchVal);
  });

  if (matches.length === 0) {
    searchResultsDropdown.innerHTML = '<div style="font-size:0.78rem; color:var(--text-muted); padding:0.75rem 1rem; text-align:center;">No matching subjects found</div>';
    searchResultsDropdown.style.display = 'block';
    return;
  }

  matches.forEach(code => {
    const name = SUBJECT_MAP[code];
    const item = document.createElement('div');
    item.className = 'search-dropdown-item';
    item.innerHTML = `
      <span class="name">${name}</span>
      <span class="code">${code}</span>
    `;

    item.addEventListener('click', () => {
      globalSearchInput.value = '';
      clearSearchBtn.style.display = 'none';
      searchResultsDropdown.style.display = 'none';
      
      // Navigate straight to papers list page for this course
      navigateTo('papers', code);
    });

    searchResultsDropdown.appendChild(item);
  });

  searchResultsDropdown.style.display = 'block';
}

// Open profile statistics and username setter modal dialog
function openProfileModal() {
  profileUsernameInput.value = localStorage.getItem('profile-username') || '';
  
  // Calculate total papers tracked/completed in localstorage
  let completedCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('score_')) {
      completedCount++;
    }
  }

  profileStatsText.textContent = `Total papers completed & tracked: ${completedCount}`;
  profileModal.classList.add('open');
}

function closeProfileModal() {
  profileModal.classList.remove('open');
}

function saveProfileName() {
  const name = profileUsernameInput.value.trim();
  if (name) {
    localStorage.setItem('profile-username', name);
  } else {
    localStorage.removeItem('profile-username');
  }
  
  // Update dashboard greetings if active
  if (currentPage === 'dashboard') {
    dashboardView.querySelector('h2').textContent = name ? `${name}'s courses` : 'My courses';
  }

  closeProfileModal();
}
