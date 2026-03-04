import { LightningElement, wire, track } from 'lwc';
import getEducation from '@salesforce/apex/PortfolioController.getEducation';
import getExperience from '@salesforce/apex/PortfolioController.getExperience';
import getSkills from '@salesforce/apex/PortfolioController.getSkills';
import getProjects from '@salesforce/apex/PortfolioController.getProjects';
import getCertifications from '@salesforce/apex/PortfolioController.getCertifications';
import handleContact from '@salesforce/apex/PortfolioController.handleContact';

export default class Portfolio extends LightningElement {

    @track selectedProject;

    email;
    subject;
    body;

    @wire(getEducation) education;
    @track experienceData = [];

    @wire(getExperience)
    wiredExperience({ data, error }) {
        if (data) {
            this.experienceData = data.map((item, index) => {
                return {
                    ...item,
                    timelineClass: index % 2 === 0
                        ? 'timeline-item left'
                        : 'timeline-item right'
                };
            });
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getSkills) skills;
    @wire(getProjects) projects;
    @wire(getCertifications) certifications;

    renderedCallback() {
        const reveals = this.template.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add('active');
                }
            });
        });
        reveals.forEach(el => observer.observe(el));
    }

    expClass(index){
        return index % 2 === 0
            ? 'timeline-item left'
            : 'timeline-item right';
    }

    openModal(event){
        const id = event.currentTarget.dataset.id;
        this.selectedProject = this.projects.data.find(p => p.Id === id);
    }

    closeModal(){
        this.selectedProject = null;
    }

    handleEmail(e){ this.email = e.target.value; }
    handleSubject(e){ this.subject = e.target.value; }
    handleBody(e){ this.body = e.target.value; }

    sendContact(){
        handleContact({
            email: this.email,
            subject: this.subject,
            body: this.body
        }).then(()=>{
            alert('Lead Created & Email Sent!');
            this.email = '';
            this.subject = '';
            this.body = '';
        });
    }
}