import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { useEffect, useMemo, useState } from "react";
// import Link from "@mui/material/Link";
// import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { NavigateNextOutlined } from "@material-ui/icons";
import { Link, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectModelInfo } from "@slices/clientModelSlice";

const useStyles = makeStyles((theme) => ({
	activeLink: {
		color: theme.palette.primary.main,
		textTransform: "capitalize",
	},
	inactiveLinks: {
		color: theme.palette.primary.main,
		opacity: 0.5,
		cursor: "pointer",
		textTransform: "capitalize",
	},
}));

const breadCrumbs = {
	Resultsclaims: "Cost Modeling",
	Newmodel: "New Model",
	riskModeling: "Risk Modeling",
};

const _defaultGetDefaultTextGenerator = (path) => {
	// TODO: need to work on this
	const value =
		path.charAt(0).toUpperCase() + path.replace(/[^a-zA-Z ]/g, "").slice(1);
	if (breadCrumbs.hasOwnProperty(value)) {
		return breadCrumbs[value];
	}
	return value;
};

export default function NemoBreadcrumbs({
	getDefaultTextGenerator = _defaultGetDefaultTextGenerator,
}) {
	// Gives us ability to load the current route details
	const router = useRouter();

	// Two things of importance:
	// 1. The addition of getDefaultTextGenerator in the useMemo dependency list
	// 2. getDefaultTextGenerator is now being used for building the text property
	const breadcrumbs = useMemo(
		function generateBreadcrumbs() {
			const asPathWithoutQuery = router.asPath.split("?")[0];
			const asPathNestedRoutes = asPathWithoutQuery
				.split("/")
				.filter((v) => v.length > 0 && isNaN(v) && v !== "dashboard");

			const crumblist = asPathNestedRoutes.map((subpath, idx) => {
				const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
				return {
					href,
					text: getDefaultTextGenerator(subpath.replace(/-/g, " "), href),
				};
			});

			// return [{ href: "/", text: "Admin" }, ...crumblist];
			return crumblist;
		},
		[router.asPath, getDefaultTextGenerator]
	);
	return (
		<Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextOutlined />}>
			{/*
        Iterate through the crumbs, and render each individually.
        We "mark" the last crumb to not have a link.
      */}
			{breadcrumbs.map((crumb, idx) => (
				<Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
			))}
		</Breadcrumbs>
	);
}

// Each individual "crumb" in the breadcrumbs list
function Crumb({ text, href, last = false }) {
	const router = useRouter();
	const classes = useStyles();
	const modelInfo = useSelector(selectModelInfo);
	const [tempText, setTempText] = useState(text);

	useEffect(() => {
		if (
			text.toLowerCase() === "new model" ||
			text.toLowerCase() === "editmodel"
		) {
			setTempText(modelInfo || "");
		}
	}, [modelInfo]);

	useEffect(() => {
		if (text === "Reporting") {
			setTempText(breadCrumbs.riskModeling);
		}
	}, [text]);

	// The last crumb is rendered as normal text since we are already on the page
	if (last) {
		return (
			<span variant="h2" className={classes.activeLink}>
				{tempText}
			</span>
		);
	}

	// All other crumbs will be rendered as links that can be visited
	return (
		<Link
			underline="hover"
			onClick={() => {
				router.push(href);
			}}
		>
			<span variant="h2" className={classes.inactiveLinks}>
				{tempText}
			</span>
		</Link>
	);
}
