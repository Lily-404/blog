export function Footer() {
  return (
    <footer className="mt-1 pt-4">
      <div className="text-center text-zinc-400 dark:text-zinc-500 text-xs py-2">
        <div className="flex justify-center gap-4 items-center">
          <p>© 2025-{new Date().getFullYear()} Jimmy</p>
        </div>
      </div>
    </footer>
  )
}
