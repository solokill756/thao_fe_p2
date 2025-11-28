'use client';

interface CopyrightProps {
  copyright: string;
}

export default function RenderCopyright({ copyright }: CopyrightProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="text-center text-gray-500 text-sm">
      &copy; {currentYear} {copyright}
    </div>
  );
}
