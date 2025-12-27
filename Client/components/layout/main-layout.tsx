import type React from "react"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      <Sidebar />
      <div className="pl-64">
        <main className="min-h-screen">
          <div className="border-b border-border bg-background px-6 py-4 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
