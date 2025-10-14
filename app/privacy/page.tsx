import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">Last Updated: July 12, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              1. Introduction
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Welcome to PortraitWiz. We are committed to protecting your privacy and personal data in accordance with the EU General Data Protection Regulation (GDPR) and applicable data protection laws.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use our AI-powered portrait generation service. It also describes your rights regarding your personal data and how to exercise them.
            </p>

            <div className="mt-6">
              <p className="font-semibold mb-2">Key Points:</p>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>We process facial images (biometric data) to generate AI portraits - this requires your explicit consent</li>
                <li>Your uploaded photos are automatically deleted within 24-48 hours</li>
                <li>We never use your photos to train our AI models</li>
                <li>You have extensive rights over your data including access, deletion, and portability</li>
                <li>We use trusted third-party processors (Google, Stripe, Supabase) with strong data protection</li>
                <li>We are based in Latvia (EU) and comply with GDPR</li>
              </ul>
            </div>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Please read this Privacy Policy carefully.</strong> If you do not agree with our practices, please do not use the Service.
            </p>
          </section>

          {/* What Data We Collect */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              3. What Personal Data We Collect
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We collect different types of personal data depending on how you interact with our Service.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              3.1 Account and Authentication Data
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What we collect:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Name (from Google OAuth profile)</li>
              <li>Email address (from Google OAuth profile)</li>
              <li>Profile picture (from Google OAuth - optional)</li>
              <li>Google account identifier (for authentication)</li>
              <li>Account creation date and time</li>
              <li>Last login date and time</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>How we collect it:</strong> Directly from you when you connect your Google account to create an account.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Legal basis:</strong> Performance of contract - necessary to create and manage your account.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              3.2 Biometric Data (Special Category Data)
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What we collect:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Facial photographs you upload for portrait generation</li>
              <li>Facial features and biometric identifiers extracted from your photos</li>
              <li>Facial geometry data used for AI processing</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>How we collect it:</strong> Directly from you when you upload photos to generate portraits.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Legal basis:</strong> Explicit consent (Article 9(2)(a) GDPR) - biometric data is special category data under Article 9(1) and requires your explicit, separate consent.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Important:</strong> This is the most sensitive data we process. We treat it with the highest level of protection and delete it quickly (see Section 6 for retention).
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              3.3 Payment and Billing Data
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What we collect:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Subscription plan selected</li>
              <li>Payment method type (credit card brand, last 4 digits)</li>
              <li>Billing name and address</li>
              <li>Transaction history (dates, amounts, payment status)</li>
              <li>Stripe customer identifier</li>
              <li>Currency and region</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What we DON&apos;T collect:</strong> We do not store full credit card numbers, CVV codes, or complete payment credentials. These are processed and stored securely by Stripe, our PCI-DSS compliant payment processor.
            </p>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              4. How We Use Your Personal Data
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We use your personal data only for specified, explicit, and legitimate purposes. We will not use your data in ways incompatible with these purposes.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              4.1 To Provide the Service (Performance of Contract)
            </h3>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Create and manage your account:</strong> Authentication, login, account settings</li>
              <li><strong>Process portrait generation:</strong> Analyze your uploaded photos using AI to create portraits</li>
              <li><strong>Deliver generated portraits:</strong> Store and provide access to your generated images</li>
              <li><strong>Manage subscriptions:</strong> Process payments, allocate credits, handle renewals</li>
              <li><strong>Communicate about the Service:</strong> Send transactional emails (receipts, generation confirmations, subscription updates)</li>
              <li><strong>Provide customer support:</strong> Respond to your inquiries and resolve issues</li>
            </ul>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              4.2 Based on Your Explicit Consent
            </h3>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Process biometric data:</strong> Extract facial features from your photos for AI portrait generation</li>
              <li><strong>Send marketing communications:</strong> Promotional emails about new features or offers (you can opt out)</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>You can withdraw consent at any time</strong> without affecting the lawfulness of processing before withdrawal.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              4.3 What We Do NOT Do With Your Data
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>We NEVER:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Sell your personal data to third parties</li>
              <li>Use your uploaded photos to train our AI models or any other AI models</li>
              <li>Share your photos or generated portraits publicly without your permission</li>
              <li>Use your biometric data for facial recognition or identification beyond portrait generation</li>
              <li>Use your data for automated decision-making with legal or similarly significant effects</li>
              <li>Share your data with third parties for their own marketing purposes</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              6. Data Retention - How Long We Keep Your Data
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, and reporting requirements.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              6.1 Biometric Data - Shortest Retention
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Uploaded Photographs:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Retention period:</strong> 24-48 hours maximum after portrait generation</li>
              <li><strong>Automatic deletion:</strong> Photos are automatically and permanently deleted from all systems after processing</li>
              <li><strong>Early deletion:</strong> You can request immediate deletion at any time during the processing period</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Extracted Biometric Features:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Retention period:</strong> Immediately after portrait generation (seconds to minutes)</li>
              <li><strong>Purpose:</strong> Used only during the active generation process</li>
              <li><strong>Storage:</strong> Never permanently stored - deleted as soon as processing completes</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Why such short retention?</strong> Biometric data is highly sensitive. We minimize risk by keeping it for the absolute minimum time necessary.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              7. Who We Share Your Data With
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We share your personal data only when necessary to provide the Service, comply with law, or protect rights and safety. We never sell your data.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              7.1 Essential Service Providers (Data Processors)
            </h3>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Google LLC (Gemini AI API)</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Purpose:</strong> AI portrait generation processing</li>
              <li><strong>Data shared:</strong> Uploaded photographs, facial images</li>
              <li><strong>Location:</strong> EU data centers (we use EU regional endpoints)</li>
              <li><strong>Safeguards:</strong> Your photos are NOT used to train Google&apos;s AI models (paid tier guarantee)</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Stripe Technology Europe Limited</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Purpose:</strong> Payment processing, subscription management</li>
              <li><strong>Data shared:</strong> Payment information, billing details, transaction history</li>
              <li><strong>Location:</strong> Established in Ireland (EU)</li>
              <li><strong>Safeguards:</strong> PCI-DSS Level 1 compliant</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Supabase, Inc.</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Purpose:</strong> Database, authentication, file storage</li>
              <li><strong>Data shared:</strong> Account data, authentication tokens, generated portraits, usage data</li>
              <li><strong>Location:</strong> We use EU regions for data residency</li>
              <li><strong>Safeguards:</strong> SOC 2 Type 2 compliant, encryption at rest and in transit</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              9. Data Security Measures
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We implement comprehensive technical and organizational security measures to protect your personal data against unauthorized access, loss, misuse, or alteration.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              9.1 Technical Security Measures
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Encryption:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Data encrypted in transit using TLS 1.3 (Transport Layer Security)</li>
              <li>Data encrypted at rest using AES-256 encryption</li>
              <li>Database encryption with encrypted backups</li>
              <li>Secure key management practices</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Access Controls:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Role-based access control (RBAC) limiting data access to authorized personnel only</li>
              <li>Multi-factor authentication (MFA) required for administrative access</li>
              <li>Principle of least privilege - minimum necessary access</li>
              <li>Regular access reviews and audits</li>
            </ul>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              9.2 Specific Protections for Biometric Data
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Given the sensitivity of biometric data, we implement enhanced protections:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Biometric data encrypted with strongest available algorithms</li>
              <li>Processed in isolated, secure environments</li>
              <li>Automatic deletion within 24-48 hours (cannot be recovered)</li>
              <li>Never transmitted to unauthorized systems</li>
              <li>Minimal retention principle strictly enforced</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              10. Your Rights Under GDPR
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              As a data subject under GDPR, you have extensive rights regarding your personal data. These rights are guaranteed by law and can be exercised free of charge.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.1 Right of Access (Article 15)
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What it means:</strong> You have the right to obtain confirmation of whether we process your personal data and, if so, receive a copy of it.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.2 Right to Rectification (Article 16)
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What it means:</strong> You have the right to correct inaccurate personal data and complete incomplete data.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.3 Right to Erasure / &ldquo;Right to be Forgotten&rdquo; (Article 17)
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What it means:</strong> You have the right to request deletion of your personal data in certain circumstances.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.4 Right to Data Portability (Article 20)
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What it means:</strong> You have the right to receive your personal data in a structured, commonly used, machine-readable format and transmit it to another controller.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.5 Right to Object (Article 21)
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What it means:</strong> You have the right to object to processing based on legitimate interests or for direct marketing.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.6 Right to Lodge a Complaint
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>What it means:</strong> You have the right to complain to a supervisory authority if you believe we are processing your data unlawfully.
            </p>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Primary Supervisory Authority (Latvia):</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Data State Inspectorate (Datu valsts inspekcija)</li>
              <li>Address: Elijas iela 17, Rīga, LV-1050, Latvia</li>
              <li>Phone: +371 67 22 31 31</li>
              <li>Email: info@dvi.gov.lv</li>
              <li>Website: <Link href="https://www.dvi.gov.lv/en" className="font-medium text-primary underline underline-offset-4">https://www.dvi.gov.lv/en</Link></li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              11. Children&apos;s Privacy
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Minimum Age: 18 years old</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              PortraitWiz is not intended for and may not be used by individuals under 18 years of age. We do not knowingly collect personal data from anyone under 18.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              If you are a parent or guardian and believe your child under 18 has provided us with personal data, please contact us immediately and we will delete the account and all associated data promptly.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              12. Cookies and Tracking Technologies
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We use cookies and similar technologies to provide, improve, and protect our Service.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              Strictly Necessary Cookies
            </h3>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Authentication cookies (keep you logged in)</li>
              <li>Security cookies (CSRF protection, session management)</li>
              <li>Preference cookies (user settings)</li>
            </ul>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              Third-Party Cookies
            </h3>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Stripe:</strong> Payment processing and fraud detection</li>
              <li><strong>Google:</strong> OAuth authentication cookies</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>We do NOT use:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Advertising cookies</li>
              <li>Social media tracking cookies (beyond authentication)</li>
              <li>Cross-site tracking cookies</li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              17. Updates to This Privacy Policy
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We may update this Privacy Policy to reflect changes in law, new features, or changes in data processing practices.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>For material changes:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Email notification to all users at least 30 days before effective date</li>
              <li>Prominent banner in the Service</li>
              <li>Summary of key changes</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Continued use after effective date constitutes acceptance</strong> of updated Privacy Policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              18. Contact Us
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              For privacy questions, data subject rights requests, or security concerns, please contact us:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>General Privacy Inquiries:</strong> privacy@portraitwiz.com</li>
              <li><strong>Data Subject Rights:</strong> privacy@portraitwiz.com</li>
              <li><strong>Security Concerns:</strong> security@portraitwiz.com</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Response time:</strong> Within 1 month for data subject rights requests, within 5 business days for general inquiries.
            </p>
          </section>

          {/* Footer */}
          <section className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Effective Date:</strong> July 12, 2025<br />
              <strong>Version:</strong> 1.0
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-sm text-muted-foreground">
              By using PortraitWiz, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and processing of your personal data as described.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-sm text-muted-foreground">
              Thank you for trusting PortraitWiz with your personal data. We are committed to protecting your privacy and giving you control over your information.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
