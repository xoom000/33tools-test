// Simple, professional loading spinner - COMPOSE, NOT DUPLICATE!
const LoadingSpinner = ({ size = "small", className = "" }) => {
  const sizes = {
    xs: "w-3 h-3",
    small: "w-4 h-4", 
    medium: "w-5 h-5",
    large: "w-6 h-6"
  };

  return (
    <div 
      className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin opacity-75 ${className}`}
    />
  );
};

export default LoadingSpinner;