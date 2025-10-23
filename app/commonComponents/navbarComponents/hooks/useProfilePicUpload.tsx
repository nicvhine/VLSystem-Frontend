'use client';
import { useState } from 'react';

interface UseProfilePicUploadParams {
  currentProfilePic: string;
  username: string;
}

export function useProfilePicUpload({ currentProfilePic, username }: UseProfilePicUploadParams) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPic, setPreviewPic] = useState<string>(currentProfilePic);
  const [isUploading, setIsUploading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPEG or PNG allowed for profile picture.');
        return;
      }
      setSelectedFile(file);
      setPreviewPic(URL.createObjectURL(file));
      setIsUploading(true);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewPic(currentProfilePic);
    setIsUploading(false);
  };

  const handleSaveProfilePic = async () => {
    if (!selectedFile) return { ok: false, error: 'No file selected' } as const;

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return { ok: false, error: 'User not authenticated' } as const;

    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    try {
      setIsWorking(true);
      const res = await fetch(`http://localhost:3001/users/${userId}/upload-profile`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setPreviewPic(data.profilePic.filePath);
      localStorage.setItem('profilePic', data.profilePic.filePath);
      window.dispatchEvent(new CustomEvent('profilePicUpdated', { detail: { profilePic: data.profilePic.filePath } }));

      setSelectedFile(null);
      setIsUploading(false);
      setIsWorking(false);
      return { ok: true, url: data.profilePic.filePath } as const;
    } catch (err: any) {
      console.error('Upload error:', err);
      setIsWorking(false);
      return { ok: false, error: err.message || 'Upload failed' } as const;
    }
  };

  const handleRemoveProfilePic = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return { ok: false, error: 'User not authenticated' } as const;

    try {
      setIsWorking(true);
      const res = await fetch(`http://localhost:3001/users/${userId}/remove-profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Remove failed');

      setPreviewPic('/idPic.jpg');
      localStorage.setItem('profilePic', '/idPic.jpg');
      window.dispatchEvent(new CustomEvent('profilePicUpdated', { detail: { profilePic: '/idPic.jpg' } }));

      setSelectedFile(null);
      setIsUploading(false);
      setIsWorking(false);
      return { ok: true } as const;
    } catch (err: any) {
      console.error('Remove error:', err);
      setIsWorking(false);
      return { ok: false, error: err.message || 'Remove failed' } as const;
    }
  };

  return {
    previewPic,
    isUploading,
    isWorking,
    handleFileChange,
    handleCancelUpload,
    handleSaveProfilePic,
    handleRemoveProfilePic,
  };
}
