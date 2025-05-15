'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import Swal from 'sweetalert2'

export default function ClientNavLoader() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [navStarted, setNavStarted] = useState(false)

  // when the transition finishes, close the Swal
  useEffect(() => {
    if (navStarted && !isPending) {
      Swal.close()
      setNavStarted(false)
    }
  }, [isPending, navStarted])

  useEffect(() => {
    const handleClick = (e) => {
      let el = e.target
      while (el && el.tagName !== 'A') el = el.parentNode

      if (el && el.href && new URL(el.href).origin === window.location.origin) {
        e.preventDefault()
        const href = el.getAttribute('href')
        setNavStarted(true)
        Swal.fire({
          title: 'กำลังโหลด…',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        })
        startTransition(() => {
          router.push(href)   // again, no .finally()
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [router, startTransition])

  return null
} 