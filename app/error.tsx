'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем на сервере (серверные логи Dokploy покажут реальную ошибку)
    console.error('[App Error]', error?.message, 'digest:', error?.digest, error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">Что-то пошло не так</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Произошла ошибка при загрузке страницы. Проверьте логи сервера в Dokploy — там будет полное описание.
        {error?.digest && (
          <span className="block mt-2 text-sm">Код ошибки: {error.digest}</span>
        )}
      </p>
      <Button onClick={() => reset()}>Попробовать снова</Button>
    </div>
  )
}
