/**
 * Google Apps Script for Proposal Response Management
 * Deploy this as a Web App to log entourage / principal sponsor proposal responses.
 *
 * Used by /app/api/proposal-responses/route.ts
 *
 * IMPORTANT — use this file OR principal-sponsor-management.js, not both.
 * Apps Script shares one global scope across all .gs files in a project.
 * Pasting both causes: "Identifier 'PROPOSAL_SHEET_NAME' has already been declared"
 * and duplicate doPost/doGet errors.
 *
 * - Proposals only → paste ONLY this file into its own Apps Script project
 * - Sponsors + proposals → paste ONLY principal-sponsor-management.js instead
 *
 * Sheet Structure: Each response is a row with the following columns:
 * A: ID
 * B: Role (proposal role id, e.g. best-man, honor-attendant)
 * C: Name
 * D: Status (Confirmed | Declined)
 * E: SubmittedAt (ISO timestamp)
 * F: Category (RoleCategory from entourage sheet, e.g. Best Man, Groomsmen)
 */

const PROPOSAL_SHEET_NAME = 'ProposalResponses';
const PROPOSAL_COLUMN_COUNT = 6;

/**
 * Handle POST requests (Create proposal, Delete proposal)
 */
function doPost(e) {
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid request. This function must be called via web app deployment.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getProposalSheet();
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'ProposalResponses sheet not found. Please run initializeProposalResponsesSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const body = JSON.parse(e.postData.contents);
  const action = body.action || 'proposal';

  try {
    let result;

    switch (action) {
      case 'proposal':
        result = createProposalResponse(sheet, body);
        break;
      case 'delete-proposal':
        result = deleteProposalResponse(sheet, body);
        break;
      default:
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Invalid action. Use "proposal" or "delete-proposal".' })
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
 * Handle GET requests (Read proposal responses)
 */
function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = params.action || 'proposals';

  const sheet = getProposalSheet();
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'ProposalResponses sheet not found. Please run initializeProposalResponsesSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (action === 'proposals') {
      const proposals = getAllProposalResponses(sheet);
      return ContentService.createTextOutput(
        JSON.stringify(proposals)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'stats') {
      return ContentService.createTextOutput(
        JSON.stringify(getProposalStatistics(sheet))
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid action. Use "proposals" or "stats".' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
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

  return {
    status: 'ok',
    message: 'Proposal response saved successfully',
    proposal: proposal,
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

function addSampleProposalResponses() {
  let sheet = getProposalSheet();

  if (!sheet) {
    initializeProposalResponsesSheet();
    sheet = getProposalSheet();
  }

  const samples = [
    {
      id: 'best-man-sample-1',
      role: 'best-man',
      name: 'John Smith',
      status: 'Confirmed',
      submittedAt: new Date().toISOString(),
      category: 'Best Man',
    },
    {
      id: 'bridesmaid-sample-1',
      role: 'bridesmaid',
      name: 'Jane Doe',
      status: 'Confirmed',
      submittedAt: new Date().toISOString(),
      category: 'Bridesmaids',
    },
    {
      id: 'groomsman-sample-1',
      role: 'groomsman',
      name: 'Declined Entourage Offer',
      status: 'Declined',
      submittedAt: new Date().toISOString(),
      category: 'Groomsmen',
    },
  ];

  samples.forEach(function (sample) {
    createProposalResponse(sheet, sample);
  });

  return { status: 'ok', message: 'Sample proposal responses added successfully' };
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

function testSetup() {
  try {
    let sheet = getProposalSheet();

    if (!sheet) {
      Logger.log('ProposalResponses sheet not found. Creating...');
      initializeProposalResponsesSheet();
      return 'Sheet created and initialized!';
    }

    const lastRow = sheet.getLastRow();
    Logger.log('Sheet found: ' + PROPOSAL_SHEET_NAME);
    Logger.log('Last row: ' + lastRow);
    Logger.log('Headers: ' + sheet.getRange(1, 1, 1, PROPOSAL_COLUMN_COUNT).getValues());

    if (lastRow > 1) {
      Logger.log('Sample row: ' + sheet.getRange(2, 1, 1, PROPOSAL_COLUMN_COUNT).getValues());
    } else {
      Logger.log('No data yet. Run addSampleProposalResponses() to add sample data.');
    }

    return 'Setup looks good!';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

function testDoGet() {
  try {
    Logger.log('Testing doGet with action=proposals...');
    const result = doGet({ parameter: { action: 'proposals' } });
    Logger.log('Result: ' + result.getContent());
    return 'doGet test complete. Check logs.';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

function exportProposalResponsesToCSV() {
  const sheet = getProposalSheet();

  if (!sheet) {
    return { error: 'ProposalResponses sheet not found' };
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { error: 'No proposal responses to export' };
  }

  const data = sheet.getRange(1, 1, lastRow, PROPOSAL_COLUMN_COUNT).getValues();
  let csv = '';

  data.forEach(function (row) {
    csv += row.map(function (cell) {
      const cellStr = String(cell);
      if (cellStr.indexOf(',') !== -1 || cellStr.indexOf('"') !== -1 || cellStr.indexOf('\n') !== -1) {
        return '"' + cellStr.replace(/"/g, '""') + '"';
      }
      return cellStr;
    }).join(',') + '\n';
  });

  return {
    status: 'ok',
    csv: csv,
    rowCount: lastRow - 1,
  };
}
