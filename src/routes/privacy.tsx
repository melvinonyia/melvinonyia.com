import { createFileRoute } from '@tanstack/react-router'
import { privacyHead } from '~/lib/seo/privacyHead'

export const Route = createFileRoute('/privacy')({
  head: privacyHead,
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="legal-container">
      <h2 className="legal-headline">Privacy</h2>
      <p>Last updated: January 29, 2022</p>
      <div className="legal-group">
        <p>
          This Privacy Policy describes My policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You. I use Your Personal data to provide and improve the
          Service. By using the Service, You agree to the collection and use of
          information in accordance with this Privacy Policy.
        </p>
      </div>
      <h3>Personal Data</h3>
      <div className="legal-group">
        <h4>Data Collected</h4>
        <p>
          Usage Data is collected automatically when using the Service. Usage
          Data may include information such as Your Device&apos;s Internet
          Protocol address (e.g. IP address), browser type, browser version,
          the pages of my Service that You visit, the time and date of Your
          visit, the time spent on those pages, unique device identifiers and
          other diagnostic data.
        </p>
        <p>
          I use Cookies and similar tracking technologies to track the activity
          on My Service and store certain information.
        </p>
      </div>
      <h3>Contact</h3>
      <div className="legal-group">
        <p>
          For privacy questions, write to{' '}
          <a href="mailto:melvin.onyia@gmail.com">melvin.onyia@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}
