import { Brain } from "lucide-react";

const footerLinks = {
  Platform: ["Overview", "AI Tutor", "Quiz Engine", "Progress Tracker", "Mobile App"],
  Features: ["Homework Solver", "Document Learning", "Streaks & XP", "Leaderboards", "Study Timer"],
  Resources: ["Blog", "Documentation", "API Reference", "Community", "Tutorials"],
  Company: ["About Us", "Careers", "Press", "Contact", "Partners"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

const Footer = () => (
  <footer className="bg-deep text-deep-foreground border-t border-interface/10">
    <div className="container max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <a href="#" className="flex items-center gap-2 font-bold text-lg text-highlight mb-4">
            <div className="h-7 w-7 rounded-lg bg-navy border border-interface/30 flex items-center justify-center">
              <Brain className="h-4 w-4 text-highlight" />
            </div>
            StudyMind
          </a>
          <p className="text-xs text-soft leading-relaxed">
            AI-powered learning platform for smarter studying.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-soft mb-4">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-soft/70 hover:text-highlight transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-interface/10 mt-12 pt-8 text-center">
        <p className="text-xs text-soft/50">
          © 2026 StudyMind. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
