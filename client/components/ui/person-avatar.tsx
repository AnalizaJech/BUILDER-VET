import React from "react";
import { cn } from "@/lib/utils";

interface PersonAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

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
    sm: 32,
    md: 48,
    lg: 64,
  };

  // Generate a consistent seed based on the name for reproducible images
  const generateSeed = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
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

  // Generate image URL from DiceBear API for realistic person avatars
  const seed = generateSeed(name);
  const imageSize = sizePixels[size];
  const imageUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&size=${imageSize}&backgroundColor=transparent`;

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
            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">${getInitials(name)}</div>`;
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
}> = ({ name, className }) => (
  <PersonAvatar name={name} className={className} size="lg" />
);

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
