import type { DashboardLink } from './types';

export const seedData: Omit<DashboardLink, 'id' | 'order'>[] = [
  // PAYG Operations
  {
    name: 'PAYG Pipeline Portal',
    url: 'https://payg.hellotractor.com/',
    section: 'payg-operations',
    type: 'external',
  },
  {
    name: 'Pipeline Spreadsheet',
    url: 'https://docs.google.com/spreadsheets/d/1AB5XqXmvMqlTQrbu4Qc0pa0dtEIS4TbCUasvOZDCBVw/edit?rm=minimal',
    section: 'payg-operations',
    type: 'embed',
  },
  // Invoicing
  {
    name: 'Loan Management System',
    url: 'https://api.hellotractor.com/payg/admin/',
    section: 'invoicing',
    type: 'external',
  },
  {
    name: 'Invoicing Spreadsheet',
    url: 'https://docs.google.com/spreadsheets/d/1xARIH_9bKQegwQ4n7Bik-DCjYUoh7wftNH0v8GsFJ0A/edit?rm=minimal',
    section: 'invoicing',
    type: 'embed',
  },
  // Tractor Service
  {
    name: 'HT Dealer Portal',
    url: 'https://ht-dealer-portal-v2.web.app/dashboard',
    section: 'tractor-service',
    type: 'external',
  },
  {
    name: 'Hello Tractor Service Reports',
    url: 'https://docs.google.com/spreadsheets/d/1hUHeCjTyJHUajNAfnJk-o4FVwP2qhN6h/edit?rm=minimal',
    section: 'tractor-service',
    type: 'embed',
  },
  {
    name: 'Job Card Responses',
    url: 'https://docs.google.com/spreadsheets/d/1KCmjJc-8Uk_LsVlgsf4RZw0iBsJRR4GpCQpB1igWSNs/edit?rm=minimal',
    section: 'tractor-service',
    type: 'embed',
  },
  // Reports
  {
    name: 'Kenya Covenant / Billed / Collected',
    url: 'https://docs.google.com/spreadsheets/d/1ecQtxLZXN8H08rT5xc0IN-4cDUkzOY9wKeYCP3gdzzQ/edit?rm=minimal',
    section: 'reports',
    type: 'embed',
  },
  {
    name: 'Account Managers Portfolio',
    url: 'https://docs.google.com/spreadsheets/d/1dA3a5SHnPVeBHlBKcsr635xmn6rN4lQg/edit?rm=minimal',
    section: 'reports',
    type: 'embed',
  },
  {
    name: 'Covenant Targets',
    url: 'https://docs.google.com/spreadsheets/d/1Tq8ghFMcrnkqU24S1G1Dpc5GwQEsBIqXkyErJbP1XtQ/edit?rm=minimal',
    section: 'reports',
    type: 'embed',
  },
  {
    name: 'Agrimec Reassigned Tractors',
    url: 'https://docs.google.com/spreadsheets/d/113fwM7rQiBNETsJ_r7a4HiyPFIYZP6x4Ndq0IsfNuX0/edit?rm=minimal',
    section: 'reports',
    type: 'embed',
  },
  {
    name: 'Surcharge Revenue Analysis',
    url: 'https://docs.google.com/spreadsheets/d/1laGtCc25Anc_x2P_XgQrVHHaxaERH6yxViVOvKYhac4/edit?rm=minimal',
    section: 'reports',
    type: 'embed',
  },
  {
    name: 'Top Renters',
    url: 'https://docs.google.com/spreadsheets/d/1y1WEIhbijqnIakk_t01r2IBTFGn5mwpNObf3JpPxP6w/edit?rm=minimal',
    section: 'reports',
    type: 'embed',
  },
  // Utilities
  {
    name: 'Booking Preset',
    url: 'https://0416503c.us1a.app.preset.io/superset/dashboard/37/',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'Farmers Preset',
    url: 'https://0416503c.us1a.app.preset.io/superset/dashboard/19/',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'Tractor Preset',
    url: 'https://0416503c.us1a.app.preset.io/superset/dashboard/36/',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'Change Accounts',
    url: 'https://api.hellotractor.com/admin/user_auth/commonuser/',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'HubSpot',
    url: 'https://app.hubspot.com/',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'Booking Console',
    url: 'https://console.hellotractor.com/owner',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'Learning (Udemy)',
    url: 'https://hellotractor.udemy.com/organization',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'WorkPay',
    url: 'https://dashboard.myworkpay.com/',
    section: 'utilities',
    type: 'external',
  },
  {
    name: 'Phone Link',
    url: 'ms-phone:',
    section: 'utilities',
    type: 'protocol',
  },
  {
    name: 'Power Automate',
    url: 'ms-powerautomate:',
    section: 'utilities',
    type: 'protocol',
  },
];
