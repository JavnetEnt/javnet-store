"use client"

import Script from 'next/script'
import { usePathname } from 'next/navigation'

const PROPERTY_ID = '6ad0a88869219e34c47a7056'
const WIDGET_ID = '1k4vh4lrd'

export default function TawkChat() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <Script id="tawk-chat" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  )
}