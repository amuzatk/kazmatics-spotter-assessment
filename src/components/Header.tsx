import React, { useState } from "react";
import {
  Map,
  Compass,
  Plane,
  Building,
  Home,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronDown,
  Menu,
  GripVertical,
} from "lucide-react"; // Menu for hamburger, GripVertical for six dots

interface HeaderProps {
  theme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const navItems = [
    { icon: Map, label: "Travel" },
    { icon: Compass, label: "Explore" },
    { icon: Plane, label: "Flights", active: true },
    { icon: Building, label: "Hotels" },
    { icon: Home, label: "Holiday rentals" },
  ];

  const themeOptions = [
    { value: "system", label: "Use device default", icon: Monitor },
    { value: "dark", label: "Dark theme", icon: Moon },
    { value: "light", label: "Light theme", icon: Sun },
  ];

  return (
    <header className="fixed h-19 m-auto top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-16">
            <div className="flex items-center space-x-4">

            <Menu size={24} className="text-gray-700 dark:text-gray-300" />

            <img
              src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png"
              alt="Google Logo"
              className="h-6"
            />
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              {navItems.map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  className={`flex items-center space-x-3 px-3 py-3 border border-gray-200 rounded-[25px] text-sm font-medium transition-colors ${
                    active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Section: Theme + 6-dot icon + Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Moon size={18} />
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                      Appearance
                    </div>
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          onThemeChange(value as "light" | "dark" | "system");
                          setIsThemeDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={16} />
                          <span>{label}</span>
                        </div>
                        {theme === value && (
                          <Check
                            size={16}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6 Dots Icon */}
            <GripVertical size={20} className="text-gray-700 dark:text-gray-300" />

            {/* Avatar */}
            <img
              src="https://www.gravatar.com/avatar?d=mp"
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;






// import React, { useState } from "react";
// import {
//   Map,
//   Compass,
//   Plane,
//   Building,
//   Home,
//   Moon,
//   Sun,
//   Monitor,
//   Check,
//   ChevronDown,
// } from "lucide-react";

// interface HeaderProps {
//   theme: "light" | "dark" | "system";
//   onThemeChange: (theme: "light" | "dark" | "system") => void;
// }

// const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
//   const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

//   const navItems = [
//     { icon: Map, label: "Travel" },
//     { icon: Compass, label: "Explore" },
//     { icon: Plane, label: "Flights", active: true },
//     { icon: Building, label: "Hotels" },
//     { icon: Home, label: "Holiday rentals" },
//   ];

//   const themeOptions = [
//     { value: "system", label: "Use device default", icon: Monitor },
//     { value: "dark", label: "Dark theme", icon: Moon },
//     { value: "light", label: "Light theme", icon: Sun },
//   ];

//   return (
//     <header className="fixed h-19 m-auto top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
//       <div className=" mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Left Navigation */}
//           <nav className="flex items-center space-x-2">
//             {navItems.map(({ icon: Icon, label, active }) => (
//               <button
//                 key={label}
//                 className={`flex items-center space-x-2 px-3 py-3 border border-red-500 rounded-[25px] text-sm font-medium transition-colors ${
//                   active
//                     ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
//                     : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span className="hidden sm:inline">{label}</span>
//               </button>
//             ))}
//           </nav>

//           {/* Right Theme Selector */}
//           <div className="relative">
//             <button
//               onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
//               className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//             >
//               <Moon size={18} />
//               <ChevronDown size={16} />
//             </button>

//             {isThemeDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
//                 <div className="py-1">
//                   <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
//                     Appearance
//                   </div>
//                   {themeOptions.map(({ value, label, icon: Icon }) => (
//                     <button
//                       key={value}
//                       onClick={() => {
//                         onThemeChange(value as "light" | "dark" | "system");
//                         setIsThemeDropdownOpen(false);
//                       }}
//                       className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <Icon size={16} />
//                         <span>{label}</span>
//                       </div>
//                       {theme === value && (
//                         <Check
//                           size={16}
//                           className="text-blue-600 dark:text-blue-400"
//                         />
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
