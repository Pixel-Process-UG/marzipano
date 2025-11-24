interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-400 transition-all duration-200 hover:shadow-lg hover:scale-105">
      {icon && (
        <div className="mb-4 text-gray-900 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-black">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}

