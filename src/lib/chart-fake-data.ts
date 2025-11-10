export const outstandingAmounts = [
	{ period: "0-30 days", amount: 145000 },
	{ period: "31-60 days", amount: 98500 },
	{ period: "61-90 days", amount: 56000 },
	{ period: ">90 days", amount: 35000 },
];

export const vendorAnomalies = [
	{
		vendor: "Tech Solutions Inc.",
		amount: 5240,
		frequency: 12,
		isAnomaly: false,
	},
	{
		vendor: "Global Supplies Co.",
		amount: 3750,
		frequency: 8,
		isAnomaly: false,
	},
	{
		vendor: "Office Systems Ltd.",
		amount: 2800,
		frequency: 7,
		isAnomaly: false,
	},
	{
		vendor: "Logistics Partners",
		amount: 4100,
		frequency: 6,
		isAnomaly: false,
	},
	{ vendor: "Digital Services", amount: 1950, frequency: 9, isAnomaly: false },
	{
		vendor: "Hardware Providers",
		amount: 2350,
		frequency: 5,
		isAnomaly: false,
	},
	{ vendor: "Cloud Storage Co.", amount: 1650, frequency: 4, isAnomaly: false },
	{ vendor: "Tech Consulting", amount: 8750, frequency: 1, isAnomaly: true },
	{ vendor: "Office Direct", amount: 950, frequency: 18, isAnomaly: true },
	{ vendor: "Global Tech", amount: 12450, frequency: 2, isAnomaly: true },
	{ vendor: "Network Solutions", amount: 3250, frequency: 6, isAnomaly: false },
	{ vendor: "Cloud Security", amount: 2450, frequency: 5, isAnomaly: false },
	{ vendor: "Data Systems", amount: 1850, frequency: 7, isAnomaly: false },
	{ vendor: "Office Equipment", amount: 7850, frequency: 1, isAnomaly: true },
	{ vendor: "IT Services", amount: 2750, frequency: 8, isAnomaly: false },
];

export const vendorSpend = [
	{
		vendor: "Tech Solutions Inc.",
		amount: 325000,
		runningTotal: 325000,
		percentage: 32.5,
	},
	{
		vendor: "Global Supplies Co.",
		amount: 215000,
		runningTotal: 540000,
		percentage: 54.0,
	},
	{
		vendor: "Office Systems Ltd.",
		amount: 142000,
		runningTotal: 682000,
		percentage: 68.2,
	},
	{
		vendor: "Logistics Partners",
		amount: 98000,
		runningTotal: 780000,
		percentage: 78.0,
	},
	{
		vendor: "Digital Services",
		amount: 75000,
		runningTotal: 855000,
		percentage: 85.5,
	},
	{
		vendor: "Hardware Providers",
		amount: 65000,
		runningTotal: 920000,
		percentage: 92.0,
	},
	{
		vendor: "Cloud Storage Co.",
		amount: 45000,
		runningTotal: 965000,
		percentage: 96.5,
	},
	{ vendor: "Others", amount: 35000, runningTotal: 1000000, percentage: 100.0 },
];

export const outstandingAmountsData = [
	{
		bucket: "0-30 days",
		sales: 45000,
		marketing: 32000,
		engineering: 28000,
		support: 15000,
	},
	{
		bucket: "31-60 days",
		sales: 38000,
		marketing: 27000,
		engineering: 22000,
		support: 18000,
	},
	{
		bucket: "61-90 days",
		sales: 25000,
		marketing: 19000,
		engineering: 15000,
		support: 12000,
	},
	{
		bucket: ">90 days",
		sales: 18000,
		marketing: 14000,
		engineering: 10000,
		support: 8000,
	},
];

export const customerData = {
	customerName: "Acme Corp",
	data: [
		{ timePeriod: "Jan 2024", riskScore: 75 },
		{ timePeriod: "Feb 2024", riskScore: 80 },
		{ timePeriod: "Mar 2024", riskScore: 92 },
		{ timePeriod: "Apr 2024", riskScore: 88 },
		{ timePeriod: "May 2024", riskScore: 90 },
		{ timePeriod: "Jun 2024", riskScore: 100 },
	],
};

export const sampleAgingData = [
	{ name: "0-30 days", value: 150000, fill: "var(--chart-1)" },
	{ name: "31-60 days", value: 100000, fill: "var(--chart-2)" },
	{ name: "61-90 days", value: 30000, fill: "var(--chart-3)" },
	{ name: "90+ days", value: 20000, fill: "var(--chart-4)" },
];

export const samplePaymentData = [
	{
		customer: "Delta Systems",
		invoiceAmount: 2105,
		daysPaidLate: 15,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 881,
		daysPaidLate: 19,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2503,
		daysPaidLate: 16,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 1735,
		daysPaidLate: 16,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3657,
		daysPaidLate: 14,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3286,
		daysPaidLate: 8,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4399,
		daysPaidLate: 15,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2039,
		daysPaidLate: 11,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3512,
		daysPaidLate: 7,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 113,
		daysPaidLate: 11,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 2272,
		daysPaidLate: 20,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2509,
		daysPaidLate: 13,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3817,
		daysPaidLate: 24,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1754,
		daysPaidLate: 15,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1639,
		daysPaidLate: 11,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 5043,
		daysPaidLate: 8,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3631,
		daysPaidLate: 27,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1520,
		daysPaidLate: 16,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 1248,
		daysPaidLate: 16,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 5010,
		daysPaidLate: 9,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 232,
		daysPaidLate: 17,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4003,
		daysPaidLate: 15,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 588,
		daysPaidLate: 16,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 485,
		daysPaidLate: 11,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 2038,
		daysPaidLate: 15,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 767,
		daysPaidLate: 9,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1718,
		daysPaidLate: 5,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 1404,
		daysPaidLate: 12,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4144,
		daysPaidLate: 17,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3287,
		daysPaidLate: 10,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 541,
		daysPaidLate: 11,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3931,
		daysPaidLate: 8,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4399,
		daysPaidLate: 14,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 612,
		daysPaidLate: 17,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3971,
		daysPaidLate: 15,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4457,
		daysPaidLate: 24,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 752,
		daysPaidLate: 12,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2430,
		daysPaidLate: 8,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4056,
		daysPaidLate: 15,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 444,
		daysPaidLate: 19,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 2927,
		daysPaidLate: 11,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 3599,
		daysPaidLate: 19,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4367,
		daysPaidLate: 7,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3234,
		daysPaidLate: 12,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1402,
		daysPaidLate: 12,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4787,
		daysPaidLate: 10,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3406,
		daysPaidLate: 22,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4517,
		daysPaidLate: 23,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2773,
		daysPaidLate: 13,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4542,
		daysPaidLate: 25,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 426,
		daysPaidLate: 16,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 2474,
		daysPaidLate: 13,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4868,
		daysPaidLate: 21,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1137,
		daysPaidLate: 20,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 166,
		daysPaidLate: 10,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4011,
		daysPaidLate: 14,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3413,
		daysPaidLate: 10,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 387,
		daysPaidLate: 11,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 1473,
		daysPaidLate: 17,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 1805,
		daysPaidLate: 8,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 991,
		daysPaidLate: 15,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 260,
		daysPaidLate: 13,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4025,
		daysPaidLate: 10,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3783,
		daysPaidLate: 21,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4753,
		daysPaidLate: 15,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 1119,
		daysPaidLate: 14,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2664,
		daysPaidLate: 19,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 353,
		daysPaidLate: 3,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3417,
		daysPaidLate: 20,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2443,
		daysPaidLate: 8,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4716,
		daysPaidLate: 9,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2004,
		daysPaidLate: 19,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 635,
		daysPaidLate: 21,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 267,
		daysPaidLate: 19,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3535,
		daysPaidLate: 17,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 2144,
		daysPaidLate: 11,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 111,
		daysPaidLate: 15,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4601,
		daysPaidLate: 12,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 2851,
		daysPaidLate: 21,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3995,
		daysPaidLate: 8,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3345,
		daysPaidLate: 18,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3625,
		daysPaidLate: 10,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 241,
		daysPaidLate: 30,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 528,
		daysPaidLate: 18,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2901,
		daysPaidLate: 9,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1518,
		daysPaidLate: 13,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 5054,
		daysPaidLate: 22,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4606,
		daysPaidLate: 18,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 693,
		daysPaidLate: 20,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3946,
		daysPaidLate: 12,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 5075,
		daysPaidLate: 10,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1347,
		daysPaidLate: 12,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1921,
		daysPaidLate: 13,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2385,
		daysPaidLate: 9,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1050,
		daysPaidLate: 15,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 5049,
		daysPaidLate: 18,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 3435,
		daysPaidLate: 13,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1152,
		daysPaidLate: 13,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1031,
		daysPaidLate: 16,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 201,
		daysPaidLate: 14,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 5054,
		daysPaidLate: 20,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 925,
		daysPaidLate: 8,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1333,
		daysPaidLate: 16,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1320,
		daysPaidLate: 13,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 170,
		daysPaidLate: 16,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2047,
		daysPaidLate: 18,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1204,
		daysPaidLate: 19,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 2056,
		daysPaidLate: 14,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 1272,
		daysPaidLate: 7,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4958,
		daysPaidLate: 11,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 2619,
		daysPaidLate: 23,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3125,
		daysPaidLate: 19,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 198,
		daysPaidLate: 8,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4877,
		daysPaidLate: 13,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 4440,
		daysPaidLate: 23,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 665,
		daysPaidLate: 12,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 5081,
		daysPaidLate: 12,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 778,
		daysPaidLate: 13,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2753,
		daysPaidLate: 11,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4671,
		daysPaidLate: 15,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 1213,
		daysPaidLate: 9,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1260,
		daysPaidLate: 12,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2523,
		daysPaidLate: 21,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3749,
		daysPaidLate: 20,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3673,
		daysPaidLate: 9,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 692,
		daysPaidLate: 20,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3528,
		daysPaidLate: 13,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 1485,
		daysPaidLate: 18,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4239,
		daysPaidLate: 21,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4452,
		daysPaidLate: 27,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3139,
		daysPaidLate: 19,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1229,
		daysPaidLate: 14,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4574,
		daysPaidLate: 20,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3484,
		daysPaidLate: 10,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3391,
		daysPaidLate: 12,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 606,
		daysPaidLate: 21,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1905,
		daysPaidLate: 21,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3683,
		daysPaidLate: 10,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2649,
		daysPaidLate: 24,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 155,
		daysPaidLate: 17,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1564,
		daysPaidLate: 18,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4906,
		daysPaidLate: 21,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 3019,
		daysPaidLate: 16,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 3392,
		daysPaidLate: 5,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 273,
		daysPaidLate: 13,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 3700,
		daysPaidLate: 13,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3026,
		daysPaidLate: 9,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 2578,
		daysPaidLate: 9,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 316,
		daysPaidLate: 11,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1364,
		daysPaidLate: 19,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 3023,
		daysPaidLate: 25,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4889,
		daysPaidLate: 19,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2376,
		daysPaidLate: 14,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 2706,
		daysPaidLate: 14,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4509,
		daysPaidLate: 15,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3420,
		daysPaidLate: 23,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3130,
		daysPaidLate: 16,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4218,
		daysPaidLate: 16,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3215,
		daysPaidLate: 11,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3854,
		daysPaidLate: 20,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4126,
		daysPaidLate: 14,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 146,
		daysPaidLate: 5,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1188,
		daysPaidLate: 13,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4010,
		daysPaidLate: 20,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 996,
		daysPaidLate: 11,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 2675,
		daysPaidLate: 13,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 2024,
		daysPaidLate: 16,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 574,
		daysPaidLate: 20,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 4363,
		daysPaidLate: 7,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 388,
		daysPaidLate: 18,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 2738,
		daysPaidLate: 15,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2538,
		daysPaidLate: 9,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 2507,
		daysPaidLate: 11,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 2740,
		daysPaidLate: 16,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4052,
		daysPaidLate: 17,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 1035,
		daysPaidLate: 29,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 1804,
		daysPaidLate: 12,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 2247,
		daysPaidLate: 13,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 842,
		daysPaidLate: 7,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4256,
		daysPaidLate: 5,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1588,
		daysPaidLate: 23,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 4114,
		daysPaidLate: 10,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 3856,
		daysPaidLate: 20,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 4437,
		daysPaidLate: 23,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4020,
		daysPaidLate: 7,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 1630,
		daysPaidLate: 18,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 622,
		daysPaidLate: 10,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 1061,
		daysPaidLate: 19,
	},
	{
		customer: "Gamma Solutions",
		invoiceAmount: 4134,
		daysPaidLate: 7,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 4768,
		daysPaidLate: 16,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 978,
		daysPaidLate: 18,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 3296,
		daysPaidLate: 25,
	},
	{
		customer: "Alpha Industries",
		invoiceAmount: 1336,
		daysPaidLate: 18,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 2813,
		daysPaidLate: 14,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 3140,
		daysPaidLate: 20,
	},
	{
		customer: "Delta Systems",
		invoiceAmount: 2661,
		daysPaidLate: 18,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 335,
		daysPaidLate: 9,
	},
	{
		customer: "Beta Corp",
		invoiceAmount: 5008,
		daysPaidLate: 15,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 4692,
		daysPaidLate: 20,
	},
	{
		customer: "Epsilon Group",
		invoiceAmount: 2677,
		daysPaidLate: 19,
	},
];

export const sampleRegionRiskData = [
	{ region: "North America", defaultRisk: 0.05, fill: "var(--chart-1)" },
	{ region: "Europe", defaultRisk: 0.03, fill: "var(--chart-2)" },
	{ region: "Asia", defaultRisk: 0.08, fill: "var(--chart-3)" },
	{ region: "South America", defaultRisk: 0.06, fill: "var(--chart-4)" },
	{ region: "Africa", defaultRisk: 0.07, fill: "var(--chart-5)" },
];

export const sampleForecastData = [
	{ month: "May 2025", projectedLoss: 120000 },
	{ month: "Jun 2025", projectedLoss: 135000 },
	{ month: "Jul 2025", projectedLoss: 150000 },
	{ month: "Aug 2025", projectedLoss: 160000 },
	{ month: "Sep 2025", projectedLoss: 175000 },
	{ month: "Oct 2025", projectedLoss: 190000 },
];

export const sampleRiskyCustomers = [
	{ customer: "Epsilon Group", riskScore: 95, fill: "var(--chart-0)" },
	{ customer: "Gamma Solutions", riskScore: 88, fill: "var(--chart-1)" },
	{ customer: "Omega Ltd", riskScore: 82, fill: "var(--chart-2)" },
	{ customer: "Zeta Industries", riskScore: 79, fill: "var(--chart-3)" },
	{ customer: "Theta Corp", riskScore: 75, fill: "var(--chart-4)" },
	{ customer: "Delta Systems", riskScore: 68, fill: "var(--chart-5)" },
	{ customer: "Sigma Enterprises", riskScore: 62, fill: "var(--chart-6)" },
	{ customer: "Beta Corp", riskScore: 55, fill: "var(--chart-7)" },
	{ customer: "Alpha Industries", riskScore: 50, fill: "var(--chart-8)" },
	{ customer: "Iota Inc", riskScore: 45, fill: "var(--chart-9)" },
]
	.sort((a, b) => b.riskScore - a.riskScore)
	.slice(0, 10); // Sort by risk score descending and take top 10

export const customerPaymentRiskHeatmapData = [
	{
		customer: "Acme Corp",
		overdueBucket: "0-30 days",
		amount: 0,
	},
	{
		customer: "Globex Inc",
		overdueBucket: "0-30 days",
		amount: 2,
	},
	{
		customer: "Initech LLC",
		overdueBucket: "0-30 days",
		amount: 0,
	},
	{
		customer: "Umbrella Co",
		overdueBucket: "0-30 days",
		amount: 1,
	},
	{
		customer: "Stark Industries",
		overdueBucket: "0-30 days",
		amount: 0,
	},
	{
		customer: "Wayne Enterprises",
		overdueBucket: "0-30 days",
		amount: 3,
	},
	{
		customer: "Cyberdyne Systems",
		overdueBucket: "0-30 days",
		amount: 0,
	},
	{
		customer: "Oscorp Industries",
		overdueBucket: "0-30 days",
		amount: 4,
	},
	{
		customer: "Acme Corp",
		overdueBucket: "31-60 days",
		amount: 1.2,
	},
	{
		customer: "Globex Inc",
		overdueBucket: "31-60 days",
		amount: 5.1,
	},
	{
		customer: "Initech LLC",
		overdueBucket: "31-60 days",
		amount: 0,
	},
	{
		customer: "Umbrella Co",
		overdueBucket: "31-60 days",
		amount: 0,
	},
	{
		customer: "Stark Industries",
		overdueBucket: "31-60 days",
		amount: 0.5,
	},
	{
		customer: "Wayne Enterprises",
		overdueBucket: "31-60 days",
		amount: 2.7,
	},
	{
		customer: "Cyberdyne Systems",
		overdueBucket: "31-60 days",
		amount: 3.1,
	},
	{
		customer: "Oscorp Industries",
		overdueBucket: "31-60 days",
		amount: 2,
	},
	{
		customer: "Acme Corp",
		overdueBucket: "61-90 days",
		amount: 6.5,
	},
	{
		customer: "Globex Inc",
		overdueBucket: "61-90 days",
		amount: 4.7,
	},
	{
		customer: "Initech LLC",
		overdueBucket: "61-90 days",
		amount: 1.9,
	},
	{
		customer: "Umbrella Co",
		overdueBucket: "61-90 days",
		amount: 0.6,
	},
	{
		customer: "Stark Industries",
		overdueBucket: "61-90 days",
		amount: 2.1,
	},
	{
		customer: "Wayne Enterprises",
		overdueBucket: "61-90 days",
		amount: 7.2,
	},
	{
		customer: "Cyberdyne Systems",
		overdueBucket: "61-90 days",
		amount: 4.3,
	},
	{
		customer: "Oscorp Industries",
		overdueBucket: "61-90 days",
		amount: 3,
	},
	{
		customer: "Acme Corp",
		overdueBucket: "90+ days",
		amount: 8.1,
	},
	{
		customer: "Globex Inc",
		overdueBucket: "90+ days",
		amount: 0,
	},
	{
		customer: "Initech LLC",
		overdueBucket: "90+ days",
		amount: 10.2,
	},
	{
		customer: "Umbrella Co",
		overdueBucket: "90+ days",
		amount: 1.5,
	},
	{
		customer: "Stark Industries",
		overdueBucket: "90+ days",
		amount: 0,
	},
	{
		customer: "Wayne Enterprises",
		overdueBucket: "90+ days",
		amount: 12,
	},
	{
		customer: "Cyberdyne Systems",
		overdueBucket: "90+ days",
		amount: 5.5,
	},
	{
		customer: "Oscorp Industries",
		overdueBucket: "90+ days",
		amount: 6,
	},
];
