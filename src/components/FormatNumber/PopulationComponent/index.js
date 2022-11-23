import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	textComponent: {
		fontSize: "14px",
		lineHeight: "17px",
		color: "black",
		fontWeight: 500,
	},
	populationContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "flex-start",
	},
});

const PopulationComponent = function PopulationComponent({ children }) {
	const classes = useStyles();
	let population = Number(children);
	// let populationInK = population;
	// if(population >= 1000){
	//     populationInK = Number(population / 1000).toFixed(0) + 'k';
	// }

	if (population !== "-") {
		population = population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<span className={classes.populationContainer}>
			<img src="/human.svg" alt="human image" width="17" height="17" />
			<span className={classes.textComponent}>{population}</span>
		</span>
	);
};

export default PopulationComponent;
