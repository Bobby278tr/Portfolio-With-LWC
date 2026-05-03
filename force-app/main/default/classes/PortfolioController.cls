public class PortfolioController {

    /* ── READ methods (cacheable) ──────────────────────────────── */

    @AuraEnabled(cacheable=true)
    public static List<Education__c> getEducation(){
        return [SELECT Id, School_Name__c, Degree__c, Grade__c,
                       Start_Date__c, End_Date__c, Description__c, Logo__c
                FROM Education__c ORDER BY Display_Order__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Experience__c> getExperience(){
        return [SELECT Id, Organization_Name__c, Designation__c,
                       Start_Date__c, End_Date__c, Description__c,
                       Logo_URL__c, Image_URL__c, Skill__c
                FROM Experience__c ORDER BY Start_Date__c DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Skill__c> getSkills(){
        return [SELECT Id, Name, Logo_URL__c FROM Skill__c ORDER BY Display_Order__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjects(){
        return [SELECT Id, Name, Short_Description__c, Full_Description__c,
                       Skills__c, Github_Link__c, Image_URL__c
                FROM Project__c ORDER BY Display_Order__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification__c> getCertifications(){
        return [SELECT Id, Name, Issued_By__c, Credential_Id__c,
                       Credential_Link__c, Image_URL__c
                FROM Certification__c ORDER BY Display_Order__c];
    }

    /* ── CONTACT / EMAIL ───────────────────────────────────────── */

    /*
     * HOW EMAIL DELIVERY WORKS — read this if mail is not arriving
     * ─────────────────────────────────────────────────────────────
     * Salesforce blocks outbound email to external addresses unless:
     *
     *  1. Setup → Email → Deliverability → "Access Level" = "All Email"
     *     (default on new orgs is "System Only" which blocks user mail)
     *
     *  2. For Experience Cloud / Guest-user contexts you ALSO need an
     *     Org-Wide Email Address that is verified:
     *     Setup → Email → Organization-Wide Addresses → Add
     *     Use any address you own and click the verification link.
     *
     *  3. This method looks up that OrgWideEmailAddress and uses it as
     *     the From address. If none is found it falls back to the
     *     running-user address (works in internal/authenticated orgs).
     *
     *  4. As a belt-and-suspenders fallback the contact is always saved
     *     as a Lead in Salesforce, so you never lose a submission even
     *     if email delivery is blocked.
     * ─────────────────────────────────────────────────────────────
     */
    @AuraEnabled
    public static void handleContact(
        String name,
        String email,
        String subject,
        String body,
        String toEmail
    ){
        // Sanitise inputs
        name    = String.isBlank(name)    ? 'Unknown'                        : name.trim();
        email   = String.isBlank(email)   ? ''                               : email.trim();
        subject = String.isBlank(subject) ? 'New portfolio contact'          : subject.trim();
        body    = String.isBlank(body)    ? '(no message)'                   : body.trim();
        toEmail = String.isBlank(toEmail) ? 'bobbytripathi24@gmail.com'      : toEmail.trim();

        // ── 1. Save as Lead (belt-and-suspenders — you always get it) ──
        try {
            Lead ld = new Lead(
                LastName    = name,
                Company     = 'Portfolio Website',
                Email       = String.isBlank(email) ? null : email,
                Description = 'Subject: ' + subject + '\n\n' + body,
                LeadSource  = 'Web'
            );
            insert ld;
        } catch (Exception leadEx) {
            // Don't let a Lead insert failure block the email attempt
            System.debug('Lead insert failed (non-fatal): ' + leadEx.getMessage());
        }

        // ── 2. Send email ──────────────────────────────────────────────
        try {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

            // Use a verified Org-Wide Email Address when available.
            // Query by DisplayName so the sender is the org-wide address named PortfolioMail.
            List<OrgWideEmailAddress> owea = [
                SELECT Id, Address, DisplayName FROM OrgWideEmailAddress
                WHERE DisplayName = 'PortfolioMail'
                LIMIT 1
            ];
            if (!owea.isEmpty()) {
                mail.setOrgWideEmailAddressId(owea[0].Id);
            }
            // else: Salesforce uses the running-user's email as From
            // (fine for internal/authenticated pages)

            mail.setToAddresses(new List<String>{ toEmail });
            mail.setSenderDisplayName('Portfolio Contact Form');
            mail.setSubject('[Portfolio] ' + subject);

            // Reply-To so you can reply directly to the visitor
            if (!String.isBlank(email)) {
                mail.setReplyTo(email);
            }

            // Plain-text body
            mail.setPlainTextBody(
                '=== New Portfolio Contact ===\n\n' +
                'Name:    ' + name    + '\n' +
                'Email:   ' + email   + '\n' +
                'Subject: ' + subject + '\n\n' +
                '--- Message ---\n' +
                body
            );

            // HTML body
            mail.setHtmlBody(
                '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;' +
                'border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">' +

                '<div style="background:linear-gradient(135deg,#00d2ff,#3a7bd5);padding:24px 30px;">' +
                '<h2 style="color:white;margin:0;font-size:20px;">New Portfolio Contact</h2>' +
                '</div>' +

                '<div style="padding:28px 30px;background:#ffffff;">' +

                '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
                '<tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:80px;">Name</td>' +
                '<td style="padding:8px 0;font-weight:600;">' + name + '</td></tr>' +
                '<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td>' +
                '<td style="padding:8px 0;"><a href="mailto:' + email + '" style="color:#3a7bd5;">' + email + '</a></td></tr>' +
                '<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Subject</td>' +
                '<td style="padding:8px 0;">' + subject + '</td></tr>' +
                '</table>' +

                '<div style="background:#f8fafc;border-left:4px solid #00d2ff;' +
                'border-radius:0 8px 8px 0;padding:16px 20px;">' +
                '<p style="color:#334155;line-height:1.7;margin:0;white-space:pre-wrap;">' +
                body.escapeHtml4() +
                '</p></div>' +

                '<p style="margin-top:24px;font-size:12px;color:#94a3b8;">' +
                'Sent from Bobby Tripathi\'s portfolio website</p>' +

                '</div></div>'
            );

            List<Messaging.SendEmailResult> results =
                Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });

            // Surface any delivery errors
            if (results != null && !results.isEmpty() && !results[0].isSuccess()) {
                List<String> errs = new List<String>();
                for (Messaging.SendEmailError e2 : results[0].getErrors()) {
                    errs.add(e2.getStatusCode() + ': ' + e2.getMessage());
                }
                // We still throw so the LWC can show a meaningful message.
                // But the Lead was already saved above.
                throw new AuraHandledException(
                    'Email delivery failed — your message was saved. Error: ' +
                    String.join(errs, '; ')
                );
            }

        } catch (AuraHandledException ahe) {
            throw ahe; // re-throw our own
        } catch (Exception e) {
            throw new AuraHandledException(
                'Email send error (message was saved): ' + e.getMessage()
            );
        }
    }
}