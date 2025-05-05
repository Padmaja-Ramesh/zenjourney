import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZenJourney - Travel Planning",
  description: "Plan your next trip with our AI-powered travel planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
          <header className="py-4 px-8 border-b border-gray-800">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">ZenJourney</h1>
              <nav>
                <ul className="flex space-x-6">
                  <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
                  <li><a href="/about" className="hover:text-blue-400 transition-colors">About</a></li>
                  <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                  <li><a href="/voice-agent" className="hover:text-blue-400 transition-colors">Agent</a></li>
                </ul>
              </nav>
            </div>
          </header>
          {children}
          <footer className="py-6 px-8 border-t border-gray-800 text-center text-gray-400">
            <div className="container mx-auto">
              <p>© {new Date().getFullYear()} ZenJourney. Powered by uAgents and Next.js</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 