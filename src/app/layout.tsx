import '../styles/globals.css';
import { Header } from '../components/Header';
import { ClientLayout } from '../components/ClientLayout';

export const metadata = {
  title: 'SSWebStudio CRM',
  description: 'Sales CRM and employee tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <Header />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
