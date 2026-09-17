import * as React from "react"
import { Loader2, AlertCircle, FileX } from "lucide-react"
import { cn } from "../../utils/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4 text-muted-foreground", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Processing...</p>
    </div>
  )
}

export function EmptyState({ title, description, icon, className }: { title: string, description: string, icon?: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/50", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon || <FileX className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}

export function ErrorState({ title = "Something went wrong", description, onRetry, className }: { title?: string, description: string, onRetry?: () => void, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none">
          Try Again
        </button>
      )}
    </div>
  )
}
