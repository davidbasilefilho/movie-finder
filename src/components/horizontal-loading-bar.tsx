import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HorizontalLoadingBarProps {
  className?: string;
  height?: number;
  duration?: number;
}

const HorizontalLoadingBar: React.FC<HorizontalLoadingBarProps> = ({
  className,
  height = 4,
  duration = 3000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const resetProgress = useCallback(() => {
    setIsResetting(true);
    setTimeout(() => {
      setProgress(0);
      setIsResetting(false);
    }, 500);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const updateProgress = () => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          resetProgress();
          return 100;
        }
        return prevProgress + 1;
      });
    };

    if (!isResetting) {
      timer = setInterval(updateProgress, duration / 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [duration, resetProgress, isResetting]);

  return (
    <div
      className="w-full bg-gray-200 rounded-full overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        className={cn("transition-all duration-300 ease-out", className)}
        style={{
          width: `${progress}%`,
          height: "100%",
          transition: isResetting ? "none" : "all 300ms ease-out",
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default HorizontalLoadingBar;
