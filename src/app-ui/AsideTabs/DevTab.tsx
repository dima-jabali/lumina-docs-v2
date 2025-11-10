"use client";

import { ArkErrors } from "arktype";
import { JsonEditor, githubLightTheme } from "json-edit-react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCurrentOrganization } from "@/hooks/fetch/use-fetch-organization-list";
import { useCreateOrganization } from "@/hooks/mutation/use-create-organization";
import { useUpdateOrganization } from "@/hooks/mutation/use-mutate-organization";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import { convertFileToBase64 } from "@/lib/convert-file-to-base-64";
import type { SupportedDocTypes } from "@/types/general-enums";
import {
	createISODate,
	createMessageUuid,
	createOrganizationUUID,
	MakeFileMetadataStep,
	MakeOrganization,
	type FileMetadataStep,
} from "@/types/organization";

export function DevTab() {
	const updateOrgLocally = useUpdateOrgLocally().mutate;
	const createOrg = useCreateOrganization();
	const updateOrg = useUpdateOrganization();
	const org = useCurrentOrganization();

	const formRef = useRef<HTMLFormElement>(null);

	async function handleCreateOrg() {
		const form = formRef.current;

		if (!form) return;

		const data = Object.fromEntries(new FormData(form).entries());

		const logoFile = data["put=org-logo"] as File | null;
		const name = data["post=org-name"] as string | null;

		console.log({ name, logoFile, data });

		if (!logoFile) return;

		const logo = await convertFileToBase64(logoFile);

		if (!name || !logo) return;

		const newOrg = MakeOrganization({
			uuid: createOrganizationUUID(),
			currentCategory: -1,
			currentStep: 1,
			categories: [],
			name,
			logo,
		});

		if (newOrg instanceof ArkErrors) {
			console.error("Error parsing org!", newOrg);

			return;
		}

		createOrg.mutate(newOrg);
	}

	async function handleUpdateOrg() {
		const form = formRef.current;

		if (!form || !org) return;

		const data = Object.fromEntries(new FormData(form).entries());

		const logoFile = data["put=org-logo"] as File;
		const logo = logoFile.name ? await convertFileToBase64(logoFile) : org.logo;
		const name = data["put=org-name"] as string | null;

		console.log({ name, logo, data, logoFile });

		if (!name || !logo) return;

		const notValidatedUpdatedOrg: typeof org = {
			...org,
			steps: org.steps,
			uuid: org.uuid,
			name,
			logo,
		};

		// Let's assign a new uuid to each message to make sure they are not repeated since
		// we can copy paste them:
		Object.values(notValidatedUpdatedOrg.steps).forEach((steps) => {
			steps.forEach((step) => {
				step.chatMessages.forEach((message) => {
					message.createdAt = createISODate();
					message.uuid = createMessageUuid();
				});
			});
		});

		const updatedOrg = MakeOrganization(notValidatedUpdatedOrg);

		if (updatedOrg instanceof ArkErrors) {
			console.error("Error parsing org!", updatedOrg);

			return;
		}

		updateOrg.mutate(updatedOrg);
	}

	function handleChangeStepsLocally(
		newData: unknown,
		docType: SupportedDocTypes,
	) {
		if (!Array.isArray(newData) || !org) return;

		for (const step of newData) {
			const out = MakeFileMetadataStep(step);

			if (out instanceof ArkErrors) {
				console.error("Error parsing steps!", out);

				toast.error(out.summary);

				return;
			}
		}

		const updatedOrg = { ...org };

		updatedOrg.steps[docType] = newData as Array<FileMetadataStep>;

		updateOrgLocally(updatedOrg);
	}

	return (
		<div className="flex flex-col gap-2 simple-scrollbar" key={org?.uuid}>
			<h3 className="text-lg font-semibold p-4">Dev</h3>

			<form className="flex flex-col gap-2 p-4" ref={formRef}>
				<div className="flex flex-col gap-2 bg-black/10 p-4 rounded-lg">
					<h3>Create new org</h3>

					<fieldset>
						<label htmlFor="post=org-name">Name</label>

						<Input id="post=org-name" name="post=org-name" />
					</fieldset>

					<fieldset>
						<label htmlFor="post=org-logo">Logo</label>

						<Input id="post=org-logo" name="post=org-logo" type="file" />
					</fieldset>

					<Button
						isLoading={createOrg.isPending}
						onClick={handleCreateOrg}
						type="button"
					>
						Create
					</Button>
				</div>

				<Separator />

				<div className="flex flex-col gap-2 bg-black/10 p-4 rounded-lg">
					<h3>Update current org</h3>

					<fieldset>
						<label htmlFor="put=org-name">Name</label>

						<Input
							id="put=org-name"
							name="put=org-name"
							defaultValue={org?.name}
						/>
					</fieldset>

					<fieldset>
						<label htmlFor="put=org-logo">Logo</label>

						<Input id="put=org-logo" name="put=org-logo" type="file" />
					</fieldset>

					<Separator />

					{Object.entries(org?.steps || {}).map(([key, value]) => (
						<fieldset key={key}>
							<label>Steps - {key}</label>

							<JsonEditor
								setData={(newData) =>
									handleChangeStepsLocally(newData, key as SupportedDocTypes)
								}
								className="text-primary w-full"
								collapseAnimationTime={0}
								theme={githubLightTheme}
								showCollectionCount
								showArrayIndices
								rootName="steps"
								restrictDrag
								data={value}
								indent={2}
							/>

							<Separator />
						</fieldset>
					))}

					<Button
						isLoading={updateOrg.isPending}
						onClick={handleUpdateOrg}
						type="button"
					>
						Update organization
					</Button>
				</div>
			</form>
		</div>
	);
}
