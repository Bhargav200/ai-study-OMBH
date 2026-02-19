import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
          <div className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center">
            <Brain className="h-5 w-5 text-highlight" />
          </div>
          <span className="tracking-tight">StudyMind</span>
        </a>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button size="sm" className="bg-navy text-highlight hover:bg-navy/90 text-sm font-semibold rounded-lg px-5" asChild>
            <Link to="/signup">Sign Up Free</Link>
          </Button>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="block text-sm text-muted-foreground py-2">
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button className="w-full bg-navy text-highlight text-sm" asChild>
              <Link to="/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
