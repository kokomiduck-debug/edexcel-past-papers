const fs = require('fs');
const path = require('path');

const PAPERS_DIR = path.join(__dirname, '..', 'papers');
const OUTPUT_FILE = path.join(__dirname, '..', 'papers-catalog.json');

// Helper to recursively scan directory
function scanDir(dirPath) {
  let results = [];
  
  if (!fs.existsSync(dirPath)) {
    return results;
  }

  const list = fs.readdirSync(dirPath);
  
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(filePath));
    } else {
      if (!file.startsWith('.') && file !== '.gitkeep') {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Helper to clean up filenames and parse details
function parsePaperDetails(absoluteFilePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), absoluteFilePath);
  const pathParts = relativePath.split(path.sep); // e.g. ["papers", "4CH1 Chemistry", "May June 2026", "filename.pdf"]
  
  const subjectFolder = pathParts[1] || 'Unknown Subject';
  const yearFolder = pathParts[2] || 'Other';
  const filename = pathParts[3] || path.basename(absoluteFilePath);
  
  // Extract Subject Code and Subject Name
  let subjectCode = '';
  let subjectName = subjectFolder;
  const subjectMatch = subjectFolder.match(/^([A-Z0-9]+)\s+(.+)$/);
  if (subjectMatch) {
    subjectCode = subjectMatch[1];
    subjectName = subjectMatch[2];
  }

  // Parse Year and Session from the folder name (e.g. "May June 2026" or "January 2019")
  let year = 'Other';
  let session = 'Other';
  const folderMatch = yearFolder.match(/^(May June|January|November)\s+(\d{4})$/i);
  if (folderMatch) {
    const rawSession = folderMatch[1].toLowerCase();
    year = folderMatch[2];
    if (rawSession === 'may june') session = 'May/June';
    else if (rawSession === 'january') session = 'January';
    else if (rawSession === 'november') session = 'November';
  } else if (yearFolder.match(/^\d{4}$/)) {
    year = yearFolder;
    session = 'Other';
  } else {
    year = yearFolder;
  }

  // Parse filename details
  const ext = path.extname(filename);
  const baseNameWithoutExt = path.basename(filename, ext);
  
  let displayName = baseNameWithoutExt;
  let paperCode = '';
  let docTypeLabel = 'Document';
  let docTypeCategory = 'Other'; // QP, MS, ER, GB, Other
  let examSeries = ''; // parsed from filename date if available

  const parts = baseNameWithoutExt.split('_');
  
  if (parts.length >= 3) {
    // 1. Paper variant / code (e.g., 1C, 2C, 1H, 2H, 1P, 2P, 1, 2)
    let paperPart = parts[1].trim();
    const paperMatch = paperPart.match(/^paper\s*(\d+)$/i);
    if (paperMatch) {
      paperCode = `Paper ${parseInt(paperMatch[1], 10)}`;
    } else if (paperPart.match(/^\d+$/)) {
      paperCode = `Paper ${parseInt(paperPart, 10)}`;
    } else if (paperPart.match(/^(\d+)([a-zA-Z]+)$/)) {
      const num = paperPart.match(/^(\d+)/)[0];
      const letters = paperPart.match(/([a-zA-Z]+)$/)[0].toUpperCase();
      paperCode = `Paper ${parseInt(num, 10)} (${num}${letters})`;
    } else {
      paperCode = paperPart.toUpperCase();
    }

    // 2. Document type
    const rawDocType = parts[2].toLowerCase();
    switch (rawDocType) {
      case 'que':
      case 'qp':
        docTypeLabel = 'Question Paper';
        docTypeCategory = 'QP';
        break;
      case 'msc':
      case 'ms':
        docTypeLabel = 'Mark Scheme';
        docTypeCategory = 'MS';
        break;
      case 'rms':
        docTypeLabel = 'Regional Mark Scheme';
        docTypeCategory = 'MS';
        break;
      case 'er':
        docTypeLabel = 'Examiner Report';
        docTypeCategory = 'ER';
        break;
      case 'gb':
        docTypeLabel = 'Grade Boundaries';
        docTypeCategory = 'GB';
        break;
      case 'lts':
        docTypeLabel = 'Listening Transcript';
        docTypeCategory = 'Other';
        break;
      default:
        docTypeLabel = rawDocType.toUpperCase();
        docTypeCategory = 'Other';
    }

    // 3. Exam date extraction for series override
    if (parts[3] && parts[3].match(/^\d{8}$/)) {
      const dateStr = parts[3];
      const fileYear = dateStr.substring(0, 4);
      const fileMonth = dateStr.substring(4, 6);
      
      let seriesMonth = '';
      if (fileMonth === '01') {
        seriesMonth = 'January';
        if (session === 'Other') session = 'January';
      } else if (fileMonth === '05' || fileMonth === '06') {
        seriesMonth = 'June';
        if (session === 'Other') session = 'May/June';
      } else if (fileMonth === '10' || fileMonth === '11') {
        seriesMonth = 'October';
        if (session === 'Other') session = 'November';
      } else {
        seriesMonth = 'Series';
      }
      
      examSeries = `${seriesMonth} ${fileYear}`;
      if (year === 'Other') year = fileYear;
    }
  } else {
    // FALLBACK: Match keywords in filenames if they don't use underscores
    const lowerFilename = baseNameWithoutExt.toLowerCase();
    
    if (lowerFilename.includes('mark') || lowerFilename.includes('scheme') || lowerFilename.includes('ms')) {
      docTypeLabel = 'Mark Scheme';
      docTypeCategory = 'MS';
    } else if (lowerFilename.includes('question') || lowerFilename.includes('paper') || lowerFilename.includes('qp')) {
      docTypeLabel = 'Question Paper';
      docTypeCategory = 'QP';
    } else if (lowerFilename.includes('examiner') || lowerFilename.includes('report') || lowerFilename.includes('er')) {
      docTypeLabel = 'Examiner Report';
      docTypeCategory = 'ER';
    } else if (lowerFilename.includes('boundary') || lowerFilename.includes('boundaries') || lowerFilename.includes('gb')) {
      docTypeLabel = 'Grade Boundaries';
      docTypeCategory = 'GB';
    }
  }

  // Format display title
  if (paperCode && docTypeLabel) {
    const paperLabel = paperCode.startsWith('Paper') ? paperCode : `Paper ${paperCode}`;
    displayName = `${paperLabel} - ${docTypeLabel}`;
    if (examSeries) {
      displayName += ` (${examSeries})`;
    } else if (yearFolder !== 'Other') {
      displayName += ` (${yearFolder})`;
    }
  } else {
    displayName = baseNameWithoutExt
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Get file size
  let fileSize = 'Unknown Size';
  try {
    const stats = fs.statSync(absoluteFilePath);
    const bytes = stats.size;
    if (bytes < 1024) fileSize = bytes + ' B';
    else if (bytes < 1048576) fileSize = (bytes / 1024).toFixed(1) + ' KB';
    else fileSize = (bytes / 1048576).toFixed(1) + ' MB';
  } catch (e) {}

  return {
    subjectCode,
    subjectName,
    year,
    session,
    docTypeLabel,
    docTypeCategory,
    fileName: filename,
    fileExtension: ext.replace('.', '').toUpperCase(),
    fileSize,
    filePath: relativePath.replace(/\\/g, '/'),
    displayName
  };
}

function generateCatalog() {
  console.log('Scanning papers directory...');
  const files = scanDir(PAPERS_DIR);
  console.log(`Found ${files.length} paper file(s).`);

  const catalog = files.map((file) => {
    return parsePaperDetails(file);
  });

  // Sort by Subject Name, Year (descending), Session (descending), Document Title
  catalog.sort((a, b) => {
    if (a.subjectName !== b.subjectName) {
      return a.subjectName.localeCompare(b.subjectName);
    }
    if (a.year !== b.year) {
      return b.year.localeCompare(a.year);
    }
    if (a.session !== b.session) {
      return b.session.localeCompare(a.session);
    }
    return a.displayName.localeCompare(b.displayName);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Catalog successfully written to ${OUTPUT_FILE}`);
}

generateCatalog();
