import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Terms of Service', 'Terms for using the FC Career Top player dashboard and website.', '/terms');
export default function TermsPage() {
  return <article className="container max-w-3xl mx-auto px-2 sm:px-4 py-8 leading-relaxed">
    <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
    <p className="mb-6">Last updated: October 10, 2026</p>
    <p>FC Career Top is a free community project operated by Veeja Liu for tracking EA FC career-mode player data. It is an independent project and is not affiliated with or endorsed by Electronic Arts. By using the service, you agree to these terms.</p>
    <h2 className="text-xl font-bold mt-6 mb-2">Your account and data</h2>
    <p>Use an email or Google account you control. Keep your password, session token and upload key private. Only upload game data you are entitled to use. You retain rights you have in your uploaded data and allow us to store and process it to provide the dashboard, history and notifications. See our <a className="underline" href="/privacy">Privacy Policy</a> for how account information is handled.</p>
    <h2 className="text-xl font-bold mt-6 mb-2">Acceptable use</h2>
    <p>Do not access other users&apos; accounts, misuse credentials, upload malicious content, disrupt the service or attempt to bypass access controls. We may restrict or suspend accounts that abuse the service or create security risks.</p>
    <h2 className="text-xl font-bold mt-6 mb-2">Availability and game compatibility</h2>
    <p>The service and game integration are provided as available. Game updates and third-party tools may affect compatibility. Features may change or be unavailable, and we cannot guarantee uninterrupted service, accuracy or permanent storage. Keep copies of important game saves and data.</p>
    <h2 className="text-xl font-bold mt-6 mb-2">Contact and changes</h2>
    <p>For account help or deletion requests, contact <a className="underline" href="mailto:veejaliu@gmail.com">veejaliu@gmail.com</a>. We may update these terms and publish the updated version and date here. These terms do not limit rights that applicable law does not allow to be limited.</p>
  </article>;
}
