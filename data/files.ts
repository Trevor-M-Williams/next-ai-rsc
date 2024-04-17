const allFiles = [
  {
    name: "2022-goverance-challenges-kpmg-custom-covers.pdf",
    title: "Goverance Challenges 2022",
    updated: "2024-02-16T23:23:45.468Z",
    size: 1439651,
  },
  {
    name: "2023_Governance_Outlook.pdf",
    title: "Governance Outlook 2023",
    updated: "2024-02-16T23:23:53.398Z",
    size: 13777340,
  },
  {
    name: "DI_Boardroom-climate-piece.pdf",
    title: "DI Boardroom Climate Piece",
    updated: "2024-02-16T23:23:46.464Z",
    size: 1676805,
  },
  {
    name: "GenGoods_Agenda.pdf",
    title: "Agenda",
    updated: "2024-02-05T20:28:25.801Z",
    size: 34797,
  },
  {
    name: "GenGoods_Annual_Report.pdf",
    title: "Annual Report",
    updated: "2023-12-01T18:01:37.609Z",
    size: 2664,
  },
  {
    name: "GenGoods_CSR_Programs_Initiatives.pdf",
    title: "CSR Programs Initiatives",
    updated: "2023-12-05T16:39:44.251Z",
    size: 2217,
  },
  {
    name: "GenGoods_Environmental_Sustainability_Reports.pdf",
    title: "Environmental Sustainability Reports",
    updated: "2023-12-01T18:01:37.796Z",
    size: 2165,
  },
  {
    name: "GenGoods_Expanded_Business_Plan.pdf",
    title: "Expanded Business Plan",
    updated: "2023-12-01T18:01:37.724Z",
    size: 3329,
  },
  {
    name: "GenGoods_Indented_Balance_Sheet.pdf",
    title: "Indented Balance Sheet",
    updated: "2023-12-05T21:13:09.891Z",
    size: 2196,
  },
  {
    name: "GenGoods_Internal_Process_Document.pdf",
    title: "Internal Process Document",
    updated: "2023-12-05T21:12:09.114Z",
    size: 2862,
  },
  {
    name: "GenGoods_Investor_Relations_Documents.pdf",
    title: "Investor Relations Documents",
    updated: "2023-12-01T18:01:37.629Z",
    size: 2570,
  },
  {
    name: "GenGoods_Organizational_Charts_Detailed.pdf",
    title: "Organizational Charts Detailed",
    updated: "2023-12-01T18:01:37.635Z",
    size: 2121,
  },
  {
    name: "GenGoods_Overview.pdf",
    title: "Overview",
    updated: "2023-12-01T18:01:38.009Z",
    size: 53112,
  },
  {
    name: "GenGoods_PESTEL_Analysis.pdf",
    title: "PESTEL Analysis",
    updated: "2023-12-01T18:01:37.720Z",
    size: 1985,
  },
  {
    name: "GenGoods_Profit_Loss_Statement.pdf",
    title: "Profit Loss Statement",
    updated: "2023-12-05T16:46:23.424Z",
    size: 1883,
  },
  {
    name: "GenGoods_Q1_2022.pdf",
    title: "Q1 2022",
    updated: "2023-12-01T18:01:37.757Z",
    size: 1476,
  },
  {
    name: "GenGoods_Q2_2022.pdf",
    title: "Q2 2022",
    updated: "2023-12-01T18:01:37.769Z",
    size: 1475,
  },
  {
    name: "GenGoods_Q3_2022.pdf",
    title: "Q3 2022",
    updated: "2023-12-01T18:01:37.835Z",
    size: 1479,
  },
  {
    name: "GenGoods_Q4_2022.pdf",
    title: "Q4 2022",
    updated: "2023-12-01T18:01:37.688Z",
    size: 1481,
  },
  {
    name: "GenGoods_SOPs.pdf",
    title: "SOPs",
    updated: "2023-12-01T18:01:37.780Z",
    size: 2950,
  },
  {
    name: "GenGoods_SWOT_Analysis_Adjusted.pdf",
    title: "SWOT Analysis Adjusted",
    updated: "2023-12-01T18:01:37.640Z",
    size: 1946,
  },
  {
    name: "GenGoods_Strategic_Roadmap_Dash.pdf",
    title: "Strategic Roadmap Dash",
    updated: "2023-12-01T18:01:37.733Z",
    size: 3369,
  },
  {
    name: "NACD-Cyber-Risk-Oversight-Handbook-2020.pdf",
    title: "Cyber Risk Oversight Handbook 2023",
    updated: "2024-02-16T23:24:03.995Z",
    size: 2557920,
  },
  {
    name: "decision-making-science_2023.pdf",
    title: "Decision Making Science 2023",
    updated: "2024-02-16T23:23:49.986Z",
    size: 5403371,
  },
  {
    name: "directorship_23q3_lores.pdf",
    title: "Directorship 2023",
    updated: "2024-02-16T23:24:03.379Z",
    size: 4454710,
  },
  {
    name: "directorship_septoct21_web.pdf",
    title: "Directorship 2022",
    updated: "2024-02-16T23:24:07.071Z",
    size: 6401671,
  },
  {
    name: "ey-cbm-americas-board-priorities-2023.pdf",
    title: "Board Priorities 2023",
    updated: "2024-02-16T23:23:49.390Z",
    size: 4620085,
  },
  {
    name: "ey-cbm-four-lessons-for-boards-in-overseeing-emerging-technology.pdf",
    title: "Overseeing Emerging Technology",
    updated: "2024-02-16T23:23:59.677Z",
    size: 255734,
  },
  {
    name: "ey-cbm-what-cyber-disclosures-are-telling-shareholders-in-2023.pdf",
    title: "Cyber Disclosures 2023",
    updated: "2024-02-16T23:23:38.428Z",
    size: 1574219,
  },
  {
    name: "ey-fueling-purposeful-growth-through-innovation-and-human-centered-experiences-v1.pdf",
    title: "Fueling Purposeful Growth Through Innovation",
    updated: "2024-02-16T23:24:06.322Z",
    size: 12709830,
  },
  {
    name: "ey-how-boards-can-sharpen-focus-on-innovation.pdf",
    title: "Sharpen Focus on Innovation",
    updated: "2024-02-16T23:24:01.046Z",
    size: 872296,
  },
  {
    name: "nominating_and_governance_committee_blueprint.pdf",
    title: "Nominating Governance Committee Blueprint",
    updated: "2024-02-16T23:23:47.738Z",
    size: 3457990,
  },
];

export const boardFiles = allFiles.filter((file) =>
  file.name.includes("GenGoods")
);

export const governanceFiles = allFiles.filter(
  (file) => !file.name.includes("GenGoods")
);

export const personalFiles = [
  {
    name: "#",
    title: "Meeting Notes 4/17",
    updated: "2024-02-16T23:23:45.468Z",
    size: 1651,
  },
  {
    name: "#",
    title: "Meeting Notes 1/11",
    updated: "2024-02-16T23:23:45.468Z",
    size: 1651,
  },
  {
    name: "Slide_Deck.pdf",
    title: "Director Assist",
    updated: "2024-02-16T23:23:45.468Z",
    size: 1651,
  },
];
