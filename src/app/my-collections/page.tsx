"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Globe, Lock, Image as ImageIcon, X, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import AssetPreviewModal from "@/components/AssetPreviewModal";
import { useCollections } from "@/contexts/CollectionsContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Asset } from "@/types/asset";
import { MOCK_ASSETS } from "@/lib/mock-data";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { formatNumber } from "@/lib/api";

export default function MyCollectionsPage() {
  const { collections, createCollection, updateCollection, deleteCollection, isLoading } = useCollections();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);

  const selectedCollectionData = selectedCollection
    ? collections.find((c) => c._id === selectedCollection)
    : null;

  const selectedCollectionAssets = selectedCollectionData
    ? MOCK_ASSETS.filter((a) => selectedCollectionData.assets.includes(a._id))
    : [];

  const handleCreateCollection = () => {
    if (!newName.trim()) return;
    const id = createCollection(newName, newDescription || undefined, newIsPublic);
    setNewName("");
    setNewDescription("");
    setNewIsPublic(false);
    setIsCreating(false);
    setSelectedCollection(id);
  };

  const handleStartEdit = (collectionId: string) => {
    const collection = collections.find((c) => c._id === collectionId);
    if (collection) {
      setEditName(collection.name);
      setEditDescription(collection.description || "");
      setEditIsPublic(collection.isPublic);
      setIsEditing(collectionId);
    }
  };

  const handleSaveEdit = () => {
    if (!isEditing || !editName.trim()) return;
    updateCollection(isEditing, {
      name: editName,
      description: editDescription || undefined,
      isPublic: editIsPublic,
    });
    setIsEditing(null);
  };

  const handleDelete = (collectionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette collection ?")) {
      deleteCollection(collectionId);
      if (selectedCollection === collectionId) {
        setSelectedCollection(null);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <ImageIcon size={24} className="text-primary" />
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mes Collections</h1>
              <p className="text-slate-500">
                {collections.length} {collections.length > 1 ? "collections" : "collection"}
              </p>
            </div>
            <AnimatedButton
              variant="primary"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Nouvelle collection
            </AnimatedButton>
          </div>

          {/* Create Collection Modal */}
          <AnimatePresence>
            {isCreating && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                  onClick={() => setIsCreating(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed inset-4 md:inset-12 max-w-2xl mx-auto z-[9999] bg-white rounded-[2rem] p-8 overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-slate-900">Nouvelle collection</h2>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCreating(false)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </motion.button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                          Nom *
                        </label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Ma collection"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                          Description
                        </label>
                        <textarea
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Description de la collection..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="newPublic"
                          checked={newIsPublic}
                          onChange={(e) => setNewIsPublic(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="newPublic" className="text-sm font-bold text-slate-700">
                          Collection publique
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <AnimatedButton
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                        className="flex-1"
                      >
                        Annuler
                      </AnimatedButton>
                      <AnimatedButton
                        variant="primary"
                        onClick={handleCreateCollection}
                        className="flex-1"
                        disabled={!newName.trim()}
                      >
                        Créer
                      </AnimatedButton>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Collections Grid */}
          {collections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon size={32} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Aucune collection</h3>
                <p className="text-sm text-slate-500">
                  Créez votre première collection pour organiser vos assets favoris
                </p>
              </div>
              <AnimatedButton
                variant="primary"
                onClick={() => setIsCreating(true)}
                className="inline-flex"
              >
                <Plus size={16} />
                Créer une collection
              </AnimatedButton>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <motion.div
                  key={collection._id}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(255,107,0,0.15)] cursor-pointer"
                  onClick={() => setSelectedCollection(collection._id)}
                >
                  {/* Cover */}
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {collection.assets.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                        {MOCK_ASSETS.filter((a) => collection.assets.includes(a._id))
                          .slice(0, 4)
                          .map((asset, idx) => (
                            <div
                              key={asset._id}
                              className="relative aspect-square rounded-xl overflow-hidden"
                            >
                              <img
                                src={asset.thumbnailUrl || asset.url}
                                alt={asset.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <ImageIcon size={48} className="text-primary/30" />
                    )}
                    <div className="absolute top-4 right-4">
                      {collection.isPublic ? (
                        <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Globe size={10} />
                          Public
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-slate-900/60 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Lock size={10} />
                          Privé
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    {isEditing === collection._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm font-black"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none resize-none text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editIsPublic}
                            onChange={(e) => setEditIsPublic(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4"
                          />
                          <span className="text-xs font-bold text-slate-600">Public</span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEdit();
                            }}
                            className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold"
                          >
                            <Save size={12} className="inline mr-1" />
                            Sauvegarder
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditing(null);
                            }}
                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold"
                          >
                            <X size={12} />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {collection.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold">{collection.assets.length} assets</span>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(collection._id);
                              }}
                              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <Edit2 size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(collection._id);
                              }}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collection Detail Modal */}
      <AnimatePresence>
        {selectedCollectionData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
              onClick={() => setSelectedCollection(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-12 z-[9999] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">{selectedCollectionData.name}</h2>
                  {selectedCollectionData.description && (
                    <p className="text-sm text-slate-500">{selectedCollectionData.description}</p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCollection(null)}
                  className="p-3 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedCollectionAssets.length === 0 ? (
                  <div className="text-center py-20">
                    <ImageIcon size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Cette collection est vide</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {selectedCollectionAssets.map((asset) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        onClick={() => setPreviewAsset(asset)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AssetPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        onPurchase={() => setPreviewAsset(null)}
        onDownload={(asset) => {
          window.open(asset.url, "_blank");
        }}
      />
    </main>
  );
}
