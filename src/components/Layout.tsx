import { TopNav, MainNav } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';
import { AnnouncerProvider } from '../context/AnnouncerProvider';

export function Layout() {
  return (
    <AnnouncerProvider>
      <div className="flex flex-col min-h-svh">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-sis-navy focus:px-4 focus:py-2 focus:rounded focus:shadow-lg">
          Saltar al contenido principal
        </a>
        <header>
          <TopNav />
          <MainNav />
        </header>
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AnnouncerProvider>
  );
}
