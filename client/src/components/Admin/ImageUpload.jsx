import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

// Basic wrapper around native file input to look like drag & drop
const ImageUpload = ({ value, onChange, multiple = false, maxFiles = 1, maxSize = 5242880, accept = "image/jpeg, image/png, image/webp", circular = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // mock upload state

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    
    if (multiple && files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }

    const validFiles = Array.from(files).filter(f => {
      if (f.size > maxSize) {
        toast.error(`File ${f.name} is too large. Max size is ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // MOCK CLOUDINARY UPLOAD FOR NOW
    setIsUploading(true);
    try {
      // Simulate API call delay
      await new Promise(res => setTimeout(res, 1500));
      
      const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const newUrls = await Promise.all(validFiles.map(file => readFileAsDataURL(file)));
      
      if (multiple) {
        onChange([...(value || []), ...newUrls].slice(0, maxFiles));
      } else {
        onChange(newUrls[0]);
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (idxToRemove) => {
    if (multiple) {
      onChange(value.filter((_, idx) => idx !== idxToRemove));
    } else {
      onChange(null);
    }
  };

  const hasValue = multiple ? (value && value.length > 0) : !!value;

  return (
    <div style={{ width: '100%' }}>
      {(!hasValue || multiple) && (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--primary)' : '#ddd'}`,
            borderRadius: circular ? '50%' : '12px',
            padding: circular ? '0' : '32px',
            textAlign: 'center',
            background: isDragging ? 'rgba(27,67,50,0.05)' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: circular ? '120px' : '100%',
            height: circular ? '120px' : 'auto',
            margin: circular ? '0 auto 16px' : '0 0 16px',
            overflow: 'hidden'
          }}
          onClick={() => document.getElementById('file-upload-input').click()}
        >
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <Loader size={24} className="spin" />
              {!circular && <span style={{ fontSize: '14px', fontWeight: 600 }}>Uploading...</span>}
              <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
            </div>
          ) : (
            <>
              <UploadCloud size={circular ? 24 : 32} color={isDragging ? 'var(--primary)' : '#999'} style={{ marginBottom: circular ? '0' : '12px' }} />
              {!circular && (
                <>
                  <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--dark)' }}>
                    Drag & drop or click to select
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                    JPG, PNG, WEBP (Max {maxSize / 1024 / 1024}MB)
                  </p>
                </>
              )}
            </>
          )}
          <input 
            id="file-upload-input"
            type="file" 
            accept={accept}
            multiple={multiple}
            onChange={(e) => processFiles(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Previews */}
      {hasValue && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: circular ? '0' : '16px', justifyContent: circular ? 'center' : 'flex-start' }}>
          {multiple ? (
            value.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ position: 'relative', width: circular ? '120px' : '100%', height: circular ? '120px' : '200px', borderRadius: circular ? '50%' : '12px', overflow: 'hidden', margin: circular ? '0 auto' : '0' }}>
              <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                type="button"
                onClick={() => handleRemove()}
                style={{ position: 'absolute', top: circular ? '50%' : '8px', right: circular ? '50%' : '8px', transform: circular ? 'translate(50%, -50%)' : 'none', background: 'rgba(220,53,69,0.9)', color: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', opacity: circular ? 0 : 1, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => circular && (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => circular && (e.currentTarget.style.opacity = '0')}
                className={circular ? "circular-btn" : ""}
              >
                <X size={16} />
              </button>
              {circular && (
                <style>{`
                  div:hover > .circular-btn { opacity: 1 !important; }
                `}</style>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
