import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Finance Tracker',
  description: 'Personal finance tracker with database integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand fw-bold" href="/">
              💰 FinanceTracker
            </a>
            <div className="navbar-nav">
              <a className="nav-link" href="/">Dashboard</a>
            </div>
          </div>
        </nav>
        <main className="container-fluid bg-light min-vh-100 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}