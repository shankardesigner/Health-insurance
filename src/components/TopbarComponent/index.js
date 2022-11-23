import NemoBreadcrumbs from "@components/NemoBreadcrumbs";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { Autocomplete, Skeleton } from "@material-ui/lab";
import makeStyles from "@material-ui/styles/makeStyles";
import { menuSelector } from "@slices/menuToggleSlice";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from '@auth0/nextjs-auth0';
import { removeUser, updateUser } from "@slices/profile";
import { selectUserProfile } from "@slices/profile/selectors";
import NemoLoader from "src/shared/NemoLoader";

const useStyles = makeStyles((theme) => ({
  topbarContainer: {
    backgroundColor: "#ffffff",
    boxShadow: "0px 1px 8px rgba(61, 62, 100, 0.1)",
    height: "70px",
    width: "100%",
    paddingLeft: "216px",
    paddingRight: "20px",
    position: "absolute",
    top: 0,
    zIndex: 1001,
    transition: "padding-left 0.3s ease-in-out",
  },
  largeAvatar: {
    width: "46px",
    height: "46px",
  },
  floatingSearch: { position: "absolute", top: "-4px", right: "0px" },
  drawerClose: {
    paddingLeft: theme.spacing(10),
  },
  inputWrapperBox: {
    width: "392px",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      width: 270,
    },
  },
}));

export default function Topbar({ patientList: usedPatients }) {
  const classes = useStyles();
  const { open } = useSelector(menuSelector);
  const { user, isLoading, error } = useUser();
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  // const [profile, setProfile] = useState(initProfile);
  // dropdown options 
  const router = useRouter();
  const [openSetting, setOpenSetting] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState('');
  const [anchorEl, setAnchorEl] = useState()

  const handleCloseSetting = () => {
    setOpenSetting(false);
  }

  const handleOpenSetting = (e) => {
    setAnchorEl(e.currentTarget)
    setOpenSetting(true);
  }

  const handleChangeSetting = (ev, value) => {
    setSelectedSetting(value);
  }

  useEffect(() => {
    if (selectedSetting === 'LOGOUT') {
        // dispatch(removeUser());
        localStorage.setItem('persist:nemo-admin', "{}");
        window.location.replace('/api/auth/logout'); // TODO: need to externalize
    }
  }, [selectedSetting]);

  useEffect(() => {
    if(user) {
      // setProfile(user);
      dispatch(updateUser(user));
    }
  }, [user]);

  if(isLoading || !user) return <NemoLoader />

  return (
    <Grid
      container
      direction="row"
      className={clsx([
        classes.topbarContainer,
        !open ? classes.drawerClose : "",
      ])}
    >
      <Grid item xs={5} container direction="row" alignItems="center">
        <NemoBreadcrumbs />
      </Grid>
      <Grid item xs={7} container direction="row">
        <Grid item xs container alignItems="center" justifyContent="flex-end">
          <Box marginRight={2} className={classes.inputWrapperBox}>
            {usedPatients.length !== 0 ? (
              <>
                <Autocomplete
                  freeSolo
                  id="patients-list"
                  disableClearable
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  options={usedPatients.map((p) => p)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoFocus={true}
                      fullWidth={true}
                      id="outlined-basic"
                      label="Search Patients or Doctors"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                <IconButton className={classes.floatingSearch}>
                  <img src={"/icons/search.svg"} />
                </IconButton>
              </>
            ) : (
              <>
                {/* <Skeleton height={50} /> */} {/* flashing search bar disabled */}
              </>

            )}
          </Box>
          <Box marginRight={2}>
            {/* <IconButton>
              <img src={"/icons/notification.svg"} />
            </IconButton> */}
          </Box>
          <Avatar
            variant="circular"
            src={profile.picture || `/avatars/sample-doctor.png`}
            className={classes.largeAvatar}
          />
          <Box marginLeft={2}>
            <Typography variant="h4" color="primary" style={{
              textTransform: 'capitalize'
            }}>
              {profile.nickname || profile.name}
            </Typography>
          </Box>
          <IconButton onClick={handleOpenSetting}>
            <ExpandMoreRoundedIcon color="disabled" />
          </IconButton>


          <div>
            <Menu
              anchorEl={anchorEl}
              keepMounted={false}
              open={openSetting}
              onClose={handleCloseSetting}
              className={classes.setting}
              PaperProps={{
                style: {
                  transform: 'translateX(10px) translateY(50px)',
                }
              }}
            >
              {/* <MenuItem onClick={handleCloseSetting}>My Account</MenuItem>
              <Divider variant="middle" /> */}
              <MenuItem onClick={(ev) => handleChangeSetting(ev, 'LOGOUT')}>Logout</MenuItem>
            </Menu>
          </div>

        </Grid>
      </Grid>
    </Grid>
  );
}
