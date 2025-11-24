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
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg z-10">
        <div>
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
          >
            ← Back to Demos
          </Link>
          <h1 className="text-xl font-bold inline-block ml-4">{title}</h1>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

