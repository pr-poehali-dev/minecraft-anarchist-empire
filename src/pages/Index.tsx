import { useState, useEffect } from 'react';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Privileges from '@/components/sections/Privileges';
import AdminPanel from '@/components/sections/AdminPanel';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAuthToken(token);
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('admin_token', token);
    setAuthToken(token);
    setIsAdmin(true);
    setActiveSection('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthToken(null);
    setIsAdmin(false);
    setActiveSection('main');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-primary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wider">
              ANARCHIST EMPIRE
            </h1>
            <div className="flex gap-4 md:gap-6">
              <button
                onClick={() => setActiveSection('main')}
                className={`text-sm md:text-base transition-colors ${
                  activeSection === 'main' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveSection('features')}
                className={`text-sm md:text-base transition-colors ${
                  activeSection === 'features' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Преимущества
              </button>
              <button
                onClick={() => setActiveSection('privileges')}
                className={`text-sm md:text-base transition-colors ${
                  activeSection === 'privileges' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Привилегии
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveSection('admin')}
                  className={`text-sm md:text-base transition-colors ${
                    activeSection === 'admin' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Админ-панель
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {activeSection === 'main' && <Hero onNavigate={setActiveSection} />}
        {activeSection === 'features' && <Features />}
        {activeSection === 'privileges' && <Privileges />}
        {activeSection === 'admin' && (
          <AdminPanel
            isAdmin={isAdmin}
            authToken={authToken}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
