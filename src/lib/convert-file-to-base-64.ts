export function convertFileToBase64(file: File | null): Promise<string> {
	if (!file) {
		return Promise.reject("No file selected");
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = () => {
			if (typeof reader.result === "string") {
				// Remove the data URL prefix (e.g., "data:image/png;base64,")
				resolve(reader.result);
			} else {
				reject(new Error("FileReader result was not a string."));
			}
		};

		reader.onerror = (error) => {
			reject(error);
		};
	});
}
