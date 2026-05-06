export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-yellow flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
        <h1 className="font-black text-3xl text-brand-black mb-3">הקמפיין לא נמצא</h1>
        <p className="text-brand-black font-medium">
          ייתכן שהקישור שגוי או שהקמפיין הוסר.
        </p>
      </div>
    </main>
  )
}
