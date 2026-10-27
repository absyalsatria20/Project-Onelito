import { useMemo, useState } from 'react'
import { Check, ChevronDown, Fish, FileText, ImagePlus, Menu, Moon, Pencil, Plus, Search, Settings, Sun, Trash2, X } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './App.css'

type FishRecord = { id: number; name: string; owner: string; yen: number | null; rate: number | null; rupiah: number; feePercent: number; shipping: number; certificate: boolean; image: string; tc: string }
const initial: FishRecord[] = [
  { id: 1, name: 'Ginrin Kohaku Torazo Nisai Female 52cm', owner: 'Budi Santoso', yen: 3800000, rate: 115, rupiah: 437000000, feePercent: 5, shipping: 500000, certificate: true, image: 'https://images.unsplash.com/photo-1535392432937-a27c1a6c9a35?auto=format&w=160&q=80', tc: 'Free azukari 1 season until September 2027\nBreeder guarantee 100%\nFree entry fish & handling fish AJKS 2027' },
  { id: 2, name: 'Sanke Female Local Breeder 40cm', owner: 'Budi Santoso', yen: null, rate: null, rupiah: 18500000, feePercent: 3, shipping: 250000, certificate: true, image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&w=160&q=80', tc: 'Free azukari 1 season until September 2027\nBreeder guarantee 100%\nFree entry fish & handling fish AJKS 2027' },
  { id: 3, name: 'Showa Sanshoku Dainichi Sansai 65cm', owner: 'Budi Santoso', yen: 5500000, rate: 115, rupiah: 632500000, feePercent: 5, shipping: 750000, certificate: true, image: 'https://images.unsplash.com/photo-1535392432937-a27c1a6c9a35?auto=format&w=160&q=80', tc: 'Free azukari 2 seasons until 2028\nFull health warranty by breeder\nVIP auction access' },
  { id: 4, name: 'Tancho Kohaku Sakai Fish Farm Nisai 45cm', owner: 'Sugiarto', yen: 2800000, rate: 114, rupiah: 319200000, feePercent: 4, shipping: 400000, certificate: true, image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&w=160&q=80', tc: 'Standard quarantine included\nLive arrival guarantee' },
  { id: 5, name: 'Doitsu Cyber Metallic Ogon 50cm', owner: 'Hendra Wijaya', yen: 1900000, rate: 114, rupiah: 216600000, feePercent: 5, shipping: 350000, certificate: false, image: 'https://images.unsplash.com/photo-1535392432937-a27c1a6c9a35?auto=format&w=160&q=80', tc: 'No certificate issued\nStandard local health check' },
  { id: 6, name: 'Kujaku Maruhiro Nisai 48cm', owner: 'Sugiarto', yen: 2400000, rate: 115, rupiah: 276000000, feePercent: 5, shipping: 450000, certificate: true, image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&w=160&q=80', tc: 'Azukari option available until autumn\nBreeder certificate provided' }
]
const money = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`
const yenMoney = (n: number | null) => n == null ? '—' : `¥ ${n.toLocaleString('id-ID')}`
const fee = (r: FishRecord) => r.rupiah * r.feePercent / 100
const total = (r: FishRecord) => r.rupiah + fee(r) + r.shipping

function App() {
  const [records, setRecords] = useState(initial)
  const [owner, setOwner] = useState('Budi Santoso')
  const [certificate, setCertificate] = useState('All Status')
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('fish-theme') === 'dark' ? 'dark' : 'light')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<FishRecord | null>(null)
  const [preview, setPreview] = useState<FishRecord | null>(null)
  const [termsDetail, setTermsDetail] = useState<FishRecord | null>(null)
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Rekap Ikan')
  const [sort, setSort] = useState<'name' | 'owner' | 'total'>('name')
  const owners = [...new Set(records.map(x => x.owner))]
  const filtered = useMemo(() => records.filter(r => (owner === 'All Owners' || r.owner === owner) && (certificate === 'All Status' || (certificate === 'Ada' ? r.certificate : !r.certificate)) && `${r.name} ${r.owner}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === 'total' ? total(b)-total(a) : sort === 'owner' ? a.owner.localeCompare(b.owner) : a.name.localeCompare(b.name)), [records, owner, certificate, query, sort])
  const selected = owner === 'All Owners' ? records : records.filter(r => r.owner === owner)
  const grand = selected.reduce((sum, r) => sum + total(r), 0)
  const toast = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  const themeToggle = () => setTheme(value => { const next = value === 'light' ? 'dark' : 'light'; localStorage.setItem('fish-theme', next); return next })
  const remove = (record: FishRecord) => { if (window.confirm(`Hapus data “${record.name}”?`)) { setRecords(items => items.filter(item => item.id !== record.id)); toast('Data ikan berhasil dihapus') } }

  const exportPdf = async () => {
    if (owner === 'All Owners') {
      toast('Pilih satu owner untuk export PDF')
      return
    }
    toast('Menyiapkan file PDF...')
    const element = document.getElementById('pdf-export-container')
    if (!element) return
    element.style.display = 'block'
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight)
      pdf.save(`Rekap-Pembelian-${owner}.pdf`)
      toast('PDF berhasil di-download')
    } catch (err) {
      console.error(err)
      toast('Gagal mengexport PDF')
    } finally {
      element.style.display = 'none'
    }
  }

  return <div className={`app ${theme}`}>
    <div className="app-shell">
      {sidebarOpen&&<button className="sidebar-scrim" aria-label="Tutup navigasi" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`sidebar ${sidebarOpen?'sidebar-open':''}`}>
        <div className="sidebar-brand"><span className="brand-mark"><Fish size={21}/></span><span className="brand-copy"><b>Koi<span>House</span></b><small>INVENTORY MANAGER</small></span><button className="sidebar-close" onClick={()=>setSidebarOpen(false)} aria-label="Tutup navigasi"><X size={19}/></button></div>
        <span className="nav-label">WORKSPACE</span>
        <nav className="sidebar-nav" aria-label="Navigasi utama">
          <button className={`sidebar-link ${activeSection==='Rekap Ikan'?'selected':''}`} onClick={()=>{setActiveSection('Rekap Ikan');setSidebarOpen(false)}}><Fish size={18}/><span>Rekap Ikan</span><b className="nav-badge">{records.length}</b></button>
        </nav>
        <div className="sidebar-spacer"/><span className="nav-label settings-label">PREFERENCES</span>
        <nav className="sidebar-nav"><button className="sidebar-link" onClick={()=>toast('Pengaturan belum tersedia di prototipe')}><Settings size={18}/><span>Settings</span></button></nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-mark">?</span><span><b>Need a hand?</b><small>Get help with your koi records.</small></span><button onClick={()=>toast('Hubungi admin workspace untuk bantuan')}>↗</button></div><div className="profile-card"><span className="profile-avatar">AS</span><span><b>Admin Sistem</b><small>Workspace admin</small></span><button onClick={()=>toast('Profil admin') } aria-label="Menu profil">···</button></div></div>
      </aside>
      <div className="workspace-main"><header className="workspace-topbar"><span className="current-tab">Workspace/Rekap Ikan</span><button className="theme-toggle" onClick={themeToggle} aria-label={theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'} title={theme === 'light' ? 'Mode gelap' : 'Mode terang'}>{theme === 'light' ? <Moon size={17}/> : <Sun size={17}/>}</button></header>
      <main className="inventory-page">
      <header className="page-heading"><div className="heading-copy"><button className="mobile-nav-toggle" onClick={()=>setSidebarOpen(true)} aria-label="Buka navigasi"><Menu size={20}/></button><h1>Rekap Pembelian Ikan Jepang</h1><p>Kelola data ikan, harga, dan dokumen pemilik.</p></div><div className="heading-actions"><button className="primary-btn" onClick={() => { setEditing(null); setModal(true) }}><Plus size={17}/>Tambah ikan</button></div></header>
      <section className="filter-panel" aria-label="Filter dan inventaris ikan">
        <div className="toolbar">
          <label className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari ikan atau pemilik..." aria-label="Cari ikan atau pemilik"/></label>
          <label className="select-wrap"><span className="sr-only">Pilih owner</span><select value={owner} onChange={e=>setOwner(e.target.value)}><option>All Owners</option>{owners.map(name=><option key={name}>{name}</option>)}</select><ChevronDown size={15}/></label>
          <label className="select-wrap status-select"><span className="sr-only">Filter status sertifikat</span><select value={certificate} onChange={e=>setCertificate(e.target.value)}><option>All Status</option><option>Ada</option><option>Belum ada</option></select><ChevronDown size={15}/></label>
          <div className="export-actions"><button className="export-btn pdf-btn" onClick={exportPdf}><FileText size={17}/>PDF</button></div>
        </div>
      <section className="data-panel" aria-label="Daftar inventaris ikan">
        <div className="table-wrap"><table><colgroup><col className="fish-col"/><col className="yen-col"/><col className="rate-col"/><col className="idr-col"/><col className="fee-col"/><col className="shipping-col"/><col className="total-col"/><col className="cert-col"/><col className="tc-col"/><col className="action-col"/></colgroup><thead><tr><th><button onClick={()=>setSort('name')}>FISH</button></th><th className="numeric">HARGA (JPY)</th><th className="numeric">KURS</th><th className="numeric">HARGA (IDR)</th><th className="numeric">DEALER FEE</th><th className="numeric">SHIPPING COST</th><th className="numeric"><button onClick={()=>setSort('total')}>TOTAL</button></th><th>SERTIFIKAT</th><th>TERM &amp; CONDITION</th><th className="action-head">EDIT</th></tr></thead><tbody>{filtered.map(record=><tr key={record.id}>
          <td><div className="fish-cell"><button className="thumb" onClick={()=>setPreview(record)} aria-label={`Lihat foto ${record.name}`}><img src={record.image} alt={record.name} loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden'}}/><span className="thumb-fallback"><Fish size={18}/></span></button><span className="fish-info"><b title={record.name}>{record.name}</b></span></div></td>
          <td className="numeric">{yenMoney(record.yen)}</td><td className="numeric">{record.rate ?? '—'}</td><td className="numeric">{money(record.rupiah)}</td><td className="numeric fee-cell"><span className="fee-percent">{record.feePercent}%</span><span className="fee-amount">{money(fee(record))}</span></td><td className="numeric">{money(record.shipping)}</td><td className="numeric total-value">{money(total(record))}</td><td><span className={`status ${record.certificate?'status-ok':'status-pending'}`}><i/>{record.certificate?'Ada':'Belum ada'}</span></td><td className="tc-cell">{record.tc ? <><span>{record.tc.split('\n')[0]}</span><button className="tc-detail-btn" onClick={()=>setTermsDetail(record)}>Detail</button></> : '—'}</td>
          <td><div className="row-actions"><button className="row-action edit" onClick={()=>{setEditing(record);setModal(true)}} aria-label={`Edit ${record.name}`} title="Edit"><Pencil size={17}/></button><button className="row-action delete" onClick={()=>remove(record)} aria-label={`Hapus ${record.name}`} title="Hapus"><Trash2 size={17}/></button></div></td>
        </tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state"><Search size={22}/><b>Data tidak ditemukan</b><span>Coba ubah kata pencarian atau filter pilihan.</span></div>}</div>
      </section>
      <footer className="table-footer"><div className="owner-summary"><span>Owner:</span><b>{owner==='All Owners'?'Semua owner':owner}</b><i>·</i><span>Menampilkan {filtered.length} data</span></div><div className="grand-total"><span>GRAND TOTAL:</span><strong>{money(grand)}</strong></div></footer>
      </section>
      </main>
      </div>
    </div>

    {/* Hidden PDF Export Container matching exact reference PDF structure with explicit table column widths */}
    <div id="pdf-export-container" style={{ display: 'none', position: 'absolute', left: '-9999px', top: 0, width: '1200px', backgroundColor: '#ffffff', color: '#111827', padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', color: '#111827', fontWeight: 800, letterSpacing: '-0.3px' }}>REKAP PEMBELIAN IKAN JEPANG</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: 500 }}>Owner: {owner} · {selected.length} data ikan · Tanggal Cetak: 24 Oktober 2026</p>
      </div>
      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '24px' }}>
        <colgroup>
          <col style={{ width: '60px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '90px' }} />
          <col style={{ width: '60px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '90px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '70px' }} />
          <col style={{ width: '220px' }} />
        </colgroup>
        <thead>
          <tr style={{ backgroundColor: '#2b76ff', color: '#ffffff', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'center' }}>Gambar</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700 }}>Fish</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'right' }}>Harga (JPY)</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'right' }}>Kurs</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'right' }}>Harga (IDR)</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'right' }}>Dealer Fee</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'right' }}>Shipping Cost</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'right' }}>Total</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700, textAlign: 'center' }}>Sertifikat</th>
            <th style={{ padding: '12px 8px', border: '1px solid #2b76ff', fontWeight: 700 }}>Term &amp; Condition</th>
          </tr>
        </thead>
        <tbody>
          {selected.map((r, idx) => (
            <tr key={r.id} style={{ backgroundColor: idx % 2 === 0 ? '#f3f4f6' : '#ffffff', verticalAlign: 'middle' }}>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'center', overflow: 'hidden' }}>
                <img src={r.image} alt={r.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', display: 'block', margin: '0 auto' }} crossOrigin="anonymous" />
              </td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', fontWeight: 700, color: '#111827', wordBreak: 'break-word' }}>{r.name}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 500, wordBreak: 'break-all' }}>{yenMoney(r.yen)}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 500 }}>{r.rate ?? '—'}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 500, wordBreak: 'break-all' }}>{money(r.rupiah)}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 500, wordBreak: 'break-all' }}>{r.feePercent}% — {money(fee(r))}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 500, wordBreak: 'break-all' }}>{money(r.shipping)}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 800, color: '#111827', wordBreak: 'break-all' }}>{money(total(r))}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', textAlign: 'center', fontWeight: 500 }}>{r.certificate ? 'Ada' : 'Belum ada'}</td>
              <td style={{ padding: '10px 8px', border: '1px solid #e5e7eb', fontSize: '11px', color: '#374151', wordBreak: 'break-word', lineHeight: '1.4' }}>{r.tc ? r.tc.split('\n').map(t => `- ${t}`).join(' ') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '14px 24px' }}>
        <div style={{ fontSize: '16px', color: '#111827', fontWeight: 800 }}>GRAND TOTAL: <span style={{ fontSize: '20px', color: '#111827', marginLeft: '16px' }}>{money(grand)}</span></div>
      </div>
    </div>

    {modal&&<FishForm initial={editing} owners={owners} onClose={()=>setModal(false)} onSave={record=>{setRecords(items=>editing?items.map(item=>item.id===editing.id?record:item):[{...record,id:Math.max(0,...items.map(item=>item.id))+1},...items]);setModal(false);toast(editing?'Perubahan berhasil disimpan':'Ikan berhasil ditambahkan')}}/>}
    {preview&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPreview(null)}} onKeyDown={e=>{if(e.key==='Escape')setPreview(null)}}><section className="image-dialog" role="dialog" aria-modal="true" aria-label={`Foto ${preview.name}`}><button type="button" className="dialog-close" onClick={()=>setPreview(null)} aria-label="Tutup"><X size={20}/></button><img src={preview.image} alt={preview.name}/><div className="image-caption"><b>{preview.name}</b><span>{preview.owner}</span></div></section></div>}
    {termsDetail&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setTermsDetail(null)}} onKeyDown={e=>{if(e.key==='Escape')setTermsDetail(null)}}><section className="terms-dialog" role="dialog" aria-modal="true" aria-label={`Term & Condition ${termsDetail.name}`}><div className="terms-heading"><div><h2>Term &amp; Condition</h2><p>{termsDetail.name}</p></div><button className="dialog-close" onClick={()=>setTermsDetail(null)} aria-label="Tutup"><X size={20}/></button></div><ul>{termsDetail.tc.split('\n').filter(Boolean).map(term=><li key={term}>{term}</li>)}</ul></section></div>}
    {notice&&<div className="toast"><Check size={17}/>{notice}</div>}
  </div>
}
export default App

type FormProps={initial:FishRecord|null;owners:string[];onClose:()=>void;onSave:(record:FishRecord)=>void}
function FishForm({initial:existing,owners,onClose,onSave}:FormProps){
  const [name,setName]=useState(existing?.name??'');const [owner,setOwner]=useState(existing?.owner??'');const [yen,setYen]=useState(existing?.yen?.toString()??'');const [rate,setRate]=useState(existing?.rate?.toString()??'');const [rupiah,setRupiah]=useState(existing?.yen&&existing.rate?'':existing?.rupiah.toString()??'');const [percent,setPercent]=useState(existing?.feePercent.toString()??'5');const [shipping,setShipping]=useState(existing?.shipping.toString()??'');const [certificate,setCertificate]=useState(existing?.certificate??false);const [tc,setTc]=useState(existing?.tc??'');const [image,setImage]=useState(existing?.image??'');const [error,setError]=useState('')
  const yenValue=Number(yen)||0;const rateValue=Number(rate)||0;const price=yen&&rate?yenValue*rateValue:Number(rupiah)||0;const feeValue=price*(Number(percent)||0)/100;const totalValue=price+feeValue+(Number(shipping)||0)
  const fileChange=(file?:File)=>{if(!file)return;if(!['image/jpeg','image/png'].includes(file.type)){setError('Format gambar harus JPG, JPEG, atau PNG.');return}if(file.size>10*1024*1024){setError('Ukuran gambar maksimal 10 MB.');return}setError('');const reader=new FileReader();reader.onload=()=>setImage(String(reader.result));reader.readAsDataURL(file)}
  const submit=(event:React.FormEvent)=>{event.preventDefault();if(!name.trim()||!owner.trim()){setError('Nama ikan dan owner wajib diisi.');return}if((yen&&Number(yen)<0)||(rate&&Number(rate)<=0)||Number(percent)<0||Number(percent)>100||Number(shipping)<0||(rupiah&&Number(rupiah)<0)){setError('Periksa nilai harga, kurs, persentase fee, dan ongkir.');return}if(yen&&!rate&&!rupiah){setError('Isi kurs atau harga Rupiah manual.');return}if(rate&&!yen&&!rupiah){setError('Isi harga Rupiah manual jika harga Yen kosong.');return}onSave({id:existing?.id??0,name:name.trim(),owner:owner.trim(),yen:yen?yenValue:null,rate:rate?rateValue:null,rupiah:Math.round(price),feePercent:Number(percent)||0,shipping:Number(shipping)||0,certificate,image,tc})}
  return <div className="modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><form className="form-dialog" onSubmit={submit} noValidate><div className="dialog-heading"><div><span className="eyebrow">DATA INVENTARIS</span><h2>{existing?'Edit data ikan':'Tambah ikan baru'}</h2><p>Lengkapi informasi untuk mencatat koleksi ikan.</p></div><button type="button" className="dialog-close" onClick={onClose} aria-label="Tutup"><X size={20}/></button></div><div className="form-body"><section className="form-section"><div className="section-title"><span>01</span><b>Informasi dasar</b></div><div className="field-grid"><label className="field full"><span>Nama ikan <i>*</i></span><input value={name} onChange={event=>setName(event.target.value)} placeholder="Contoh: Kohaku Nisai 52cm" autoFocus/></label><label className="field"><span>Owner <i>*</i></span><input list="owner-list" value={owner} onChange={event=>setOwner(event.target.value)} placeholder="Nama owner"/><datalist id="owner-list">{owners.map(item=><option key={item}/>)}</datalist></label><div className="field"><span>Foto ikan</span><label className="upload-box">{image?<img src={image} alt="Pratinjau ikan"/>:<><ImagePlus size={22}/><b>Unggah foto</b><small>JPG atau PNG · Maks. 10 MB</small></>}<input type="file" accept="image/jpeg,image/png" onChange={event=>fileChange(event.target.files?.[0])}/></label></div></div></section><section className="form-section"><div className="section-title"><span>02</span><b>Rincian harga</b></div><div className="field-grid three"><label className="field"><span>Harga Yen</span><div className="input-prefix"><b>¥</b><input type="number" min="0" value={yen} onChange={event=>setYen(event.target.value)} placeholder="0"/></div></label><label className="field"><span>Kurs Yen / IDR</span><input type="number" min="0" value={rate} onChange={event=>setRate(event.target.value)} placeholder="Contoh: 115"/></label><label className="field"><span>Harga Rupiah {yen&&rate?<em>(Otomatis)</em>:null}</span><input type="number" min="0" value={rupiah} onChange={event=>setRupiah(event.target.value)} disabled={Boolean(yen&&rate)} placeholder="0"/></label></div><div className="field-grid two" style={{marginTop:12}}><label className="field"><span>Dealer Fee (%)</span><input type="number" min="0" max="100" step="0.1" value={percent} onChange={event=>setPercent(event.target.value)} placeholder="5"/></label><label className="field"><span>Shipping Cost (IDR)</span><input type="number" min="0" value={shipping} onChange={event=>setShipping(event.target.value)} placeholder="0"/></label></div><div className="calc-preview"><div><span>Nilai Dasar</span><b>{money(price)}</b></div><div><span>Dealer Fee</span><b>{money(feeValue)}</b></div><div><span>Shipping</span><b>{money(Number(shipping)||0)}</b></div><div className="grand"><span>Total Harga</span><b>{money(totalValue)}</b></div></div></section><section className="form-section"><div className="section-title"><span>03</span><b>Dokumen &amp; Ketentuan</b></div><div className="field-grid"><label className="field"><span>Sertifikat</span><button type="button" className={`cert-toggle ${certificate?'on':`off`}`} onClick={()=>setCertificate(value=>!value)}><i>{certificate?<Check size={16}/>:null}</i><span>{certificate?'Sertifikat ada (Asli / Breeder)':'Belum ada sertifikat'}</span></button></label><label className="field full"><span>Term &amp; Condition</span><textarea value={tc} onChange={event=>setTc(event.target.value)} rows={3} placeholder="Tulis ketentuan, garansi, atau azukari per baris..."/></label></div></section></div>{error&&<p className="form-error">{error}</p>}<div className="dialog-actions"><button type="button" className="secondary-btn" onClick={onClose}>Batal</button><button type="submit" className="primary-btn">{existing?'Simpan perubahan':'Tambah ikan'}</button></div></form></div>
}
