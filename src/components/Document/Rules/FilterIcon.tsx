import {
	Calendar,
	CalendarPlus,
	CalendarSync,
	Circle,
	CircleAlert,
	CircleCheck,
	CircleDashed,
	CircleDotDashed,
	CircleEllipsis,
	CircleX,
	FileText,
	ScanText,
	SignalHigh,
	SignalLow,
	SignalMedium,
	Tag,
	UserCircle,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Assignee, Fields, Labels, Priority, RuleType, Status } from "./enums";

export const FilterIcon = ({
	type,
}: {
	type: RuleType | Status | Assignee | Labels | Priority | Fields;
}) => {
	const className = (str?: string) =>
		cn(
			"size-3.5 group-hover:text-white group-data-[state=checked]:bg-white group-data-[state=checked]:text-white group-data-[state=checked]:border-white",
			str,
		);

	switch (type) {
		case Assignee.ANDREW_LUO:
			return (
				<Avatar className={className("rounded-full text-[9px] text-white")}>
					<AvatarFallback className="bg-orange-300">AL</AvatarFallback>
				</Avatar>
			);
		case Assignee.NO_ASSIGNEE:
			return <UserCircle className={className()} />;
		case RuleType.ASSIGNEE:
			return <UserCircle className={className()} />;
		case RuleType.LABELS:
			return <Tag className={className()} />;
		case RuleType.PRIORITY:
			return <SignalHigh className={className()} />;
		case RuleType.DUE_DATE:
			return <Calendar className={className()} />;
		case RuleType.CREATED_DATE:
			return <CalendarPlus className={className()} />;
		case RuleType.UPDATED_DATE:
			return <CalendarSync className={className()} />;
		case Status.BACKLOG:
			return <CircleDashed className={className("text-muted-foreground")} />;
		case Status.TODO:
			return <Circle className={className("text-primary")} />;
		case Status.IN_PROGRESS:
			return <CircleDotDashed className={className("text-yellow-400")} />;
		case Status.IN_REVIEW:
			return <CircleEllipsis className={className("text-green-400")} />;
		case Status.DONE:
			return <CircleCheck className={className("text-blue-400")} />;
		case Status.CANCELLED:
			return <CircleX className={className("text-muted-foreground")} />;
		case Priority.URGENT:
			return <CircleAlert className={className()} />;
		case Priority.HIGH:
			return <SignalHigh className={className()} />;
		case Priority.MEDIUM:
			return <SignalMedium className={className()} />;
		case Priority.LOW:
			return <SignalLow className={className()} />;
		case Labels.BUG:
			return <div className={className("bg-red-400 rounded-full size-2.5")} />;
		case Labels.FEATURE:
			return <div className={className("bg-blue-400 rounded-full size-2.5")} />;
		case Labels.HOTFIX:
			return (
				<div className={className("bg-amber-400 rounded-full size-2.5")} />
			);
		case Labels.RELEASE:
			return (
				<div className={className("bg-green-400 rounded-full size-2.5")} />
			);
		case RuleType.AMOUNT:
			return <span className="flex items-center justify-center size-2">$</span>;
		case RuleType.TEXT:
			return <ScanText className={className()} />;
		case RuleType.DOCUMENT_TYPE:
			return <FileText className={className()} />;

		default:
			return <CircleDashed className={className()} />;
	}
};
