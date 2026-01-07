# PAYG Operations Dashboard

**Account Management & Operations Portal**

## Overview

The **PAYG Operations Dashboard** is a secure, internal web application built with **Firebase** to centralize access to operational tools, Google Sheets, and external systems used in PAYG account management.

The dashboard consolidates pipelines, invoicing systems, tractor service workflows, reports, and utilities into a single authenticated interface. It was designed as both a **production-ready internal tool** and a **portfolio project demonstrating real-world Firebase usage**.

---

## Key Features

* 🔐 **Secure Authentication**

  * Google Sign-In only
  * Restricted to `@hellotractor.com` email domain
* 🧭 **Centralized Operations Dashboard**

  * PAYG pipelines and portals
  * Invoicing systems and spreadsheets
  * Tractor service portals and reports
  * Finance and performance reports
  * Operational utilities
* 👥 **Role-Based Access Control**

  * **Admin**: manage dashboard links
  * **Viewer**: read-only access
* 📊 **Embedded Google Sheets**

  * View-only previews for live operational data
* 🎨 **Branded UI**

  * Hello Tractor color palette and logo
* 🚀 **Deployed on Firebase Hosting**

---

## Technology Stack

* **Frontend**: React (or Vite/React – depending on scaffold)
* **Authentication**: Firebase Authentication (Google Provider)
* **Database**: Firebase Firestore (config-driven links)
* **Hosting**: Firebase Hosting
* **Access Control**: Firestore Security Rules
* **Version Control**: Git & GitHub

---

## Application Structure

```
payg-operations-dashboard/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── auth/
│   └── services/
│
├── firebase.json
├── firestore.rules
├── package.json
└── README.md
```

---

## Dashboard Sections

* **PAYG Operations**

  * PAYG Pipeline Portal
  * Pipeline Spreadsheet
* **Invoicing**

  * Loan Management System
  * Invoicing Spreadsheet
* **Tractor Service**

  * Dealer Portal
  * Service Reports
  * Job Card Responses
* **Reports**

  * Covenant, Portfolio, Revenue, and Asset Reports
* **Utilities**

  * Preset Dashboards
  * HubSpot
  * Booking Console
  * WorkPay
  * Learning Platform
  * Desktop automation links

---

## Authentication & Access Rules

* Only users authenticated via **Google Sign-In**
* Only emails ending with:

  ```
  @hellotractor.com
  ```
* Firestore enforces:

  * Admin users can modify dashboard configuration
  * Viewer users have read-only access

> **Note:** Document-level permissions remain managed in Google Drive.

---

## Firestore Data Model (Simplified)

```json
dashboardLinks {
  section: "PAYG Operations",
  title: "Pipeline Portal",
  url: "https://payg.hellotractor.com/",
  type: "external",
  order: 1
}
```

---

## Local Development

### Prerequisites

* Node.js (v18+ recommended)
* Firebase CLI
* Git

### Setup

```bash
git clone https://github.com/<your-username>/payg-operations-dashboard.git
cd payg-operations-dashboard
npm install
```

### Run Locally

```bash
npm run dev
```

### Deploy

```bash
firebase deploy
```

---

## Security Considerations

* No secrets committed to the repository
* Environment variables stored locally
* Firestore rules enforce role-based access
* Firebase Authentication controls entry point

---

## Portfolio Value

This project demonstrates:

* Real-world **Firebase Authentication** with domain restriction
* **Role-based authorization** using Firestore
* Config-driven UI design
* Secure internal dashboard architecture
* Production-style deployment workflow

It reflects practical experience building **enterprise-grade internal tools**, not demo applications.

---

## Future Improvements

* Audit logs for admin actions
* Advanced search and filtering
* Analytics on link usage
* CI/CD pipeline with GitHub Actions
* Mobile-optimized layout

---

## Author

**Stephen Oloo**
Software Engineer - Backend
Firebase • GCP • Cloud Architecture • Internal Tools

---
