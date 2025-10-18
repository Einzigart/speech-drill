import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TeleprompterPlayingIndicatorProps {
  fullscreen?: boolean
  floating?: boolean
  className?: string
}

export function TeleprompterPlayingIndicator({
  fullscreen = false,
  floating = true,
  className
}: TeleprompterPlayingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.92 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
        "bg-primary/10 text-primary",
        floating && "absolute top-4 right-4",
        floating && fullscreen && "top-8 right-8",
        !floating && "shadow-sm",
        className
      )}
    >
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      Playing
    </motion.div>
  )
}
