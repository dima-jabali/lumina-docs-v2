"use client";

import { scope } from "arktype";

import { SupportedDocTypes } from "./general-enums";

const GeneralTypesScope = scope(
	{
		FileMetadataStepWithoutSubSteps: {
			chatMessages: ["Message[]", "=", () => []],
			dealsWithSubFiles: "boolean = false",
			isAutomated: "boolean = false",
			isCompleted: "boolean = false",
			currentSubStep: "number = -1",
			description: "string = ''",
			title: "string = ''",
			step: "number",
		},

		FileMetadataStep: {
			"...": "FileMetadataStepWithoutSubSteps",
			subSteps: ["FileMetadataStepWithoutSubSteps[]", "=", () => []],
		},

		OrganizationUuid: "string#OrganizationUuid",
		ISODateString: "string#ISODateString",
		MessageUuid: "string#MessageUuid",

		Steps: {
			[SupportedDocTypes.Commission]: ["FileMetadataStep[]", "=", () => []],
			[SupportedDocTypes.Mortgage]: ["FileMetadataStep[]", "=", () => []],
			[SupportedDocTypes.Invoice]: ["FileMetadataStep[]", "=", () => []],
			[SupportedDocTypes.W2]: ["FileMetadataStep[]", "=", () => []],
		},

		Organization: {
			steps: [
				"Steps",
				"=",
				() => ({
					[SupportedDocTypes.Commission]: [],
					[SupportedDocTypes.Mortgage]: [],
					[SupportedDocTypes.Invoice]: [],
					[SupportedDocTypes.W2]: [],
				}),
			],
			categories: ["FileMetadataStep[]", "=", () => []],
			currentCategory: "number = -1",
			currentStep: "number = 1",
			uuid: "OrganizationUuid",
			name: "string",
			logo: "string",
		},

		MessageSender: '"user" | "bot" | "add-chart" | "steps" | "action"',
		SuccessOrStreamingOrHiddenStatus: {
			status: '"success" | "streaming" | "hidden"',
		},
		LoadingStatus: {
			status: '"loading"',
			timeout: "number",
		},
		Status: "SuccessOrStreamingOrHiddenStatus | LoadingStatus",

		Message: {
			sender: "MessageSender = 'bot'",
			showFooter: "boolean = true",
			showSender: "boolean = true",
			createdAt: "ISODateString",
			toggleText: "string = ''",
			statusIndex: "number = 0",
			statuses: "Status[]",
			uuid: "MessageUuid",
			text: "string = ''",
		},
	} as const,
	{
		name: "GeneralTypesScope",
	},
);

const GeneralTypesScopeExport = GeneralTypesScope.export();

export const {
	FileMetadataStep: MakeFileMetadataStep,
	OrganizationUuid: MakeOrganizationUuid,
	MessageSender: MakeMessageSender,
	ISODateString: MakeISODateString,
	Organization: MakeOrganization,
	MessageUuid: MakeMessageUuid,
	Message: MakeMessage,
} = GeneralTypesScopeExport;

export type FileMetadataStep =
	typeof GeneralTypesScopeExport.FileMetadataStep.infer;
export type OrganizationUuid =
	typeof GeneralTypesScopeExport.OrganizationUuid.infer;
export type FileMetadataStepWithoutSubSteps =
	typeof GeneralTypesScopeExport.FileMetadataStepWithoutSubSteps.infer;
export type MessageSender = typeof GeneralTypesScopeExport.MessageSender.infer;
export type ISODateString = typeof GeneralTypesScopeExport.ISODateString.infer;
export type Organization = typeof GeneralTypesScopeExport.Organization.infer;
export type MessageUuid = typeof GeneralTypesScopeExport.MessageUuid.infer;
export type Message = typeof GeneralTypesScopeExport.Message.infer;

export const createMessageUuid = () => crypto.randomUUID() as MessageUuid;
export const createOrganizationUUID = () =>
	crypto.randomUUID() as OrganizationUuid;
export const createISODate = () => new Date().toISOString() as ISODateString;
