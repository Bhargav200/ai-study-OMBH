import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Bell, User, LogOut, Shield, Moon } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [notifications, setNotifications] = useState({ email: true, push: true, streak: true });

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account</p>
        </div>
      </div>

      {/* Account */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <User className="h-4 w-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">Account</span>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" />
          </div>
        </div>
        <Button size="sm" className="bg-navy text-highlight hover:bg-navy/90">Save Changes</Button>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Bell className="h-4 w-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">Notifications</span>
        </div>
        {[
          { key: "email", label: "Email notifications", desc: "Receive weekly progress reports" },
          { key: "push", label: "Push notifications", desc: "Get reminders to study" },
          { key: "streak", label: "Streak reminders", desc: "Don't lose your streak!" },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">{n.label}</div>
              <div className="text-xs text-muted-foreground">{n.desc}</div>
            </div>
            <button
              onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
              className={`h-6 w-11 rounded-full transition-colors ${
                notifications[n.key as keyof typeof notifications] ? "bg-accent" : "bg-muted"
              }`}
            >
              <div className={`h-5 w-5 rounded-full bg-card shadow transition-transform ${
                notifications[n.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Shield className="h-4 w-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">Security</span>
        </div>
        <Button variant="outline" size="sm">Change Password</Button>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </Button>
    </div>
  );
};

export default Settings;
