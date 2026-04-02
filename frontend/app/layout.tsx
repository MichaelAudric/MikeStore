import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Container from "../components/ui/Container";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata = {
  title: "Mike's Store",
  description: "Building my own ecommerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <Navbar />
          <Container>{children}</Container>
        </AuthProvider>
      </body>
    </html>
  );
}
