import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { KucukIkon } from '../../components/common/Ikonlar'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toastlar, setToastlar] = useState([])
  const [sonGeriAlma, setSonGeriAlma] = useState(null)
  const zamanlayicilar = useRef(new Map())

  const toastKapat = (toastId) => {
    setToastlar((onceki) => onceki.filter((oge) => oge.id !== toastId))
    setSonGeriAlma((onceki) => (onceki?.toastId === toastId ? null : onceki))

    const zamanlayici = zamanlayicilar.current.get(toastId)
    if (zamanlayici) {
      window.clearTimeout(zamanlayici)
      zamanlayicilar.current.delete(toastId)
    }
  }

  const toastEyleminiCalistir = (toast) => {
    toastKapat(toast.id)
    if (typeof toast.eylem === 'function') {
      toast.eylem()
    }
  }

  const toastGoster = (tip, metin, secenekler = {}) => {
    const id = Date.now() + Math.random()
    const yeniToast = { id, tip, metin, ...secenekler }

    setToastlar((onceki) => [...onceki, yeniToast])

    if (secenekler.eylemEtiketi && typeof secenekler.eylem === 'function') {
      setSonGeriAlma({
        toastId: id,
        eylem: secenekler.eylem,
      })
    }

    const zamanlayici = window.setTimeout(() => {
      toastKapat(id)
    }, secenekler.sure ?? 3200)

    zamanlayicilar.current.set(id, zamanlayici)
  }

  useEffect(() => {
    const aktifZamanlayicilar = zamanlayicilar.current
    return () => {
      aktifZamanlayicilar.forEach((zamanlayici) => window.clearTimeout(zamanlayici))
      aktifZamanlayicilar.clear()
    }
  }, [])

  useEffect(() => {
    if (!sonGeriAlma) return undefined

    const duzenlenebilirAlanAcikMi = () => {
      const aktif = document.activeElement
      if (!aktif) return false
      const tag = aktif.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || aktif.isContentEditable
    }

    const tusYakala = (event) => {
      const geriAlTuslandi = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z'
      if (!geriAlTuslandi || duzenlenebilirAlanAcikMi()) return

      event.preventDefault()
      const calisacakEylem = sonGeriAlma.eylem
      toastKapat(sonGeriAlma.toastId)
      if (typeof calisacakEylem === 'function') {
        calisacakEylem()
      }
    }

    window.addEventListener('keydown', tusYakala)
    return () => window.removeEventListener('keydown', tusYakala)
  }, [sonGeriAlma])

  return (
    <ToastContext.Provider value={{ toastGoster }}>
      {children}
      {toastlar.length > 0 && (
        <div className="toast-kapsayici" aria-live="polite" aria-atomic="true">
          {toastlar.map((toast) => (
            <article key={toast.id} className={`toast-bildirim ${toast.tip}`}>
              <span className="toast-ikon" aria-hidden="true">
                <KucukIkon tip={toast.tip === 'basari' ? 'basari' : 'uyari'} />
              </span>
              <div className="toast-metin">
                <strong>{toast.tip === 'basari' ? 'Başarılı' : 'Uyarı'}</strong>
                <span>{toast.metin}</span>
                {toast.eylemEtiketi && typeof toast.eylem === 'function' && (
                  <button type="button" className="toast-eylem" onClick={() => toastEyleminiCalistir(toast)}>
                    {toast.eylemEtiketi}
                  </button>
                )}
              </div>
              <button type="button" className="toast-kapat" aria-label="Bildirimi kapat" onClick={() => toastKapat(toast.id)}>
                ×
              </button>
            </article>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
