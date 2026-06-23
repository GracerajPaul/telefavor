"use client";
import { useRouter } from "next/navigation";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: 'By accessing or using Telefavor ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Platform. Continued use of the Platform constitutes acceptance of any future modifications to these terms.',
  },
  {
    title: "2. Description of Service",
    content: "Telefavor is a peer-to-peer referral exchange platform that connects users for the purpose of exchanging referral links and codes via Telegram. The Platform facilitates discovery, trust evaluation, and communication between users but does not directly participate in, guarantee, or oversee any referral exchange between users.",
  },
  {
    title: "3. User Accounts",
    content: "3.1. You must sign in using a valid Google account to use the Platform.\n\n3.2. You are responsible for maintaining the confidentiality of your account credentials.\n\n3.3. You must provide accurate, current, and complete information during the registration process.\n\n3.4. You are solely responsible for all activity that occurs under your account.\n\n3.5. You may not create multiple accounts or use automated methods to create accounts.\n\n3.6. You must notify Telefavor immediately of any unauthorized use of your account.",
  },
  {
    title: "4. Telegram Username",
    content: "4.1. All users must provide a valid Telegram username to use the Platform's features.\n\n4.2. Your Telegram username will be displayed publicly on your listings and profile.\n\n4.3. You are responsible for ensuring that your Telegram username is accurate and that you can be reached at that username.\n\n4.4. Telefavor is not responsible for any communications or transactions that occur on Telegram.",
  },
  {
    title: "5. User Conduct",
    content: "You agree not to:\n\n5.1. Use the Platform for any unlawful purpose or in violation of any applicable laws.\n\n5.2. Post false, misleading, or fraudulent listings.\n\n5.3. Harass, abuse, or harm other users.\n\n5.4. Attempt to manipulate trust scores through fake ratings or collusion.\n\n5.5. Use the Platform to distribute spam, malware, or harmful content.\n\n5.6. Impersonate any person or entity.\n\n5.7. Interfere with the proper functioning of the Platform.\n\n5.8. Attempt to bypass any security measures or access restricted areas.",
  },
  {
    title: "6. Listings",
    content: "6.1. Users may post one active listing at a time.\n\n6.2. Listings automatically expire after 24 hours.\n\n6.3. You may delete or repost your listing at any time.\n\n6.4. Listings must accurately describe the referral being offered.\n\n6.5. Telefavor reserves the right to remove any listing that violates these terms.\n\n6.6. Prohibited listing categories include but are not limited to: illegal services, adult content, gambling (unless legally compliant), and fraudulent schemes.",
  },
  {
    title: "7. Ratings and Trust Scores",
    content: '7.1. After contacting a user through the Platform, you may rate the interaction as "Successful" (green) or "Not Successful" (red).\n\n7.2. You may only rate each listing once.\n\n7.3. Trust scores are calculated as the percentage of green ratings out of total ratings.\n\n7.4. Trust scores are publicly displayed on user profiles.\n\n7.5. Attempting to manipulate ratings through fake accounts or coordination with other users is strictly prohibited and may result in account termination.\n\n7.6. Ratings are final and cannot be changed once submitted.',
  },
  {
    title: "8. Privacy",
    content: "8.1. Telefavor collects the following information:\n   - Google account information (name, email, profile photo)\n   - Telegram username\n   - Listing activity\n   - Ratings submitted and received\n\n8.2. This information is used to operate the Platform, calculate trust scores, and facilitate referral exchanges.\n\n8.3. Your email address is not publicly displayed unless you choose to share it.\n\n8.4. Telefavor does not sell or share your personal information with third parties except as required by law.\n\n8.5. We use industry-standard security measures to protect your data.\n\n8.6. By using the Platform, you consent to the collection and use of information as described in these terms.",
  },
  {
    title: "9. Limitation of Liability",
    content: '9.1. Telefavor is provided "as is" without any warranty, express or implied.\n\n9.2. Telefavor does not guarantee the accuracy, reliability, or completeness of any listings, ratings, or user information.\n\n9.3. Telefavor is not responsible for any losses, damages, or disputes arising from referral exchanges conducted between users.\n\n9.4. In no event shall Telefavor be liable for any indirect, incidental, special, consequential, or punitive damages.\n\n9.5. Your sole remedy for dissatisfaction with the Platform is to stop using it.',
  },
  {
    title: "10. Termination",
    content: "10.1. Telefavor reserves the right to suspend or terminate your account at any time, with or without notice, for violation of these terms.\n\n10.2. You may delete your account at any time by contacting support.\n\n10.3. Upon termination, your listings will be deactivated and your profile will no longer be accessible.\n\n10.4. Ratings submitted by or about you may be retained for moderation purposes.",
  },
  {
    title: "12. Modifications to Terms",
    content: "12.1. Telefavor reserves the right to modify these terms at any time.\n\n12.2. Users will be notified of material changes via email or Platform notification.\n\n12.3. Continued use of the Platform after changes constitutes acceptance of the modified terms.\n\n12.4. It is your responsibility to review these terms periodically.",
  },
  {
    title: "13. Governing Law",
    content: "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Telefavor operates. Any disputes arising from these terms shall be resolved through binding arbitration.",
  },
  {
    title: "14. Contact Information",
    content: "For questions about these terms, please reach out to the development team.",
  },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-dark">
      <nav className="flex items-center justify-between px-4 md:px-[141px] py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded overflow-hidden ring-1 ring-white/10">
            <img src="/logo.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-semibold text-text tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Telefavor</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => router.push("/features")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Features</button>
          <button onClick={() => router.push("/community")} className="px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">Community</button>
        </div>
      </nav>

      <section className="px-4 md:px-[141px] pt-20 md:pt-28 animate-fadeIn" style={{ marginBottom: "250px" }}>
        <div className="text-center mb-12">
          <h1 className="text-[28px] md:text-[36px] font-light text-text mb-3" style={{ fontFamily: "var(--font-heading)" }}>Terms & Conditions</h1>
          <p className="text-text-secondary text-[13px]">Last updated: June 2026</p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 md:p-10 space-y-8 max-w-3xl mx-auto">
          {sections.map((s, i) => (
            <div key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 40}ms` }}>
              <h2 className="text-[15px] font-semibold text-text mb-3">{s.title}</h2>
              {s.content.split("\n").map((line, j) => (
                <p key={j} className="text-[13px] text-text-secondary leading-relaxed mb-2 last:mb-0 whitespace-pre-line">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <footer className="px-4 md:px-[141px] py-6 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <p>Telefavor — Safe Referral Exchanges on Telegram</p>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/features")} className="hover:text-text-secondary transition-colors">Features</button>
            <button onClick={() => router.push("/community")} className="hover:text-text-secondary transition-colors">Community</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
