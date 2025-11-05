"use client";

import { Calendar, Clock, AlertCircle } from "lucide-react";
import { format, differenceInDays, differenceInHours, differenceInMinutes, isPast } from "date-fns";

interface DeadlineCountdownProps {
  deadline: Date;
  className?: string;
}

export function DeadlineCountdown({ deadline, className = "" }: DeadlineCountdownProps) {
  const now = new Date();
  const isOverdue = isPast(deadline);
  const days = Math.abs(differenceInDays(deadline, now));
  const hours = Math.abs(differenceInHours(deadline, now)) % 24;
  const minutes = Math.abs(differenceInMinutes(deadline, now)) % 60;

  let displayText = "";
  let icon = <Clock className="h-3 w-3" />;
  let colorClass = "text-blue-600 dark:text-blue-400";

  if (isOverdue) {
    const overdueDays = days > 0 ? `${days}d ` : "";
    const overdueHours = hours > 0 ? `${hours}h` : "";
    const overdueMinutes = days === 0 && hours === 0 ? `${minutes}m` : "";
    displayText = `Overdue by ${overdueDays}${overdueHours}${overdueMinutes}`.trim();
    icon = <AlertCircle className="h-3 w-3" />;
    colorClass = "text-red-600 dark:text-red-400";
  } else if (days === 0 && hours === 0) {
    displayText = `${minutes}m remaining`;
    colorClass = "text-orange-600 dark:text-orange-400";
  } else if (days === 0) {
    displayText = `${hours}h ${minutes > 0 ? `${minutes}m` : ""} remaining`;
    colorClass = "text-orange-600 dark:text-orange-400";
  } else if (days <= 3) {
    displayText = `${days}d ${hours > 0 ? `${hours}h` : ""} remaining`;
    colorClass = "text-yellow-600 dark:text-yellow-400";
  } else {
    displayText = `${days} days remaining`;
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${colorClass} ${className} line-clamp-1`}>
      <Calendar className="h-3 w-3 icon-3d flex-shrink-0" />
      <span className="truncate">{displayText}</span>
      <span className="text-muted-foreground truncate">({format(deadline, "MMM d, yyyy")})</span>
    </div>
  );
}

