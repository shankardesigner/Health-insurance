/**
 * @description extract the stop loss input value from the array
 * @param {string} category {serviceCategory} ipOnly|ipOp|ipOpAndIp
 * @param {string} key objectKey name pmpm|totalPremium|netExpense
 * @param {[]} arr ServiceModelingArray
 * @returns string
 */
export const extractValue = (serviceCategory, key, arr = []) => {
	if (!arr) return "";
	const value =
		arr.find((item) => item.serviceCategory === serviceCategory) || {};
	return value ? value[key] || "" : "";
};

/**
 * @description input change handler for specific stop loss input and premiums input
 * @param {ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>} event HTMLInputElement or HTMLTextAreaElement
 * @param {[]} arr ServiceModelingArray
 * @param {Function} persistFn Persist util function eg: useState
 * @param {Function} debounceFn Debounce util function
 * @param {string} category {serviceCategory}
 * @param {number} modelId
 * @returns void
 */
export const handleStopLossTabInputChange = (
	event,
	arr,
	persistFn,
	debounceFn,
	categoryType,
	modelId
) => {
	const target = event.target;
	const name = target.name;
	const value = target.value;
	const serviceCategory = name.split("_")[0];
	const objectKey = name.split("_")[1];

	//if (!RegExp("^[0-9]*$").test(value)) return;
	let pattern = /^\d+\.?\d*$/;

	if (isNaN(Number(target.value))) return;
	if (!pattern.test(Number(target.value))) return;

	const isExists = arr.find((item) => item.serviceCategory === serviceCategory);

	if (isExists) {
		const newArr = [...arr].map((item) => {
			if (item.serviceCategory === serviceCategory) {
				return {
					...item,
					[objectKey]: value,
				};
			}
			return item;
		});

		//debounceFn(newArr);
		persistFn(newArr);
		return;
	}

	const payload = [
		...arr,
		{ categoryType, serviceCategory, modelId, [objectKey]: value },
	];
	//debounceFn(payload);
	persistFn(payload);
};
