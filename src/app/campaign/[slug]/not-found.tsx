import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-yellow flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
        <h1 className="font-black text-3xl text-brand-black mb-3">הקמפיין לא נמצא</h1>
        <p className="text-brand-black font-medium">
          ייתכן שהקישור שגוי או שהקמפיין הוסר.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-brand-black text-white font-bold px-5 py-3 rounded-sm hover:opacity-90"
        >
          לכל הקמפיינים
        </Link>
      </div>
    </main>
  )
}
