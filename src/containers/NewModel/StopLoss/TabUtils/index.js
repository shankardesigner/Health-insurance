export default function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			style={{ paddingBottom: 0 }}
			role="tabpanel"
			hidden={value !== index}
			id={`nemo-tabpanel-${index}`}
			aria-labelledby={`nemo-tab-${index}`}
			{...other}
		>
			{value === index && <>{children}</>}
		</div>
	);
}
