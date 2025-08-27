'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import '@/app/[locale]/globals.css'

const locales = [
  { code: 'en', label: 'English', flag: '/flags/en.svg' },
  { code: 'mm', label: 'မြန်မာ', flag: '/flags/mm.svg' },
  { code: 'ru', label: 'Русский', flag: '/flags/ru.svg' }
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  // Define routes where LanguageSwitcher should be hidden
  const hiddenRoutes = ['/en/authorization','/mm/authorization','/en/ers-technology', '/mm/ers-technology', '/en/recieved-map', '/mm/recieved-map', '/en/earthquake', '/mm/earthquake', '/en/minerals', '/mm/minerals', '/en/about', '/mm/about', '/en/fire', '/mm/fire', '/en/weather', '/mm/weather', '/en/osis', '/mm/osis'];

  // If pathname starts with any of the hidden routes, hide the switcher
  const shouldHide = hiddenRoutes.some(route => pathname.startsWith(route));

  if (shouldHide) return null;

  // Extract current locale from the path (e.g., "/en/page" => "en")
  const currentLocale = pathname.split('/')[1] || 'en'

  const [open, setOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleChange = (code: string) => {
    const segments = pathname.split('/');
    segments[1] = code;
    router.replace(segments.join('/'));
    setOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50 px-15" style={{position:'relative', display:'inline-block', zIndex: '50'}}>
      <button
        className="flex items-center gap-2 px-3 py-1 border rounded bg-black text-white hover:bg-gray-600"
        onClick={() => setOpen((prev) => !prev)}
        style={{width: '90px', gap: '5px', color: 'white', borderColor: 'rgb(37,58,149)', padding: '5px'}}
      >
        
         {locales.find((l) => l.code === currentLocale)?.label}
        <img src={locales.find((l) => l.code === currentLocale)?.flag} alt="" className="w-5 h-5" style={{width: '20px'}}/>
        
      </button>

      {open && (
        <div className="absolute mt-1 bg-black border rounded shadow w-40" style={{position: 'absolute', width: 'calc(var(--spacing) * 30)', borderColor: 'rgb(37,58,149)', color: 'white'}}>
          {locales.map(locale => (
            <div
              key={locale.code}
              onClick={() => handleChange(locale.code)}
              className="flex items-center gap-2 px-5 py-2 hover:bg-gray-600 cursor-pointer"
              style={{gap: '5px'}}
            >
              {locale.label}
              <img src={locale.flag} alt="" className="w-5 h-5" style={{width: '20px'}}/>
              
            </div>
          ))}
        </div>
      )}
    </div>
  )
}