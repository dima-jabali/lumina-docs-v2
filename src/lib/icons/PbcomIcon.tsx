import type { ComponentProps } from "react";

export const PbcomIcon: React.FC<ComponentProps<"svg">> = (props) => (
	<svg
		width="150"
		height="150"
		viewBox="0 0 150 150"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		{/* Red background with square edges */}
		<rect x="0" y="0" width="150" height="150" fill="#fe0000" rx="0" ry="0" />

		{/* White 'P' in semibold, centered */}
		<text
			x="75"
			y="90"
			fontFamily="Arial, sans-serif"
			fontSize="140"
			fontWeight="600"
			fill="white"
			textAnchor="middle"
			dominantBaseline="middle"
		>
			P
		</text>
	</svg>
);
