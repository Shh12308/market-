import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { Save, Bell, Lock, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8 max-w-4xl">
           <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Store Settings</h1>
            <p className="text-[var(--text-muted)]">Configure your store profile, payout preferences, and security.</p>
          </div>

          <div className="space-y-8">
            {/* Profile Section */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--primary)]" /> Public Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Store Name</label>
                  <input type="text" defaultValue="CryptoGoods" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 text-white focus:border-[var(--primary)] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Store Description</label>
                  <textarea rows={4} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 text-white focus:border-[var(--primary)] focus:outline-none" defaultValue="Premium digital assets and crypto collectibles." />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Store Slug</label>
                  <div className="flex">
                    <span className="bg-[var(--surface-2)] border border-r-0 border-[var(--border)] rounded-l-lg px-3 py-3 text-[var(--text-muted)] text-sm">nexus.market/</span>
                    <input type="text" defaultValue="cryptogoods" className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-r-lg p-3 text-white focus:border-[var(--primary)] focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[var(--accent)]" /> Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--surface-2)]">
                  <div>
                    <p className="text-white font-medium text-sm">New Order Alerts</p>
                    <p className="text-xs text-[var(--text-muted)]">Receive email when a new order comes in.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded" />
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--surface-2)]">
                  <div>
                    <p className="text-white font-medium text-sm">Low Stock Warnings</p>
                    <p className="text-xs text-[var(--text-muted)]">Alert when inventory drops below 10.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded" />
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--surface-2)]">
                  <div>
                    <p className="text-white font-medium text-sm">Marketing Emails</p>
                    <p className="text-xs text-[var(--text-muted)]">Tips and platform updates.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded" />
                </div>
              </div>
            </div>

            {/* Security Section */}
             <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--warning)]" /> Security
              </h3>
              <div className="space-y-4">
                 <button className="w-full secondary-btn text-left flex justify-between items-center group">
                   <span className="text-sm">Change Password</span>
                   <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100">→</span>
                 </button>
                 <button className="w-full secondary-btn text-left flex justify-between items-center group">
                   <span className="text-sm">Enable 2FA</span>
                   <span className="text-[var(--success)]">Enabled</span>
                 </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button className="secondary-btn">Cancel</button>
              <button className="primary-btn flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
