import { AnimatePresence, motion } from "motion/react";

import { HandleShowChatMessagesWhenVisible } from "../HandleShowChatMessagesWhenVisible";
import { DebtToIncomeRatioChart } from "./charts/DebtToIncomeRatioChart";
import { LoanToValueChart } from "./charts/LoanToValueChart";
import { CollateralMarketabilityScore } from "./score-cards/CollateralMarketabilityScore";
import { CompositeApplicationRiskIndex } from "./score-cards/CompositeApplicationRiskIndex";
import { CreditBureauScore } from "./score-cards/CreditBureauScore";
import { DisposableIncomeBuffer } from "./score-cards/DisposableIncomeBuffer";
import { DocumentCompletenessScore } from "./score-cards/DocumentCompletenessScore";
import { EmploymentTenureScore } from "./score-cards/EmploymentTenureScore";
import { ExistingExposureToBank } from "./score-cards/ExistingExposureToBank";
import { ExtractionConfidenceScore } from "./score-cards/ExtractionConfidenceScore";
import { FraudAnomalyScore } from "./score-cards/FraudAnomalyScore";
import { IncomeStabilityScore } from "./score-cards/IncomeStabilityScore";
import { KYC_AML_RiskRating } from "./score-cards/KYC_AML_RiskRating";
import { OFWCurrencyRiskIndex } from "./score-cards/OFWCurrencyRiskIndex";
import { RealEstatePortfolioLimitBuffer } from "./score-cards/RealEstatePortfolioLimitBuffer";
import { SelfEmployedEarningsTrend } from "./score-cards/SelfEmployedEarningsTrend";

const ANIMATION_PROPS = {
	initial: { opacity: 0, y: "20%" },
	animate: { opacity: 1, y: 0 },
	transition: {
		type: "spring",
		duration: 0.4,
		delay: 0.4,
	},
} as const;

export function ApplicationScorecard() {
	return (
		<>
			<HandleShowChatMessagesWhenVisible />

			<AnimatePresence>
				<motion.section
					className="flex flex-col gap-8 relative"
					{...ANIMATION_PROPS}
				>
					<DebtToIncomeRatioChart />

					<LoanToValueChart />

					<IncomeStabilityScore />

					<EmploymentTenureScore />

					<DisposableIncomeBuffer />

					<CreditBureauScore />

					<ExistingExposureToBank />

					<SelfEmployedEarningsTrend />

					<OFWCurrencyRiskIndex />

					<CollateralMarketabilityScore />

					<DocumentCompletenessScore />

					<ExtractionConfidenceScore />

					<KYC_AML_RiskRating />

					<FraudAnomalyScore />

					<RealEstatePortfolioLimitBuffer />

					<CompositeApplicationRiskIndex />
				</motion.section>
			</AnimatePresence>
		</>
	);
}
