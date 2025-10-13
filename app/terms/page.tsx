import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Terms and Conditions
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">Last Updated: October 12, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              1. Introduction and Acceptance
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Welcome to PortraitWiz, an AI-powered portrait generation service operated by PortraitWiz, a company registered in Latvia (&quot;PortraitWiz,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you and PortraitWiz governing your access to and use of our website, mobile applications, and services (collectively, the &quot;Service&quot;). The Service uses artificial intelligence technology to transform your uploaded photographs into professional portrait images.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>BY ACCESSING OR USING THE SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS.</strong> If you do not agree to these Terms, you must not access or use the Service.
            </p>

            <div className="mt-6">
              <p className="font-semibold mb-2">IMPORTANT NOTICES:</p>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>You must be at least 18 years old to use this Service</li>
                <li>These Terms include important limitations on our liability</li>
                <li>If you are a consumer in the European Union, you have specific rights that cannot be waived</li>
                <li>You have a 14-day withdrawal right subject to certain exceptions</li>
                <li>AI-generated content is marked as artificially generated in compliance with EU AI Act</li>
              </ul>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              2. About PortraitWiz
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              PortraitWiz is a credit-based service that uses artificial intelligence (specifically, Google&apos;s Gemini 2.5 Flash Image Preview API) to generate professional portrait images from photographs you upload. The Service analyzes your reference images and creates new portrait variations in various styles, backgrounds, and poses.
            </p>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Key Service Features:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>AI-powered portrait generation from uploaded photos</li>
              <li>Multiple portrait styles and professional backgrounds</li>
              <li>Credit-based payment system with three tiers</li>
              <li>Secure cloud storage during processing</li>
              <li>High-resolution downloadable outputs</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              3. Eligibility
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              To use PortraitWiz, you must:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts under applicable law</li>
              <li>Not be prohibited from using the Service under any applicable law or regulation</li>
              <li>Not have been previously suspended or terminated from the Service</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Age Verification:</strong> By using the Service, you confirm you meet the minimum age requirement. We reserve the right to request proof of age and to suspend accounts if age eligibility cannot be verified.
            </p>
          </section>

          {/* Account Security */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              4. Account Registration and Security
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              4.1 Account Creation
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              To access the Service, you must create an account by connecting through a supported third-party authentication provider (currently Google OAuth). By connecting your third-party account, you authorize us to access certain information from that account for authentication purposes only.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              4.2 Account Security
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              You are responsible for:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access or security breach</li>
              <li>Ensuring your account information remains accurate and current</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              You must not:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Share your account credentials with others</li>
              <li>Create multiple accounts to circumvent Service limitations</li>
              <li>Allow others to access the Service through your account</li>
              <li>Use another person&apos;s account without permission</li>
            </ul>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              5. Pricing and Payment
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              5.1 Pricing Tiers
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              PortraitWiz offers three credit packages:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Starter Plan:</strong> 50 credits</li>
              <li><strong>Popular Plan:</strong> 150 credits (Best Value)</li>
              <li><strong>Professional Plan:</strong> 250 credits</li>
            </ul>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              5.2 Billing and Payment
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We accept payments via credit card, debit card, and other methods made available through our payment processor, Stripe. By providing payment information, you authorize us to charge the purchase amount to your selected payment method.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              5.3 Credits System
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Credit Usage:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>One credit generates one AI portrait image</li>
              <li>Credits have no cash value and cannot be transferred or refunded outside the withdrawal period</li>
              <li>Unused credits remain in your account for use anytime</li>
            </ul>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              6. Refund Policy and Right of Withdrawal
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              6.1 EU 14-Day Withdrawal Right
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              If you are a consumer in the European Union, you have the right to withdraw from your purchase within 14 days of purchase without giving any reason, in accordance with EU Consumer Rights Directive 2011/83/EU.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>To exercise your withdrawal right:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Contact us at support@portraitwiz.com within 14 days of purchase</li>
              <li>State clearly that you wish to withdraw from the contract</li>
              <li>Include your account email and order reference</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We will refund all payments received from you within 14 days of receiving your withdrawal notice using the same payment method you used for purchase.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              6.2 Exception for Immediate Access to Digital Content
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>IMPORTANT: If you request immediate access to the Service and begin generating portraits, you acknowledge that you will lose your right of withdrawal.</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              This is required under Article 16(m) of the Consumer Rights Directive. If you provide this consent and begin using the Service, the 14-day withdrawal right no longer applies.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              7. Service License and User Rights
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              7.1 Ownership of Generated Portraits
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>You own the AI-generated portrait images created using your uploaded photos and your credits.</strong> We assign to you all right, title, and interest in the portraits generated specifically for you through the Service.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              7.2 Input Photo Ownership and License
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              You retain all ownership rights in photographs you upload to the Service. By uploading photos, you grant us a limited license to:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Process your photos using AI to generate portraits</li>
              <li>Store photos temporarily during processing (24-48 hours)</li>
              <li>Use photos solely to provide the Service to you</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>We will NOT:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Use your uploaded photos to train our AI models</li>
              <li>Use your photos for marketing without your separate written consent</li>
              <li>Share your photos with third parties except as necessary to provide the Service</li>
              <li>Retain your photos beyond the processing period</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              8. User Responsibilities and Prohibited Uses
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              8.1 Biometric Data Consent
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>IMPORTANT: The Service processes facial images, which constitute biometric data under GDPR.</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Before using the Service, you must provide explicit consent to biometric data processing. You understand that:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Your facial images will be analyzed by Google Gemini AI</li>
              <li>Biometric facial features will be extracted temporarily for portrait generation</li>
              <li>Images will be stored for 24-48 hours then automatically deleted</li>
              <li>You can withdraw this consent at any time by contacting support@portraitwiz.com</li>
              <li>You have rights to access, delete, and receive a copy of your data</li>
            </ul>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              8.2 Prohibited Uses
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>You are strictly prohibited from using the Service to create, generate, store, or disseminate:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Illegal content including CSAM or non-consensual intimate images</li>
              <li>Content depicting illegal violence, terrorism, or criminal activity</li>
              <li>Deepfakes intended to deceive or manipulate</li>
              <li>Content used for harassment, stalking, or threatening</li>
              <li>Content violating personality rights or right to image without authorization</li>
              <li>Defamatory or libelous content about identifiable persons</li>
              <li>Portraits of identifiable persons without their knowledge or consent</li>
              <li>Content used for illegal purposes under applicable law</li>
            </ul>
          </section>

          {/* AI Content Disclosures */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              9. AI-Generated Content Disclosures
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              9.1 AI Act Transparency Obligations
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              In compliance with Article 50 of the EU Artificial Intelligence Act:
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>All portrait images generated by PortraitWiz are artificially generated using AI technology.</strong> Outputs are marked in machine-readable format with embedded metadata including generator name, date/time of generation, and AI model information.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              9.2 Nature of AI-Generated Content
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>AI-generated portraits are synthetic content created by machine learning algorithms.</strong> You acknowledge and understand that:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>AI systems produce probabilistic outputs that may vary significantly</li>
              <li>Outputs may be unexpected, unusual, or not match your intentions</li>
              <li>Generated portraits may contain visual errors, distortions, or anomalies</li>
              <li>AI systems may reflect biases present in training data</li>
              <li>Service is not a substitute for professional photography or artistic services</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              10. Data Protection and Privacy
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.1 GDPR Compliance
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              We process your personal data in accordance with the EU General Data Protection Regulation (GDPR) and our <Link href="/privacy" className="font-medium text-primary underline underline-offset-4">Privacy Policy</Link>, which is incorporated into these Terms by reference.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              10.2 Data Retention
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Input Photographs:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Automatically deleted 24-48 hours after portrait generation</li>
              <li>You may request immediate deletion at any time</li>
              <li>Deleted securely and permanently</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Biometric Features:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Extracted facial features deleted immediately after portrait generation</li>
              <li>Never stored permanently</li>
              <li>Not used for facial recognition or identification</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              12. Limitation of Liability
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              12.1 Mandatory Liability
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>NOTHING IN THESE TERMS EXCLUDES OR LIMITS OUR LIABILITY FOR:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>Death or personal injury caused by our negligence</li>
              <li>Fraud or fraudulent misrepresentation</li>
              <li>Gross negligence or willful misconduct</li>
              <li>Any liability that cannot be excluded under applicable law</li>
            </ul>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              12.2 Consumer Rights Preservation
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>IF YOU ARE A CONSUMER:</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              These limitations apply only to the extent permitted by law. Nothing in these Terms affects your statutory rights under EU consumer protection law. You retain all rights under applicable consumer protection regulations.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              15. Dispute Resolution
            </h2>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              15.1 Informal Resolution
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Before initiating formal proceedings, we encourage you to contact us at support@portraitwiz.com to resolve disputes informally. Many issues can be resolved through direct communication.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              15.2 No Mandatory Arbitration
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>YOU ARE NOT REQUIRED TO USE ARBITRATION.</strong> You retain the full right to bring any dispute to court. Any arbitration must be agreed to individually after a dispute arises and may not be imposed through these Terms.
            </p>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3">
              15.3 Consumer Court Access
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>IF YOU ARE A CONSUMER:</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              You may bring legal proceedings related to these Terms in either:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>The courts of the Republic of Latvia, OR</li>
              <li>The courts of your country of residence (EU Member State)</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              16. Governing Law
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              These Terms are governed by the laws of the Republic of Latvia, without regard to conflict of law principles.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>IF YOU ARE A CONSUMER RESIDING IN ANOTHER EU MEMBER STATE:</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              You also benefit from the mandatory consumer protection provisions of the law of your country of residence that provide a higher level of protection than Latvian law. Nothing in these Terms limits your rights under those national consumer protection laws.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              18. Contact Information
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Contact Methods:</strong>
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li><strong>Customer Support:</strong> support@portraitwiz.com</li>
              <li><strong>Data Protection:</strong> privacy@portraitwiz.com</li>
              <li><strong>Legal Inquiries:</strong> legal@portraitwiz.com</li>
            </ul>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Supervisory Authority:</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Data State Inspectorate of Latvia (Datu valsts inspekcija)<br />
              Website: <Link href="https://www.dvi.gov.lv/en" className="font-medium text-primary underline underline-offset-4">https://www.dvi.gov.lv/en</Link>
            </p>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <strong>Consumer Protection Authority:</strong>
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Consumer Rights Protection Centre (PTAC)<br />
              Website: <Link href="https://www.ptac.gov.lv/en" className="font-medium text-primary underline underline-offset-4">https://www.ptac.gov.lv/en</Link>
            </p>
          </section>

          {/* Acknowledgment */}
          <section>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
              Acknowledgment
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              By clicking &quot;I Accept&quot; or by accessing and using the Service, you acknowledge that:
            </p>
            <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
              <li>You have read, understood, and agree to be bound by these Terms</li>
              <li>You are at least 18 years of age and legally capable of entering into contracts</li>
              <li>You understand this is a credit-based payment service</li>
              <li>You consent to processing of your biometric data for portrait generation</li>
              <li>You understand AI-generated content is marked as artificially generated</li>
              <li>You are responsible for lawful use of the Service and generated portraits</li>
              <li>You understand your EU consumer rights and how to exercise them</li>
            </ul>
          </section>

          {/* Footer */}
          <section className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> October 12, 2025<br />
              <strong>Version:</strong> 1.0
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-sm text-muted-foreground">
              These Terms and Conditions constitute a legally binding agreement. By using PortraitWiz, you confirm your acceptance of these Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
