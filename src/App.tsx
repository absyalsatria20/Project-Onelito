import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Fish, FileText, ImagePlus, Menu, Moon, MoreHorizontal, Pencil, Plus, Search, Settings, Sun, Trash2, X } from 'lucide-react'
import { downloadRekapPdf } from './exportPdf'
import './App.css'

type FishRecord = { id: number; name: string; owner: string; yen: number | null; rate: number | null; rupiah: number; feePercent: number; shipping: number; certificate: boolean; image: string; tc: string }
type Period = { id: string; name: string; records: FishRecord[]; owner: string; certificate: string; query: string; sort: 'name' | 'owner' | 'total' }
type PeriodDialog = { mode: 'add' | 'rename'; periodId?: string } | null
const initial: FishRecord[] = [
  { id: 1, name: 'Ginrin Kohaku Torazo Nisai Female 52cm', owner: 'Budi Santoso', yen: 3800000, rate: 115, rupiah: 437000000, feePercent: 5, shipping: 500000, certificate: true, image: '/koi-reference.jpeg', tc: 'Free azukari 1 season until September 2027\nBreeder guarantee 100%\nFree entry fish & handling fish AJKS 2027' },
  { id: 2, name: 'Sanke Female Local Breeder 40cm', owner: 'Budi Santoso', yen: null, rate: null, rupiah: 18500000, feePercent: 3, shipping: 250000, certificate: true, image: '/koi-reference.jpeg', tc: 'Azukari breeder 1 season, 100% guarantee' },
  { id: 3, name: 'Showa Sanshoku Dainichi Sansai 65cm', owner: 'Budi Santoso', yen: 5500000, rate: 115, rupiah: 632500000, feePercent: 5, shipping: 750000, certificate: true, image: 'https://images.unsplash.com/photo-1535392432937-a27c1a6c9a35?auto=format&w=160&q=80', tc: 'Free azukari 2 seasons until 2028\nFull health warranty by breeder\nVIP auction access' },
  { id: 4, name: 'Tancho Kohaku Sakai Fish Farm Nisai 45cm', owner: 'Sugiarto', yen: 2800000, rate: 114, rupiah: 319200000, feePercent: 4, shipping: 400000, certificate: true, image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&w=160&q=80', tc: 'Standard quarantine included\nLive arrival guarantee' },
  { id: 5, name: 'Doitsu Cyber Metallic Ogon 50cm', owner: 'Hendra Wijaya', yen: 1900000, rate: 114, rupiah: 216600000, feePercent: 5, shipping: 350000, certificate: false, image: 'https://images.unsplash.com/photo-1535392432937-a27c1a6c9a35?auto=format&w=160&q=80', tc: 'No certificate issued\nStandard local health check' },
  { id: 6, name: 'Kujaku Maruhiro Nisai 48cm', owner: 'Sugiarto', yen: 2400000, rate: 115, rupiah: 276000000, feePercent: 5, shipping: 450000, certificate: true, image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&w=160&q=80', tc: 'Azukari option available until autumn\nBreeder certificate provided' }
]
const sample2027: FishRecord[] = [
  { id: 1, name: 'Kohaku Sakai Nisai Female 55cm', owner: 'Budi Santoso', yen: 4200000, rate: 116, rupiah: 487200000, feePercent: 5, shipping: 600000, certificate: true, image: '/koi-reference.jpeg', tc: 'Azukari 1 season until September 2028\nBreeder health guarantee\nCertificate included' },
  { id: 2, name: 'Showa Dainichi Sansai Male 62cm', owner: 'Sugiarto', yen: 6100000, rate: 116, rupiah: 707600000, feePercent: 5, shipping: 750000, certificate: true, image: 'https://images.unsplash.com/photo-1535392432937-a27c1a6c9a35?auto=format&w=160&q=80', tc: 'Azukari 2 seasons until autumn 2029\nBreeder guarantee 100%' },
  { id: 3, name: 'Kujaku Maruhiro Nisai 48cm', owner: 'Hendra Wijaya', yen: 2500000, rate: 116, rupiah: 290000000, feePercent: 4, shipping: 450000, certificate: false, image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&w=160&q=80', tc: 'No certificate issued\nStandard health check included' }
]
const money = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`
const yenMoney = (n: number | null) => n == null ? '—' : `¥ ${n.toLocaleString('id-ID')}`
const formatAmountInput = (value: string) => value ? Number(value).toLocaleString('id-ID') : ''
const parseAmountInput = (value: string) => value.replace(/\D/g, '')
const fee = (r: FishRecord) => r.rupiah * r.feePercent / 100
const total = (r: FishRecord) => r.rupiah + fee(r) + r.shipping

function App() {
  const [periods, setPeriods] = useState<Period[]>([{id:'period-2026',name:'Periode 2026',records:initial,owner:'Budi Santoso',certificate:'All Status',query:'',sort:'name'}])
  const [activePeriodId, setActivePeriodId] = useState('period-2026')
  const activePeriod = periods.find(period=>period.id===activePeriodId) ?? periods[0]
  const {records,owner,certificate,query,sort}=activePeriod
  const updateActivePeriod = (updates:Partial<Period>) => setPeriods(items=>items.map(period=>period.id===activePeriod.id?{...period,...updates}:period))
  const setRecords = (updater:FishRecord[]|((items:FishRecord[])=>FishRecord[])) => updateActivePeriod({records:typeof updater==='function'?updater(records):updater})
  const setOwner = (value:string) => updateActivePeriod({owner:value})
  const setCertificate = (value:string) => updateActivePeriod({certificate:value})
  const setQuery = (value:string) => updateActivePeriod({query:value})
  const setSort = (value:'name'|'owner'|'total') => updateActivePeriod({sort:value})
  const [periodDialog,setPeriodDialog] = useState<PeriodDialog>(null)
  const [periodName,setPeriodName] = useState('')
  const [deletePeriodTarget,setDeletePeriodTarget] = useState<Period|null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('fish-theme') === 'dark' ? 'dark' : 'light')
  const [modal, setModal] = useState(false)
  useEffect(() => {
    if (!modal && !periodDialog && !deletePeriodTarget) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [modal, periodDialog, deletePeriodTarget])
  const [periodError,setPeriodError] = useState('')
  const [openPeriodMenu,setOpenPeriodMenu] = useState<{id:string;left:number;top:number;width:number;height:number}|null>(null)
  useEffect(() => {
    if (!openPeriodMenu) return
    const handlePointerDown = (event:PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('.period-tab-menu, .period-tab-menu-trigger')) setOpenPeriodMenu(null)
    }
    const handleKeyDown = (event:KeyboardEvent) => { if (event.key === 'Escape') setOpenPeriodMenu(null) }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openPeriodMenu])
  const [ownerNames,setOwnerNames] = useState<string[]>(() => [...new Set(initial.map(record=>record.owner))])
  const owners = ownerNames
  const [editing, setEditing] = useState<FishRecord | null>(null)
  const [preview, setPreview] = useState<FishRecord | null>(null)
  const [termsDetail, setTermsDetail] = useState<FishRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FishRecord | null>(null)
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Rekap Ikan')
  const filtered = useMemo(() => records.filter(r => (owner === 'All Owners' || r.owner === owner) && (certificate === 'All Status' || (certificate === 'Ada' ? r.certificate : !r.certificate)) && `${r.name} ${r.owner}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === 'total' ? total(b)-total(a) : sort === 'owner' ? a.owner.localeCompare(b.owner) : a.name.localeCompare(b.name)), [records, owner, certificate, query, sort])
  const selected = owner === 'All Owners' ? records : records.filter(r => r.owner === owner)
  const grand = selected.reduce((sum, r) => sum + total(r), 0)
  const toastTimer = useRef<number | null>(null)
  const toast = (message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    setNotice(message)
    toastTimer.current = window.setTimeout(() => { setNotice(''); toastTimer.current = null }, 2600)
  }
  useEffect(() => () => { if (toastTimer.current !== null) window.clearTimeout(toastTimer.current) }, [])
  const themeToggle = () => setTheme(value => { const next = value === 'light' ? 'dark' : 'light'; localStorage.setItem('fish-theme', next); return next })
  const openAddPeriod = () => { setPeriodName(''); setPeriodError(''); setPeriodDialog({mode:'add'}); setOpenPeriodMenu(null) }
  const openRenamePeriod = (period:Period) => { setPeriodName(period.name); setPeriodError(''); setPeriodDialog({mode:'rename',periodId:period.id}); setOpenPeriodMenu(null) }
  const savePeriodName = (event:React.FormEvent) => {
    event.preventDefault()
    const name=periodName.trim()
    if(!name){setPeriodError('Nama periode wajib diisi.');return}
    const current=periodDialog?.mode==='rename'?periodDialog.periodId:null
    if(periods.some(period=>period.id!==current&&period.name.trim().toLocaleLowerCase()===name.toLocaleLowerCase())){setPeriodError('Nama periode tersebut sudah digunakan.');return}
    if(periodDialog?.mode==='add'){
      const id=window.crypto?.randomUUID?.() ?? `period-${Date.now()}`
      setPeriods(items=>[...items,{id,name,records:name.trim().toLocaleLowerCase()==='periode 2027'?sample2027.map(record=>({...record})):[],owner:'All Owners',certificate:'All Status',query:'',sort:'name'}])
      setActivePeriodId(id)
    }else if(periodDialog?.mode==='rename'){
      setPeriods(items=>items.map(period=>period.id===periodDialog.periodId?{...period,name}:period))
    }
    setPeriodDialog(null)
  }
  const deletePeriod = () => {
    if(!deletePeriodTarget||periods.length<=1)return
    const remaining=periods.filter(period=>period.id!==deletePeriodTarget.id)
    setPeriods(remaining)
    if(activePeriodId===deletePeriodTarget.id)setActivePeriodId(remaining[0].id)
    setDeletePeriodTarget(null)
    setOpenPeriodMenu(null)
  }
  const remove = (record: FishRecord) => setDeleteTarget(record)
  const confirmDelete = () => { if (!deleteTarget) return; setRecords(items => items.filter(item => item.id !== deleteTarget.id)); setDeleteTarget(null); toast('Data ikan berhasil dihapus') }

  const exportPdf = async () => {
    if (owner === 'All Owners') {
      toast('Pilih satu owner untuk export PDF')
      return
    }
    toast('Menyiapkan file PDF...')
    try {
      await downloadRekapPdf(owner, selected)
      toast('PDF berhasil di-download')
    } catch (err) {
      console.error(err)
      toast('Gagal mengexport PDF')
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
        <nav className="sidebar-nav"><button className={`sidebar-link ${activeSection==='Setting'?'selected':''}`} onClick={()=>{setActiveSection('Setting');setSidebarOpen(false)}}><Settings size={18}/><span>Setting</span></button></nav>
        <div className="sidebar-bottom"><div className="profile-card"><span className="profile-avatar">AS</span><span><b>Admin Sistem</b><small>Workspace admin</small></span><button onClick={()=>toast('Profil admin') } aria-label="Menu profil">···</button></div></div>
      </aside>
      <div className="workspace-main"><header className="workspace-topbar"><span className="current-tab">Workspace/{activeSection}</span>{activeSection==='Rekap Ikan'&&<div className="period-tabs" role="tablist" aria-label="Periode rekap ikan">{periods.map(period=><div className={`period-tab ${activePeriodId===period.id?'active':''}`} key={period.id}><button type="button" role="tab" aria-selected={activePeriodId===period.id} onClick={()=>{setActivePeriodId(period.id);setOpenPeriodMenu(null)}}>{period.name}</button><button type="button" className="period-tab-menu-trigger" aria-label={`Menu ${period.name}`} aria-expanded={openPeriodMenu?.id===period.id} onClick={event=>{const rect=event.currentTarget.parentElement!.getBoundingClientRect();setOpenPeriodMenu(openPeriodMenu?.id===period.id?null:{id:period.id,left:Math.max(8,Math.min(rect.left,window.innerWidth-rect.width-8)),top:Math.min(rect.bottom+5,window.innerHeight-88),width:rect.width,height:rect.height})}}><MoreHorizontal size={16}/></button></div>)}<button type="button" className="period-add" onClick={openAddPeriod} aria-label="Tambah periode" title="Tambah periode"><Plus size={17}/></button></div>}{openPeriodMenu&&periods.find(period=>period.id===openPeriodMenu.id)&&<div className="period-tab-menu" style={{left:openPeriodMenu.left,top:openPeriodMenu.top,width:openPeriodMenu.width}}><button type="button" style={{height:openPeriodMenu.height}} onClick={()=>openRenamePeriod(periods.find(period=>period.id===openPeriodMenu.id)!)}><Pencil size={14}/>Ganti nama</button><button type="button" style={{height:openPeriodMenu.height}} disabled={periods.length===1} onClick={()=>{setDeletePeriodTarget(periods.find(period=>period.id===openPeriodMenu.id)!);setOpenPeriodMenu(null)}}><Trash2 size={14}/>Hapus periode</button></div>}<button className="theme-toggle" onClick={themeToggle} aria-label={theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'} title={theme === 'light' ? 'Mode gelap' : 'Mode terang'}>{theme === 'light' ? <Moon size={17}/> : <Sun size={17}/>}</button></header>
      <main className="inventory-page">{activeSection==='Setting' ? <SettingsPanel theme={theme} onThemeToggle={themeToggle} onPrototypeAction={toast}/> : <>
      <header className="page-heading"><div className="heading-copy"><button className="mobile-nav-toggle" onClick={()=>setSidebarOpen(true)} aria-label="Buka navigasi"><Menu size={20}/></button><h1>Rekap Pembelian Ikan Jepang</h1><p>Kelola data ikan, harga, dan dokumen pemilik.</p></div><div className="heading-actions"><button className="primary-btn" onClick={() => { setEditing(null); setModal(true) }}><Plus size={17}/>Tambah ikan</button></div></header>
      <section className="filter-panel" aria-label="Filter dan inventaris ikan">
        <div className="toolbar">
          <label className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari ikan atau pemilik..." aria-label="Cari ikan atau pemilik"/></label>
          <label className="select-wrap"><span className="sr-only">Pilih owner</span><select value={owner} onChange={e=>setOwner(e.target.value)}><option>All Owners</option>{owners.map(name=><option key={name}>{name}</option>)}</select><ChevronDown size={15}/></label>
          <label className="select-wrap status-select"><span className="sr-only">Filter status sertifikat</span><select value={certificate} onChange={e=>setCertificate(e.target.value)}><option>All Status</option><option>Ada</option><option>Belum ada</option></select><ChevronDown size={15}/></label>
          <div className="export-actions"><button className="export-btn pdf-btn" onClick={exportPdf}><FileText size={17}/><span>Export PDF</span></button></div>
        </div>
      <section className="data-panel" aria-label="Daftar inventaris ikan">
        <div className="table-wrap"><table><colgroup><col className="fish-col"/><col className="yen-col"/><col className="rate-col"/><col className="idr-col"/><col className="fee-col"/><col className="shipping-col"/><col className="total-col"/><col className="cert-col"/><col className="tc-col"/><col className="action-col"/></colgroup><thead><tr><th><button onClick={()=>setSort('name')}>FISH</button></th><th className="numeric">HARGA (JPY)</th><th className="numeric">KURS</th><th className="numeric">HARGA (IDR)</th><th className="numeric">DEALER FEE</th><th className="numeric">SHIPPING COST</th><th className="numeric"><button onClick={()=>setSort('total')}>TOTAL</button></th><th>SERTIFIKAT</th><th>TERM &amp; CONDITION</th><th className="action-head">EDIT</th></tr></thead><tbody>{filtered.map(record=><tr key={record.id}>
          <td><div className="fish-cell"><button className="thumb" onClick={()=>setPreview(record)} aria-label={`Lihat foto ${record.name}`} title="Klik untuk melihat gambar"><img src={record.image} alt={record.name} loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden'}}/><span className="thumb-fallback"><Fish size={18}/></span></button><span className="fish-info"><b title={record.name}>{record.name}</b>{owner==='All Owners'&&<small className="fish-owner">{record.owner}</small>}</span></div></td>
          <td className="numeric">{yenMoney(record.yen)}</td><td className="numeric">{record.rate ?? '—'}</td><td className="numeric">{money(record.rupiah)}</td><td className="numeric fee-cell"><span className="fee-percent">{record.feePercent}%</span><span className="fee-amount">{money(fee(record))}</span></td><td className="numeric">{money(record.shipping)}</td><td className="numeric total-value">{money(total(record))}</td><td><span className={`status ${record.certificate?'status-ok':'status-pending'}`}><i/>{record.certificate?'Ada':'Belum ada'}</span></td><td className="tc-cell">{record.tc ? <><span>{record.tc.split('\n')[0]}</span><button className="tc-detail-btn" onClick={()=>setTermsDetail(record)}>Detail</button></> : '—'}</td>
          <td><div className="row-actions"><button className="row-action edit" onClick={()=>{setEditing(record);setModal(true)}} aria-label={`Edit ${record.name}`} title="Edit"><Pencil size={17}/></button><button className="row-action delete" onClick={()=>remove(record)} aria-label={`Hapus ${record.name}`} title="Hapus"><Trash2 size={17}/></button></div></td>
        </tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state"><Search size={22}/><b>Data tidak ditemukan</b><span>Coba ubah kata pencarian atau filter pilihan.</span></div>}</div>
      </section>
      <footer className="table-footer"><div className="owner-summary"><span>Owner:</span><b>{owner==='All Owners'?'Semua owner':owner}</b><i>·</i><span>Menampilkan {filtered.length} data</span></div><div className="grand-total"><span>GRAND TOTAL:</span><strong>{money(grand)}</strong></div></footer>
      </section>
      </> }</main>
      </div>
    </div>


    {modal&&<FishForm key={`${activePeriod.id}-${editing?.id??'new'}`} initial={editing} owners={owners} onClose={()=>setModal(false)} onSave={record=>{setOwnerNames(items=>items.some(name=>name.toLocaleLowerCase()===record.owner.trim().toLocaleLowerCase())?items:[...items,record.owner.trim()]);setRecords(items=>editing?items.map(item=>item.id===editing.id?record:item):[{...record,id:Math.max(0,...items.map(item=>item.id))+1},...items]);setModal(false);toast(editing?'Perubahan berhasil disimpan':'Ikan berhasil ditambahkan')}}/>}
    {periodDialog&&<div className="modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setPeriodDialog(null)}}><form className="period-name-dialog" role="dialog" aria-modal="true" aria-labelledby="period-dialog-title" onSubmit={savePeriodName}><div className="period-dialog-heading"><div><span className="eyebrow">WORKSPACE</span><h2 id="period-dialog-title">{periodDialog.mode==='add'?'Tambah periode':'Ganti nama periode'}</h2></div><button type="button" className="dialog-close" onClick={()=>setPeriodDialog(null)} aria-label="Tutup"><X size={20}/></button></div><label className="period-name-field" htmlFor="period-name">Nama periode<input id="period-name" autoFocus value={periodName} onChange={event=>{setPeriodName(event.target.value);setPeriodError('')}} placeholder="Contoh: Periode 2027" aria-describedby={periodError?'period-name-error':undefined}/></label>{periodError&&<p className="period-form-error" id="period-name-error" role="alert">{periodError}</p>}<div className="period-dialog-actions"><button type="button" className="secondary-btn" onClick={()=>setPeriodDialog(null)}>Batal</button><button type="submit" className="primary-btn">{periodDialog.mode==='add'?'Buat periode':'Simpan nama'}</button></div></form></div>}
    {deletePeriodTarget&&<div className="modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setDeletePeriodTarget(null)}}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="period-delete-title" aria-describedby="period-delete-description"><div className="confirm-icon"><Trash2 size={21}/></div><h2 id="period-delete-title">Hapus periode?</h2><p id="period-delete-description">Periode <b>{deletePeriodTarget.name}</b> dan seluruh data di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.</p><div className="confirm-actions"><button type="button" className="secondary-btn" onClick={()=>setDeletePeriodTarget(null)}>Batal</button><button type="button" className="delete-confirm-btn" onClick={deletePeriod}>Hapus</button></div></section></div>}
    {preview&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPreview(null)}} onKeyDown={e=>{if(e.key==='Escape')setPreview(null)}}><section className="image-dialog" role="dialog" aria-modal="true" aria-label={`Foto ${preview.name}`}><button type="button" className="dialog-close" onClick={()=>setPreview(null)} aria-label="Tutup"><X size={20}/></button><img src={preview.image} alt={preview.name}/><div className="image-caption"><b>{preview.name}</b><span>{preview.owner}</span></div></section></div>}
    {termsDetail&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setTermsDetail(null)}} onKeyDown={e=>{if(e.key==='Escape')setTermsDetail(null)}}><section className="terms-dialog" role="dialog" aria-modal="true" aria-label={`Term & Condition ${termsDetail.name}`}><div className="terms-heading"><div><h2>Term &amp; Condition</h2><p>{termsDetail.name}</p></div><button className="dialog-close" onClick={()=>setTermsDetail(null)} aria-label="Tutup"><X size={20}/></button></div><ul>{termsDetail.tc.split('\n').filter(Boolean).map(term=><li key={term}>{term}</li>)}</ul></section></div>}
    {deleteTarget&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setDeleteTarget(null)}} onKeyDown={e=>{if(e.key==='Escape')setDeleteTarget(null)}}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><div className="confirm-icon"><Trash2 size={21}/></div><h2 id="delete-title">Hapus data ikan?</h2><p id="delete-description">Data <b>{deleteTarget.name}</b> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p><div className="confirm-actions"><button type="button" className="secondary-btn" onClick={()=>setDeleteTarget(null)}>Batal</button><button type="button" className="delete-confirm-btn" onClick={confirmDelete}>Hapus</button></div></section></div>}
    {notice&&<div className="toast"><Check size={17}/>{notice}</div>}
  </div>
}

function SettingsPanel({theme,onThemeToggle,onPrototypeAction}:{theme:'light'|'dark';onThemeToggle:()=>void;onPrototypeAction:(message:string)=>void}){
  return <section className="settings-page" aria-labelledby="settings-title">
    <header className="settings-heading"><div><span className="eyebrow">WORKSPACE PREFERENCES</span><h1 id="settings-title">Setting</h1><p>Kelola backup data, akun, dan tampilan aplikasi.</p></div><span className="prototype-badge">PROTOTIPE</span></header>
    <div className="settings-grid">
      <article className="settings-card"><div className="settings-card-heading"><span className="settings-icon"><FileText size={19}/></span><div><h2>Data &amp; Backup</h2><p>Kontrol salinan data inventaris.</p></div></div><div className="settings-info"><b>Status data</b><span>Data tersimpan sementara di sesi browser ini dan hilang setelah halaman dimuat ulang.</span></div><button className="settings-action" onClick={()=>onPrototypeAction('Fitur backup masih berupa prototipe.')}>Buat backup</button><small className="settings-footnote">Belum membuat atau mengunduh file backup.</small></article>
      <article className="settings-card"><div className="settings-card-heading"><span className="settings-icon"><Settings size={19}/></span><div><h2>Akun &amp; Akses</h2><p>Profil pengguna dan hak akses.</p></div></div><div className="settings-profile"><span className="profile-avatar">AS</span><span><b>Admin Sistem</b><small>Administrator · tampilan prototipe</small></span></div><div className="settings-info"><b>Akses akun</b><span>Login dan pengaturan hak akses belum tersedia.</span></div><button className="settings-action secondary" onClick={()=>onPrototypeAction('Pengaturan akun dan akses masih berupa prototipe.')}>Kelola akun</button></article>
      <article className="settings-card"><div className="settings-card-heading"><span className="settings-icon"><Sun size={19}/></span><div><h2>Mode Tampilan</h2><p>Pilih tema aplikasi.</p></div></div><div className="settings-mode" role="group" aria-label="Pilih mode tampilan"><button className={theme==='light'?'active':''} aria-pressed={theme==='light'} onClick={()=>{if(theme!=='light')onThemeToggle()}}><Sun size={17}/>Light</button><button className={theme==='dark'?'active':''} aria-pressed={theme==='dark'} onClick={()=>{if(theme!=='dark')onThemeToggle()}}><Moon size={17}/>Dark</button></div><small className="settings-footnote">Pilihan mode tersimpan di browser ini.</small></article>
    </div>
  </section>
}

export default App

type FormProps={initial:FishRecord|null;owners:string[];onClose:()=>void;onSave:(record:FishRecord)=>void}
function FishForm({initial:existing,owners,onClose,onSave}:FormProps){
  const [name,setName]=useState(existing?.name??'');const [owner,setOwner]=useState(existing?.owner??'');const [newOwner,setNewOwner]=useState(false);const [ownerName,setOwnerName]=useState('');const [yen,setYen]=useState(existing?.yen?.toString()??'');const [rate,setRate]=useState(existing?.rate?.toString()??'');const [rupiah,setRupiah]=useState(existing?.yen&&existing.rate?'':existing?.rupiah.toString()??'');const [percent,setPercent]=useState(existing?.feePercent.toString()??'5');const [shipping,setShipping]=useState(existing?.shipping.toString()??'');const [certificate,setCertificate]=useState(existing?.certificate??false);const [tc,setTc]=useState(existing?.tc??'');const [image,setImage]=useState(existing?.image??'');const [error,setError]=useState('')
  const yenValue=Number(yen)||0;const rateValue=Number(rate)||0;const price=yen&&rate?yenValue*rateValue:Number(rupiah)||0;const feeValue=price*(Number(percent)||0)/100;const totalValue=price+feeValue+(Number(shipping)||0)
  const fileChange=(file?:File)=>{if(!file)return;if(!['image/jpeg','image/png'].includes(file.type)){setError('Format gambar harus JPG, JPEG, atau PNG.');return}if(file.size>10*1024*1024){setError('Ukuran gambar maksimal 10 MB.');return}setError('');const reader=new FileReader();reader.onload=()=>setImage(String(reader.result));reader.readAsDataURL(file)}
  const submit=(event:React.FormEvent)=>{event.preventDefault();const resolvedOwner=newOwner?ownerName.trim():owner;if(!name.trim()||!resolvedOwner){setError('Nama ikan dan owner wajib diisi.');return}if(newOwner&&owners.some(item=>item.trim().toLocaleLowerCase()===resolvedOwner.toLocaleLowerCase())){setError('Owner tersebut sudah ada. Pilih owner dari daftar.');return}if((yen&&Number(yen)<0)||(rate&&Number(rate)<=0)||Number(percent)<0||Number(percent)>100||Number(shipping)<0||(rupiah&&Number(rupiah)<0)){setError('Periksa nilai harga, kurs, persentase fee, dan ongkir.');return}if(yen&&!rate&&!rupiah){setError('Isi kurs atau harga Rupiah manual.');return}if(rate&&!yen&&!rupiah){setError('Isi harga Rupiah manual jika harga Yen kosong.');return}onSave({id:existing?.id??0,name:name.trim(),owner:resolvedOwner,yen:yen?yenValue:null,rate:rate?rateValue:null,rupiah:Math.round(price),feePercent:Number(percent)||0,shipping:Number(shipping)||0,certificate,image,tc})}
  return <div className="modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><form className="form-dialog" onSubmit={submit} noValidate><div className="dialog-heading"><div><span className="eyebrow">DATA IKAN</span><h2>{existing?'Edit data ikan':'Tambah ikan baru'}</h2><p>Lengkapi informasi untuk mencatat data ikan.</p></div><button type="button" className="dialog-close" onClick={onClose} aria-label="Tutup"><X size={20}/></button></div><div className="form-body"><section className="form-section"><div className="section-title"><span>01</span><b>Informasi dasar</b></div><div className="field-grid"><label className="field full"><span>Nama ikan <i>*</i></span><input value={name} onChange={event=>setName(event.target.value)} placeholder="Contoh: Kohaku Nisai 52cm" autoFocus/></label><div className="field"><div className="owner-field-heading"><label htmlFor="owner-select">Owner <i>*</i></label><button type="button" className="new-owner-link" onClick={()=>{setNewOwner(value=>!value);setOwnerName('');setError('')}}>{newOwner?'Pilih owner lama':' + Owner Baru'}</button></div>{newOwner?<input value={ownerName} onChange={event=>setOwnerName(event.target.value)} placeholder="Masukkan nama owner baru" aria-label="Nama owner baru"/>:<select id="owner-select" value={owner} onChange={event=>{setOwner(event.target.value);setError('')}}><option value="">Pilih owner</option>{owners.map(item=><option key={item} value={item}>{item}</option>)}</select>}</div><div className="field"><span>Foto ikan</span><label className="upload-box">{image?<img src={image} alt="Pratinjau ikan"/>:<><ImagePlus size={22}/><b>Unggah foto</b><small>JPG atau PNG · Maks. 10 MB</small></>}<input type="file" accept="image/jpeg,image/png" onChange={event=>fileChange(event.target.files?.[0])}/></label></div></div></section><section className="form-section"><div className="section-title"><span>02</span><b>Rincian harga</b></div><div className="field-grid three"><label className="field"><span>Harga Yen</span><div className="input-prefix"><b>¥</b><input type="text" inputMode="numeric" value={formatAmountInput(yen)} onChange={event=>setYen(parseAmountInput(event.target.value))} placeholder="0"/></div></label><label className="field"><span>Kurs Yen / IDR</span><input type="number" min="0" value={rate} onChange={event=>setRate(event.target.value)} placeholder="Contoh: 115"/></label><label className="field"><span>Harga Rupiah {yen&&rate?<em>(Otomatis)</em>:null}</span><div className="input-prefix"><b>Rp</b><input type="text" inputMode="numeric" value={formatAmountInput(rupiah)} onChange={event=>setRupiah(parseAmountInput(event.target.value))} disabled={Boolean(yen&&rate)} placeholder="0"/></div></label></div><div className="field-grid two" style={{marginTop:12}}><label className="field"><span>Dealer Fee (%)</span><input type="number" min="0" max="100" step="0.1" value={percent} onChange={event=>setPercent(event.target.value)} placeholder="5"/></label><label className="field"><span>Shipping Cost (IDR)</span><div className="input-prefix"><b>Rp</b><input type="text" inputMode="numeric" value={formatAmountInput(shipping)} onChange={event=>setShipping(parseAmountInput(event.target.value))} placeholder="0"/></div></label></div><div className="calc-preview"><div><span>Harga Dasar</span><b>{money(price)}</b></div><div><span>Dealer Fee</span><b>{money(feeValue)}</b></div><div><span>Shipping</span><b>{money(Number(shipping)||0)}</b></div><div className="grand"><span>Total Harga</span><b>{money(totalValue)}</b></div></div></section><section className="form-section"><div className="section-title"><span>03</span><b>Dokumen &amp; Ketentuan</b></div><div className="field-grid"><label className="field"><span>Sertifikat</span><button type="button" className={`cert-toggle ${certificate?'on':`off`}`} onClick={()=>setCertificate(value=>!value)}><i>{certificate?<Check size={16}/>:null}</i><span>{certificate?'Sertifikat ada':'Belum ada sertifikat'}</span></button></label><label className="field full"><span>Term &amp; Condition</span><textarea value={tc} onChange={event=>setTc(event.target.value)} rows={3} placeholder="Tulis ketentuan, garansi, atau azukari per baris..."/></label></div></section></div>{error&&<p className="form-error">{error}</p>}<div className="dialog-actions"><button type="button" className="secondary-btn" onClick={onClose}>Batal</button><button type="submit" className="primary-btn">{existing?'Simpan perubahan':'Tambah ikan'}</button></div></form></div>
}
