import React, { useState, useRef } from 'react';
import { useMates } from '../../context/MatesContext';
import { PlayerRole } from '../../types/cricket';
import { IconUsers, IconTrash, IconCamera, IconImage } from '../icons/SvgIcons';
import { resizeAndCompressImage } from '../../utils/imageUtils';
import CameraModal from '../modals/CameraModal';
import styles from './MatesDatabase.module.css';

export default function MatesDatabase() {
  const { mates, matesDispatch } = useMates();
  
  const [name, setName] = useState('');
  const [role, setRole] = useState<PlayerRole>('batsman');
  const [photo, setPhoto] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    matesDispatch({ type: 'ADD_MATE', payload: { name, role, photo } });
    setName('');
    setPhoto('');
  };

  const uploadToSupabase = async (base64String: string) => {
    try {
      setIsUploading(true);
      const { supabase } = await import('../../lib/supabase');
      
      // Convert base64 to Blob
      const byteString = atob(base64String.split(',')[1]);
      const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      const fileName = `player_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('Player_name')
        .upload(fileName, blob, { contentType: 'image/jpeg' });
        
      if (error) throw error;
      
      const { data: publicData } = supabase.storage
        .from('Player_name')
        .getPublicUrl(fileName);
        
      setPhoto(publicData.publicUrl);
    } catch (err) {
      console.error('Failed to upload to Supabase:', err);
      alert('Failed to upload photo. Check your Supabase Storage policies!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await resizeAndCompressImage(file);
        setPhoto(base64); // Temporary local preview
        await uploadToSupabase(base64);
      } catch (err) {
        console.error('Image compression failed', err);
      }
    }
  };

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        <IconUsers size={20} className={styles.icon} />
        <h3 className={styles.title}>Mates Database</h3>
        <span className={styles.count}>{mates.length}</span>
      </div>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <div className={styles.photoUpload}>
          <div className={styles.avatarPreview}>
            {photo ? <img src={photo} alt="Preview" /> : <IconUsers size={24} className={styles.placeholderIcon} />}
          </div>
          <div className={styles.uploadActions}>
            <button type="button" className={styles.actionBtn} onClick={() => fileInputRef.current?.click()}>
              <IconImage size={16} /> Gallery
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => setIsCameraOpen(true)}>
              <IconCamera size={16} /> Camera
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <input 
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Player Name" 
            className={styles.input}
          />
          <select 
            value={role} 
            onChange={e => setRole(e.target.value as PlayerRole)}
            className={styles.select}
          >
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All Rounder</option>
            <option value="wicket-keeper">Wicket Keeper</option>
          </select>
          <button type="submit" className={styles.addBtn} disabled={isUploading}>
            {isUploading ? 'Uploading Photo...' : 'Add Mate'}
          </button>
        </div>
      </form>

      <div className={styles.list}>
        {mates.map(m => (
          <div key={m.name} className={styles.listItem}>
            <div className={styles.itemInfo}>
              {m.photo ? (
                <img src={m.photo} alt={m.name} className={styles.avatar} />
              ) : (
                <div className={styles.textAvatar}>{m.name.substring(0,1)}</div>
              )}
              <div className={styles.nameGroup}>
                <span className={styles.name}>{m.name}</span>
                <span className={styles.role}>{m.role}</span>
              </div>
            </div>
            <button 
              className={styles.deleteBtn}
              onClick={() => matesDispatch({ type: 'DELETE_MATE', payload: m.name })}
              title="Remove Mate"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </div>

      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)}
        onCapture={async (base64) => {
          setPhoto(base64); // temporary local preview
          await uploadToSupabase(base64);
        }}
      />
    </div>
  );
}
