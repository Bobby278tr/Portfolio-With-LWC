# Salesforce Portfolio Website

A **personal portfolio website built on Salesforce Experience Cloud using Lightning Web Components (LWC)**.

This project demonstrates how Salesforce can be used not only for CRM but also for building **modern web applications with dynamic UI and backend integration**.

The portfolio showcases:

- Professional Experience
- Projects
- Education
- Certifications
- Technical Skills
- Contact Form with Email Integration

---

# Live Demo

Example Portfolio URL:

https://orgfarm-6d6390b11c-dev-ed.develop.my.site.com/portfolio/

---

# Features

## Interactive UI
- Animated experience timeline
- Animated tech stack section
- Project modal popups
- Hover animations
- Scroll reveal animations

## Portfolio Sections

- About / Hero Section
- Skills
- Experience Timeline
- Projects Showcase
- Education Timeline
- Certifications
- Contact Form

## Salesforce Integration

- Custom objects to store portfolio data
- Apex controllers for retrieving data
- Experience Cloud public website
- Static resources for images and icons


---

# Architecture
Experience Cloud Site
│
▼
Lightning Web Component (Portfolio UI)
│
▼
Apex Controllers
│
▼
Salesforce Custom Objects


---

# Project Structure
force-app
└── main
└── default
├── lwc
│ └── portfolio
│ ├── portfolio.html
│ ├── portfolio.js
│ ├── portfolio.css
│ └── portfolio.js-meta.xml
│
├── classes
│ ├── PortfolioController.cls
│ └── PortfolioController.cls-meta.xml
│
├── objects
│ ├── Experience__c
│ ├── Education__c
│ ├── Project__c
│ ├── Certification__c
│ └── Skill__c
│
└── staticresources
└── Resource_for_Portfolio


---

# Custom Objects

## Experience Object

Stores professional experience.

Fields:

- Organization_Name__c
- Designation__c
- Start_Date__c
- End_Date__c
- Description__c
- Skill__c
- Logo_URL__c
- Image_URL__c

---

## Education Object

Stores education details.

Fields:

- School_Name__c
- Degree__c
- Grade__c
- Start_Date__c
- End_Date__c
- Description__c
- Logo_URL__c

---

## Project Object

Stores project information.

Fields:

- Title__c
- Description__c
- Image_URL__c
- GitHub_URL__c
- Tech_Stack__c

---

## Certification Object

Stores certification details.

Fields:

- Certification_Name__c
- Issuer__c
- Date__c
- Certificate_URL__c

---

## Skill Object

Stores technology stack data.

Fields:

- Skill_Name__c
- Image_URL__c

---

# Static Resources

Images and icons used in the portfolio are stored in Salesforce Static Resources.

Example structure:
Resource_for_Portfolio
├── portfolio.png
├── salesforce.png
├── apex.png
├── lwc.png
└── javascript.png


Example usage:
/resource/Resource_for_Portfolio/portfolio.png


---

# Experience Cloud Setup

1. Enable Digital Experiences
Setup → Digital Experiences → Settings


2. Create a new site
Setup → All Sites → New


Choose template:
Build Your Own (LWR)


3. Open **Experience Builder**

4. Add the **Portfolio LWC Component** to the homepage.

5. Enable **Guest User Access**

6. Publish the site.

---

# UI Components

## Timeline UI

Experience and Education sections use an animated timeline layout.

Features:

- Alternating timeline cards
- Scroll reveal animations
- Skill badges
- Company logos

---

## Project Modal

Clicking a project card opens a modal containing:

- Project image
- Detailed description
- Technology stack
- GitHub repository link

---

## Tech Stack Section

Technologies are displayed as animated cards with hover effects.

---

## Scroll Animations

Sections animate into view using **IntersectionObserver**.

---

# Technologies Used

- Salesforce Experience Cloud
- Lightning Web Components (LWC)
- Apex
- JavaScript
- HTML
- CSS

---

# Deployment

Clone the repository.
git clone https://github.com/Bobby278tr/Portfolio-With-LWC.git


Authenticate Salesforce org.
sfdx auth:web:login


Deploy project.
sfdx force:source:deploy -p force-app


Publish the Experience Cloud site after deployment.

---

# Future Improvements

Potential enhancements:

- Dark mode toggle
- GitHub activity section
- Resume download button
- Mobile navigation improvements
- Project filtering
- Analytics integration

---

# Author

Portfolio created by:

**Bobby Tripathi**  
Salesforce Developer

GitHub:

https://github.com/Bobby278tr

LinkedIn:

https://www.linkedin.com/in/bobby-tripathi-b178361b5/

