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
      // Only include files (ignore hidden files and .gitkeep)
      if (!file.startsWith('.') && file !== '.gitkeep') {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Helper to clean up filenames and make them human readable
function parsePaperDetails(absoluteFilePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), absoluteFilePath);
  const pathParts = relativePath.split(path.sep); // e.g. ["papers", "4CH1 Chemistry", "2023", "filename.pdf"]
  
  // Basic info from folder structure
  const subjectFolder = pathParts[1] || 'Unknown Subject';
  const yearFolder = pathParts[2] || 'Other';
  const filename = pathParts[3] || path.basename(absoluteFilePath);
  
  // Extract Subject Code and Subject Name
  // Subject folders are named like "4CH1 Chemistry" or "4MA1 Mathematics A"
  let subjectCode = '';
  let subjectName = subjectFolder;
  const subjectMatch = subjectFolder.match(/^([A-Z0-9]+)\s+(.+)$/);
  if (subjectMatch) {
    subjectCode = subjectMatch[1];
    subjectName = subjectMatch[2];
  }

  // Parse filename to see if it fits Edexcel's pattern: [SubjectCode]_[PaperCode]_[DocType]_[Date].pdf
  // Example: 4CH1_1C_que_20230518.pdf
  const ext = path.extname(filename);
  const baseNameWithoutExt = path.basename(filename, ext);
  
  let displayName = baseNameWithoutExt;
  let paperCode = '';
  let docType = 'Document';
  let examSeries = ''; // e.g. "January 2023" or "June 2023"

  // Check if filename fits the standard Edexcel past paper pattern
  // Pattern: CODE_PAPER_TYPE_DATE (e.g., 4CH1_1C_que_20230518) or 4MA1_1H_msc_20240115
  const parts = baseNameWithoutExt.split('_');
  
  if (parts.length >= 3) {
    // Check if first part matches or is similar to subject code
    const fileSubjectCode = parts[0];
    
    // The second part is usually the paper, like 1C, 2C, 1H, 2H, 1P, 2P, 1, 2, Paper 1, Paper 2
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

    // The third part is document type, like que (question paper), msc (mark scheme), rms (regional mark scheme), er (examiner report)
    const rawDocType = parts[2].toLowerCase();
    switch (rawDocType) {
      case 'que':
      case 'qp':
        docType = 'Question Paper';
        break;
      case 'msc':
      case 'ms':
        docType = 'Mark Scheme';
        break;
      case 'rms':
        docType = 'Regional Mark Scheme';
        break;
      case 'er':
        docType = 'Examiner Report';
        break;
      case 'lts':
        docType = 'Listening Transcript';
        break;
      default:
        docType = rawDocType.toUpperCase();
    }

    // The fourth part is often a date or year, e.g. 20230518
    if (parts[3] && parts[3].match(/^\d{8}$/)) {
      const dateStr = parts[3];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      
      let seriesMonth = '';
      if (month === '01') {
        seriesMonth = 'January';
      } else if (month === '05' || month === '06') {
        seriesMonth = 'June';
      } else if (month === '10' || month === '11') {
        seriesMonth = 'October';
      } else {
        seriesMonth = 'Series';
      }
      
      examSeries = `${seriesMonth} ${year}`;
    }
  }

  // If we successfully parsed the parts, build a beautiful display name
  if (paperCode && docType) {
    const paperLabel = paperCode.startsWith('Paper') ? paperCode : `Paper ${paperCode}`;
    displayName = `${paperLabel} - ${docType}`;
    if (examSeries) {
      displayName += ` (${examSeries})`;
    } else if (yearFolder !== 'Other') {
      displayName += ` (${yearFolder})`;
    }
  } else {
    // If not standard Edexcel format, just clean up the name nicely
    displayName = baseNameWithoutExt
      .replace(/[_-]/g, ' ') // replace underscores/dashes with spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
  }

  // Get file size in bytes and convert to human readable format
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
    year: yearFolder,
    fileName: filename,
    fileExtension: ext.replace('.', '').toUpperCase(),
    fileSize,
    filePath: relativePath.replace(/\\/g, '/'), // Use forward slashes for URLs
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

  // Sort catalog by Subject, then Year (descending), then Paper Name
  catalog.sort((a, b) => {
    if (a.subjectName !== b.subjectName) {
      return a.subjectName.localeCompare(b.subjectName);
    }
    if (a.year !== b.year) {
      return b.year.localeCompare(a.year); // Descending order for years (e.g. 2024 first)
    }
    return a.displayName.localeCompare(b.displayName);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Catalog successfully written to ${OUTPUT_FILE}`);
}

generateCatalog();
