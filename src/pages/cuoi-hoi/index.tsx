import Link from 'next/link'

export default function CuoiHoi() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Chọn miền - Roadmap Cưới hỏi</h1>
      <ul className="list-disc list-inside space-y-3">
        <li>
          <Link href="/cuoi-hoi/mien-bac" className="text-blue-600 hover:underline">
            Miền Bắc
          </Link>
        </li>
        <li>
          <Link href="/cuoi-hoi/mien-trung" className="text-blue-600 hover:underline">
            Miền Trung
          </Link>
        </li>
        <li>
          <Link href="/cuoi-hoi/mien-nam" className="text-blue-600 hover:underline">
            Miền Nam
          </Link>
        </li>
      </ul>
    </div>
  )
}
