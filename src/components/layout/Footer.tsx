export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Репетитор по математике. Все права защищены.
        </p>
      </div>
    </footer>
  )
}

