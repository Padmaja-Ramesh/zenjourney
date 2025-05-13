import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar"; // Import the NavBar component

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
          {/* Include the NavBar */}
          <header className="py-4 px-8 border-b border-gray-800">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">ZenJourney</h1>
              <NavBar /> {/* Place NavBar here */}
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
