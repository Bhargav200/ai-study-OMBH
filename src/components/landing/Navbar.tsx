import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, BookOpen, Bot, BarChart3, Trophy, Timer, Zap, HelpCircle } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShinyButton } from "@/components/ui/shiny-button";

const features = [
  {
    title: "AI Tutor",
    description: "Get instant help on any topic with our AI study companion",
    icon: <Bot className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#features",
  },
  {
    title: "Quiz Engine",
    description: "AI-generated quizzes to test your knowledge",
    icon: <Zap className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#features",
  },
  {
    title: "Progress Tracker",
    description: "Visualize your learning journey with detailed analytics",
    icon: <BarChart3 className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#features",
  },
  {
    title: "Study Timer",
    description: "Focused study sessions with Pomodoro-style timer",
    icon: <Timer className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#features",
  },
];

const resources = [
  {
    title: "How It Works",
    description: "Learn how StudyMind helps you study smarter",
    icon: <HelpCircle className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#how-it-works",
  },
  {
    title: "Leaderboards",
    description: "Compete with friends and climb the rankings",
    icon: <Trophy className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#features",
  },
  {
    title: "Document Learning",
    description: "Upload your materials and learn from them with AI",
    icon: <BookOpen className="h-5 w-5 shrink-0 text-highlight" />,
    href: "#features",
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-transparent">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
          <div className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center">
            <Brain className="h-5 w-5 text-highlight" />
          </div>
          <span className="tracking-tight">StudyMind</span>
        </Link>

        {/* Center nav - Desktop */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground bg-transparent hover:text-foreground">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-3 md:w-[500px] md:grid-cols-2">
                    {features.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors"
                          >
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium text-foreground">{item.title}</div>
                              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground bg-transparent hover:text-foreground">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-3">
                    {resources.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors"
                          >
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium text-foreground">{item.title}</div>
                              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right - Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <ShinyButton className="!py-2 !px-5 !text-sm">Log In</ShinyButton>
          </Link>
          <Link to="/signup">
            <ShinyButton className="!py-2 !px-5 !text-sm">Sign Up Free</ShinyButton>
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>
                <Link to="/" className="flex items-center gap-2 font-bold text-foreground" onClick={() => setOpen(false)}>
                  <div className="h-8 w-8 rounded-lg bg-navy flex items-center justify-center">
                    <Brain className="h-5 w-5 text-highlight" />
                  </div>
                  StudyMind
                </Link>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-4">
              <a href="#" className="text-sm font-medium text-foreground py-2" onClick={() => setOpen(false)}>
                Home
              </a>

              <Accordion type="single" collapsible>
                <AccordionItem value="features">
                  <AccordionTrigger className="text-sm font-medium py-2">Features</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pl-2">
                      {features.map((item) => (
                        <a key={item.title} href={item.href} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          {item.icon}
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="resources">
                  <AccordionTrigger className="text-sm font-medium py-2">Resources</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pl-2">
                      {resources.map((item) => (
                        <a key={item.title} href={item.href} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                          {item.icon}
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <ShinyButton className="!w-full !text-sm">Log In</ShinyButton>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <ShinyButton className="!w-full !text-sm">Sign Up Free</ShinyButton>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
