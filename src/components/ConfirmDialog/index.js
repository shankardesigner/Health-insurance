import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
  } from '@material-ui/core';
  import { makeStyles } from '@material-ui/core/styles';
  import { Close } from '@material-ui/icons';

  const useStyles = makeStyles((theme) => ({
    cancelButton: {
        background: "#EFEFF0",
        color: '#3D3E64',
        borderRadius: 20,
        padding: '5px 30px',
        "&:hover": {
          background: "#EFEFF0",
        },
        titleText: {
          fontSize: 20,
          fontWeight: "bold",
        },
      },
    addButton: {
        background: "#3D3E64",
        borderRadius: 20,
        color: '#FFF',
        padding: '5px 30px',
        "&:hover": {
          background: "#3D3E64",
        },
        titleText: {
          fontSize: 20,
          fontWeight: "bold",
        },
      },
    title: {
        textAlign: 'center',
        padding: '20px 0px 0px 0px',
        color: '#3D3E64',
        '& h2': {
          fontSize: '20px !important',
        }
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0px'
    },
    content: {
        
    }
}))
  
  const ConfirmDialog = ({open, close, handleConfirm, title, subtitle}) => {
    const classes = useStyles();

    return (
      <Dialog 
        open={open} 
        maxWidth="sm" 
        BackdropProps={{ style: { backgroundColor: 'rgba(62, 63, 100, 0.9)' } }}
        PaperProps={{ style: { paddingLeft: '20px', paddingRight: '20px' } }}
        >
        <DialogTitle className={classes.title} style={{
          fontSize: '20px !important',
        }}>{title}</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent className={classes.content}>
          <Typography>{subtitle}</Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button className={classes.cancelButton} color="primary" onClick={close} variant="contained">
            Cancel
          </Button>
          <Button className={classes.addButton} color="secondary" onClick={handleConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmDialog;