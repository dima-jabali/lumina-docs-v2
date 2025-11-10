import { Grid, Col } from "@tremor/react";

import { OutstandingAmounts } from "./OutstandingAmounts";
import { VendorSpendPareto } from "./VendorSpendPareto";
import { VendorAnomalies } from "./VendorAnomalies";
import { outstandingAmounts, vendorAnomalies, vendorSpend } from "./data";

export const VendorAnalysisTab: React.FC = () => {
	return (
		<div className="space-y-6">
			<Grid numItems={1} className="gap-6">
				<Col numColSpan={1}>
					<VendorSpendPareto data={vendorSpend} />
				</Col>
			</Grid>

			<Grid numItems={2} className="gap-6">
				<Col numColSpan={1}>
					<VendorAnomalies data={vendorAnomalies} />
				</Col>
				<Col numColSpan={1}>
					<OutstandingAmounts data={outstandingAmounts} />
				</Col>
			</Grid>
		</div>
	);
};
