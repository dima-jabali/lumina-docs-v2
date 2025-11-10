"use client";

import { Check, Plus, Trash } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { titleCase } from "scule";

import { useFileMetadata } from "@/hooks/fetch/use-fetch-document-metadata-list";
import {
	useCurrentOrganization,
	useIsStepCompleted,
} from "@/hooks/fetch/use-fetch-organization-list";
import { useMutateDocumentMetadata } from "@/hooks/mutation/use-mutate-document-metadata";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import { useForceRender } from "@/hooks/use-force-render";
import { hasErrorMessage, isObjectEmpty } from "@/lib/utils";
import type { Document, DocumentId } from "@/types/document";
import { SUPPORTED_DOC_TYPES, SupportedDocTypes } from "@/types/general-enums";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	INVOICE_NUMBER_FIELDS,
	INVOICE_STRING_FIELDS,
	INVOICE_TAXES_NUMBER_FIELDS,
	INVOICE_TAXES_STRING_FIELDS,
	LINE_ITEM_NUMBER_FIELDS,
	LINE_ITEM_STRING_FIELDS,
	makeDefaultInvoiceTax,
	makeDefaultLineItem,
	makeDefaultStateTaxes,
	makeDefaultW2Fields,
	W2_STATE_TAXES_NUMBER_FIELDS,
	W2_STATE_TAXES_STRING_FIELDS,
	W2_STRING_FIELDS,
} from "./utils";
import { useDocType } from "@/contexts/luminaStore";

export const ValidateMetadata: React.FC = () => {
	const updateOrgLocally = useUpdateOrgLocally().mutate;
	const mutateDocument = useMutateDocumentMetadata();
	const isStepCompleted = useIsStepCompleted(1);
	const fileMetadata = useFileMetadata();
	const forceRender = useForceRender();
	const org = useCurrentOrganization();
	const docType = useDocType();

	const changesRef = useRef<Partial<Document>>({});

	const isInvoice =
		fileMetadata?.file_type === SupportedDocTypes.Invoice &&
		!!fileMetadata.invoice;
	const isW2 =
		fileMetadata?.file_type === SupportedDocTypes.W2 && !!fileMetadata.w2;

	useLayoutEffect(() => {
		const initialValues: Partial<Document> = {};

		if (isInvoice) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			initialValues.invoice ??= {} as any;

			initialValues.invoice!.line_items =
				fileMetadata!.invoice!.line_items ?? [];
			initialValues.invoice!.taxes = fileMetadata!.invoice!.taxes;
		} else if (isW2) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			initialValues.w2 ??= {} as any;

			initialValues.w2!.state_taxes = fileMetadata!.w2!.state_taxes ?? [];
			initialValues.w2!.codes = fileMetadata!.w2!.codes ?? [];
		}

		changesRef.current = initialValues;

		forceRender();
	}, [fileMetadata, isInvoice, isW2, forceRender]);

	const handleSave = async () => {
		console.log({
			fileMetadata,
			changesRef: structuredClone(changesRef.current),
		});

		if (!fileMetadata) return;

		try {
			if (!isObjectEmpty(changesRef.current)) {
				changesRef.current.id = fileMetadata.id;

				await mutateDocument.mutateAsync(
					changesRef.current as Partial<Document> & { id: DocumentId },
				);
			}

			if (!org || !docType) return;

			const { currentStep } = org;

			const updatedOrg: typeof org = { ...org };

			const stepIndex = org.steps[docType].findIndex(
				(s) => s.step === currentStep,
			);

			if (stepIndex === -1) {
				console.error("Unable to find step", { stepIndex });
			} else {
				const step = org.steps[docType][stepIndex]!;
				const updatedStep = { ...step, isCompleted: true };

				updatedOrg.steps[docType][stepIndex] = updatedStep;

				const hasNextStep = org.steps[docType][stepIndex + 1];

				if (hasNextStep) {
					updatedOrg.currentStep = step.step + 1;
				}
			}

			updateOrgLocally(updatedOrg);
		} catch (error) {
			toast("Error saving metadata", {
				description: hasErrorMessage(error) ? error.message : "Unknown error",
			});

			console.error(error);
		}
	};

	return (
		<section
			className="flex flex-col items-center border border-border-smooth/20 gap-4 shadow-md shadow-black/20 p-6 rounded-md"
			aria-label="Edit file metadata"
		>
			<header className="flex items-center gap-4 justify-between w-full">
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-lg">Edit metadata</h2>
				</div>

				<div className="flex items-center gap-2">
					<Button
						icon={
							isStepCompleted ? <Check className="size-4 text-white" /> : null
						}
						isLoading={mutateDocument.isPending}
						title="Validate metadata"
						onClick={handleSave}
						variant="success"
						type="submit"
						size="sm"
					>
						Validat
						{isStepCompleted ? "ed" : mutateDocument.isPending ? "ing..." : "e"}
					</Button>
				</div>
			</header>

			<div className="flex flex-col items-start gap-4 w-full">
				<fieldset className="w-full">
					<label className="text-sm text-muted" htmlFor="file_name">
						File Name
					</label>

					<Input
						onChange={(e) => (changesRef.current.file_name = e.target.value)}
						defaultValue={fileMetadata?.file_name ?? ""}
						className="flex w-full"
						id="file_name"
					/>
				</fieldset>

				<fieldset className="w-full">
					<label className="text-sm text-muted" htmlFor="file_type">
						File Type
					</label>

					<Select
						onValueChange={(e) =>
							(changesRef.current.file_type = e as SupportedDocTypes)
						}
						defaultValue={fileMetadata?.file_type || undefined}
					>
						<SelectTrigger>
							<SelectValue
								className="placeholder:italic"
								placeholder="Select a document type"
							/>
						</SelectTrigger>

						<SelectContent>
							{SUPPORTED_DOC_TYPES.map((docType) => (
								<SelectItem key={docType} value={docType}>
									{titleCase(docType.toLowerCase())}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</fieldset>

				{isW2 ? (
					<>
						{W2_STRING_FIELDS.map((stringField) => (
							<fieldset className="w-full" key={stringField}>
								<label className="text-sm text-muted" htmlFor={stringField}>
									{titleCase(stringField)}
								</label>

								<Input
									onChange={(e) => {
										changesRef.current.w2 ??= makeDefaultW2Fields(
											fileMetadata.w2!.id,
										);

										changesRef.current.w2[stringField] = e.target.value;
									}}
									defaultValue={fileMetadata.w2![stringField] ?? undefined}
									className="flex w-full"
									id={stringField}
								/>
							</fieldset>
						))}

						{/* {W2_NUMBER_FIELDS.map((numberField) => (
							<fieldset className="w-full" key={numberField}>
								<label className="text-sm text-muted" htmlFor={numberField}>
									{titleCase(numberField)}
								</label>

								<Input
									onChange={(e) => {
										changesRef.current.w2 ??= makeDefaultW2Fields(fileMetadata.w2!.id);

										changesRef.current.w2[numberField] = e.target.valueAsNumber;
									}}
									defaultValue={fileMetadata?.w2?.[numberField] ?? undefined}
									className="flex w-full"
									id={numberField}
									type="number"
								/>
							</fieldset>
						))} */}

						<fieldset className="w-full my-2">
							<label className="text-sm text-muted">Codes</label>

							<table
								className="w-full rounded overflow-hidden"
								cellPadding="0"
								cellSpacing="0"
							>
								<thead>
									<tr className="bg-muted-strong text-muted">
										<th className="font-normal py-1">Code</th>

										<th className="font-normal py-1">Amount</th>

										<th></th>
									</tr>
								</thead>

								<tbody className="max-h-96 simple-scrollbar">
									{changesRef.current.w2?.codes?.map((codeField, index) => (
										<tr
											className="border-b border-border-smooth/25"
											key={index}
										>
											<td className="px-2">
												<input
													className="flex w-full bg-transparent border-none focus-visible:outline-none items-center justify-center text-center"
													defaultValue={codeField.code ?? undefined}
													onChange={(e) => {
														changesRef.current.w2!.codes ??= [];

														changesRef.current.w2!.codes[index] = {
															...codeField,
															code: e.target.value,
														};
													}}
												/>
											</td>

											<td className="px-2">
												<input
													className="flex w-full bg-transparent border-none focus-visible:outline-none items-center justify-center text-center"
													defaultValue={codeField.amount ?? undefined}
													type="number"
													onChange={(e) => {
														changesRef.current.w2!.codes ??= [];

														changesRef.current.w2!.codes[index] = {
															...codeField,
															amount: e.target.valueAsNumber,
														};
													}}
												/>
											</td>

											<td className="p-1 flex items-end justify-end">
												<Button
													onClick={() => {
														changesRef.current.w2!.codes ??= [];

														changesRef.current.w2!.codes.splice(index, 1);

														forceRender();
													}}
													className="rounded-md aspect-square p-0 border border-border-smooth"
													variant="ghost"
													size="sm"
												>
													<Trash className="size-3 text-muted" />
												</Button>
											</td>
										</tr>
									))}

									<tr>
										<td colSpan={3}>
											<Button
												onClick={() => {
													changesRef.current.w2!.codes ??= [];

													changesRef.current.w2!.codes.push({
														code: "",
														amount: 0,
													});

													forceRender();
												}}
												className="w-full rounded-b rounded-t-none bg-muted-strong"
												title="Add to table"
												size="lg"
											>
												<Plus className="size-3 text-primary" />
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</fieldset>

						<fieldset className="w-full my-2">
							<label className="text-sm text-muted">State Taxes</label>

							<ul className="flex flex-col gap-2">
								{changesRef.current.w2?.state_taxes?.map((stateTax, index) => {
									return (
										<table
											className="w-full rounded overflow-hidden p-1 border border-border-smooth bg-muted-strong"
											cellPadding="0"
											cellSpacing="0"
											key={index}
										>
											<tbody className="[&_tr]:even:bg-alt-row [&_tr]:w-full [&_th]:font-normal [&_th]:text-start [&_th]:text-muted [&_th]:px-2">
												{W2_STATE_TAXES_NUMBER_FIELDS.map((numberField) => (
													<tr key={numberField}>
														<th>{titleCase(numberField)}</th>

														<td className="p-0.5">
															<input
																className="flex w-full bg-notebook border-none focus-visible:outline-none items-center justify-center text-center rounded"
																defaultValue={
																	stateTax[numberField] ?? undefined
																}
																type="number"
																onChange={(e) => {
																	changesRef.current.w2!.state_taxes ??= [];

																	changesRef.current.w2!.state_taxes[index] = {
																		...stateTax,
																		[numberField]: e.target.valueAsNumber,
																	};
																}}
															/>
														</td>
													</tr>
												))}

												{W2_STATE_TAXES_STRING_FIELDS.map((stringField) => (
													<tr key={stringField}>
														<th>{titleCase(stringField)}</th>

														<td className="p-0.5">
															<input
																className="flex w-full bg-notebook border-none focus-visible:outline-none items-center justify-center text-center rounded"
																defaultValue={
																	stateTax[stringField] ?? undefined
																}
																type="text"
																onChange={(e) => {
																	changesRef.current.w2!.state_taxes ??= [];

																	changesRef.current.w2!.state_taxes[index] = {
																		...stateTax,
																		[stringField]: e.target.value,
																	};
																}}
															/>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									);
								})}
							</ul>

							<Button
								onClick={() => {
									changesRef.current.w2!.state_taxes ??= [];

									changesRef.current.w2!.state_taxes.push(
										makeDefaultStateTaxes(),
									);

									forceRender();
								}}
								className="w-full rounded bg-muted-strong mt-2 text-xs text-primary"
								size="lg"
							>
								<Plus className="size-3" />

								<span>Add State Tax</span>
							</Button>
						</fieldset>
					</>
				) : null}

				{isInvoice ? (
					<>
						{INVOICE_STRING_FIELDS.map((stringField) => (
							<fieldset className="w-full" key={stringField}>
								<label className="text-sm text-muted" htmlFor={stringField}>
									{titleCase(stringField)}
								</label>

								<Input
									onChange={(e) => {
										changesRef.current.invoice![stringField] =
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											e.target.value as any;
									}}
									defaultValue={
										fileMetadata?.invoice?.[stringField] ?? undefined
									}
									className="flex w-full"
									id={stringField}
								/>
							</fieldset>
						))}

						{INVOICE_NUMBER_FIELDS.map((numberField) => (
							<fieldset className="w-full" key={numberField}>
								<label className="text-sm text-muted" htmlFor={numberField}>
									{titleCase(numberField)}
								</label>

								<Input
									onChange={(e) => {
										changesRef.current.invoice![numberField] =
											e.target.valueAsNumber;
									}}
									defaultValue={
										fileMetadata?.invoice?.[numberField] ?? undefined
									}
									className="flex w-full"
									id={numberField}
									type="number"
								/>
							</fieldset>
						))}

						<fieldset className="w-full my-2">
							<label className="text-sm text-muted">Line Items</label>

							<ul className="flex flex-col gap-2">
								{changesRef.current.invoice?.line_items?.map(
									(lineItem, index) => {
										return (
											<table
												className="w-full rounded overflow-hidden p-1 border border-border-smooth bg-muted-strong"
												cellPadding="0"
												cellSpacing="0"
												key={index}
											>
												<tbody className="[&_tr]:even:bg-alt-row [&_tr]:w-full [&_th]:font-normal [&_th]:text-start [&_th]:text-muted [&_th]:px-2">
													{LINE_ITEM_STRING_FIELDS.map((stringField) => (
														<tr key={stringField}>
															<th>{titleCase(stringField)}</th>

															<td className="p-0.5">
																<input
																	className="flex w-full bg-notebook border-none focus-visible:outline-none items-center justify-center text-center rounded"
																	defaultValue={
																		lineItem[stringField] ?? undefined
																	}
																	type="text"
																	onChange={(e) => {
																		changesRef.current.invoice!.line_items ??=
																			[];

																		changesRef.current.invoice!.line_items[
																			index
																		] = {
																			...lineItem,
																			[stringField]: e.target.value,
																		};
																	}}
																/>
															</td>
														</tr>
													))}

													{LINE_ITEM_NUMBER_FIELDS.map((numberField) => (
														<tr key={numberField}>
															<th>{titleCase(numberField)}</th>

															<td className="p-0.5">
																<input
																	className="flex w-full bg-notebook border-none focus-visible:outline-none items-center justify-center text-center rounded"
																	defaultValue={
																		lineItem[numberField] ?? undefined
																	}
																	type="number"
																	onChange={(e) => {
																		changesRef.current.invoice!.line_items ??=
																			[];

																		changesRef.current.invoice!.line_items[
																			index
																		] = {
																			...lineItem,
																			[numberField]: e.target.valueAsNumber,
																		};
																	}}
																/>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										);
									},
								)}
							</ul>

							<Button
								onClick={() => {
									changesRef.current.invoice!.line_items ??= [];

									changesRef.current.invoice!.line_items.push(
										makeDefaultLineItem(),
									);

									forceRender();
								}}
								className="w-full rounded bg-muted-strong mt-2 text-xs text-primary"
								size="lg"
							>
								<Plus className="size-3" />

								<span>Add Line Item</span>
							</Button>
						</fieldset>

						<fieldset className="w-full my-2">
							<label className="text-sm text-muted">Taxes</label>

							<ul className="flex flex-col gap-2">
								{changesRef.current.invoice?.taxes?.map((tax, index) => {
									return (
										<table
											className="w-full rounded overflow-hidden p-1 border border-border-smooth bg-muted-strong"
											cellPadding="0"
											cellSpacing="0"
											key={index}
										>
											<tbody className="[&_tr]:even:bg-alt-row [&_tr]:w-full [&_th]:font-normal [&_th]:text-start [&_th]:text-muted [&_th]:px-2">
												{INVOICE_TAXES_STRING_FIELDS.map((stringField) => (
													<tr key={stringField}>
														<th>{titleCase(stringField)}</th>

														<td className="p-0.5">
															<input
																className="flex w-full bg-notebook border-none focus-visible:outline-none items-center justify-center text-center rounded"
																defaultValue={tax[stringField] ?? undefined}
																type="text"
																onChange={(e) => {
																	changesRef.current.invoice!.taxes ??= [];

																	changesRef.current.invoice!.taxes[index] = {
																		...tax,
																		[stringField]: e.target.value,
																	};
																}}
															/>
														</td>
													</tr>
												))}

												{INVOICE_TAXES_NUMBER_FIELDS.map((numberField) => (
													<tr key={numberField}>
														<th>{titleCase(numberField)}</th>

														<td className="p-0.5">
															<input
																className="flex w-full bg-notebook border-none focus-visible:outline-none items-center justify-center text-center rounded"
																defaultValue={tax[numberField] ?? undefined}
																type="number"
																onChange={(e) => {
																	changesRef.current.invoice!.taxes ??= [];

																	changesRef.current.invoice!.taxes[index] = {
																		...tax,
																		[numberField]: e.target.valueAsNumber,
																	};
																}}
															/>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									);
								})}
							</ul>

							<Button
								onClick={() => {
									changesRef.current.invoice!.taxes ??= [];

									changesRef.current.invoice!.taxes.push(
										makeDefaultInvoiceTax(),
									);

									forceRender();
								}}
								className="w-full rounded bg-muted-strong mt-2 text-xs text-primary"
								size="lg"
							>
								<Plus className="size-3" />

								<span>Add Tax</span>
							</Button>
						</fieldset>
					</>
				) : null}
			</div>
		</section>
	);
};
