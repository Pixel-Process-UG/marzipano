interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {icon && (
        <div className="mb-4 text-gray-900 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-3 text-black group-hover:text-gray-700 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
        {description}
      </p>
    </div>
  );
}
