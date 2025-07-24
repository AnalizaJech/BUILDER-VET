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

  // Generate a consistent background color based on the name
  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold shadow-md",
        getBackgroundColor(name),
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
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
