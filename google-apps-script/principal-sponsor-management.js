/**
 * Google Apps Script for Principal Sponsor + Proposal Response Management
 * Deploy this as a Web App — one deployment URL serves both:
 *   - PrincipalSponsors sheet (godparent names)
 *   - ProposalResponses sheet (accept/decline audit log)
 *
 * Used by /app/api/principal-sponsor/route.ts and /app/api/proposal-responses/route.ts
 *
 * IMPORTANT — use this file OR proposal-responses-management.js, not both.
 * Apps Script shares one global scope across all .gs files in a project.
 * Pasting both causes: "Identifier 'PROPOSAL_SHEET_NAME' has already been declared"
 * and duplicate doPost/doGet errors.
 *
 * PrincipalSponsors columns:
 * A: MalePrincipalSponsor
 * B: FemalePrincipalSponsor
 *
 * ProposalResponses columns:
 * A: ID | B: Role | C: Name | D: Status | E: SubmittedAt | F: Category
 */

const PROPOSAL_SHEET_NAME = 'ProposalResponses';
const PROPOSAL_COLUMN_COUNT = 6;

const SPONSOR_ROLE_NINONG = 'principal-sponsor-ninong';
const SPONSOR_ROLE_NINANG = 'principal-sponsor-ninang';
const SPONSOR_ROLE_ALIASES = {
  ninong: SPONSOR_ROLE_NINONG,
  ninang: SPONSOR_ROLE_NINANG,
};

function resolveSponsorRoleId(role) {
  const normalized = String(role || '').trim();
  return SPONSOR_ROLE_ALIASES[normalized] || normalized;
}

/**
 * Handle POST requests (Create, Update, Delete sponsors; Log proposals)
 */
function doPost(e) {
  // Guard against running without event data
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid request. This function must be called via web app deployment.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const body = JSON.parse(e.postData.contents);
  const action = body.action || 'create';

  try {
    if (action === 'proposal' || action === 'delete-proposal') {
      const proposalSheet = getProposalSheet();
      if (!proposalSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'ProposalResponses sheet not found. Please run initializeProposalResponsesSheet() first.' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      let result;
      if (action === 'proposal') {
        result = createProposalResponse(proposalSheet, body);
      } else {
        result = deleteProposalResponse(proposalSheet, body);
      }

      return ContentService.createTextOutput(
        JSON.stringify(result)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PrincipalSponsors');

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: 'PrincipalSponsors sheet not found. Please run initializePrincipalSponsorSheet() first.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    let result;

    switch (action) {
      case 'create':
        result = createPrincipalSponsor(sheet, body);
        break;
      case 'update':
        result = updatePrincipalSponsor(sheet, body);
        break;
      case 'delete':
        result = deletePrincipalSponsor(sheet, body);
        break;
      default:
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Invalid action. Use "create", "update", "delete", "proposal", or "delete-proposal".' })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (Read sponsors or proposal responses)
 */
function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = params.action;

  try {
    if (action === 'proposals') {
      const proposalSheet = getProposalSheet();
      if (!proposalSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'ProposalResponses sheet not found. Please run initializeProposalResponsesSheet() first.' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const proposals = getAllProposalResponses(proposalSheet);
      return ContentService.createTextOutput(
        JSON.stringify(proposals)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'stats') {
      const proposalSheet = getProposalSheet();
      if (!proposalSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'ProposalResponses sheet not found. Please run initializeProposalResponsesSheet() first.' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      return ContentService.createTextOutput(
        JSON.stringify(getProposalStatistics(proposalSheet))
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PrincipalSponsors');

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: 'PrincipalSponsors sheet not found. Please run initializePrincipalSponsorSheet() first.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const sponsors = getAllPrincipalSponsors(sheet);

    return ContentService.createTextOutput(
      JSON.stringify(sponsors)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all principal sponsors
 */
function getAllPrincipalSponsors(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  return data
    .filter(row => row[0] || row[1]) // Filter out completely empty rows
    .map(row => ({
      MalePrincipalSponsor: row[0] || '',
      FemalePrincipalSponsor: row[1] || ''
    }));
}

/**
 * Find the first row (from startRow) with an empty cell in the given column.
 */
function findFirstEmptyRowInColumn(sheet, column, startRow) {
  var lastRow = Math.max(sheet.getLastRow(), startRow);
  var values = sheet.getRange(startRow, column, lastRow, column).getValues();

  for (var i = 0; i < values.length; i++) {
    if (!String(values[i][0] || '').trim()) {
      return startRow + i;
    }
  }

  return lastRow + 1;
}

/**
 * Find the first row (from startRow) where both sponsor columns are empty.
 */
function findFirstEmptyPairRow(sheet, startRow) {
  var lastRow = Math.max(sheet.getLastRow(), startRow);
  var values = sheet.getRange(startRow, 1, lastRow, 2).getValues();

  for (var i = 0; i < values.length; i++) {
    var male = String(values[i][0] || '').trim();
    var female = String(values[i][1] || '').trim();
    if (!male && !female) {
      return startRow + i;
    }
  }

  return lastRow + 1;
}

/**
 * Check whether a name already exists in a column.
 */
function nameExistsInColumn(sheet, column, name, startRow) {
  var lastRow = Math.max(sheet.getLastRow(), startRow);
  var values = sheet.getRange(startRow, column, lastRow, column).getValues();

  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0] || '').trim() === name) {
      return true;
    }
  }

  return false;
}

/**
 * Create a new principal sponsor
 */
function createPrincipalSponsor(sheet, data) {
  // Validate required fields
  if (!data.MalePrincipalSponsor && !data.FemalePrincipalSponsor) {
    throw new Error('At least one sponsor name is required');
  }

  const maleSponsor = (data.MalePrincipalSponsor || '').toString().trim();
  const femaleSponsor = (data.FemalePrincipalSponsor || '').toString().trim();
  const startRow = 2;

  // Check for duplicates
  if (maleSponsor && nameExistsInColumn(sheet, 1, maleSponsor, startRow)) {
    return {
      status: 'ok',
      message: 'Principal sponsor already exists',
      data: {
        MalePrincipalSponsor: maleSponsor,
        FemalePrincipalSponsor: femaleSponsor
      }
    };
  }

  if (femaleSponsor && nameExistsInColumn(sheet, 2, femaleSponsor, startRow)) {
    return {
      status: 'ok',
      message: 'Principal sponsor already exists',
      data: {
        MalePrincipalSponsor: maleSponsor,
        FemalePrincipalSponsor: femaleSponsor
      }
    };
  }

  var targetRow;

  if (maleSponsor && femaleSponsor) {
    // Pair add: use the first fully empty row, otherwise append.
    targetRow = findFirstEmptyPairRow(sheet, startRow);
    sheet.getRange(targetRow, 1).setValue(maleSponsor);
    sheet.getRange(targetRow, 2).setValue(femaleSponsor);
  } else if (maleSponsor) {
    // Ninong / male only: fill the first empty cell in column A.
    targetRow = findFirstEmptyRowInColumn(sheet, 1, startRow);
    sheet.getRange(targetRow, 1).setValue(maleSponsor);
  } else {
    // Ninang / female only: fill the first empty cell in column B.
    targetRow = findFirstEmptyRowInColumn(sheet, 2, startRow);
    sheet.getRange(targetRow, 2).setValue(femaleSponsor);
  }

  return {
    status: 'ok',
    message: 'Principal sponsor added successfully',
    data: {
      MalePrincipalSponsor: maleSponsor,
      FemalePrincipalSponsor: femaleSponsor
    }
  };
}

/**
 * Update an existing principal sponsor
 */
function updatePrincipalSponsor(sheet, data) {
  // Validate required fields
  if (!data.originalMale && !data.originalFemale) {
    throw new Error('Original sponsor information is required for update');
  }

  const originalMale = (data.originalMale || '').toString().trim();
  const originalFemale = (data.originalFemale || '').toString().trim();
  const newMale = (data.MalePrincipalSponsor || '').toString().trim();
  const newFemale = (data.FemalePrincipalSponsor || '').toString().trim();

  // Find the sponsor row by matching both male and female names
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    throw new Error('No principal sponsors found');
  }

  const allData = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < allData.length; i++) {
    const currentMale = allData[i][0].toString().trim();
    const currentFemale = allData[i][1].toString().trim();
    
    // Match both names to identify the correct row
    if (currentMale === originalMale && currentFemale === originalFemale) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Principal sponsor not found: ' + originalMale + ' & ' + originalFemale);
  }

  // Update the sponsor
  sheet.getRange(rowIndex, 1).setValue(newMale);
  sheet.getRange(rowIndex, 2).setValue(newFemale);

  return {
    status: 'ok',
    message: 'Principal sponsor updated successfully',
    data: {
      MalePrincipalSponsor: newMale,
      FemalePrincipalSponsor: newFemale
    }
  };
}

/**
 * Delete a principal sponsor
 */
function deletePrincipalSponsor(sheet, data) {
  // Validate required fields
  if (!data.MalePrincipalSponsor && !data.FemalePrincipalSponsor) {
    throw new Error('Sponsor information is required for deletion');
  }

  const maleSponsor = (data.MalePrincipalSponsor || '').toString().trim();
  const femaleSponsor = (data.FemalePrincipalSponsor || '').toString().trim();

  // Find the sponsor row
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    throw new Error('No principal sponsors found');
  }

  const allData = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < allData.length; i++) {
    const currentMale = allData[i][0].toString().trim();
    const currentFemale = allData[i][1].toString().trim();
    
    // Match both names to identify the correct row
    if (currentMale === maleSponsor && currentFemale === femaleSponsor) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Principal sponsor not found: ' + maleSponsor + ' & ' + femaleSponsor);
  }

  // Delete the row
  sheet.deleteRow(rowIndex);

  return {
    status: 'ok',
    message: 'Principal sponsor deleted successfully'
  };
}

/**
 * Initialize the PrincipalSponsors sheet with headers
 * Run this function once from the Script Editor before deploying
 */
function initializePrincipalSponsorSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('PrincipalSponsors');
  
  if (!sheet) {
    sheet = ss.insertSheet('PrincipalSponsors');
  }
  
  // Set headers
  sheet.getRange(1, 1).setValue('MalePrincipalSponsor');
  sheet.getRange(1, 2).setValue('FemalePrincipalSponsor');
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 2);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  
  // Set column widths
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 250);
  
  Logger.log('PrincipalSponsors sheet initialized successfully');
}

function getProposalSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PROPOSAL_SHEET_NAME);
}

function rowToProposalResponse(row) {
  return {
    id: String(row[0] || ''),
    role: String(row[1] || ''),
    name: String(row[2] || ''),
    status: String(row[3] || ''),
    submittedAt: String(row[4] || ''),
    category: String(row[5] || ''),
  };
}

function getAllProposalResponses(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, PROPOSAL_COLUMN_COUNT).getValues();

  return values
    .filter(function (row) {
      return row[0] || row[1] || row[2];
    })
    .map(rowToProposalResponse)
    .filter(function (proposal) {
      return proposal.status === 'Confirmed' || proposal.status === 'Declined';
    });
}

function syncConfirmedSponsorFromProposal(data) {
  if (data.status !== 'Confirmed') {
    return null;
  }

  const role = resolveSponsorRoleId(data.role);
  const name = String(data.name || '').trim();

  if (!name) {
    return null;
  }

  const sponsorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PrincipalSponsors');
  if (!sponsorSheet) {
    throw new Error('PrincipalSponsors sheet not found. Please run initializePrincipalSponsorSheet() first.');
  }

  if (role === SPONSOR_ROLE_NINONG) {
    return createPrincipalSponsor(sponsorSheet, {
      MalePrincipalSponsor: name,
      FemalePrincipalSponsor: '',
    });
  }

  if (role === SPONSOR_ROLE_NINANG) {
    return createPrincipalSponsor(sponsorSheet, {
      MalePrincipalSponsor: '',
      FemalePrincipalSponsor: name,
    });
  }

  return null;
}

function createProposalResponse(sheet, data) {
  if (!data.role) {
    throw new Error('Role is required');
  }

  const status = String(data.status || '').trim();
  if (status !== 'Confirmed' && status !== 'Declined') {
    throw new Error('Status must be "Confirmed" or "Declined"');
  }

  const role = String(data.role).trim();
  const name = String(data.name || '').trim();
  const submittedAt = String(data.submittedAt || new Date().toISOString()).trim();
  const category = String(data.category || data.roleCategory || '').trim();
  const id = String(data.id || Utilities.getUuid()).trim();

  const rowData = [
    id,
    role,
    name,
    status,
    submittedAt,
    category,
  ];

  sheet.appendRow(rowData);

  const proposal = {
    id: id,
    role: role,
    name: name,
    status: status,
    submittedAt: submittedAt,
    category: category,
  };

  let sponsorSync = null;
  if (status === 'Confirmed') {
    sponsorSync = syncConfirmedSponsorFromProposal(data);
  }

  return {
    status: 'ok',
    message: 'Proposal response saved successfully',
    proposal: proposal,
    sponsorSync: sponsorSync,
  };
}

function deleteProposalResponse(sheet, data) {
  if (!data.id) {
    throw new Error('Proposal ID is required for deletion');
  }

  const id = String(data.id).trim();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    throw new Error('No proposal responses found');
  }

  const idColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let rowIndex = -1;

  for (let i = 0; i < idColumn.length; i++) {
    if (String(idColumn[i][0]).trim() === id) {
      rowIndex = i + 2;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error('Proposal response not found with ID: ' + id);
  }

  sheet.deleteRow(rowIndex);

  return {
    status: 'ok',
    message: 'Proposal response deleted successfully',
    id: id,
  };
}

function initializeProposalResponsesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PROPOSAL_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(PROPOSAL_SHEET_NAME);
  }

  const headers = [
    'ID',
    'Role',
    'Name',
    'Status',
    'SubmittedAt',
    'Category',
  ];

  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#8C6B4F');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 220);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(5, 200);
    sheet.setColumnWidth(6, 180);
  }

  return { status: 'ok', message: 'ProposalResponses sheet initialized successfully' };
}

function getProposalStatistics(sheet) {
  const proposals = getAllProposalResponses(sheet);

  const stats = {
    total: proposals.length,
    confirmed: 0,
    declined: 0,
    byRole: {},
    byCategory: {},
  };

  proposals.forEach(function (proposal) {
    if (proposal.status === 'Confirmed') {
      stats.confirmed++;
    } else if (proposal.status === 'Declined') {
      stats.declined++;
    }

    stats.byRole[proposal.role] = (stats.byRole[proposal.role] || 0) + 1;

    const categoryKey = proposal.category || 'Uncategorized';
    stats.byCategory[categoryKey] = (stats.byCategory[categoryKey] || 0) + 1;
  });

  return stats;
}

function initializeAllSheets() {
  initializePrincipalSponsorSheet();
  initializeProposalResponsesSheet();
  return { status: 'ok', message: 'PrincipalSponsors and ProposalResponses sheets initialized' };
}


