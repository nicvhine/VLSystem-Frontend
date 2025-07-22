'use client';

import { useState } from 'react';

export default function useProfilePic() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [previewPic, setPreviewPic] = useState<string | null>(null);
  const [originalPic, setOriginalPic] = useState<string | null>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreviewPic(previewURL);
    setIsUploadingPic(true);
  };

  const handleSaveProfilePic = async () => {
    if (!previewPic) return;

    const fileInput = document.getElementById('profileUpload') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    const userId = localStorage.getItem('userId');
    try {
      const res = await fetch(`http://localhost:3001/users/${userId}/upload-profile`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.profilePic) {
        const fullUrl = `http://localhost:3001${data.profilePic}`;
        setProfilePic(fullUrl);
        setOriginalPic(fullUrl);
        localStorage.setItem('profilePic', fullUrl);
        setIsUploadingPic(false);
        setPreviewPic(null);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleCancelUpload = () => {
    setPreviewPic(null);
    setIsUploadingPic(false);
  };

  return {
    profilePic,
    setProfilePic,
    previewPic,
    setPreviewPic,
    originalPic,
    setOriginalPic,
    isUploadingPic,
    setIsUploadingPic,
    handleFileChange,
    handleSaveProfilePic,
    handleCancelUpload,
  };
}