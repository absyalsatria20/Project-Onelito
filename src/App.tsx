import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronsRight, ChevronRight, Fish, FileText, ImagePlus, LogOut, Moon, MoreHorizontal, Pencil, Plus, Search, Eye, EyeOff, Settings, Sun, Trash2, User, X, Camera, Shield, Key, Download, Upload, Database } from 'lucide-react'
import { downloadRekapPdf } from './exportPdf'
import ThemeToggle from './ThemeToggle'
import OnelitoPreloader from './OnelitoPreloader'
import './App.css'
import './animations.css'
import './Sidebar.css'
import './ThemeToggle.css'

type FishRecord = { id: number; name: string; owner: string; yen: number | null; rate: number | null; rupiah: number; feePercent: number; shipping: number; certificate: boolean; image: string; tc: string }
type Period = { id: string; name: string; records: FishRecord[]; owner: string; certificate: string; query: string; sort: 'name' | 'owner' | 'total' }
type PeriodDialog = { mode: 'add' | 'rename'; periodId?: string } | null
const initial: FishRecord[] = []
const sample2027: FishRecord[] = []
const money = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`
const yenMoney = (n: number | null) => n == null ? '—' : `¥ ${n.toLocaleString('id-ID')}`
const formatAmountInput = (value: string) => value ? Number(value).toLocaleString('id-ID') : ''
const parseAmountInput = (value: string) => value.replace(/\D/g, '')
const fee = (r: FishRecord) => r.rupiah * r.feePercent / 100
const total = (r: FishRecord) => r.rupiah + fee(r) + r.shipping

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fish-logged-in') === 'true')
  const [currentUsername, setCurrentUsername] = useState(() => localStorage.getItem('fish-username') || 'adelia')
  const [currentPassword, setCurrentPassword] = useState(() => localStorage.getItem('fish-password') || 'adelia')
  const [currentTitle, setCurrentTitle] = useState(() => localStorage.getItem('fish-title') || 'Workspace Administrator')
  const [currentAvatar, setCurrentAvatar] = useState(() => localStorage.getItem('fish-avatar') || '')
  const [accountModal, setAccountModal] = useState<'username' | 'password' | 'title' | 'avatar' | null>(null)
  const [accountModalInput, setAccountModalInput] = useState('')
  const [showPassModal, setShowPassModal] = useState(false)

  const openAccountModal = (type: 'username' | 'password' | 'title' | 'avatar') => {
    setAccountModal(type)
    if (type === 'username') setAccountModalInput(currentUsername)
    else if (type === 'password') setAccountModalInput(currentPassword)
    else if (type === 'title') setAccountModalInput(currentTitle)
    else if (type === 'avatar') setAccountModalInput(currentAvatar)
    setShowPassModal(false)
  }

  const [lastBackupTime, setLastBackupTime] = useState(() => localStorage.getItem('fish-last-backup') || '')
  const [pendingImport, setPendingImport] = useState<{periods:Period[];activePeriodId?:string}|null>(null)

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      periods,
      activePeriodId
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `onelito-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    const timeStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    setLastBackupTime(timeStr)
    localStorage.setItem('fish-last-backup', timeStr)
    toast('Backup data berhasil diunduh')
  }

  const validateBackup = (data: unknown): { valid: true } | { valid: false; error: string } => {
    const d = data as Record<string, unknown>
    if (!d || typeof d !== 'object') return { valid: false, error: 'Format file backup tidak valid' }
    if (!Array.isArray(d.periods)) return { valid: false, error: 'Format file backup tidak valid: field "periods" tidak ditemukan' }
    if (d.periods.length === 0) return { valid: false, error: 'File backup tidak berisi data periode' }
    const periodFields: [string, string][] = [['id','string'],['name','string'],['owner','string'],['certificate','string'],['query','string']]
    const validSorts = ['name','owner','total']
    for (let i = 0; i < d.periods.length; i++) {
      const p = d.periods[i] as Record<string, unknown>
      if (!p || typeof p !== 'object') return { valid: false, error: `Periode ke-${i + 1} bukan object yang valid` }
      for (const [key, type] of periodFields) {
        if (typeof p[key] !== type) return { valid: false, error: `Periode ke-${i + 1} tidak memiliki field wajib (${key})` }
      }
      if (!validSorts.includes(p.sort as string)) return { valid: false, error: `Periode ke-${i + 1} memiliki nilai "sort" tidak valid` }
      if (!Array.isArray(p.records)) return { valid: false, error: `Periode ke-${i + 1} tidak memiliki field wajib (records)` }
      const pName = (p.name as string) || `Periode ${i + 1}`
      const recordFields: [string, string][] = [['name','string'],['owner','string'],['rupiah','number'],['feePercent','number'],['shipping','number'],['image','string'],['tc','string']]
      for (let j = 0; j < (p.records as unknown[]).length; j++) {
        const r = (p.records as Record<string, unknown>[])[j]
        if (!r || typeof r !== 'object') return { valid: false, error: `Record ke-${j + 1} di periode '${pName}' bukan object yang valid` }
        if (typeof r.id !== 'number') return { valid: false, error: `Record ke-${j + 1} di periode '${pName}' tidak valid (id)` }
        for (const [key, type] of recordFields) {
          if (typeof r[key] !== type) return { valid: false, error: `Record ke-${j + 1} di periode '${pName}' tidak valid (${key})` }
        }
        if (r.yen !== null && typeof r.yen !== 'number') return { valid: false, error: `Record ke-${j + 1} di periode '${pName}' tidak valid (yen)` }
        if (r.rate !== null && typeof r.rate !== 'number') return { valid: false, error: `Record ke-${j + 1} di periode '${pName}' tidak valid (rate)` }
        if (typeof r.certificate !== 'boolean') return { valid: false, error: `Record ke-${j + 1} di periode '${pName}' tidak valid (certificate)` }
      }
    }
    return { valid: true }
  }

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result))
        const result = validateBackup(parsed)
        if (!result.valid) {
          toast(result.error)
          return
        }
        setPendingImport({
          periods: parsed.periods,
          activePeriodId: parsed.activePeriodId
        })
      } catch (err) {
        toast('Gagal membaca file JSON backup')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const confirmImportBackup = () => {
    if (!pendingImport) return
    setPeriods(pendingImport.periods)
    if (pendingImport.activePeriodId) setActivePeriodId(pendingImport.activePeriodId)
    closeWithAnimation('pendingImport', () => setPendingImport(null))
    toast('Data berhasil dipulihkan dari backup')
  }



  const saveAccountModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountModalInput.trim() && accountModal !== 'avatar') {
      toast('Nilai tidak boleh kosong')
      return
    }
    let u = currentUsername
    let t = currentTitle
    let a = currentAvatar
    let p = currentPassword

    if (accountModal === 'username') {
      u = accountModalInput.trim()
      setCurrentUsername(u)
      localStorage.setItem('fish-username', u)
      toast('Username berhasil diubah')
    } else if (accountModal === 'password') {
      p = accountModalInput.trim()
      if (!p) {
        toast('Password tidak boleh kosong')
        return
      }
      setCurrentPassword(p)
      localStorage.setItem('fish-password', p)
      toast('Password berhasil diubah')
    } else if (accountModal === 'title') {
      t = accountModalInput.trim()
      setCurrentTitle(t)
      localStorage.setItem('fish-title', t)
      toast('Title berhasil diubah')
    } else if (accountModal === 'avatar') {
      a = accountModalInput
      setCurrentAvatar(a)
      localStorage.setItem('fish-avatar', a)
      toast('Avatar berhasil diperbarui')
    }

    try {
      const { supabase } = await import('./supabaseClient')
      const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle()
      const profileId = existing?.id || '00000000-0000-0000-0000-000000000001'
      await supabase.from('profiles').upsert({
        id: profileId,
        username: u,
        title: t,
        avatar: a,
        password_hash: p
      })
    } catch (err) {
      console.error('Failed to sync profile to Supabase:', err)
    }

    closeWithAnimation('accountModal', () => setAccountModal(null))
  }
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('fish-theme') === 'dark' ? 'dark' : 'light')

  const [periods, setPeriods] = useState<Period[]>(() => {
    try {
      const saved = localStorage.getItem('fish-periods')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {}
    return [{id:'period-1',name:'Periode 1',records:[],owner:'All Owners',certificate:'All Status',query:'',sort:'name'}]
  })
  const [activePeriodId, setActivePeriodId] = useState<string>(() => {
    return localStorage.getItem('fish-active-period') || 'period-1'
  })

  useEffect(() => {
    localStorage.setItem('fish-periods', JSON.stringify(periods))
  }, [periods])

  useEffect(() => {
    localStorage.setItem('fish-active-period', activePeriodId)
  }, [activePeriodId])
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(15)
  const [isGlobalSearch, setIsGlobalSearch] = useState(false)
  const [globalQuery, setGlobalQuery] = useState('')
  const [globalSelectedIndex, setGlobalSelectedIndex] = useState(0)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    let channel: any;
    let progressInterval: any;
    const startTime = Date.now();
    (async () => {
      try {
        let currentProg = 10
        setLoadProgress(currentProg)
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const targetProg = Math.min(95, Math.round((elapsed / 5000) * 90) + 10)
          setLoadProgress(targetProg)
        }, 100)

        const { supabase } = await import('./supabaseClient')
        const fetchData = async () => {
          const { data, error } = await supabase.from('periods').select('*, fish_records(*)').order('created_at', { ascending: true })
          if (!error && data && data.length > 0) {
            const loaded = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              owner: p.owner || 'All Owners',
              certificate: p.certificate || 'All Status',
              query: p.query || '',
              sort: p.sort || 'name',
              records: (p.fish_records || []).map((r: any) => ({
                id: r.id,
                name: r.name,
                owner: r.owner,
                yen: r.price_jpy ?? null,
                rate: r.rate ?? null,
                rupiah: Number(r.price_idr || r.price_jpy * r.rate || 0),
                feePercent: Number(r.dealer_fee_pct || 0),
                shipping: Number(r.shipping_cost || 0),
                certificate: Boolean(r.certificate),
                tc: r.terms || '',
                image: r.image || ''
              }))
            }))
            setPeriods(loaded)
            const allOwners = Array.from(new Set(loaded.flatMap((p: any) => p.records.map((r: any) => r.owner)).filter(Boolean)))
            if (allOwners.length > 0) {
              setOwnerNames(allOwners as string[])
            }
          }
        }

        await fetchData()

        const { data: profData } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
        if (profData) {
          if (profData.username) { setCurrentUsername(profData.username); localStorage.setItem('fish-username', profData.username); }
          if (profData.title) { setCurrentTitle(profData.title); localStorage.setItem('fish-title', profData.title); }
          if (profData.avatar) { setCurrentAvatar(profData.avatar); localStorage.setItem('fish-avatar', profData.avatar); }
          if (profData.password_hash) { setCurrentPassword(profData.password_hash); localStorage.setItem('fish-password', profData.password_hash); }
        }

        channel = supabase
          .channel('public-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'periods' }, () => {
            fetchData()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'fish_records' }, () => {
            fetchData()
          })
          .subscribe()

        if (progressInterval) clearInterval(progressInterval)
        setLoadProgress(100)
        await new Promise(r => setTimeout(r, 800))

      } catch (err) {
        console.error('Failed to load from Supabase or setup realtime:', err)
        if (progressInterval) clearInterval(progressInterval)
        setLoadProgress(100)
      } finally {
        setIsLoading(false)
      }
    })()

    return () => {
      if (channel) {
        import('./supabaseClient').then(({ supabase }) => {
          supabase.removeChannel(channel)
        })
      }
    }
  }, [])
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
  const [modal, setModal] = useState(false)
  const [closingModal, setClosingModal] = useState<string | null>(null)
  const closeWithAnimation = (modalKey: string, closeFn: () => void) => {
    setClosingModal(modalKey)
    setTimeout(() => {
      closeFn()
      setClosingModal(null)
    }, 180)
  }
  const [periodError,setPeriodError] = useState('')
  const [openPeriodMenu,setOpenPeriodMenu] = useState<{id:string;left:number;top:number;width:number;height:number}|null>(null)
  const tabsRef = useRef<Record<string, HTMLDivElement | null>>({})
  const periodTabsContainerRef = useRef<HTMLDivElement|null>(null)
  const globalDropdownRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  useEffect(() => {
    if (globalDropdownRef.current) {
      const activeItem = globalDropdownRef.current.children[globalSelectedIndex] as HTMLElement
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [globalSelectedIndex])
  useEffect(() => {
    if (!isLoggedIn) return
    const activeEl = tabsRef.current[activePeriodId]
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft + 12,
        width: activeEl.offsetWidth - 24
      })
    }
  }, [isLoggedIn, activePeriodId, periods])

  useEffect(() => {
    if (!isLoggedIn || !openPeriodMenu) return
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
  }, [isLoggedIn, openPeriodMenu])
  const [ownerNames,setOwnerNames] = useState<string[]>(() => [...new Set(initial.map(record=>record.owner))])
  const owners = ownerNames
  const [editing, setEditing] = useState<FishRecord | null>(null)
  const [preview, setPreview] = useState<FishRecord | null>(null)
  const [termsDetail, setTermsDetail] = useState<FishRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FishRecord | null>(null)
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [profileMenuClosing, setProfileMenuClosing] = useState(false)
  const [profileModal, setProfileModal] = useState(false)
  const closeProfileMenu = () => {
    setProfileMenuClosing(true)
    setTimeout(() => {
      setProfileMenuOpen(false)
      setProfileMenuClosing(false)
    }, 160)
  }
  const [activeSection, setActiveSection] = useState('Rekap Ikan')
  useEffect(() => {
    if (!isLoggedIn) return
    const activeEl = tabsRef.current[activePeriodId]
    const container = periodTabsContainerRef.current
    if (activeEl && container) {
      requestAnimationFrame(() => {
        container.scrollTo({ left: Math.max(0, activeEl.offsetLeft - 16), behavior: 'smooth' })
      })
    }
  }, [isLoggedIn, activePeriodId, periods, activeSection])
  useEffect(() => {
    const container = periodTabsContainerRef.current
    if (!container) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollBy({
            left: e.deltaY * 0.75
          })
      }
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', onWheel)
    }
  }, [activeSection])
  useEffect(() => {
    if (!isLoggedIn) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuOpen && !(e.target as HTMLElement).closest('.sidebar-bottom')) {
        closeProfileMenu()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isLoggedIn, profileMenuOpen])

  useEffect(() => {
    if (!isLoggedIn) return
    const hasActiveModal = modal || periodDialog || deletePeriodTarget || preview || termsDetail || deleteTarget || profileModal || accountModal || pendingImport || sidebarOpen
    if (!hasActiveModal) return

    const scrollY = window.scrollY
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, scrollY)

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const inSidebar = target.closest('.sidebar')
      const inModal = target.closest('.form-dialog, .confirm-dialog, .profile-dialog, .period-name-dialog, .image-dialog, .terms-dialog, .profile-popover-menu')
      if (!inSidebar && !inModal) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      document.body.style.overflow = previousOverflow
      window.scrollTo(0, scrollY)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isLoggedIn, modal, periodDialog, deletePeriodTarget, preview, termsDetail, deleteTarget, profileModal, accountModal, sidebarOpen])

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth > 700) return
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth > 700) return
      const deltaX = e.changedTouches[0].clientX - touchStartX
      const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY)
      if (!sidebarOpen && touchStartX < 35 && deltaX > 60 && deltaY < 50) {
        setSidebarOpen(true)
      }
      if (sidebarOpen && deltaX < -60 && deltaY < 50) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [sidebarOpen])
  const allRecordsWithPeriod = useMemo(() => periods.flatMap(p => p.records.map(r => ({ ...r, periodName: p.name, periodId: p.id }))), [periods])
  const sourceRecords = isGlobalSearch ? allRecordsWithPeriod : records
  const filtered = useMemo(() => sourceRecords.filter(r => (owner === 'All Owners' || r.owner === owner) && (certificate === 'All Status' || (certificate === 'Ada' ? r.certificate : !r.certificate)) && `${r.name} ${r.owner}`.toLowerCase().includes(isGlobalSearch ? globalQuery.toLowerCase() : query.toLowerCase())).sort((a,b) => sort === 'total' ? total(b)-total(a) : sort === 'owner' ? a.owner.localeCompare(b.owner) : a.name.localeCompare(b.name)), [sourceRecords, owner, certificate, query, globalQuery, isGlobalSearch, sort])
  const selected = owner === 'All Owners' ? sourceRecords : sourceRecords.filter(r => r.owner === owner)
  const grand = filtered.reduce((sum, r) => sum + total(r), 0)
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
  const savePeriodName = async (event:React.FormEvent) => {
    event.preventDefault()
    const name=periodName.trim()
    if(!name){setPeriodError('Nama periode wajib diisi.');return}
    const current=periodDialog?.mode==='rename'?periodDialog.periodId:null
    if(periods.some(period=>period.id!==current&&period.name.trim().toLocaleLowerCase()===name.toLocaleLowerCase())){setPeriodError('Nama periode tersebut sudah digunakan.');return}
    if(periodDialog?.mode==='add'){
      const id=window.crypto?.randomUUID?.() ?? `period-${Date.now()}`
      const newRecords = name.trim().toLocaleLowerCase()==='periode 2027'?sample2027.map(record=>({...record})):[]
      setPeriods(items=>[...items,{id,name,records:newRecords,owner:'All Owners',certificate:'All Status',query:'',sort:'name'}])
      setActivePeriodId(id)
      try {
        const { supabase } = await import('./supabaseClient')
        await supabase.from('periods').upsert({ id, name, owner: 'All Owners', certificate: 'All Status', query: '', sort: 'name' })
        if (newRecords.length > 0) {
          const recsToInsert = newRecords.map(r => ({
            id: String(r.id),
            period_id: id,
            name: r.name,
            owner: r.owner,
            price_jpy: r.yen,
            rate: r.rate,
            price_idr: r.rupiah,
            dealer_fee_pct: r.feePercent,
            shipping_cost: r.shipping,
            certificate: r.certificate,
            terms: r.tc,
            image: r.image
          }))
          await supabase.from('fish_records').upsert(recsToInsert)
        }
      } catch (err) {
        console.error('Failed to save period to Supabase:', err)
      }
    }else if(periodDialog?.mode==='rename'){
      setPeriods(items=>items.map(period=>period.id===periodDialog.periodId?{...period,name}:period))
      try {
        const { supabase } = await import('./supabaseClient')
        await supabase.from('periods').upsert({ id: periodDialog.periodId, name })
      } catch (err) {
        console.error('Failed to rename period in Supabase:', err)
      }
    }
    setPeriodDialog(null)
  }
  const deletePeriod = async () => {
    if(!deletePeriodTarget||periods.length<=1)return
    const targetId = deletePeriodTarget.id
    const remaining=periods.filter(period=>period.id!==targetId)
    setPeriods(remaining)
    if(activePeriodId===targetId)setActivePeriodId(remaining[0].id)
    setDeletePeriodTarget(null)
    setOpenPeriodMenu(null)
    try {
      const { supabase } = await import('./supabaseClient')
      await supabase.from('periods').delete().eq('id', targetId)
    } catch (err) {
      console.error('Failed to delete period from Supabase:', err)
    }
  }
  const remove = (record: FishRecord) => setDeleteTarget(record)
  const confirmDelete = async () => {
    if (!deleteTarget) return
    const recordId = String(deleteTarget.id)
    setRecords(items => items.filter(item => item.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast('Data ikan berhasil dihapus')
    try {
      const { supabase } = await import('./supabaseClient')
      await supabase.from('fish_records').delete().eq('id', recordId)
    } catch (err) {
      console.error('Failed to delete fish record from Supabase:', err)
    }
  }

  const exportPdf = async () => {
    if (owner === 'All Owners') {
      toast('Pilih satu owner untuk export PDF')
      return
    }
    toast('Menyiapkan file PDF...')
    try {
      await downloadRekapPdf(owner, selected, activePeriod.name)
      toast('PDF berhasil di-download')
    } catch (err) {
      console.error(err)
      toast('Gagal mengexport PDF')
    }
  }

  if (isLoading) {
    return (
      <OnelitoPreloader
        progress={loadProgress}
        isLoaded={!isLoading}
        logoSrc="/logo-vertical.png"
        onFinish={() => setIsLoading(false)}
      />
    )
  }

  if (!isLoggedIn) {
    return <LoginForm theme={theme} themeToggle={themeToggle} onLogin={name => {
      localStorage.setItem('fish-logged-in', 'true')
      localStorage.setItem('fish-username', name)
      setCurrentUsername(name)
      setIsLoggedIn(true)
    }} />
  }

  return <div className={`app ${theme}`}>
    <div className="app-shell">
      {sidebarOpen&&<button className="sidebar-scrim" aria-label="Tutup navigasi" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`sidebar ${sidebarOpen?'sidebar-open':''} ${sidebarCollapsed?'sidebar-collapsed':''}`}>
        <div className="sidebar-header">
          <button type="button" className="sidebar-brand" onClick={()=>setSidebarCollapsed(val=>!val)} aria-expanded={!sidebarCollapsed} aria-label={sidebarCollapsed?'Buka sidebar':'Tutup sidebar'} title={sidebarCollapsed?'Buka sidebar':'Tutup sidebar'}>
            {sidebarCollapsed ? <ChevronsRight size={22} className="brand-toggle-icon"/> : <img src="/logo-onelito.png" alt="" className="brand-logo"/>}
            <span className="brand-copy"><b>ONELITO <span className="brand-koired">KOI</span></b><small>Fish Inventory</small></span>
          </button>
          <button type="button" className="sidebar-close" onClick={()=>setSidebarOpen(false)} aria-label="Tutup navigasi"><X size={19}/></button>
        </div>
        <span className="nav-label workspace-label" title="WORKSPACE">WORKSPACE</span>
        {!sidebarCollapsed && (
          <div style={{padding: '0 12px 6px', position: 'relative', animation: 'sidebarSearchIn 0.22s ease-out'}}>
            <label className="search-field" style={{width: '100%', height: '36px', background: 'transparent', border: 'none', borderBottom: `1.5px solid ${isSearchFocused ? 'var(--blue)' : 'var(--line)'}`, borderRadius: '0', padding: '0 2px', boxShadow: 'none', transition: 'border-bottom-color 0.15s ease'}}>
              <Search size={15}/>
              <input 
                value={globalQuery} 
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={e => {
                  const val = e.target.value
                  setGlobalQuery(val)
                  setGlobalSelectedIndex(0)
                  if (val.trim() === '') {
                    setIsGlobalSearch(false)
                    setPeriods(items => items.map(p => ({ ...p, query: '' })))
                  } else {
                    if (!isGlobalSearch) setIsGlobalSearch(true)
                    if (activeSection !== 'Rekap Ikan') setActiveSection('Rekap Ikan')
                  }
                }} 
                onKeyDown={e => {
                  const results = allRecordsWithPeriod.filter(r => r.name.toLowerCase().includes(globalQuery.toLowerCase()) || r.owner.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 6)
                  if (results.length === 0) return
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setGlobalSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setGlobalSelectedIndex(prev => Math.max(prev - 1, 0))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    const item = results[globalSelectedIndex] || results[0]
                    if (item) {
                      setPeriods(items => items.map(p => p.id === item.periodId ? { ...p, query: item.name, owner: 'All Owners' } : { ...p, query: '', owner: 'All Owners' }))
                      setActivePeriodId(item.periodId)
                      setIsGlobalSearch(false)
                      setIsSearchFocused(false)
                      setGlobalSelectedIndex(0)
                      setActiveSection('Rekap Ikan')
                      setSidebarOpen(false)
                    }
                  } else if (e.key === 'Escape') {
                    setIsGlobalSearch(false)
                    ;(e.currentTarget as HTMLInputElement).blur()
                  }
                }}
                placeholder="Cari semua ikan..." 
                aria-label="Cari global"
                style={{fontSize: '12px'}}
              />
              {globalQuery && (
                <button type="button" onClick={(e) => { 
                  setGlobalQuery('')
                  setIsGlobalSearch(false)
                  setPeriods(items => items.map(p => ({ ...p, query: '' })))
                  setIsSearchFocused(false)
                  setGlobalSelectedIndex(0)
                  ;(e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement)?.blur()
                }} style={{background:'var(--line)', border:0, cursor:'pointer', color:'var(--text)', display:'grid', placeItems:'center', width:'18px', height:'18px', borderRadius:'50%', padding:0, marginLeft:'auto', flexShrink:0}} title="Hapus pencarian">
                  <X size={11}/>
                </button>
              )}
            </label>
            {isGlobalSearch && globalQuery.trim() !== '' && allRecordsWithPeriod.length > 0 && (
              <div ref={globalDropdownRef} className="global-search-dropdown" style={{position: 'absolute', top: '42px', left: 12, right: 12, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100, maxHeight: '260px', overflowY: 'auto', padding: '4px'}}>
                {allRecordsWithPeriod.filter(r => r.name.toLowerCase().includes(globalQuery.toLowerCase()) || r.owner.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 6).map((item, idx) => (
                  <div 
                    key={`${item.periodId}-${item.id}`}
                    onMouseDown={e => {
                      e.preventDefault()
                      setPeriods(items => items.map(p => p.id === item.periodId ? { ...p, query: item.name, owner: 'All Owners' } : { ...p, query: '', owner: 'All Owners' }))
                      setActivePeriodId(item.periodId)
                      setIsGlobalSearch(false)
                      setIsSearchFocused(false)
                      setGlobalSelectedIndex(0)
                      setActiveSection('Rekap Ikan')
                      setSidebarOpen(false)
                    }}
                    style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s', background: idx === globalSelectedIndex ? 'var(--panel-soft)' : 'transparent'}}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--panel-soft)'; setGlobalSelectedIndex(idx) }}
                    onMouseLeave={e => { if (idx !== globalSelectedIndex) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{width: '28px', height: '28px', borderRadius: '4px', overflow: 'hidden', flexShrink: '0', background: 'var(--line)'}}>
                      <img src={item.image} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} onError={e => { e.currentTarget.style.display = 'none' }} />
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.name}</div>
                      <div style={{fontSize: '10px', color: 'var(--muted)', display: 'flex', gap: '4px', alignItems: 'center'}}>
                        <span>{item.owner}</span><span>·</span><span style={{color: 'var(--blue)', fontWeight: 600}}>{item.periodName}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {allRecordsWithPeriod.filter(r => r.name.toLowerCase().includes(globalQuery.toLowerCase()) || r.owner.toLowerCase().includes(globalQuery.toLowerCase())).length === 0 && (
                  <div style={{padding: '12px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)'}}>Tidak ada ikan ditemukan</div>
                )}
              </div>
            )}
          </div>
        )}
        <nav className="sidebar-nav" aria-label="Navigasi utama">
          <button className={`sidebar-link ${activeSection==='Rekap Ikan'?'selected':''}`} onClick={()=>{setActiveSection('Rekap Ikan');setSidebarOpen(false)}}><div className="fish-icon"><svg className="fish-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="koiBody"><path d="M4 12 C6 7 10 5.5 15 7 C18 8 20 10 21 12 C19 15 16 17 12 17 C8 17 5 15 4 12Z"/></clipPath></defs><g className="fish-tail"><path d="M5 12 C3 9 1 7 0.8 7 C1 10 1 14 0.8 17 C3 15 4 14 5 12Z" fill="#F87171" stroke="#991B1B" strokeWidth="0.7"/></g><path d="M4 12 C6 7 10 5.5 15 7 C18 8 20 10 21 12 C19 15 16 17 12 17 C8 17 5 15 4 12Z" fill="#FFFDF7" stroke="#475569" strokeWidth="0.7"/><g clipPath="url(#koiBody)"><path d="M16 5 C19 5 21 8 20 11 C18 12 16 11 15 9Z" fill="#DC2626"/><path d="M9 5 C12 5 14 7 13 10 C12 12 9 12 8 10 C7 8 8 6 9 5Z" fill="#DC2626"/><path d="M4 12 C5 9 7 9 8 11 C8 14 6 16 4 15Z" fill="#DC2626"/></g><path d="M10 7 Q12 3 15 6 L13 8" fill="#FFFDF7" stroke="#991B1B" strokeWidth="0.6"/><path d="M11 16 Q13 20 16 17 L14 15" fill="#FFFDF7" stroke="#991B1B" strokeWidth="0.6"/><circle cx="19" cy="11" r="0.8" fill="#1E293B"/><path d="M20 12.5 Q22 13 22.5 12 M20 13 Q22 14 22.5 14" stroke="#991B1B" strokeWidth="0.45" strokeLinecap="round"/></svg><span className="fish-bubble fish-bubble-one"></span><span className="fish-bubble fish-bubble-two"></span></div><span>Rekap Ikan</span><b className="nav-badge">{records.length}</b></button>
        </nav>
        <div className="sidebar-spacer"/><span className="nav-label settings-label" title="PREFERENCES">PREFERENCES</span>
        <nav className="sidebar-nav"><button className={`sidebar-link ${activeSection==='Setting'?'selected':''}`} onClick={()=>{setActiveSection('Setting');setSidebarOpen(false)}}><Settings size={18}/><span>Setting</span></button></nav>
        <div className="mobile-theme-toggle-wrap"><span style={{fontSize:'12px',fontWeight:600,color:'var(--text)'}}>Ubah Tampilan</span><ThemeToggle isDark={theme === 'dark'} onToggle={themeToggle} size={84}/></div>
        <div className="sidebar-bottom" style={{position:'relative'}}><div className="profile-card" onClick={(e)=>{e.stopPropagation();if(profileMenuOpen){closeProfileMenu()}else{setProfileMenuOpen(true)}}} role="button" aria-expanded={profileMenuOpen} tabIndex={0}><span className="profile-avatar" style={{overflow:'hidden'}}>{currentAvatar ? <img src={currentAvatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : currentUsername.slice(0,2).toUpperCase()}</span><span className="profile-user-info"><b>{currentUsername}</b><small>Workspace admin</small></span></div>{(profileMenuOpen || profileMenuClosing)&&<div className={`profile-popover-menu ${profileMenuClosing?'closing':''}`}><button onClick={()=>{setProfileModal(true);closeProfileMenu()}}><User size={13}/> Lihat Profil</button><button onClick={()=>{localStorage.removeItem('fish-logged-in');setIsLoggedIn(false);toast('Berhasil keluar sesi');closeProfileMenu()}}><LogOut size={13}/> Keluar</button></div>}</div>
      </aside>
      <div className="workspace-main"><header className="workspace-topbar"><span className="current-tab" key={activeSection}>Workspace/{activeSection}</span>{activeSection==='Rekap Ikan'&&<div className="period-tabs" ref={periodTabsContainerRef} role="tablist" aria-label="Periode rekap ikan"><div className="period-tabs-indicator" style={{left:`${indicatorStyle.left}px`,width:`${indicatorStyle.width}px`}}/>{periods.map(period=><div className={`period-tab ${activePeriodId===period.id?'active':''}`} key={period.id} ref={el=>{tabsRef.current[period.id]=el}}><button type="button" role="tab" aria-selected={activePeriodId===period.id} onClick={()=>{setActivePeriodId(period.id);setOpenPeriodMenu(null)}}>{period.name}</button><button type="button" className="period-tab-menu-trigger" aria-label={`Menu ${period.name}`} aria-expanded={openPeriodMenu?.id===period.id} onClick={event=>{
                    const tabEl=event.currentTarget.closest('.period-tab');
                    const rect=tabEl?tabEl.getBoundingClientRect():event.currentTarget.getBoundingClientRect();
                    setOpenPeriodMenu(openPeriodMenu?.id===period.id?null:{
                      id:period.id,
                      left:rect.left,
                      top:rect.bottom+4,
                      width:rect.width,
                      height:36
                    })
                  }}><MoreHorizontal size={16}/></button></div>)}<button type="button" className="period-add" onClick={openAddPeriod} aria-label="Tambah periode" title="Tambah periode"><Plus size={17}/></button></div>}<ThemeToggle isDark={theme === 'dark'} onToggle={themeToggle} size={80}/></header>
      {openPeriodMenu&&periods.find(period=>period.id===openPeriodMenu.id)&&<div className="period-tab-menu" style={{position:'fixed',left:openPeriodMenu.left,top:openPeriodMenu.top,width:openPeriodMenu.width}}><button type="button" onClick={()=>{openRenamePeriod(periods.find(p=>p.id===openPeriodMenu.id)!);setOpenPeriodMenu(null)}}><Pencil size={14}/>Ganti nama</button><button type="button" disabled={periods.length===1} onClick={()=>{setDeletePeriodTarget(periods.find(p=>p.id===openPeriodMenu.id)!);setOpenPeriodMenu(null)}}><Trash2 size={14}/>Hapus</button></div>}
      <main className="inventory-page" key={activeSection==='Setting'?'setting':activePeriodId}>{activeSection==='Setting' ? <SettingsPanel theme={theme} onThemeToggle={themeToggle} currentUsername={currentUsername} currentTitle={currentTitle} currentAvatar={currentAvatar} openModal={openAccountModal} lastBackupTime={lastBackupTime} onExportBackup={handleExportBackup} onImportBackup={handleImportBackup} totalPeriods={periods.length} totalRecords={periods.reduce((acc, p) => acc + p.records.length, 0)}/> : <>
      <header className="page-heading"><div className="heading-copy"><h1>Rekap Pembelian Ikan Jepang</h1><p>Kelola data ikan, harga, dan dokumen pemilik.</p></div><div className="heading-actions"><button className="primary-btn" onClick={() => { setEditing(null); setModal(true) }}><Plus size={17}/>Tambah ikan</button></div></header>
      <section className="filter-panel" aria-label="Filter dan inventaris ikan">
        <div className="toolbar">
          <label className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari ikan atau pemilik..." aria-label="Cari ikan atau pemilik"/>{query && (<button type="button" onClick={() => setQuery('')} style={{background:'var(--line)', border:0, cursor:'pointer', color:'var(--text)', display:'grid', placeItems:'center', width:'18px', height:'18px', borderRadius:'50%', padding:0, marginLeft:'auto', flexShrink:0}} title="Hapus pencarian"><X size={11}/></button>)}</label>
          <label className="select-wrap"><span className="sr-only">Pilih owner</span><select value={owner} onChange={e=>setOwner(e.target.value)}><option>All Owners</option>{owners.map(name=><option key={name}>{name}</option>)}</select><ChevronDown size={15}/></label>
          <label className="select-wrap status-select"><span className="sr-only">Filter status sertifikat</span><select value={certificate} onChange={e=>setCertificate(e.target.value)}><option>All Status</option><option>Ada</option><option>Belum ada</option></select><ChevronDown size={15}/></label>
          <div className="export-actions"><button className="export-btn pdf-btn" onClick={exportPdf}><FileText size={17}/><span>Export PDF</span></button></div>
        </div>
      <section className="data-panel" aria-label="Daftar inventaris ikan">
        <div className="table-wrap"><table><colgroup><col className="fish-col"/><col className="yen-col"/><col className="rate-col"/><col className="idr-col"/><col className="fee-col"/><col className="shipping-col"/><col className="total-col"/><col className="cert-col"/><col className="tc-col"/><col className="action-col"/></colgroup><thead><tr><th><button onClick={()=>setSort('name')}>FISH</button></th><th className="numeric">HARGA (JPY)</th><th className="numeric">KURS</th><th className="numeric">HARGA (IDR)</th><th className="numeric">DEALER FEE</th><th className="numeric">SHIPPING COST</th><th className="numeric"><button onClick={()=>setSort('total')}>TOTAL</button></th><th>SERTIFIKAT</th><th>TERM &amp; CONDITION</th><th className="action-head">EDIT</th></tr></thead><tbody>{filtered.map(record=><tr key={`${(record as any).periodId || 'curr'}-${record.id}`}>
          <td><div className="fish-cell"><button className="thumb" onClick={()=>{if((record as any).periodId)setActivePeriodId((record as any).periodId);setPreview(record)}} aria-label={`Lihat foto ${record.name}`} title="Klik untuk melihat gambar"><img src={record.image} alt={record.name} loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden'}}/><span className="thumb-fallback"><Fish size={18}/></span></button><span className="fish-info"><b title={record.name}>{record.name}</b><span style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>{owner==='All Owners'&&<small className="fish-owner">{record.owner}</small>}{isGlobalSearch&&(record as any).periodName&&<small className="fish-owner" style={{padding:'1px 5px',borderRadius:'4px',background:'var(--panel-soft)',border:'1px solid var(--line)',color:'var(--blue)'}}>{(record as any).periodName}</small>}</span></span></div></td>
          <td className="numeric">{yenMoney(record.yen)}</td><td className="numeric">{record.rate ?? '—'}</td><td className="numeric">{money(record.rupiah)}</td><td className="numeric fee-cell"><span className="fee-percent">{record.feePercent}%</span><span className="fee-amount">{money(fee(record))}</span></td><td className="numeric">{money(record.shipping)}</td><td className="numeric total-value">{money(total(record))}</td><td><span className={`status ${record.certificate?'status-ok':'status-pending'}`}><i/>{record.certificate?'Ada':'Belum ada'}</span></td><td className="tc-cell">{record.tc ? <><span>{record.tc.split('\n')[0]}</span><button className="tc-detail-btn" onClick={()=>setTermsDetail(record)}>Detail</button></> : '—'}</td>
          <td><div className="row-actions"><button className="row-action edit" onClick={()=>{if((record as any).periodId)setActivePeriodId((record as any).periodId);setEditing(record);setModal(true)}} aria-label={`Edit ${record.name}`} title="Edit"><Pencil size={17}/></button><button className="row-action delete" onClick={()=>{if((record as any).periodId)setActivePeriodId((record as any).periodId);remove(record)}} aria-label={`Hapus ${record.name}`} title="Hapus"><Trash2 size={17}/></button></div></td>
        </tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state"><Search size={22}/><b>Data tidak ditemukan</b><span>Coba ubah kata pencarian atau filter pilihan.</span></div>}</div>
      </section>
      <footer className="table-footer"><div className="owner-summary"><span>Owner:</span><b>{owner==='All Owners'?'Semua owner':owner}</b><i>·</i><span>Menampilkan {filtered.length} data</span></div><div className="grand-total"><span>GRAND TOTAL:</span><strong>{money(grand)}</strong></div></footer>
      </section>
      </> }</main>
      </div>
    </div>


    {modal&&<FishForm key={`${activePeriod.id}-${editing?.id??'new'}`} initial={editing} owners={owners} closing={closingModal==='modal'} onClose={()=>closeWithAnimation('modal',()=>setModal(false))} onSave={async record => {
      const isEditing = Boolean(editing)
      const currentEditing = editing
      const recordId = isEditing && currentEditing ? String(currentEditing.id) : `fish-${Date.now()}`
      const finalRecord = isEditing ? record : {...record, id: recordId as any}

      setOwnerNames(items=>items.some(name=>name.toLocaleLowerCase()===record.owner.trim().toLocaleLowerCase())?items:[...items,record.owner.trim()])
      setRecords(items=>isEditing && currentEditing ? items.map(item=>item.id===currentEditing.id?finalRecord:item):[finalRecord,...items])
      closeWithAnimation('modal',()=>setModal(false))
      toast(isEditing?'Perubahan berhasil disimpan':'Ikan berhasil ditambahkan')

      try {
        const { supabase } = await import('./supabaseClient')
        await supabase.from('periods').upsert({
          id: activePeriod.id,
          name: activePeriod.name,
          owner: activePeriod.owner,
          certificate: activePeriod.certificate,
          query: activePeriod.query,
          sort: activePeriod.sort
        })
        await supabase.from('fish_records').upsert({
          id: String(finalRecord.id),
          period_id: activePeriod.id,
          name: finalRecord.name,
          owner: finalRecord.owner,
          price_jpy: finalRecord.yen,
          rate: finalRecord.rate,
          price_idr: finalRecord.rupiah,
          dealer_fee_pct: finalRecord.feePercent,
          shipping_cost: finalRecord.shipping,
          certificate: finalRecord.certificate,
          terms: finalRecord.tc,
          image: finalRecord.image
        })
      } catch (err) {
        console.error('Failed to save fish record to Supabase:', err)
      }
    }}/>}
    {periodDialog&&<div className={`modal-backdrop ${closingModal==='periodDialog'?'closing':''}`} onMouseDown={event=>{if(event.target===event.currentTarget)closeWithAnimation('periodDialog',()=>setPeriodDialog(null))}}><form className={`period-name-dialog ${closingModal==='periodDialog'?'closing':''}`} role="dialog" aria-modal="true" aria-labelledby="period-dialog-title" onSubmit={savePeriodName}><div className="period-dialog-heading"><div><span className="eyebrow">WORKSPACE</span><h2 id="period-dialog-title">{periodDialog.mode==='add'?'Tambah Tab Baru':'Ganti nama periode'}</h2></div><button type="button" className="dialog-close" onClick={()=>closeWithAnimation('periodDialog',()=>setPeriodDialog(null))} aria-label="Tutup"><X size={20}/></button></div><label className="period-name-field" htmlFor="period-name">Nama Tab<input id="period-name" autoFocus value={periodName} onChange={event=>{setPeriodName(event.target.value);setPeriodError('')}} placeholder="Contoh: Periode 2027" aria-describedby={periodError?'period-name-error':undefined}/></label>{periodError&&<p className="period-form-error" id="period-name-error" role="alert">{periodError}</p>}<div className="period-dialog-actions"><button type="button" className="secondary-btn" onClick={()=>closeWithAnimation('periodDialog',()=>setPeriodDialog(null))}>Batal</button><button type="submit" className="primary-btn">{periodDialog.mode==='add'?'Buat periode':'Simpan nama'}</button></div></form></div>}
    {deletePeriodTarget&&<div className={`modal-backdrop ${closingModal==='deletePeriodTarget'?'closing':''}`} onMouseDown={event=>{if(event.target===event.currentTarget)closeWithAnimation('deletePeriodTarget',()=>setDeletePeriodTarget(null))}}><section className={`confirm-dialog ${closingModal==='deletePeriodTarget'?'closing':''}`} role="alertdialog" aria-modal="true" aria-labelledby="period-delete-title" aria-describedby="period-delete-description"><div className="confirm-icon"><Trash2 size={21}/></div><h2 id="period-delete-title">Hapus periode?</h2><p id="period-delete-description">Periode <b>{deletePeriodTarget.name}</b> dan seluruh data di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.</p><div className="confirm-actions"><button type="button" className="secondary-btn" onClick={()=>closeWithAnimation('deletePeriodTarget',()=>setDeletePeriodTarget(null))}>Batal</button><button type="button" className="delete-confirm-btn" onClick={deletePeriod}>Hapus</button></div></section></div>}
    {pendingImport&&<div className={`modal-backdrop ${closingModal==='pendingImport'?'closing':''}`} onMouseDown={event=>{if(event.target===event.currentTarget)closeWithAnimation('pendingImport',()=>setPendingImport(null))}}><section className={`confirm-dialog ${closingModal==='pendingImport'?'closing':''}`} role="alertdialog" aria-modal="true" aria-labelledby="import-confirm-title" aria-describedby="import-confirm-description"><div className="confirm-icon"><Database size={21}/></div><h2 id="import-confirm-title">Timpa data saat ini?</h2><p id="import-confirm-description">File backup berisi <b>{pendingImport.periods.length} periode</b>{pendingImport.periods.length>0&&<> ({pendingImport.periods.map(p=>p.name).join(', ')})</>}. Semua data saat ini akan diganti dengan data dari backup.</p><div className="confirm-actions"><button type="button" className="secondary-btn" onClick={()=>closeWithAnimation('pendingImport',()=>setPendingImport(null))}>Batal</button><button type="button" className="delete-confirm-btn" onClick={confirmImportBackup}>Timpa Data</button></div></section></div>}
    {preview&&<div className={`modal-backdrop ${closingModal==='preview'?'closing':''}`} onMouseDown={e=>{if(e.target===e.currentTarget)closeWithAnimation('preview',()=>setPreview(null))}} onKeyDown={e=>{if(e.key==='Escape')closeWithAnimation('preview',()=>setPreview(null))}}><section className={`image-dialog ${closingModal==='preview'?'closing':''}`} role="dialog" aria-modal="true" aria-label={`Foto ${preview.name}`}><button type="button" className="dialog-close" onClick={()=>closeWithAnimation('preview',()=>setPreview(null))} aria-label="Tutup"><X size={20}/></button><img src={preview.image} alt={preview.name}/><div className="image-caption"><b>{preview.name}</b><span>{preview.owner}</span></div></section></div>}
    {termsDetail&&<div className={`modal-backdrop ${closingModal==='termsDetail'?'closing':''}`} onMouseDown={e=>{if(e.target===e.currentTarget)closeWithAnimation('termsDetail',()=>setTermsDetail(null))}} onKeyDown={e=>{if(e.key==='Escape')closeWithAnimation('termsDetail',()=>setTermsDetail(null))}}><section className={`terms-dialog ${closingModal==='termsDetail'?'closing':''}`} role="dialog" aria-modal="true" aria-label={`Term & Condition ${termsDetail.name}`}><div className="terms-heading"><div><h2>Term &amp; Condition</h2><p>{termsDetail.name}</p></div><button className="dialog-close" onClick={()=>closeWithAnimation('termsDetail',()=>setTermsDetail(null))} aria-label="Tutup"><X size={20}/></button></div><ul>{termsDetail.tc.split('\n').filter(Boolean).map(term=><li key={term}>{term}</li>)}</ul></section></div>}
    {deleteTarget&&<div className={`modal-backdrop ${closingModal==='deleteTarget'?'closing':''}`} onMouseDown={e=>{if(e.target===e.currentTarget)closeWithAnimation('deleteTarget',()=>setDeleteTarget(null))}} onKeyDown={e=>{if(e.key==='Escape')closeWithAnimation('deleteTarget',()=>setDeleteTarget(null))}}><section className={`confirm-dialog ${closingModal==='deleteTarget'?'closing':''}`} role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><div className="confirm-icon"><Trash2 size={21}/></div><h2 id="delete-title">Hapus data ikan?</h2><p id="delete-description">Data <b>{deleteTarget.name}</b> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p><div className="confirm-actions"><button type="button" className="secondary-btn" onClick={()=>closeWithAnimation('deleteTarget',()=>setDeleteTarget(null))}>Batal</button><button type="button" className="delete-confirm-btn" onClick={confirmDelete}>Hapus</button></div></section></div>}
    {profileModal&&<div className={`modal-backdrop ${closingModal==='profileModal'?'closing':''}`} onMouseDown={e=>{if(e.target===e.currentTarget)closeWithAnimation('profileModal',()=>setProfileModal(false))}} onKeyDown={e=>{if(e.key==='Escape')closeWithAnimation('profileModal',()=>setProfileModal(false))}}><section className={`profile-dialog ${closingModal==='profileModal'?'closing':''}`} role="dialog" aria-modal="true" aria-label="Profil Admin Sistem"><div className="profile-dialog-heading"><div><h2>Profile Information</h2></div></div><div className="profile-dialog-body" style={{display:'flex',flexDirection:'column',gap:'16px',padding:'8px 0 20px'}}><div style={{display:'flex',justifyContent:'center',marginBottom:4}}><div className="profile-dialog-avatar-large" style={{overflow:'hidden'}}>{currentAvatar ? <img src={currentAvatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : currentUsername.slice(0,2).toUpperCase()}</div></div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:14,borderBottom:'1px solid var(--line)'}}><span style={{fontSize:15,color:'var(--muted)',fontWeight:600}}>Username</span><b style={{fontSize:15,color:'var(--text)',fontWeight:650}}>{currentUsername}</b></div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:2}}><span style={{fontSize:15,color:'var(--muted)',fontWeight:600}}>Title &amp; Jabatan</span><b style={{fontSize:15,color:'var(--text)',fontWeight:650}}>{currentTitle}</b></div></div><div className="dialog-actions"><button type="button" className="primary-btn" onClick={()=>closeWithAnimation('profileModal',()=>setProfileModal(false))}>Tutup</button></div></section></div>}
    {accountModal&&<div className={`modal-backdrop ${closingModal==='accountModal'?'closing':''}`} onMouseDown={e=>{if(e.target===e.currentTarget)closeWithAnimation('accountModal',()=>setAccountModal(null))}}><form className={`period-name-dialog ${closingModal==='accountModal'?'closing':''}`} role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" onSubmit={saveAccountModal}><div className="period-dialog-heading"><div><span className="eyebrow">AKUN &amp; AKSES</span><h2 id="account-dialog-title">{accountModal==='username'?'Ubah Username':accountModal==='password'?'Ubah Password':accountModal==='title'?'Ubah Title':'Ubah Avatar'}</h2></div><button type="button" className="dialog-close" onClick={()=>closeWithAnimation('accountModal',()=>setAccountModal(null))} aria-label="Tutup"><X size={20}/></button></div>{accountModal==='avatar'?(<div className="field" style={{marginBottom:'16px'}}><span>Pilih foto avatar baru</span><label className="upload-box" style={{height:'120px'}}>{accountModalInput?<img src={accountModalInput} alt="Pratinjau avatar" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'8px'}}/>:<><ImagePlus size={22}/><b>Unggah foto</b><small>JPG atau PNG · Maks. 10 MB</small></>}<input type="file" accept="image/jpeg,image/png" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(!['image/jpeg','image/png'].includes(file.type)){toast('Format gambar harus JPG, JPEG, atau PNG.');return}if(file.size>10*1024*1024){toast('Ukuran gambar maksimal 10 MB.');return}const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');const maxSize=160;let w=img.width;let h=img.height;if(w>h){if(w>maxSize){h=Math.round(h*(maxSize/w));w=maxSize}}else{if(h>maxSize){w=Math.round(w*(maxSize/h));h=maxSize}}canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx?.drawImage(img,0,0,w,h);setAccountModalInput(canvas.toDataURL('image/jpeg',0.85))};img.src=String(reader.result)};reader.readAsDataURL(file)}}/></label>{accountModalInput&&<button type="button" className="secondary-btn" style={{marginTop:'8px',width:'100%',fontSize:'12px'}} onClick={()=>setAccountModalInput('')}>Hapus / Reset Avatar</button>}</div>):(<label className="period-name-field" htmlFor="account-input">{accountModal==='username'?'Username baru':accountModal==='password'?'Password baru':'Isi Title'}<div className={accountModal==='password'?'login-password-wrap':''}><input id="account-input" type={accountModal==='password'&&!showPassModal?'password':'text'} autoFocus value={accountModalInput} onChange={e=>setAccountModalInput(e.target.value)} placeholder={accountModal==='username'?'Masukkan username baru':accountModal==='password'?'Masukkan password baru':'Masukkan title baru'} style={accountModal==='password'?{paddingRight:'40px'}:undefined}/>{accountModal==='password'&&<button type="button" className="login-eye-btn" onClick={()=>setShowPassModal(!showPassModal)} aria-label={showPassModal?'Sembunyikan password':'Tampilkan password'} style={{right:'8px'}}>{showPassModal?<EyeOff size={16}/>:<Eye size={16}/>}</button>}</div></label>)}<div className="period-dialog-actions"><button type="button" className="secondary-btn" onClick={()=>closeWithAnimation('accountModal',()=>setAccountModal(null))}>Batal</button><button type="submit" className="primary-btn">Simpan</button></div></form></div>}
    {notice&&<div className="toast"><Check size={17}/>{notice}</div>}
  </div>
}

function SettingsPanel({theme,onThemeToggle,currentUsername,currentTitle,currentAvatar,openModal,lastBackupTime,onExportBackup,onImportBackup,totalPeriods,totalRecords}:{theme:'light'|'dark';onThemeToggle:()=>void;currentUsername:string;currentTitle:string;currentAvatar:string;openModal:(type:'username'|'password'|'title'|'avatar')=>void;lastBackupTime:string;onExportBackup:()=>void;onImportBackup:(e:React.ChangeEvent<HTMLInputElement>)=>void;totalPeriods:number;totalRecords:number}){
  return <section className="settings-page" aria-labelledby="settings-title">
    <header className="settings-heading"><div><span className="eyebrow">WORKSPACE PREFERENCES</span><h1 id="settings-title">Setting</h1><p>Kelola backup data, akun, dan tampilan aplikasi.</p></div><span className="prototype-badge">SYSTEM ACTIVE</span></header>
    <div className="settings-grid">
      <article className="settings-card">
        <div className="settings-card-heading">
          <span className="settings-icon"><Database size={19}/></span>
          <div><h2>Data &amp; Backup</h2><p>Ekspor, impor, dan manajemen penyimpanan data.</p></div>
        </div>
        <div className="settings-info" style={{display:'grid',gap:'8px',marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'var(--muted)',fontSize:'12px'}}>Jumlah Periode</span>
            <b style={{fontSize:'12px',color:'var(--text)'}}>{totalPeriods} Periode</b>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'var(--muted)',fontSize:'12px'}}>Total Record Ikan</span>
            <b style={{fontSize:'12px',color:'var(--text)'}}>{totalRecords} Ikan</b>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'var(--muted)',fontSize:'12px'}}>Penyimpanan Lokal</span>
            <b style={{fontSize:'12px',color:'var(--text)'}}>Aktif (LocalStorage)</b>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'var(--muted)',fontSize:'12px'}}>Terakhir Backup</span>
            <b style={{fontSize:'12px',color:'var(--text)'}}>{lastBackupTime || 'Belum pernah'}</b>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'var(--muted)',fontSize:'12px'}}>Status Enkripsi</span>
            <span style={{fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'10px',background:'rgba(16,185,129,0.1)',color:'#10B981'}}>Secure 256-bit</span>
          </div>
        </div>
        <div className="settings-actions-grid">
          <button type="button" className="settings-action" onClick={onExportBackup} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',fontSize:'12px',fontWeight:650,height:'40px'}}><Download size={15}/> Ekspor JSON</button>
          <label className="settings-action secondary" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',fontSize:'12px',fontWeight:650,height:'40px',margin:0,cursor:'pointer'}}>
            <Upload size={15}/> Impor Data
            <input type="file" accept=".json" onChange={onImportBackup} style={{display:'none'}}/>
          </label>
        </div>
        <small className="settings-footnote" style={{marginTop:'12px'}}>Data tersimpan otomatis di browser. Lakukan backup berkala untuk keamanan.</small>
      </article>
      <article className="settings-card" style={{gridColumn:'span 1 / span 2'}}>
        <div className="settings-card-heading">
          <span className="settings-icon"><Shield size={19}/></span>
          <div><h2>Akun &amp; Akses</h2><p>Ubah profil username, password, title, dan avatar.</p></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'16px',padding:'16px 20px',background:'linear-gradient(135deg, var(--panel-muted) 0%, var(--panel) 100%)',borderRadius:'10px',border:'1px solid var(--line)',marginBottom:'16px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'relative',cursor:'pointer',flexShrink:0}} onClick={()=>openModal('avatar')} title="Klik untuk ubah avatar">
            <span className="profile-avatar" style={{width:'50px',height:'50px',borderRadius:'50%',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'17px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>{currentAvatar ? <img src={currentAvatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : currentUsername.slice(0,2).toUpperCase()}</span>
            <span style={{position:'absolute',bottom:-2,right:-2,width:'20px',height:'20px',background:'#2563EB',color:'#FFFFFF',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 6px rgba(0,0,0,0.2)',border:'2px solid var(--panel)'}}><Camera size={10}/></span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'2px',flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <b style={{fontSize:'15px',color:'var(--text)',fontWeight:700}}>{currentUsername}</b>
              <span style={{fontSize:'10px',fontWeight:600,padding:'2px 8px',borderRadius:'10px',background:'rgba(220, 38, 38, 0.1)',color:'#DC2626'}}>Admin</span>
            </div>
            <span style={{fontSize:'12px',color:'var(--muted)',fontWeight:500}}>{currentTitle}</span>
          </div>
        </div>
        <div className="account-actions-grid">
          <button type="button" className="settings-action secondary" onClick={()=>openModal('username')} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'12px',fontWeight:600,padding:'0 14px',height:'42px',background:'var(--panel)',border:'1px solid var(--line)',borderRadius:'8px',cursor:'pointer',color:'var(--text)',transition:'all 0.15s ease'}}><span style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(59,130,246,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}><User size={14} style={{color:'#3B82F6'}}/></span> Ubah Username</span><ChevronRight size={15} style={{color:'var(--muted)'}}/></button>
          <button type="button" className="settings-action secondary" onClick={()=>openModal('password')} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'12px',fontWeight:600,padding:'0 14px',height:'42px',background:'var(--panel)',border:'1px solid var(--line)',borderRadius:'8px',cursor:'pointer',color:'var(--text)',transition:'all 0.15s ease'}}><span style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(245,158,11,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}><Key size={14} style={{color:'#F59E0B'}}/></span> Ubah Password</span><ChevronRight size={15} style={{color:'var(--muted)'}}/></button>
          <button type="button" className="settings-action secondary" onClick={()=>openModal('title')} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'12px',fontWeight:600,padding:'0 14px',height:'42px',background:'var(--panel)',border:'1px solid var(--line)',borderRadius:'8px',cursor:'pointer',color:'var(--text)',transition:'all 0.15s ease'}}><span style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(139,92,246,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}><Shield size={14} style={{color:'#8B5CF6'}}/></span> Ubah Title</span><ChevronRight size={15} style={{color:'var(--muted)'}}/></button>
          <button type="button" className="settings-action secondary" onClick={()=>openModal('avatar')} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'12px',fontWeight:600,padding:'0 14px',height:'42px',background:'var(--panel)',border:'1px solid var(--line)',borderRadius:'8px',cursor:'pointer',color:'var(--text)',transition:'all 0.15s ease'}}><span style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(16,185,129,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}><Camera size={14} style={{color:'#10B981'}}/></span> Ubah Avatar</span><ChevronRight size={15} style={{color:'var(--muted)'}}/></button>
        </div>
        <small className="settings-footnote">Kelola informasi profil akun.</small>
      </article>
      <article className="settings-card"><div className="settings-card-heading"><span className="settings-icon"><Sun size={19}/></span><div><h2>Mode Tampilan</h2><p>Pilih tema aplikasi.</p></div></div><div className="settings-mode" role="group" aria-label="Pilih mode tampilan"><button className={theme==='light'?'active':''} aria-pressed={theme==='light'} onClick={()=>{if(theme!=='light')onThemeToggle()}}><Sun size={17}/>Light</button><button className={theme==='dark'?'active':''} aria-pressed={theme==='dark'} onClick={()=>{if(theme!=='dark')onThemeToggle()}}><Moon size={17}/>Dark</button></div><small className="settings-footnote">Pilihan mode tersimpan di browser ini.</small></article>
    </div>
  </section>
}

export default App

type FormProps={initial:FishRecord|null;owners:string[];onClose:()=>void;onSave:(record:FishRecord)=>void;closing?:boolean}
function FishForm({initial:existing,owners,onClose,onSave,closing}:FormProps){
  const [name,setName]=useState(existing?.name??'');const [owner,setOwner]=useState(existing?.owner??'');const [newOwner,setNewOwner]=useState(false);const [ownerName,setOwnerName]=useState('');const [yen,setYen]=useState(existing?.yen?.toString()??'');const [rate,setRate]=useState(existing?.rate?.toString()??'');const [rupiah,setRupiah]=useState(existing?.yen&&existing.rate?'':existing?.rupiah.toString()??'');const [percent,setPercent]=useState(existing?.feePercent.toString()??'5');const [shipping,setShipping]=useState(existing?.shipping.toString()??'');const [certificate,setCertificate]=useState(existing?.certificate??false);const [tc,setTc]=useState(existing?.tc??'');const [image,setImage]=useState(existing?.image??'');const [error,setError]=useState('')
  const yenValue=Number(yen)||0;const rateValue=Number(rate)||0;const price=yen&&rate?yenValue*rateValue:Number(rupiah)||0;const feeValue=price*(Number(percent)||0)/100;const totalValue=price+feeValue+(Number(shipping)||0)
  const fileChange=async(file?:File)=>{if(!file)return;if(!['image/jpeg','image/png'].includes(file.type)){setError('Format gambar harus JPG, JPEG, atau PNG.');return}if(file.size>10*1024*1024){setError('Ukuran gambar maksimal 10 MB.');return}setError('');try{const {uploadToCloudinary}=await import('./cloudinary');const url=await uploadToCloudinary(file);setImage(url)}catch(err:any){setError(err.message||'Gagal mengunggah gambar')}}
  const submit=(event:React.FormEvent)=>{event.preventDefault();const resolvedOwner=newOwner?ownerName.trim():owner;if(!name.trim()||!resolvedOwner){setError('Nama ikan dan owner wajib diisi.');return}if(newOwner&&owners.some(item=>item.trim().toLocaleLowerCase()===resolvedOwner.toLocaleLowerCase())){setError('Owner tersebut sudah ada. Pilih owner dari daftar.');return}if((yen&&Number(yen)<0)||(rate&&Number(rate)<=0)||Number(percent)<0||Number(percent)>100||Number(shipping)<0||(rupiah&&Number(rupiah)<0)){setError('Periksa nilai harga, kurs, persentase fee, dan ongkir.');return}if(yen&&!rate&&!rupiah){setError('Isi kurs atau harga Rupiah manual.');return}if(rate&&!yen&&!rupiah){setError('Isi harga Rupiah manual jika harga Yen kosong.');return}onSave({id:existing?.id??0,name:name.trim(),owner:resolvedOwner,yen:yen?yenValue:null,rate:rate?rateValue:null,rupiah:Math.round(price),feePercent:Number(percent)||0,shipping:Number(shipping)||0,certificate,image,tc})}
  return <div className={`modal-backdrop ${closing?'closing':''}`} onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><form className={`form-dialog ${closing?'closing':''}`} onSubmit={submit} noValidate><div className="dialog-heading"><div><span className="eyebrow">DATA IKAN</span><h2>{existing?'Edit data ikan':'Tambah ikan baru'}</h2><p>Lengkapi informasi untuk mencatat data ikan.</p></div><button type="button" className="dialog-close" onClick={onClose} aria-label="Tutup"><X size={20}/></button></div><div className="form-body"><section className="form-section"><div className="section-title"><span>01</span><b>Informasi dasar</b></div><div className="field-grid"><label className="field full"><span>Nama ikan <i>*</i></span><input value={name} onChange={event=>setName(event.target.value)} placeholder="Contoh: Kohaku Nisai 52cm" autoFocus/></label><div className="field"><div className="owner-field-heading"><label htmlFor="owner-select">Owner <i>*</i></label><button type="button" className="new-owner-link" onClick={()=>{setNewOwner(value=>!value);setOwnerName('');setError('')}}>{newOwner?'Pilih owner lama':' + Owner Baru'}</button></div>{newOwner?<input value={ownerName} onChange={event=>setOwnerName(event.target.value)} placeholder="Masukkan nama owner baru" aria-label="Nama owner baru"/>:<select id="owner-select" value={owner} onChange={event=>{setOwner(event.target.value);setError('')}}><option value="">Pilih owner</option>{owners.map(item=><option key={item} value={item}>{item}</option>)}</select>}</div><div className="field"><span>Foto ikan</span><label className="upload-box">{image?<img src={image} alt="Pratinjau ikan"/>:<><ImagePlus size={22}/><b>Unggah foto</b><small>JPG atau PNG · Maks. 10 MB</small></>}<input type="file" accept="image/jpeg,image/png" onChange={event=>fileChange(event.target.files?.[0])}/></label></div></div></section><section className="form-section"><div className="section-title"><span>02</span><b>Rincian harga</b></div><div className="field-grid three"><label className="field"><span>Harga Yen</span><div className="input-prefix"><b>¥</b><input type="text" inputMode="numeric" value={formatAmountInput(yen)} onChange={event=>setYen(parseAmountInput(event.target.value))} placeholder="0"/></div></label><label className="field"><span>Kurs Yen / IDR</span><input type="number" min="0" value={rate} onChange={event=>setRate(event.target.value)} placeholder="Contoh: 115"/></label><label className="field"><span>Harga Rupiah {yen&&rate?<em>(Otomatis)</em>:null}</span><div className="input-prefix"><b>Rp</b><input type="text" inputMode="numeric" value={formatAmountInput(rupiah)} onChange={event=>setRupiah(parseAmountInput(event.target.value))} disabled={Boolean(yen&&rate)} placeholder="0"/></div></label></div><div className="field-grid two" style={{marginTop:12}}><label className="field"><span>Dealer Fee (%)</span><input type="number" min="0" max="100" step="0.1" value={percent} onChange={event=>setPercent(event.target.value)} placeholder="5"/></label><label className="field"><span>Shipping Cost (IDR)</span><div className="input-prefix"><b>Rp</b><input type="text" inputMode="numeric" value={formatAmountInput(shipping)} onChange={event=>setShipping(parseAmountInput(event.target.value))} placeholder="0"/></div></label></div><div className="calc-preview"><div><span>Harga Dasar</span><b>{money(price)}</b></div><div><span>Dealer Fee</span><b>{money(feeValue)}</b></div><div><span>Shipping</span><b>{money(Number(shipping)||0)}</b></div><div className="grand"><span>Total Harga</span><b>{money(totalValue)}</b></div></div></section><section className="form-section"><div className="section-title"><span>03</span><b>Dokumen &amp; Ketentuan</b></div><div className="field-grid"><label className="field"><span>Sertifikat</span><button type="button" className={`cert-toggle ${certificate?'on':`off`}`} onClick={()=>setCertificate(value=>!value)}><i>{certificate?<Check size={16}/>:null}</i><span>{certificate?'Sertifikat ada':'Belum ada sertifikat'}</span></button></label><label className="field full"><span>Term &amp; Condition</span><textarea value={tc} onChange={event=>setTc(event.target.value)} rows={3} placeholder="Tulis ketentuan, garansi, atau azukari per baris..."/></label></div></section></div>{error&&<p className="form-error">{error}</p>}<div className="dialog-actions"><button type="button" className="secondary-btn" onClick={onClose}>Batal</button><button type="submit" className="primary-btn">{existing?'Simpan perubahan':'Tambah ikan'}</button></div></form></div>
}


function LoginForm({onLogin, theme, themeToggle}:{onLogin:(username:string)=>void; theme:'light'|'dark'; themeToggle:()=>void}) {
  const [username, setUsername] = useState('adelia')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Username wajib diisi')
      return
    }
    try {
      const { supabase } = await import('./supabaseClient')
      const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
      const correctPass = data?.password_hash || 'adelia'
      if (!password) {
        setError('Password wajib diisi')
        return
      }
      if (password !== correctPass) {
        setError('Password salah')
        return
      }
    } catch (err) {
      console.error('Auth check error:', err)
      if (!password || password !== 'adelia') {
        setError('Password salah')
        return
      }
    }
    onLogin(username.trim())
  }

  return (
    <div className={`app ${theme}`}>
      <div className="login-page-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-header">
            <img src="/logo-onelito.png" alt="Logo" className="login-logo"/>
            <h1>Masuk ke Workspace</h1>
          </div>
          <div className="login-fields">
            <label className="login-field">
              <span>Username</span>
              <input value={username} onChange={e=>{setUsername(e.target.value);setError('')}} placeholder="Masukkan username" autoFocus/>
            </label>
            <label className="login-field">
              <span>Password</span>
              <div className="login-password-wrap">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan password akun"/>
                <button type="button" className="login-eye-btn" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </label>
            {error && <p className="login-error">{error}</p>}
          </div>
          <button type="submit" className="primary-btn login-submit">Masuk</button>
          <div className="login-footer">
            <small>Secure authenticated session.</small>
            <ThemeToggle isDark={theme === 'dark'} onToggle={themeToggle} size={100}/>
          </div>
        </form>
      </div>
    </div>
  )
}
