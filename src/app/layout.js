import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

export const metadata = {
  title: 'Doctor Appointment App',
  description: 'Find and book appointments with doctors near you',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Leaflet CSS */}
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-white text-black">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header>
              <Navbar />
            </header>
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
