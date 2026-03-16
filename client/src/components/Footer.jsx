import { Link } from "react-router";

const footerLinks = {
  Platform: [
    { label: "Browse Auctions", to: "/auction" },
    { label: "How It Works", to: "/about" },
    { label: "Credit Plans", to: "/signup" },
    { label: "Contact Us", to: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", to: "/legal/terms-of-service" },
    { label: "Privacy Policy", to: "/legal/privacy-policy" },
    { label: "DMCA Policy", to: "/legal/dmca" },
    { label: "Code of Conduct", to: "/legal/code-of-conduct" },
  ],
  Company: [
    { label: "About Bolibazaar", to: "/about" },
    { label: "Acceptable Use", to: "/legal/acceptable-use-policy" },
    { label: "Legal Hub", to: "/legal" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
                CB
              </div>
              <span className="text-lg font-bold font-serif text-gradient bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent select-none" style={{fontFamily: 'cursive,serif'}}>Bolibazaar</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The next-generation auction platform with real-time bidding and gamified experiences.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Bolibazaar. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with React, Node.js & Socket.IO
          </p>
        </div>
      </div>
    </footer>
  );
};
