/* eslint-disable react/prop-types */
import styles from "./sidebarmenuitem.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import Link from "@material-ui/core/Link";
import { Button, Tooltip, Zoom } from "@material-ui/core";
import { useRouter } from "next/router";
import NemoIcon from "@components/NewLayout/NemoIcon";
import { useSelector } from "react-redux";
import { menuSelector } from "@slices/menuToggleSlice";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
	dashboardMenuIcon: {
		width: "20px",
		height: "20px",
		marginRight: "5px",
		marginBottom: "3px",
	},

	menuText: {
		fontSize: "14px",
		color: "#6F7376",
	},
	activeButton: {
		backgroundColor: "#C2E4FF40",
		borderRadius: "10px 0px 0px 10px",

		"& path": {
			fill: "#06406D !important",
		},
	},
	activeButtonText: {
		color: "#06406D",
		fontWeight: "bold",
	},
	customToolTip: {
		// left: '-148px',
		// marginLeft: '-148px'
	},
}));

export default function SidebarMenuItem({ menuItem, customStyle }) {
	const classes = useStyles();
	const router = useRouter();
	const { icon, alt, text, subtext, path, IconComponent } = menuItem;
	const active = router.route === path;
	const menuOpen = useSelector(menuSelector);
	const [tooltipOpen, setTooltipOpen] = useState(menuOpen?.open);

	useEffect(() => {
		setTooltipOpen(menuOpen?.open);
	}, [menuOpen]);
	return <></>;
	// if (tooltipOpen) {
	//   return (
	//     <Button
	//       fullWidth
	//       className={clsx(
	//         styles.menuList,
	//         active ? classes.activeButton : "",
	//         customStyle ? customStyle : ""
	//       )}
	//       onClick={() => {
	//         active ? () => {} : router.push(path);
	//       }}
	//     >
	//       <Grid
	//         container
	//         direction="row"
	//         justifyContent="space-between"
	//         alignItems="center"
	//       >
	//         <Grid
	//           item
	//           xs={12}
	//           container
	//           direction="row"
	//           justifyContent="center"
	//           alignItems="center"
	//           className={styles.menuTextGrid}
	//         >
	//           <Grid
	//             item
	//             xs={3}
	//             container
	//             justifyContent="center"
	//             alignItems="center"
	//           >
	//             {IconComponent && <IconComponent />}
	//             {!IconComponent && (
	//               // <img
	//               //   src={icon}
	//               //   alt={alt}
	//               //   className={`${classes.dashboardMenuIcon} ${
	//               //     active ? classes.activeButtonText : ""
	//               //   }`}
	//               // />
	//               <NemoIcon icon={icon} />
	//             )}
	//           </Grid>
	//           <Grid item xs={9} container alignItems="center">
	//             <Typography
	//               className={`${classes.menuText} ${
	//                 active ? classes.activeButtonText : ""
	//               }`}
	//             >
	//               {text}
	//             </Typography>
	//           </Grid>
	//         </Grid>
	//       </Grid>
	//     </Button>
	//   );
	// } else {
	//   return (
	//     <Tooltip
	//       title={text}
	//       followcursor="true"
	//       placement="right-end"
	//       // TransitionComponent={Zoom}
	//       arrow
	//       className={styles.customTooltip}
	//     >
	//       <Button
	//         fullWidth
	//         className={clsx(
	//           styles.menuList,
	//           active ? classes.activeButton : "",
	//           customStyle ? customStyle : ""
	//         )}
	//         onClick={() => {
	//           active ? () => {} : router.push(path);
	//         }}
	//       >
	//         <Grid
	//           container
	//           direction="row"
	//           justifyContent="space-between"
	//           alignItems="center"
	//         >
	//           <Grid
	//             item
	//             xs={12}
	//             container
	//             direction="row"
	//             justifyContent="center"
	//             alignItems="center"
	//             className={styles.menuTextGrid}
	//           >
	//             <Grid
	//               item
	//               xs={12}
	//               container
	//               justifyContent="center"
	//               alignItems="center"
	//             >
	//               {IconComponent && <IconComponent />}
	//               {!IconComponent && (
	//                 // <img
	//                 //   src={icon}
	//                 //   alt={alt}
	//                 //   className={`${classes.dashboardMenuIcon} ${
	//                 //     active ? classes.activeButtonText : ""
	//                 //   }`}
	//                 // />
	//                 <NemoIcon icon={icon} />
	//               )}
	//             </Grid>
	//           </Grid>
	//         </Grid>
	//       </Button>
	//     </Tooltip>
	//   );
	// }
}
