import React from "react";
import { cn } from "@/lib/utils";

interface PersonAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Database of high-quality professional avatar images mapped to specific names
const avatarDatabase = {
  // Female clients
  "María González Sánchez": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "Ana Rodríguez Vásquez": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "Patricia Núñez Torres": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",

  // Male clients
  "Carlos Mendoza Peña": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "José Luis Ramírez": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "Roberto Díaz Morales": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

// Detect gender based on common Spanish names
const detectGender = (name: string): 'male' | 'female' => {
  const femaleNames = ['maría', 'ana', 'patricia', 'carmen', 'laura', 'elena', 'sofia', 'isabella', 'valentina'];
  const maleNames = ['carlos', 'josé', 'roberto', 'miguel', 'antonio', 'francisco', 'manuel', 'diego', 'alejandro'];

  const firstName = name.toLowerCase().split(' ')[0];

  if (femaleNames.some(fn => firstName.includes(fn))) return 'female';
  if (maleNames.some(mn => firstName.includes(mn))) return 'male';

  // Default fallback based on name ending
  return firstName.endsWith('a') ? 'female' : 'male';
};

// Generate consistent high-quality image based on gender
const generateImageUrl = (name: string, size: number): string => {
  // Check if we have a specific image for this person
  if (avatarDatabase[name as keyof typeof avatarDatabase]) {
    return avatarDatabase[name as keyof typeof avatarDatabase];
  }

  const gender = detectGender(name);
  const seed = generateHash(name);

  // Use specific Unsplash collections for professional portraits
  const femaleIds = [
    "photo-1494790108755-2616b612b786", // Professional woman
    "photo-1438761681033-6461ffad8d80", // Business woman
    "photo-1544005313-94ddf0286df2", // Young professional
    "photo-1580489944761-15a19d654956", // Friendly woman
    "photo-1573496359142-b8d87734a5a2", // Professional portrait
  ];

  const maleIds = [
    "photo-1507003211169-0a1dd7228f2d", // Professional man
    "photo-1500648767791-00dcc994a43e", // Business man
    "photo-1472099645785-5658abf4ff4e", // Young professional
    "photo-1519085360753-af0119f7cbe7", // Friendly man
    "photo-1560250097-0b93528c311a", // Professional portrait
  ];

  const ids = gender === 'female' ? femaleIds : maleIds;
  const selectedId = ids[seed % ids.length];

  return `https://images.unsplash.com/${selectedId}?w=${size}&h=${size}&fit=crop&crop=face`;
};

// Generate consistent hash for name
const generateHash = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  name,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const sizePixels = {
    sm: 48,
    md: 64,
    lg: 80,
  };

  // Get initials from name as fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const imageSize = sizePixels[size];
  const imageUrl = generateImageUrl(name, imageSize);

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shadow-md bg-gradient-to-br from-gray-100 to-gray-200",
        sizeClasses[size],
        className,
      )}
    >
      <img
        src={imageUrl}
        alt={`Avatar de ${name}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const gender = detectGender(name);
            const bgColor = gender === 'female' ? 'from-pink-500 to-purple-500' : 'from-blue-500 to-green-500';
            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${bgColor} rounded-full flex items-center justify-center text-white font-semibold">${getInitials(name)}</div>`;
          }
        }}
      />
    </div>
  );
};

// Predefined avatar components for common use cases
export const ClientAvatar: React.FC<{ name: string; className?: string }> = ({
  name,
  className,
}) => <PersonAvatar name={name} className={className} size="md" />;

export const TestimonialAvatar: React.FC<{
  name: string;
  className?: string;
}> = ({ name, className }) => {
  return <PersonAvatar name={name} className={className} size="lg" />;
};

// Professional veterinary team avatars with consistent styling
const teamMembers = [
  { name: "Dr. Carlos Rodríguez", role: "Veterinario Principal" },
  { name: "Dra. Ana Martínez", role: "Especialista en Cirugía" },
  { name: "María González", role: "Técnica Veterinaria" },
  { name: "José Herrera", role: "Grooming Specialist" },
];

export const TeamAvatar: React.FC<{
  memberIndex?: number;
  className?: string;
}> = ({ memberIndex = 0, className }) => {
  const member = teamMembers[memberIndex % teamMembers.length];
  return <PersonAvatar name={member.name} className={className} size="lg" />;
};
