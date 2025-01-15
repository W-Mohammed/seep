<template>




    <div class="container mt-14 mb-20 max-w-[80ch]">
<div class="mb-6">
<div role="button" class="a text-priorb-primary text-lg font-semibold flex items-center gap-1"
@click="goBackWhereYouCameFrom"
>&lt; Go Back</div>
</div>
    <h1>PRIORB Privacy Policy</h1>

    <p>At PRIORB UG, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information.</p>


    <h2>About Our Users</h2>

<p>PRIORB serves two primary user groups:</p>
<p>
<ul>
    <li>Admin Users: These are our clients who use our platform to create and host expert surveys, collect data from expert users, and analyze the results.</li>
    <li>Expert Users: These are individuals who participate in surveys hosted on our platform, providing their expert opinions and insights.</li>
</ul>

</p>
    <h2>Data We Collect</h2>

    <p>We may collect the following personal information:</p>

    <ul>
        <li>For Admin Users:
            <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Billing information</li>
            </ul>
        </li>
        <li>For Expert Users:
            <ul>
                <li>Email address</li>
                <li>Survey responses</li>
            </ul>
        </li>
    </ul>

    <h2>How We Use Your Data</h2>

    <p>We use your personal information to:</p>

    <ul>
        <li>Provide our services to admin users</li>
        <li>Process survey responses from expert users</li>
        <li>Improve our services</li>
        <li>Communicate with you</li>
        <li>Comply with legal obligations</li>
    </ul>

    <h2>Legal Basis for Processing</h2>

    <p>We process your personal data based on the following legal grounds:</p>

    <ul>
        <li>Consent: We may ask for your consent to process certain types of personal data.</li>
        <li>Contractual Necessity: We may process your personal data to fulfill our contractual obligations.</li>
        <li>Legitimate Interest: We may process your personal data for legitimate business interests, such as improving our services.</li>
    </ul>

    <h2>Data Sharing and Transfer</h2>

    <p>We may share your personal data with:</p>

    <ul>
        <li>Third-party service providers: We may share your personal data with trusted third-party service providers who assist us in providing our services, such as data hosting, analytics, and customer support. We carefully select these providers and implement appropriate safeguards to protect your data.</li>
        <li>Law enforcement or regulatory authorities: We may share your personal data with law enforcement or regulatory authorities as required by law.</li>
    </ul>

    <h2>Data Security</h2>

    <p>We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, use, disclosure, alteration, or destruction. These measures include:</p>

    <ul>
        <li>Encryption of sensitive data</li>
        <li>Secure data storage and transmission</li>
        <li>Regular security assessments and updates</li>
        <li>Access controls to limit access to authorized personnel</li>
    </ul>

    <h2>Data Retention</h2>

    <p>We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by law. We will delete or anonymize your personal data when it is no longer needed.</p>

    <h2>Data Breaches</h2>

    <p>In the event of a data breach, we will take appropriate steps to investigate the incident, contain the breach, and notify affected individuals and relevant authorities as required by law. We have a robust incident response plan in place to minimize the impact of potential data breaches.</p>

    <h2>Your Rights</h2>

    <p>You have the following rights:</p>

    <ul>
        <li>Access: You can request access to your personal data.</li>
        <li>Rectification: You can request the rectification of inaccurate or incomplete personal data.</li>
        <li>Erasure: You can request the erasure of your personal data in certain circumstances.</li>
        <li>Restriction: You can request the restriction of processing your personal data.</li>
        <li>Objection: You can object to the processing of your personal data.</li>
        <li>Data Portability: You can request the portability of your personal data in a machine-readable format.</li>
    </ul>

    <p>To exercise your rights, please contact us at [email address].</p>

    <h2>Cookies and Tracking Technologies</h2>

    <p>We use cookies and similar tracking technologies to enhance your experience on our website. These technologies may collect information about your browsing behavior, such as your IP address, device type, and pages visited. You can manage your cookie preferences through your browser settings.</p>

    <h2>International Data Transfers</h2>

    <p>If we transfer your personal data outside the European Economic Area (EEA), we will ensure that appropriate safeguards are in place to protect your data, such as Standard Contractual Clauses or Privacy Shield certification.</p>

    <h2>Children's Privacy</h2>

    <p>Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children.</p>

    <h2>Contact Us</h2>

    <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>

    <p>PRIORB UG<br>
    Gewerkenstr 8<br>
    44805 Bochum, Germany<br>
    <a href="mailto:contact@priorb.com">contact@priorb.com</a>
    </p>

    </div>
</template>

<script setup>
// import router
import { useRouter } from 'vue-router';
const router = useRouter();

const goBackWhereYouCameFrom = () => {
    router.go(-1);
}


</script>

<style scoped>

</style>