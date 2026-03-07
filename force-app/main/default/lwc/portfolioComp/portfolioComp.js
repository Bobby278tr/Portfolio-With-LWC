import { LightningElement, wire, track } from 'lwc';
import getEducation from '@salesforce/apex/PortfolioController.getEducation';
import getExperience from '@salesforce/apex/PortfolioController.getExperience';
import getSkills from '@salesforce/apex/PortfolioController.getSkills';
import getProjects from '@salesforce/apex/PortfolioController.getProjects';
import getCertifications from '@salesforce/apex/PortfolioController.getCertifications';
import handleContact from '@salesforce/apex/PortfolioController.handleContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Portfolio extends LightningElement {

    @track selectedProject;

    email = '';
    subject = '';
    body = '';
    name = '';

    menuOpen = false;

    get navClass(){
        return this.menuOpen ? 'nav-links active' : 'nav-links';
    }

    toggleMenu(){
        this.menuOpen = !this.menuOpen;
    }

    @track educationData = [];
    @track experienceData = [];

    @wire(getEducation)
    wiredEducation({ data }) {

        if (data) {

            this.educationData = data.map((item, index) => {

                return {
                    ...item,
                    timelineClass:
                        index % 2 === 0
                            ? 'timeline-item left'
                            : 'timeline-item right'
                };

            });

        }

    }

    @wire(getExperience)
    wiredExperience({ data }) {
        if (data) {
            this.experienceData = data.map((item, index) => {
                let skillsArray = [];
                if (item.Skill__c) {
                    skillsArray = item.Skill__c.split(',').map(skill => skill.trim());
                }
                return {
                    ...item,
                    skillsArray,
                    timelineClass:
                        index % 2 === 0
                            ? 'timeline-item left'
                            : 'timeline-item right'
                };
            });
        }
    }

    handleImageError(event) {
        event.target.style.display = 'none';
    }
    @wire(getSkills) skills;
    @wire(getProjects) projects;
    @wire(getCertifications) certifications;

    connectedCallback() {
        window.addEventListener('scroll', this.updateScrollProgress.bind(this));
    }

    updateScrollProgress() {
        const winScroll = window.scrollY;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const scrolled = (winScroll / height) * 100;

        const bar = this.template.querySelector('.scroll-progress');
        if (bar) {
            bar.style.width = scrolled + '%';
        }
    }

    renderedCallback() {
        const elements = this.template.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }

                });

            },
            {
                threshold: 0.15
            }
        );
        elements.forEach((el) => {
            if (!el.classList.contains('observer-added')) {
                observer.observe(el);
                el.classList.add('observer-added');
            }
        });

        if (!this.mouseListenerAdded) {
            const spotlight = this.template.querySelector('.spotlight');
            window.addEventListener('mousemove', (e) => {
                if (spotlight) {
                    spotlight.style.left = e.clientX + 'px';
                    spotlight.style.top = e.clientY + 'px';
                }
            });
            this.mouseListenerAdded = true;
        }
    }

    expClass(index) {
        return index % 2 === 0
            ? 'timeline-item left'
            : 'timeline-item right';
    }

    openModal(event) {
        const id = event.currentTarget.dataset.id;
        if (this.projects?.data) {
            this.selectedProject = this.projects.data.find(p => p.Id === id);
        }
    }

    closeModal() {
        this.selectedProject = null;
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    handleEmail(e) { this.email = e.target.value; }
    handleSubject(e) { this.subject = e.target.value; }
    handleBody(e) { this.body = e.target.value; }
    handleName(e) { this.name = e.target.value; }

    sendContact() {
        handleContact({
            name: this.name,
            email: this.email,
            subject: this.subject,
            body: this.body
        }).then(() => {
            // alert('Message Sent Successfully 🚀');
            this.showToast('Success', 'Message Sent Successfully 🚀', 'success');
            this.email = '';
            this.subject = '';
            this.body = '';
            this.name = '';
        });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: 'Hi ' + this.name,
            message: 'Message Sent Successfully 🚀',
            mode: 'dismissable',
            variant: 'success'
        });
        this.dispatchEvent(evt);
    }
}