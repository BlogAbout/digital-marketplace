import { useState, useRef } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
                                        images,
                                        onImagesChange,
                                        maxImages = 5,
                                      }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList) => {
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') && images.length + newImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target?.result as string);
          onImagesChange([...images, ...newImages]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />

      <Box
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          borderRadius: 4,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragging ? 'primary.light' : 'transparent',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.light',
          },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Нажмите или перетащите изображения сюда
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Максимум {maxImages} изображений
        </Typography>
      </Box>

      {images.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemove(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </motion.div>
          ))}
        </Stack>
      )}
    </Box>
  );
}
