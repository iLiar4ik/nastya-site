'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  PlusCircle,
  Folder,
  FolderOpen,
  FileText,
  Link as LinkIcon,
  Image,
  FileVideo,
  File,
  ChevronRight,
  ChevronDown,
  Upload,
  Trash2,
  Search,
} from 'lucide-react'

const TYPES = [
  { value: 'file', label: 'Файл', icon: File },
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'doc', label: 'Документ', icon: FileText },
  { value: 'image', label: 'Изображение', icon: Image },
  { value: 'video', label: 'Видео', icon: FileVideo },
  { value: 'link', label: 'Ссылка', icon: LinkIcon },
  { value: 'note', label: 'Заметка', icon: FileText },
]

type FolderItem = { id: number; parentId: number | null; name: string }
type MaterialItem = {
  id: number
  folderId: number | null
  title: string
  type: string
  subject: string | null
  category: string | null
  topic: string | null
  fileUrl: string | null
  fileId: number | null
  content: string | null
  tags?: string[]
}

function flattenTree(
  folders: FolderItem[],
  materials: MaterialItem[],
  parentId: number | null,
  depth: number,
  expanded: Set<number>
): Array<{ type: 'folder'; folder: FolderItem; depth: number } | { type: 'material'; material: MaterialItem; depth: number }> {
  const out: Array<{ type: 'folder'; folder: FolderItem; depth: number } | { type: 'material'; material: MaterialItem; depth: number }> = []
  const childFolders = folders.filter((f) => f.parentId === parentId).sort((a, b) => a.name.localeCompare(b.name))
  const childMaterials = materials.filter((m) => m.folderId === parentId).sort((a, b) => a.title.localeCompare(b.title))
  for (const folder of childFolders) {
    out.push({ type: 'folder', folder, depth })
    if (expanded.has(folder.id)) {
      out.push(...flattenTree(folders, materials, folder.id, depth + 1, expanded))
    }
  }
  for (const material of childMaterials) {
    out.push({ type: 'material', material, depth })
  }
  return out
}

export function MaterialsAdmin() {
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  useEffect(() => {
    const rootIds = folders.filter((f) => f.parentId === null).map((f) => f.id)
    if (rootIds.length > 0) {
      setExpanded((prev) => (prev.size === 0 ? new Set(rootIds) : prev))
    }
  }, [folders])
  const [filterSearch, setFilterSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [newFolderParentId, setNewFolderParentId] = useState<number | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [addMaterialFolderId, setAddMaterialFolderId] = useState<number | null>(null)
  const [form, setForm] = useState({
    title: '',
    type: 'file',
    fileUrl: '',
    content: '',
    subject: '',
    folderId: null as number | null,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const [fRes, mRes] = await Promise.all([
      fetch('/api/admin/materials/folders'),
      fetch('/api/admin/materials'),
    ])
    if (fRes.ok) setFolders(await fRes.json())
    if (mRes.ok) setMaterials(await mRes.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const subjects = useMemo(() => {
    const s = new Set<string>()
    materials.forEach((m) => m.subject && s.add(m.subject))
    return Array.from(s).sort()
  }, [materials])

  const filteredMaterials = useMemo(() => {
    let list = materials
    if (filterSearch.trim()) {
      const q = filterSearch.trim().toLowerCase()
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.topic && m.topic.toLowerCase().includes(q)) ||
          (m.subject && m.subject.toLowerCase().includes(q)) ||
          (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
      )
    }
    if (filterType) list = list.filter((m) => m.type === filterType)
    if (filterSubject) list = list.filter((m) => m.subject === filterSubject)
    return list
  }, [materials, filterSearch, filterType, filterSubject])

  const treeItems = useMemo(
    () => flattenTree(folders, filteredMaterials, null, 0, expanded),
    [folders, filteredMaterials, expanded]
  )

  function toggleFolder(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault()
    if (!newFolderName.trim()) return
    const res = await fetch('/api/admin/materials/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId: newFolderParentId, name: newFolderName.trim() }),
    })
    if (res.ok) {
      setNewFolderName('')
      setShowAddFolder(false)
      setNewFolderParentId(null)
      load()
    }
  }

  async function handleUploadFile(file: File) {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    setUploading(false)
    if (!res.ok) return null
    return res.json()
  }

  async function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    let fileId: number | null = null
    let fileUrl: string | null = form.type === 'link' ? form.fileUrl || null : null
    if (form.type === 'file' && selectedFile) {
      const uploaded = await handleUploadFile(selectedFile)
      if (uploaded) {
        fileId = uploaded.id
        fileUrl = uploaded.url
      }
    }
    const res = await fetch('/api/admin/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folderId: form.folderId ?? addMaterialFolderId,
        title: form.title.trim(),
        type: form.type,
        fileId,
        fileUrl,
        content: form.type === 'note' ? form.content || null : null,
        subject: form.subject || null,
      }),
    })
    if (res.ok) {
      setForm({ title: '', type: 'file', fileUrl: '', content: '', subject: '', folderId: null })
      setSelectedFile(null)
      setShowAddMaterial(false)
      setAddMaterialFolderId(null)
      load()
    }
  }

  async function handleDeleteFolder(id: number) {
    if (!confirm('Удалить папку и вложенные папки? Материалы останутся без папки.')) return
    const res = await fetch(`/api/admin/materials/folders/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setShowAddFolder(true)} variant="outline" size="sm">
          <Folder className="h-4 w-4 mr-2" />
          Новая папка
        </Button>
        <Button onClick={() => { setAddMaterialFolderId(null); setShowAddMaterial(true) }} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Добавить материал
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="pl-8 w-48 h-9"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm w-36"
        >
          <option value="">Все типы</option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm w-40"
        >
          <option value="">Все предметы</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {showAddFolder && (
        <Card className="border-primary/30">
          <CardContent className="pt-4">
            <form onSubmit={handleCreateFolder} className="flex flex-wrap items-end gap-3">
              <div>
                <Label className="text-xs">Папка</Label>
                <select
                  value={newFolderParentId ?? ''}
                  onChange={(e) => setNewFolderParentId(e.target.value === '' ? null : Number(e.target.value))}
                  className="mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm w-48"
                >
                  <option value="">Корень</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">Название папки *</Label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Новая папка"
                  className="mt-1 h-9 w-48"
                  required
                />
              </div>
              <Button type="submit" size="sm">Создать</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddFolder(false)}>Отмена</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showAddMaterial && (
        <Card className="border-primary/30">
          <CardContent className="pt-4">
            <form onSubmit={handleAddMaterial} className="space-y-3 max-w-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Папка</Label>
                  <select
                    value={form.folderId ?? addMaterialFolderId ?? ''}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value)
                      setForm((f) => ({ ...f, folderId: v }))
                      setAddMaterialFolderId(v)
                    }}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Без папки</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Предмет</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Математика"
                    className="mt-1 h-9"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Название *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Тип</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3"
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {form.type === 'file' && (
                <div>
                  <Label className="text-xs">Файл</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                      className="h-9"
                    />
                    {selectedFile && <span className="text-xs text-muted-foreground truncate max-w-[180px]">{selectedFile.name}</span>}
                    {uploading && <span className="text-xs text-muted-foreground">загрузка...</span>}
                  </div>
                </div>
              )}
              {form.type === 'link' && (
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={form.fileUrl}
                    onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1 h-9"
                  />
                </div>
              )}
              {form.type === 'note' && (
                <div>
                  <Label className="text-xs">Содержимое</Label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddMaterial(false)}>Отмена</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-0.5">
            {treeItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Нет материалов. Добавьте папку или материал.</p>
            ) : (
              treeItems.map((item) => {
                if (item.type === 'folder') {
                  const { folder, depth } = item
                  const isExp = expanded.has(folder.id)
                  return (
                    <div
                      key={`f-${folder.id}`}
                      style={{ paddingLeft: depth * 20 }}
                      className="flex items-center gap-1 py-1.5 px-2 rounded-md hover:bg-muted/60 group"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFolder(folder.id)}
                        className="p-0.5 rounded hover:bg-muted"
                      >
                        {isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      {isExp ? <FolderOpen className="h-5 w-5 text-amber-600" /> : <Folder className="h-5 w-5 text-amber-600" />}
                      <span className="font-medium text-sm flex-1">{folder.name}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-0.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => { setAddMaterialFolderId(folder.id); setShowAddMaterial(true) }}
                          title="Добавить материал сюда"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteFolder(folder.id)}
                          title="Удалить папку"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                }
                const { material, depth } = item
                const TypeIcon = TYPES.find((t) => t.value === material.type)?.icon ?? FileText
                return (
                  <div
                    key={`m-${material.id}`}
                    style={{ paddingLeft: 24 + depth * 20 }}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/60"
                  >
                    <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm flex-1 truncate">{material.title}</span>
                    {material.subject && (
                      <span className="text-xs text-muted-foreground shrink-0">{material.subject}</span>
                    )}
                    {material.fileUrl && (
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline shrink-0"
                      >
                        Открыть
                      </a>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
