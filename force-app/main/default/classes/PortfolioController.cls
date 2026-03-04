public with sharing class PortfolioController {

    @AuraEnabled(cacheable=true)
    public static List<Education__c> getEducation(){
        return [SELECT Id, School_Name__c, Start_Date__c, End_Date__c, Description__c
                FROM Education__c ORDER BY Display_Order__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Experience__c> getExperience(){
        return [SELECT Id, Organization_Name__c, Designation__c,
                Start_Date__c, End_Date__c, Description__c,
                Logo_URL__c, Image_URL__c
                FROM Experience__c ORDER BY Start_Date__c DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Skill__c> getSkills(){
        return [SELECT Id, Name FROM Skill__c ORDER BY Display_Order__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjects(){
        return [SELECT Id, Name, Short_Description__c,
                Full_Description__c, Skills__c,
                Github_Link__c, Image_URL__c
                FROM Project__c ORDER BY Display_Order__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification__c> getCertifications(){
        return [SELECT Id, Name, Issued_By__c,
                Credential_Id__c, Credential_Link__c,
                Image_URL__c
                FROM Certification__c ORDER BY Display_Order__c];
    }

    @AuraEnabled
    public static void handleContact(String email, String subject, String body){

        // Create Lead
        Lead ld = new Lead();
        ld.LastName = 'Portfolio Contact';
        ld.Company = 'Website';
        ld.Email = email;
        ld.Description = body;
        insert ld;

        // Send Email
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] {'yourmail@gmail.com'});
        mail.setSubject(subject);
        mail.setPlainTextBody('From: ' + email + '\n\n' + body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});
    }
}