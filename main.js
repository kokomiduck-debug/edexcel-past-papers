// Application State
let papersData = [];
let activeSubject = 'all';
let activeYear = 'all';
let searchQuery = '';

// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const subjectTags = document.querySelectorAll('.subject-tag');
const yearTabsList = document.getElementById('year-tabs-list');
const papersGridList = document.getElementById('papers-grid-list'); // Container for accordions
const noPapersPlaceholder = document.getElementById('no-papers-placeholder');
const emptyStateMessage = document.getElementById('empty-state-message');
const currentFilterTitle = document.getElementById('current-filter-title');
const filteredCountText = document.getElementById('filtered-count');
const totalPapersCountText = document.getElementById('total-papers-count');
const toggleHelpBtn = document.getElementById('toggle-help-btn');
const helpPanel = document.querySelector('.help-panel');

// Init application
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  fetchPapersCatalog();
});

// Setup event listeners
function setupEventListeners() {
  // Search Input
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

  // Subject Tags
  subjectTags.forEach(tag => {
    tag.addEventListener('click', () => {
      subjectTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeSubject = tag.getAttribute('data-subject');
      filterAndRender();
    });
  });

  // Help Accordion Toggle
  toggleHelpBtn.addEventListener('click', () => {
    helpPanel.classList.toggle('open');
  });
}

// Fetch papers data from catalog JSON
async function fetchPapersCatalog() {
  try {
    const response = await fetch('papers-catalog.json');
    if (!response.ok) {
      throw new Error('Catalog file not found or empty.');
    }
    
    papersData = await response.json();
    totalPapersCountText.textContent = papersData.length;
    
    if (papersData.length === 0) {
      helpPanel.classList.add('open');
    }
    
    populateYearFilters();
    filterAndRender();
  } catch (error) {
    console.warn('Failed to load past papers catalog:', error);
    papersData = [];
    totalPapersCountText.textContent = 0;
    helpPanel.classList.add('open');
    filterAndRender();
  }
}

// Generate unique years from catalog and populate tab buttons
function populateYearFilters() {
  yearTabsList.innerHTML = '<button class="year-tab active" data-year="all">All Years</button>';
  if (papersData.length === 0) return;
  
  const years = [...new Set(papersData.map(paper => paper.year))];
  years.sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return b.localeCompare(a);
  });
  
  years.forEach(year => {
    if (year !== 'Other' || years.includes('Other')) {
      const btn = document.createElement('button');
      btn.className = 'year-tab';
      btn.setAttribute('data-year', year);
      btn.textContent = year;
      
      btn.addEventListener('click', () => {
        const tabs = yearTabsList.querySelectorAll('.year-tab');
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        activeYear = year;
        filterAndRender();
      });
      
      yearTabsList.appendChild(btn);
    }
  });
}

// Helper: Toggle Subject Accordion
function toggleSubjectAccordion(accordionEl, forceState = null) {
  const content = accordionEl.querySelector('.accordion-content');
  const isOpen = accordionEl.classList.contains('open');
  const shouldOpen = forceState !== null ? forceState : !isOpen;
  
  if (shouldOpen) {
    accordionEl.classList.add('open');
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // Set to none after transition so inner year accordions can expand/collapse freely
    const onTransitionEnd = () => {
      if (accordionEl.classList.contains('open')) {
        content.style.maxHeight = 'none';
      }
      content.removeEventListener('transitionend', onTransitionEnd);
    };
    content.addEventListener('transitionend', onTransitionEnd);
  } else {
    if (content.style.maxHeight === 'none' || !content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.offsetHeight; // force reflow
    }
    accordionEl.classList.remove('open');
    content.style.maxHeight = '0px';
  }
}

// Helper: Toggle Year Accordion
function toggleYearAccordion(yearAccordionEl, forceState = null) {
  const content = yearAccordionEl.querySelector('.year-content');
  const isOpen = yearAccordionEl.classList.contains('open');
  const shouldOpen = forceState !== null ? forceState : !isOpen;
  
  const parentSubject = yearAccordionEl.closest('.subject-accordion');
  const parentContent = parentSubject ? parentSubject.querySelector('.accordion-content') : null;
  
  if (shouldOpen) {
    if (parentContent && parentContent.style.maxHeight !== 'none') {
      parentContent.style.maxHeight = (parentContent.scrollHeight + content.scrollHeight) + 'px';
    }
    yearAccordionEl.classList.add('open');
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    if (parentContent && parentContent.style.maxHeight !== 'none') {
      parentContent.style.maxHeight = (parentContent.scrollHeight - content.scrollHeight) + 'px';
    }
    yearAccordionEl.classList.remove('open');
    content.style.maxHeight = '0px';
  }
}

// Main filter logic and accordion renderer
function filterAndRender() {
  // 1. Filter the papers array
  const filteredPapers = papersData.filter(paper => {
    const matchesSubject = (activeSubject === 'all' || paper.subjectCode === activeSubject);
    const matchesYear = (activeYear === 'all' || paper.year === activeYear);
    
    let matchesSearch = true;
    if (searchQuery) {
      const matchText = `${paper.displayName} ${paper.subjectName} ${paper.subjectCode} ${paper.year} ${paper.fileName}`.toLowerCase();
      matchesSearch = matchText.includes(searchQuery);
    }
    
    return matchesSubject && matchesYear && matchesSearch;
  });

  // 2. Update Header Title and Counter
  let activeSubjectName = 'All Subjects';
  if (activeSubject !== 'all') {
    const activeTag = document.querySelector(`.subject-tag[data-subject="${activeSubject}"]`);
    if (activeTag) {
      activeSubjectName = activeTag.querySelector('.subject-tag-name').textContent;
    }
  }
  
  let titleText = activeSubjectName;
  if (activeYear !== 'all') {
    titleText += ` - ${activeYear}`;
  }
  
  currentFilterTitle.textContent = titleText;
  filteredCountText.textContent = `Showing ${filteredPapers.length} paper${filteredPapers.length === 1 ? '' : 's'}`;

  // 3. Render HTML
  if (filteredPapers.length === 0) {
    papersGridList.style.display = 'none';
    noPapersPlaceholder.style.display = 'flex';
    emptyStateMessage.textContent = papersData.length === 0 
      ? 'Add paper PDFs inside your subject and year directories on GitHub to view them here.'
      : 'Try adjusting your search keywords or resetting your subject and year filters.';
  } else {
    noPapersPlaceholder.style.display = 'none';
    papersGridList.style.display = 'flex';
    
    // Group papers by Subject, then Year
    const grouped = groupPapers(filteredPapers);
    
    // Render the nested HTML
    renderAccordions(grouped);
    
    // Auto-expand accordions if search query is active or if filters are specific
    const autoExpand = (searchQuery.length > 0 || activeSubject !== 'all' || activeYear !== 'all');
    if (autoExpand) {
      const subjectEls = papersGridList.querySelectorAll('.subject-accordion');
      subjectEls.forEach(subjectEl => {
        toggleSubjectAccordion(subjectEl, true);
        
        const yearEls = subjectEl.querySelectorAll('.year-accordion');
        yearEls.forEach(yearEl => {
          toggleYearAccordion(yearEl, true);
        });
      });
    }
  }
}

// Group papers by Subject and Year
function groupPapers(papers) {
  const grouped = {};
  
  papers.forEach(paper => {
    const subjectKey = paper.subjectCode || paper.subjectName;
    if (!grouped[subjectKey]) {
      grouped[subjectKey] = {
        code: paper.subjectCode,
        name: paper.subjectName,
        years: {}
      };
    }
    
    if (!grouped[subjectKey].years[paper.year]) {
      grouped[subjectKey].years[paper.year] = [];
    }
    
    grouped[subjectKey].years[paper.year].push(paper);
  });
  
  return grouped;
}

// Render Accordions HTML
function renderAccordions(grouped) {
  papersGridList.innerHTML = '';
  
  // Sort subjects alphabetically
  const sortedSubjects = Object.keys(grouped).sort();
  
  sortedSubjects.forEach(subKey => {
    const subject = grouped[subKey];
    
    // Create Subject Accordion element
    const subjectAccordion = document.createElement('div');
    subjectAccordion.className = 'subject-accordion';
    
    // Calculate total papers in this subject
    let totalSubPapers = 0;
    Object.keys(subject.years).forEach(y => {
      totalSubPapers += subject.years[y].length;
    });
    
    const subjectCodeHtml = subject.code ? `<span class="subject-code-badge">${subject.code}</span>` : '';
    
    subjectAccordion.innerHTML = `
      <div class="accordion-header">
        <div class="accordion-header-left">
          <span class="folder-icon-glow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          <span class="accordion-title">
            ${subjectCodeHtml}
            ${subject.name}
            <span class="paper-count-badge">${totalSubPapers} paper${totalSubPapers === 1 ? '' : 's'}</span>
          </span>
        </div>
        <span class="accordion-chevron">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      <div class="accordion-content">
        <div class="accordion-content-inner">
          <!-- Years go here -->
        </div>
      </div>
    `;
    
    // Bind header click
    const header = subjectAccordion.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      toggleSubjectAccordion(subjectAccordion);
    });
    
    // Populate Years
    const yearsContainer = subjectAccordion.querySelector('.accordion-content-inner');
    const sortedYears = Object.keys(subject.years).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return b.localeCompare(a); // Descending order for years
    });
    
    sortedYears.forEach(year => {
      const papers = subject.years[year];
      const yearAccordion = document.createElement('div');
      yearAccordion.className = 'year-accordion';
      
      yearAccordion.innerHTML = `
        <div class="year-header">
          <div class="year-header-left">
            <span class="calendar-icon-glow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            <span>${year}</span>
            <span class="paper-count-badge" style="font-size: 0.7rem; font-weight: normal;">${papers.length} file${papers.length === 1 ? '' : 's'}</span>
          </div>
          <span class="year-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
        <div class="year-content">
          <div class="year-content-inner">
            <!-- Files go here -->
          </div>
        </div>
      `;
      
      // Bind year click
      const yearHeader = yearAccordion.querySelector('.year-header');
      yearHeader.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent parent click
        toggleYearAccordion(yearAccordion);
      });
      
      // Populate Files
      const filesContainer = yearAccordion.querySelector('.year-content-inner');
      papers.forEach(paper => {
        const fileRow = document.createElement('div');
        fileRow.className = 'file-row';
        
        fileRow.innerHTML = `
          <div class="file-row-left">
            <span class="file-name-text" title="${paper.displayName}">${paper.displayName}</span>
          </div>
          <div class="file-row-right">
            <div class="file-info">
              <span class="file-ext">${paper.fileExtension}</span>
              <span class="file-size">${paper.fileSize}</span>
            </div>
            <a href="${paper.filePath}" download="${paper.fileName}" class="download-link-btn" title="Download Paper">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
          </div>
        `;
        
        fileRow.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        
        filesContainer.appendChild(fileRow);
      });
      
      yearsContainer.appendChild(yearAccordion);
    });
    
    papersGridList.appendChild(subjectAccordion);
  });
}
