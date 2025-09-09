import React from 'react';
import { Button } from '../../common/Button/Button';

export const PhotoUploader = ({ 
  photos, 
  setPhotos, 
  isTakingPhotos, 
  setIsTakingPhotos, 
  fileInputRef, 
  disabled,
  handleTakePhotos,
  handleSelectFromGallery,
  handleFileChange
}) => {
  return (
    <div className="form-group">
      <label>Фотографии</label>
      <div className="photo-buttons">
        <Button 
          type="button" 
          onClick={handleTakePhotos} 
          disabled={isTakingPhotos || disabled} 
          variant="primary"
          className="photo-btn"
        >
          {isTakingPhotos ? 'Съемка...' : 'Сделать фотографии'}
        </Button>
        
        <input 
          ref={fileInputRef} 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={disabled} 
        />
        
        <Button 
          type="button" 
          onClick={handleSelectFromGallery} 
          disabled={disabled} 
          variant="secondary"
          className="photo-btn"
        >
          Выбрать из галереи
        </Button>
      </div>

      {photos.length > 0 && (
        <div className="photos-preview">
          <div className="photos-header">
            <span>Загружено фотографий: {photos.length}</span>
            <Button 
              type="button" 
              onClick={() => setPhotos([])} 
              variant="danger"
              size="small"
            >
              Очистить все
            </Button>
          </div>
          <div className="photos-grid">
            {photos.map((file, index) => (
              <div key={index} className="photo-item">
                <img src={URL.createObjectURL(file)} alt={`Фото ${index + 1}`} />
                <Button 
                  type="button" 
                  onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))} 
                  variant="danger"
                  size="small"
                  className="remove-btn"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};