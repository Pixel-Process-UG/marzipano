import Link from 'next/link';

interface DemoLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function DemoLayout({ title, description, children }: DemoLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 text-gray-900 p-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <Link 
            href="/demos" 
            className="text-gray-700 hover:text-black mr-4 transition-colors"
          >
            ← Back to Demos
          </Link>
          <h1 className="text-xl font-bold inline-block ml-4 text-black">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-white">
        {children}
      </main>
    </div>
  );
}

