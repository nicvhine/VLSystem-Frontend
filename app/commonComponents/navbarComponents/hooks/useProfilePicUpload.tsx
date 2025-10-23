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
    if (!selectedFile) return;

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return alert('User not authenticated');

    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    try {
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
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.message);
    }
  };

  const handleRemoveProfilePic = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return alert('User not authenticated');

    try {
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
    } catch (err: any) {
      console.error('Remove error:', err);
      alert(err.message);
    }
  };

  return {
    previewPic,
    isUploading,
    handleFileChange,
    handleCancelUpload,
    handleSaveProfilePic,
    handleRemoveProfilePic,
  };
}
