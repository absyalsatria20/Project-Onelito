import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type ExportFishRecord = {
  name: string
  yen: number | null
  rate: number | null
  rupiah: number
  feePercent: number
  shipping: number
  certificate: boolean
  image: string
  tc: string
}

const money = (amount: number) => `Rp ${Math.round(amount).toLocaleString('id-ID')}`
const yenMoney = (amount: number | null) => amount == null ? '—' : `¥ ${amount.toLocaleString('id-ID')}`
const dealerFee = (record: ExportFishRecord) => record.rupiah * record.feePercent / 100
const itemTotal = (record: ExportFishRecord) => record.rupiah + dealerFee(record) + record.shipping

async function imageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) throw new Error(`Image request failed: ${response.status}`)
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  } catch {
    try {
      const fallback = await fetch('/koi-reference.jpeg')
      if (!fallback.ok) return null
      const blob = await fallback.blob()
      return await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(blob)
      })
    } catch {
      return null
    }
  }
}

export async function downloadRekapPdf(owner: string, records: ExportFishRecord[]): Promise<void> {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 10
  const grandTotal = records.reduce((sum, record) => sum + itemTotal(record), 0)
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(0, 0, 0)
  pdf.text('REKAP PEMBELIAN IKAN JEPANG', pageWidth / 2, 15, { align: 'center' })
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.text(`Owner: ${owner} · ${records.length} data ikan · Tanggal Cetak: ${printDate}`, pageWidth / 2, 21, { align: 'center' })

  const printableImages = await Promise.all(records.map(record => imageAsDataUrl(record.image)))
  const rows = records.map(record => ({
    image: '',
    fish: record.name,
    yen: yenMoney(record.yen),
    rate: record.rate == null ? '—' : String(record.rate),
    idr: money(record.rupiah),
    fee: `${record.feePercent}% — ${money(dealerFee(record))}`,
    shipping: money(record.shipping),
    total: money(itemTotal(record)),
    certificate: record.certificate ? 'Ada' : 'Belum ada',
    terms: record.tc ? record.tc.split('\n').map(term => `- ${term}`).join('\n') : '—',
  }))

  rows.push({
    image: '', fish: '', yen: '', rate: '', idr: '', fee: '', shipping: 'GRAND TOTAL:', total: money(grandTotal),
    certificate: '', terms: '',
  })

  autoTable(pdf, {
    startY: 26,
    margin: { left: margin, right: margin },
    tableWidth: pageWidth - margin * 2,
    columns: [
      { header: 'Gambar', dataKey: 'image' },
      { header: 'Fish', dataKey: 'fish' },
      { header: 'Harga (JPY)', dataKey: 'yen' },
      { header: 'Kurs', dataKey: 'rate' },
      { header: 'Harga (IDR)', dataKey: 'idr' },
      { header: 'Dealer Fee', dataKey: 'fee' },
      { header: 'Shipping Cost', dataKey: 'shipping' },
      { header: 'Total', dataKey: 'total' },
      { header: 'Sertifikat', dataKey: 'certificate' },
      { header: 'Term & Condition', dataKey: 'terms' },
    ],
    body: rows,
    theme: 'plain',
    styles: {
      font: 'helvetica', fontSize: 7.5, textColor: [80, 80, 80],
      cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      valign: 'middle', lineWidth: 0, overflow: 'linebreak', minCellHeight: 24,
    },
    headStyles: {
      fillColor: [59, 130, 245], textColor: [255, 255, 255],
      fontStyle: 'bold', fontSize: 7.5, halign: 'left', minCellHeight: 7,
      cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      image: { cellWidth: 23, halign: 'center' },
      fish: { cellWidth: 40 },
      yen: { cellWidth: 25, halign: 'right' },
      rate: { cellWidth: 12, halign: 'center' },
      idr: { cellWidth: 27, halign: 'right' },
      fee: { cellWidth: 33, halign: 'right' },
      shipping: { cellWidth: 27, halign: 'right' },
      total: { cellWidth: 29, halign: 'right', fontStyle: 'bold' },
      certificate: { cellWidth: 15, halign: 'center' },
      terms: { cellWidth: 46, fontSize: 7.5 },
    },
    didParseCell: data => {
      if (data.section === 'head' && ['rate', 'total'].includes(String(data.column.dataKey))) {
        data.cell.styles.halign = 'center'
        return
      }
      if (data.section === 'head' && ['yen', 'idr', 'fee', 'shipping', 'total'].includes(String(data.column.dataKey))) {
        data.cell.styles.halign = 'right'
        return
      }
      if (data.section !== 'body' || data.row.index !== records.length) return
      data.cell.styles.fillColor = [217, 232, 255]
      data.cell.styles.textColor = [0, 0, 0]
      data.cell.styles.fontStyle = 'bold'
      data.cell.styles.fontSize = data.column.dataKey === 'shipping' || data.column.dataKey === 'total' ? 8.5 : 7.5
      data.cell.styles.lineWidth = 0
      data.cell.styles.minCellHeight = 8
      data.cell.styles.cellPadding = { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 }
      if (data.column.dataKey === 'certificate' || data.column.dataKey === 'terms') {
        data.cell.styles.halign = 'right'
      }
    },
    didDrawCell: data => {
      if (data.section === 'body' && data.row.index === records.length && data.column.index === data.table.columns.length - 1) {
        pdf.setDrawColor(165, 190, 220)
        pdf.setLineWidth(0.45)
        pdf.line(margin, data.cell.y, pageWidth - margin, data.cell.y)
      }
      if (data.section !== 'body' || data.column.dataKey !== 'image' || data.row.index >= records.length) return
      const source = printableImages[data.row.index]
      if (!source) return
      const { x, y, width, height } = data.cell
      const imageWidth = 20
      const imageHeight = 20
      const imageInfo = pdf.getImageProperties(source)
      const scale = Math.min(imageWidth / imageInfo.width, imageHeight / imageInfo.height)
      const renderedWidth = imageInfo.width * scale
      const renderedHeight = imageInfo.height * scale
      const imageX = x + (width - renderedWidth) / 2
      const imageY = y + (height - renderedHeight) / 2
      pdf.addImage(source, source.startsWith('data:image/png') ? 'PNG' : 'JPEG', imageX, imageY, renderedWidth, renderedHeight, undefined, 'FAST')
    },
  })

  pdf.save(`Rekap-Pembelian-${owner}.pdf`)
}
