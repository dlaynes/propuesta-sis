import { TopNav, MainNav } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex flex-col min-h-svh">
      <header>
        <TopNav />
        <MainNav />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
