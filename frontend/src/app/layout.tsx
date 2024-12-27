import type { Metadata } from "next";
import { Galdeano } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner"

const geistSans = Galdeano({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "400"
});


export const metadata: Metadata = {
  title: "HLS",
  description: "Generated transcoding using ffmpeg and sqs, worker and S3 for storage with HLS stream",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
