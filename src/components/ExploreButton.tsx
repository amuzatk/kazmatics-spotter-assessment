import React from "react";
import { Search } from "lucide-react";

interface Props {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

const ExploreButton: React.FC<Props> = ({ onClick, disabled, loading }) => {
  return (
    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-[30px] shadow-lg transition-colors"
      >
        <Search size={15} />
        <span>{loading ? "Exploring..." : "Explore"}</span>
      </button>
    </div>
  );
};

export default ExploreButton;