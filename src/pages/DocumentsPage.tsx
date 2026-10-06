import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { CondoDocument } from '../types';
import { formatDate } from '../utils/formatters';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import {
  FolderOpen,
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  FileCheck,
  Building2,
} from 'lucide-react';

const CATEGORIES: CondoDocument['category'][] = [
  'Prestação de contas',
  'Notas fiscais',
  'Contratos',
  'Atas',
  'Regulamento',
  'Convenção',
  'Orçamentos',
  'Comprovantes',
  'Outros',
];

export const DocumentsPage: React.FC = () => {
  const { role } = useAuth();
  const { documents, uploadDocument } = useCondo();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CondoDocument['category']>('Prestação de contas');
  const [fileName, setFileName] = useState('');

  const canManage = role === 'sindico' || role === 'admin';

  const filtered = documents.filter((doc) => {
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase()) && !doc.fileName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    return true;
  });

  const handleDownload = (doc: CondoDocument) => {
    showToast('Download do Documento', `Baixando ${doc.fileName}...`, 'success');
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFileName = fileName.trim() || `${title.replace(/\s+/g, '_')}.pdf`;

    const res = uploadDocument({
      title,
      category,
      fileName: finalFileName,
      fileSize: '2.4 MB',
      uploadedBy: role === 'admin' ? 'Administradora' : 'Síndico',
    });

    if (res.success) {
      showToast('Documento Arquivado!', res.message, 'success');
      setTitle('');
      setFileName('');
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Central de Documentos Digitais</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Repositório oficial de atas, convenção condominial, contratos e balancetes auditados.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Documento</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por título ou nome do arquivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
        >
          <option value="all">Todas as Categorias</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60 uppercase">
                  {doc.category}
                </span>
                <span className="text-[10px] text-slate-400 tabular-nums">{doc.fileSize}</span>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                    {doc.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-1 truncate">
                    {doc.fileName}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {formatDate(doc.uploadDate)} · {doc.uploadedBy}
              </span>

              <button
                onClick={() => handleDownload(doc)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Publicar Documento Oficial"
        subtitle="Armazene atas, notas ou contratos para transparência pública do condomínio"
        maxWidth="md"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Título do Documento *</label>
            <input
              type="text"
              required
              placeholder="Ex: Contrato de Manutenção de Elevadores 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CondoDocument['category'])}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nome do Arquivo PDF</label>
            <input
              type="text"
              placeholder="Ex: Contrato_Atlas_Schindler_2026.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Confirmar Publicação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
