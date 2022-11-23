
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import styles from './editnemofactor.module.css';

const useStyles = makeStyles({
    modal: {
        backgroundColor: 'lightgreen'
    },
    dialogActions: {
        justifyContent: "space-between !important"
    }
});

export default function EditNemoFactor(props) {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { openModal, setModalOpen, rowData } = props;

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleModalApply = () => {
        
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            maxWidth={"md"}
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="responsive-dialog-title"
            BackdropProps={{ style: { backgroundColor: 'rgba(62, 63, 100, 0.9)' } }}
            PaperProps={{ style: { paddingLeft: '20px', paddingRight: '20px' } }}
            classes={{ paper: styles.dialogPaper }}
        >
            <DialogTitle className={styles.modalHeader} component="div" disableTypography={true}>{"title"}</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions classes={{ root: classes.dialogActions }}>
                <Button onClick={handleModalClose}
                    className={styles.greyButton}
                    fullWidth={true}
                >
                    Back
                </Button>
                <Button
                    className={styles.greenButton}
                    fullWidth={true}
                    onClick={handleModalApply}
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}