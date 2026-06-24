import { useEffect } from 'react'

export function usePageTitle(sub?: string) {
  useEffect(() => {
    document.title = sub ? `uACT | ${sub}` : 'uACT'
  }, [sub])
}
