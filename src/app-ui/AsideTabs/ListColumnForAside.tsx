import { useEffect } from "react";

import { useLuminaDashboardUuid } from "@/hooks/url/use-lumina-dashboard-uuid";
import { globalStore, type DashboardProject } from "@/contexts/luminaStore";

export function ListColumnForAside() {
	const [luminaDashboardUuid, setLuminaDashboardUuid] =
		useLuminaDashboardUuid();
	const dashboardList = globalStore.use.dashboardList();

	const hasProjectSelected =
		Boolean(luminaDashboardUuid) &&
		luminaDashboardUuid !== "undefined" &&
		dashboardList.some((p) => p.uuid === luminaDashboardUuid);

	// Set initial value of project to be the first project in the list or the one on the url.
	useEffect(() => {
		if (hasProjectSelected) return;

		const hasProjects = dashboardList.length > 0;
		const firstProject = dashboardList[0];

		if (!hasProjects || !firstProject) return;

		console.log("No project selected, setting first project", { firstProject });

		(async () => {
			await setLuminaDashboardUuid(firstProject.uuid);
		})();
	}, [dashboardList, hasProjectSelected, setLuminaDashboardUuid]);

	const handleGoToProject = async (project: DashboardProject) => {
		if (luminaDashboardUuid === project.uuid) return;

		await setLuminaDashboardUuid(project.uuid);
	};

	return (
		<ul className="flex flex-col p-2 max-h-full simple-scrollbar">
			{dashboardList.map((project) => {
				const isActive = project.uuid === luminaDashboardUuid;

				return (
					<li
						className="cursor-pointer w-full max-w-full button-hover rounded-lg flex items-center gap-1 text-primary justify-between text-sm flex-none data-[is-active=true]:bg-button-hover select-none"
						title={`Go to dashboard project: "${project.name}"`}
						data-is-active={isActive}
						key={project.uuid}
					>
						<button
							className="w-full max-w-[80%] h-full p-2 flex items-center text-left"
							onClick={() => handleGoToProject(project)}
						>
							{project.name}
						</button>
					</li>
				);
			})}

			{dashboardList.length === 0 ? (
				<div className="flex flex-col gap-3 text-xs items-center justify-center w-full h-full text-primary">
					<span>No projects on this organization!</span>
				</div>
			) : null}
		</ul>
	);
}
