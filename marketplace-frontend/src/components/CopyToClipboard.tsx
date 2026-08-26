import {IconButton, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import {useState} from 'react';

interface CopyToClipboardProps {
  text: string;
  size?: 'small' | 'medium';
}

export default function CopyToClipboard({text, size = 'small'}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Tooltip title={copied ? 'Скопировано!' : 'Копировать'}>
        <IconButton onClick={handleCopy} size={size}>
          {copied ? (
            <CheckIcon fontSize={size} color="success"/>
          ) : (
            <ContentCopyIcon fontSize={size}/>
          )}
        </IconButton>
      </Tooltip>
    </>
  );
}
