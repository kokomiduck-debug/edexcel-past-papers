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

// Application State
let papersData = [];
let activeSubject = 'all';
let activeYear = 'all';
let activeType = 'all';
let activeSession = 'all';
let searchQuery = '';
let subjectSearchQuery = '';

// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const subjectSearchInput = document.getElementById('subject-search-input');
const subjectsFilterList = document.getElementById('subjects-filter-list');
const yearsFilterGrid = document.getElementById('years-filter-grid');
const paperTypeFilterList = document.getElementById('paper-type-filter-list');
const sessionFilterList = document.getElementById('session-filter-list');
const currentFilterTitle = document.getElementById('current-filter-title');
const filteredCountIndicator = document.getElementById('filtered-count');
const papersListContainer = document.getElementById('papers-list-container');
const noPapersPlaceholder = document.getElementById('no-papers-placeholder');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

// Init application on load
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  fetchPapersCatalog();
});

// Setup application event listeners
function setupEventListeners() {
  // Top Header Banner Search Input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
    filterAndRender();
  });

  // Clear Search button
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    filterAndRender();
  });

  // Sidebar Subject Local Search Input
  subjectSearchInput.addEventListener('input', (e) => {
    subjectSearchQuery = e.target.value.trim().toLowerCase();
    renderSubjectsList();
  });

  // Paper Type Filter clicks
  const typeButtons = paperTypeFilterList.querySelectorAll('.filter-item');
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.getAttribute('data-type');
      filterAndRender();
    });
  });

  // Session Filter clicks
  const sessionButtons = sessionFilterList.querySelectorAll('.filter-item');
  sessionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sessionButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSession = btn.getAttribute('data-session');
      filterAndRender();
    });
  });

  // Reset Filters button (Empty State)
  resetFiltersBtn.addEventListener('click', resetAllFilters);
}

// Reset all filter criteria to defaults
function resetAllFilters() {
  activeSubject = 'all';
  activeYear = 'all';
  activeType = 'all';
  activeSession = 'all';
  searchQuery = '';
  subjectSearchQuery = '';
  
  // Clear DOM input values
  searchInput.value = '';
  subjectSearchInput.value = '';
  clearSearchBtn.style.display = 'none';
  
  // Reset active classes in the UI
  // 1. Subjects
  renderSubjectsList();
  
  // 2. Years
  const yearBtns = yearsFilterGrid.querySelectorAll('.year-btn');
  yearBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-year') === 'all') btn.classList.add('active');
  });
  
  // 3. Types
  const typeBtns = paperTypeFilterList.querySelectorAll('.filter-item');
  typeBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-type') === 'all') btn.classList.add('active');
  });
  
  // 4. Sessions
  const sessionBtns = sessionFilterList.querySelectorAll('.filter-item');
  sessionBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-session') === 'all') btn.classList.add('active');
  });
  
  filterAndRender();
}

// Fetch papers catalog JSON
async function fetchPapersCatalog() {
  try {
    const response = await fetch('papers-catalog.json');
    if (!response.ok) {
      throw new Error('Catalog database is missing or empty.');
    }
    
    papersData = await response.json();
    
    // Build and populate filters
    renderSubjectsList();
    populateYearsGrid();
    
    // Perform initial render
    filterAndRender();
  } catch (error) {
    console.warn('Failed to load past papers database:', error);
    papersData = [];
    renderSubjectsList();
    populateYearsGrid();
    filterAndRender();
  }
}

// Render dynamic list of Subjects with count badges in the Sidebar
function renderSubjectsList() {
  // Clear and add the default "All Subjects" item
  subjectsFilterList.innerHTML = '';
  
  const allCount = papersData.length;
  const allBtn = document.createElement('button');
  allBtn.className = `filter-item ${activeSubject === 'all' ? 'active' : ''}`;
  allBtn.setAttribute('data-subject', 'all');
  allBtn.innerHTML = `
    <span class="filter-item-text">All Subjects</span>
    <span class="count-badge">${allCount}</span>
  `;
  allBtn.addEventListener('click', () => {
    selectSubject('all');
  });
  
  // Filter subjects based on sidebar search input
  const subjectsKeys = Object.keys(SUBJECT_MAP).filter(code => {
    if (!subjectSearchQuery) return true;
    const name = SUBJECT_MAP[code].toLowerCase();
    return name.includes(subjectSearchQuery) || code.toLowerCase().includes(subjectSearchQuery);
  });
  
  // Sort subjects alphabetically by name
  subjectsKeys.sort((a, b) => SUBJECT_MAP[a].localeCompare(SUBJECT_MAP[b]));
  
  if (subjectSearchQuery === '' || 'all subjects'.includes(subjectSearchQuery)) {
    subjectsFilterList.appendChild(allBtn);
  }
  
  // Render each subject button
  subjectsKeys.forEach(code => {
    const name = SUBJECT_MAP[code];
    const count = papersData.filter(paper => paper.subjectCode === code).length;
    
    const btn = document.createElement('button');
    btn.className = `filter-item ${activeSubject === code ? 'active' : ''}`;
    btn.setAttribute('data-subject', code);
    btn.innerHTML = `
      <span class="filter-item-text">
        <span class="filter-item-code">${code}</span>
        ${name}
      </span>
      <span class="count-badge">${count}</span>
    `;
    
    btn.addEventListener('click', () => {
      selectSubject(code);
    });
    
    subjectsFilterList.appendChild(btn);
  });
}

function selectSubject(code) {
  activeSubject = code;
  const items = subjectsFilterList.querySelectorAll('.filter-item');
  items.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-subject') === code) {
      item.classList.add('active');
    }
  });
  filterAndRender();
}

// Generate unique years and populate grid of tags
function populateYearsGrid() {
  yearsFilterGrid.innerHTML = '';
  
  // Default "All" button
  const allBtn = document.createElement('button');
  allBtn.className = `year-btn ${activeYear === 'all' ? 'active' : ''}`;
  allBtn.setAttribute('data-year', 'all');
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => {
    selectYear('all');
  });
  yearsFilterGrid.appendChild(allBtn);
  
  if (papersData.length === 0) return;
  
  // Find unique year numbers (skip folders like 'Other')
  const years = [...new Set(papersData.map(paper => paper.year).filter(y => y && y.match(/^\d{4}$/)))];
  
  // Sort descending
  years.sort((a, b) => b.localeCompare(a));
  
  years.forEach(year => {
    const btn = document.createElement('button');
    btn.className = `year-btn ${activeYear === year ? 'active' : ''}`;
    btn.setAttribute('data-year', year);
    btn.textContent = year;
    btn.addEventListener('click', () => {
      selectYear(year);
    });
    yearsFilterGrid.appendChild(btn);
  });
}

function selectYear(year) {
  activeYear = year;
  const buttons = yearsFilterGrid.querySelectorAll('.year-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-year') === year) {
      btn.classList.add('active');
    }
  });
  filterAndRender();
}

// Filter the master list and render the matching documents
function filterAndRender() {
  // If no subject is selected (activeSubject is 'all'), show a selection placeholder
  if (activeSubject === 'all') {
    papersListContainer.style.display = 'none';
    noPapersPlaceholder.style.display = 'flex';
    
    // Render "Select a Subject" prompt
    noPapersPlaceholder.innerHTML = `
      <div class="empty-icon-container">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h3>Select a subject to begin</h3>
      <p>Choose a subject from the left sidebar to start browsing and downloading past papers.</p>
    `;
    
    currentFilterTitle.textContent = "All Past Papers";
    filteredCountIndicator.textContent = "0 documents";
    return;
  }

  // Restore default empty state layout in case it was modified by the placeholder above
  noPapersPlaceholder.innerHTML = `
    <div class="empty-icon-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    </div>
    <h3>No papers match your filters</h3>
    <p id="empty-state-message">We couldn't find any documents matching your current selection. Try resetting your search or expanding the filter options.</p>
    <button id="reset-filters-btn" class="reset-blue-btn">Show All Past Papers</button>
  `;
  
  // Re-bind click listener on the dynamically restored reset button
  document.getElementById('reset-filters-btn').addEventListener('click', resetAllFilters);

  // 1. Apply active filter rules
  const filteredPapers = papersData.filter(paper => {
    // Subject filter
    const matchesSubject = (activeSubject === 'all' || paper.subjectCode === activeSubject);
    
    // Year filter
    const matchesYear = (activeYear === 'all' || paper.year === activeYear);
    
    // Document Type category filter
    const matchesType = (activeType === 'all' || paper.docTypeCategory === activeType);
    
    // Exam Session filter
    const matchesSession = (activeSession === 'all' || paper.session === activeSession);
    
    // Text search filter
    let matchesSearch = true;
    if (searchQuery) {
      const matchText = `${paper.displayName} ${paper.subjectName} ${paper.subjectCode} ${paper.year} ${paper.session} ${paper.fileName}`.toLowerCase();
      matchesSearch = matchText.includes(searchQuery);
    }
    
    return matchesSubject && matchesYear && matchesType && matchesSession && matchesSearch;
  });

  // 2. Update Header details
  let titleText = 'All Past Papers';
  if (activeSubject !== 'all') {
    titleText = `${activeSubject} ${SUBJECT_MAP[activeSubject] || ''}`;
  }
  
  // Append session/year parameters to header title if selected
  const titleAdditions = [];
  if (activeSession !== 'all') titleAdditions.push(activeSession);
  if (activeYear !== 'all') titleAdditions.push(activeYear);
  if (titleAdditions.length > 0) {
    titleText += ` (${titleAdditions.join(' ')})`;
  }
  
  currentFilterTitle.textContent = titleText;
  filteredCountIndicator.textContent = `${filteredPapers.length} document${filteredPapers.length === 1 ? '' : 's'}`;

  // 3. Render list or show Empty State card
  if (filteredPapers.length === 0) {
    papersListContainer.style.display = 'none';
    noPapersPlaceholder.style.display = 'flex';
  } else {
    noPapersPlaceholder.style.display = 'none';
    papersListContainer.style.display = 'flex';
    
    papersListContainer.innerHTML = filteredPapers.map(paper => `
      <div class="document-row">
        <div class="document-row-left">
          <span class="doc-icon-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </span>
          <span class="document-title-text" title="${paper.displayName}">${paper.displayName}</span>
        </div>
        <div class="document-row-right">
          <div class="doc-info-badges">
            <span class="doc-badge-ext">${paper.fileExtension}</span>
            <span class="doc-badge-size">${paper.fileSize}</span>
          </div>
          <a href="${paper.filePath}" download="${paper.fileName}" class="doc-download-btn" title="Download Past Paper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `).join('');
  }
}
