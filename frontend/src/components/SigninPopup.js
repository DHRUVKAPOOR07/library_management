import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Signin from './Signin';  // Import your Signin component
import { Button } from '@mui/material';

export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(true); // Open dialog immediately
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  // Disable body scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    //   document.body.style
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Reset on unmount
    };
  }, [open]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Login to Your Account"}
      </DialogTitle>
      <DialogContent>
        {/* Embed Signin Component here */}
        <Signin />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
