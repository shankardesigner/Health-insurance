import React, { useEffect, useState } from "react";
import styles from "./transiton.module.css";

const Transition = ({ value, factor }) => {
	const [isSpinning, setIsSpinning] = useState(true);

	const spin = () => {
		// without setTimeout() it doesn't work
		window.setTimeout(() => setIsSpinning(false), 500);
	};

	useEffect(() => {
		setIsSpinning(true);
	}, [value]);

	if (!value || !factor) return null;

	const amount = Number(Number(value || 0) * factor).toFixed(2);

	const amountWithCommas = amount
		? amount < 0
			? "-$" +
			  Math.abs(amount)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			: "$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		: "-";

	return (
		<p
			className={isSpinning ? styles.spinning : ""}
			onAnimationStart={spin}
			style={{
				position: "absolute",
				bottom: -8,
				right: 20,
				fontSize: 10,
			}}
		>
			{amountWithCommas}
		</p>
	);
};

export default Transition;
