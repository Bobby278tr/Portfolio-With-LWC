import { LightningElement, wire, track } from 'lwc';
import getEducation      from '@salesforce/apex/PortfolioController.getEducation';
import getExperience     from '@salesforce/apex/PortfolioController.getExperience';
import getSkills         from '@salesforce/apex/PortfolioController.getSkills';
import getProjects       from '@salesforce/apex/PortfolioController.getProjects';
import getCertifications from '@salesforce/apex/PortfolioController.getCertifications';
import handleContact     from '@salesforce/apex/PortfolioController.handleContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import PORTFOLIO_RES from '@salesforce/resourceUrl/Resource_for_Portfolio';
import HeroImage     from '@salesforce/resourceUrl/HeroImage';

/* ── HERO TYPEWRITER TITLES ─────────────────────────────────────────────── */
const HERO_TITLES = [
    'Salesforce Developer',
    'LWC Specialist',
    'Apex Engineer',
    'Flow Architect',
    'Trailblazer',
];

export default class Portfolio extends LightningElement {

    /* ── static assets ──────────────────────────────────────────── */
    linkedinIcon         = PORTFOLIO_RES + '/Images/logo-Linkedin.png';
    gitHubIcon           = PORTFOLIO_RES + '/Images/GitHub-logo.png';
    trailHeadIcon        = PORTFOLIO_RES + '/Images/trailhead-logo.png';
    doubleStarRangerIcon = PORTFOLIO_RES + '/Images/double-star-ranger.png';
    PDIcon               = PORTFOLIO_RES + '/Images/PlatDevBadge.png';
    AgentforceIcon       = PORTFOLIO_RES + '/Images/badge-agentforce.jpg';
    aboutImage           = HeroImage;

    /* ── hero typewriter ─────────────────────────────────────────── */
    @track heroTitle = '';
    _titleIndex      = 0;
    _charIndex       = 0;
    _isDeleting      = false;
    _typeTimer       = null;

    _typeStep() {
        const current = HERO_TITLES[this._titleIndex];
        if (!this._isDeleting) {
            this.heroTitle = current.substring(0, this._charIndex + 1);
            this._charIndex++;
            if (this._charIndex === current.length) {
                this._isDeleting = true;
                this._typeTimer = setTimeout(() => this._typeStep(), 1800);
                return;
            }
        } else {
            this.heroTitle = current.substring(0, this._charIndex - 1);
            this._charIndex--;
            if (this._charIndex === 0) {
                this._isDeleting = false;
                this._titleIndex = (this._titleIndex + 1) % HERO_TITLES.length;
            }
        }
        this._typeTimer = setTimeout(() => this._typeStep(), this._isDeleting ? 55 : 110);
    }

    /* ── nav state ───────────────────────────────────────────────── */
    menuOpen = false;
    @track activeSection = 'about';

    get navClass() { return this.menuOpen ? 'nav-links active' : 'nav-links'; }
    toggleMenu()   { this.menuOpen = !this.menuOpen; }
    closeMenu()    { this.menuOpen = false; }

    get activeAbout()          { return this.activeSection === 'about'          ? 'nav-link nav-link--active' : 'nav-link'; }
    get activeTech()           { return this.activeSection === 'tech'           ? 'nav-link nav-link--active' : 'nav-link'; }
    get activeExperience()     { return this.activeSection === 'experience'     ? 'nav-link nav-link--active' : 'nav-link'; }
    get activeProjects()       { return this.activeSection === 'projects'       ? 'nav-link nav-link--active' : 'nav-link'; }
    get activeEducation()      { return this.activeSection === 'education'      ? 'nav-link nav-link--active' : 'nav-link'; }
    get activeCertifications() { return this.activeSection === 'certifications' ? 'nav-link nav-link--active' : 'nav-link'; }
    get activeContact()        { return this.activeSection === 'contact'        ? 'nav-link nav-link--active' : 'nav-link'; }

    /* ── theme toggle (light / dark) ─────────────────────────────── */
    @track isDark = true;   // starts dark (portfolio default)

    get themeClass() { return this.isDark ? 'background background--dark' : 'background background--light'; }
    get themeIcon()  { return this.isDark ? '☀' : '☾'; }
    get themeLabel() { return this.isDark ? 'Light mode' : 'Dark mode'; }

    toggleTheme() { this.isDark = !this.isDark; }

    /* ── back-to-top ─────────────────────────────────────────────── */
    @track showBackToTop = false;
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

    /* ── form state ──────────────────────────────────────────────── */
    email   = '';
    subject = '';
    body    = '';
    name    = '';
    @track isSending   = false;
    @track contactSent = false;

    get sendButtonClass() { return this.isSending ? 'send-btn send-btn--loading' : 'send-btn'; }
    get bodyCharCount()   { return this.body ? this.body.length : 0; }
    get bodyCharClass() {
        const n = this.bodyCharCount;
        if (n > 900) return 'char-count char-count--danger';
        if (n > 700) return 'char-count char-count--warn';
        return 'char-count';
    }

    handleEmail(e)   { this.email   = e.target.value || ''; }
    handleSubject(e) { this.subject = e.target.value || ''; }
    handleBody(e)    { this.body    = e.target.value || ''; }
    handleName(e)    { this.name    = e.target.value || ''; }

    sendContact() {
        if (!this.name.trim() || !this.email.trim() || !this.body.trim()) {
            this.showToast('Hold on!', 'Name, email and message are all required.', 'warning');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
            this.showToast('Hmm!', 'Please enter a valid email address.', 'warning');
            return;
        }
        this.isSending = true;
        handleContact({
            name:    this.name.trim(),
            email:   this.email.trim(),
            subject: this.subject.trim() || '(No subject)',
            body:    this.body.trim(),
            toEmail: 'bobbytripathi24@gmail.com',
        })
        .then(() => {
            this.contactSent = true;
            this.name = ''; this.email = ''; this.subject = ''; this.body = '';
        })
        .catch(err => {
            console.error('Contact error:', err);
            const msg = err?.body?.message || err?.message || 'Something went wrong. Please try again.';
            this.showToast('Error', msg, 'error');
        })
        .finally(() => { this.isSending = false; });
    }

    resetContactForm() {
        this.contactSent = false;
        this.name = ''; this.email = ''; this.subject = ''; this.body = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant, mode: 'dismissable' }));
    }

    /* ── wired data ──────────────────────────────────────────────── */
    @track educationData   = [];
    @track experienceData  = [];
    @track selectedProject = null;

    @wire(getEducation)
    wiredEducation({ data, error }) {
        if (data) {
            this.educationData = data.map((item, i) => ({
                ...item,
                timelineClass: i % 2 === 0 ? 'timeline-item left' : 'timeline-item right',
            }));
        } else if (error) { console.error('Education:', error); }
    }

    @wire(getExperience)
    wiredExperience({ data, error }) {
        if (data) {
            this.experienceData = data.map((item, i) => ({
                ...item,
                skillsArray: item.Skill__c ? item.Skill__c.split(',').map(s => s.trim()) : [],
                timelineClass: i % 2 === 0 ? 'timeline-item left' : 'timeline-item right',
            }));
        } else if (error) { console.error('Experience:', error); }
    }

    @wire(getSkills)         skills;
    @wire(getProjects)       projects;
    @wire(getCertifications) certifications;

    /* ── lifecycle ───────────────────────────────────────────────── */
    connectedCallback() {
        this._scrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this._scrollHandler, { passive: true });

        this._mouseMoveHandler = e => {
            const s = this.template.querySelector('.spotlight');
            if (s) { s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; }
        };
        window.addEventListener('mousemove', this._mouseMoveHandler, { passive: true });

        // Start typewriter
        setTimeout(() => this._typeStep(), 500);
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this._scrollHandler);
        window.removeEventListener('mousemove', this._mouseMoveHandler);
        clearTimeout(this._typeTimer);
        if (this._revealObserver) this._revealObserver.disconnect();
        if (this._navObserver)    this._navObserver.disconnect();
    }

    renderedCallback() {
        // Scroll-reveal
        const revealEls = this.template.querySelectorAll('.reveal:not(.observer-added)');
        if (!this._revealObserver) {
            this._revealObserver = new IntersectionObserver(
                entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
                { threshold: 0.12 }
            );
        }
        revealEls.forEach(el => { this._revealObserver.observe(el); el.classList.add('observer-added'); });

        // Active nav
        if (!this._navObserver) {
            const sections = this.template.querySelectorAll('section[id]');
            this._navObserver = new IntersectionObserver(
                entries => entries.forEach(e => { if (e.isIntersecting) this.activeSection = e.target.id; }),
                { threshold: 0.35 }
            );
            sections.forEach(s => this._navObserver.observe(s));
        }
    }

    onScroll() {
        const winScroll = window.scrollY;
        const height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const bar = this.template.querySelector('.scroll-progress');
        if (bar) bar.style.width = (height ? (winScroll / height) * 100 : 0) + '%';
        this.showBackToTop = winScroll > 500;
    }

    /* ── modal ───────────────────────────────────────────────────── */
    openModal(event) {
        const id = event.currentTarget.dataset.id;
        if (this.projects?.data) this.selectedProject = this.projects.data.find(p => p.Id === id) || null;
    }

    closeModal()           { this.selectedProject = null; }
    stopPropagation(event) { event.stopPropagation(); }
    handleImageError(event){ event.target.style.display = 'none'; }
}