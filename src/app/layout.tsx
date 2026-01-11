import './globals.css';

export const metadata = {
  title: 'FlowBoard',
  description: 'A simple and intuitive task management application.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 