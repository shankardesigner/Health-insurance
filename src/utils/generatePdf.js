// services/reportGenerator.js

import jsPDF from "jspdf";
import "jspdf-autotable";
import { applyPlugin } from "jspdf-autotable";
import { Chart } from "chart.js";

applyPlugin(jsPDF);

const generatePDF = (claims, results, totals) => {
	try {
		// initialize jsPDF
		const doc = new jsPDF();

		// Prepare Cost Modeling Data
		const claimsColumn = ["", "Budget", "Actual", "Proj.", "Savings"];
		const claimsRows = [];

		claims.forEach((claim) => {
			const claimData = [
				claim.serviceCategoryName,
				formatCurrency(claim.pmPmBenchMark),
				formatCurrency(claim.pmPm),
				formatCurrency(claim.pmPmProjected),
				formatCurrency(claim.pmPmSavings),
			];
			claimsRows.push(claimData);
		});

		// Prepare total table
		const totalRows = [];
		totals.forEach((total) => {
			const totalData = [
				total.amountTypeName,
				"PMPM",
				formatCurrency(total.pmPm),
				formatTotalCurrency(total.totalAmount),
			];
			totalRows.push(totalData);
		});

		// Prepare Results data
		const resultColumns = ["", "PMPM", "Total"];
		const resultRows = [];
		results.forEach((result) => {
			const pmPmResult =
				result?.displayDataType == "pct"
					? formatPercentCurrency(result.pmPm)
					: formatCurrency(result.pmPm);

			const totalResult =
				result?.displayDataType == "pct"
					? formatPercentCurrency(result.totalAmount)
					: formatTotalCurrency(result.totalAmount);
			const resultData = [result.amountTypeName, pmPmResult, totalResult];
			resultRows.push(resultData);
		});

		// Get Logo Image
		var image = new Image();
		image.src = "/nemo-logo.jpg";

		// Add Logo to pdf
		doc.addImage(image, "JPG", 15, 15, 80, 20);

		// Construct Cost Modeling table
		doc.text("Cost Modeling", 14, 50);

		doc.autoTable({
			head: [claimsColumn],
			styles: {
				halign: "right",
			},
			body: claimsRows,
			columnStyles: { 0: { halign: "left" } },
			startY: 55,
		});

		// Construct totals table
		doc.autoTable({
			body: totalRows,
			startY: doc.lastAutoTable.finalY + 10,
			styles: {
				halign: "right",
			},
			columnStyles: { 0: { halign: "left" }, 1: { halign: "left" } },
		});

		// Construct Results table
		doc.text("Results", 14, doc.lastAutoTable.finalY + 20);
		doc.autoTable({
			head: [resultColumns],
			body: resultRows,
			styles: {
				halign: "right",
			},
			columnStyles: { 0: { halign: "left" } },
			startY: doc.lastAutoTable.finalY + 25,
		});

		// Generate graph
		// const claimChart = generateChart(doc);
		// doc.addImage(claimChart, 'JPEG', 15, 200, 100, 150);
		// Generate filename and save
		const date = Date().split(" ");
		const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
		doc.save(`report_${dateStr}.pdf`);
	} catch (error) {}
};

const generateChart = () => {
	var data = {
		datasets: [
			{
				label: "My First Dataset",
				data: [65, 59, 80, 81, 56, 55, 40],
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 159, 64, 0.2)",
					"rgba(255, 205, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(201, 203, 207, 0.2)",
				],
				borderColor: [
					"rgb(255, 99, 132)",
					"rgb(255, 159, 64)",
					"rgb(255, 205, 86)",
					"rgb(75, 192, 192)",
					"rgb(54, 162, 235)",
					"rgb(153, 102, 255)",
					"rgb(201, 203, 207)",
				],
				borderWidth: 1,
			},
		],
	};
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", "graphOne");

	var context = canvas.getContext("2d");
	context.fillStyle = "white";
	document.body.appendChild(canvas);

	new Chart(context, {
		type: "bar",
		data: data,
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	});

	var graphedContent = document.querySelector("#graphOne");

	return graphedContent.toDataURL("image/jpeg", 1.0);
};

const formatCurrency = (currency) => {
	const fixedNumber = Number(currency).toFixed(2);
	console.log("fixedNumber", fixedNumber);

	return `${numberWithCommas(fixedNumber)}`;
};

const formatTotalCurrency = (currency) => {
	const fixedNumber = Number(currency).toFixed(0);
	console.log("fixedNumber", fixedNumber);

	return `${numberWithCommas(fixedNumber)}`;
};

const formatPercentCurrency = (currency) => {
	const percentNumber = Number(currency).toFixed(2);
	return percentNumber + "%";
};

const numberWithCommas = (x) => {
	if (x < 0) {
		return (
			"-$" +
			Math.abs(x)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		);
	}
	return "$" + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default generatePDF;
