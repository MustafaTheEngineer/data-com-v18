type Part = {
	name: string
	route: string
}

type Section = {
	name: string
	parts: Part[]
}

export const sections: Section[] = [
	{
		name: 'Signal Encoding Techniques',
		parts: [
			{
				name: 'Digital to Digital',
				route: 'digital-to-digital'
			},
			{
				name: 'Digital to Analog',
				route: 'digital-to-analog'
			},
			{
				name: 'Analog to Digital',
				route: 'analog-to-digital'
			},
		]
	},
	{
		name: 'Error Detection',
		parts: [
			{
				name: 'Parity Checksum',
				route: 'parity-checksum'
			},
			{
				name: 'Internet Checksum',
				route: 'internet-checksum'
			},
			{
				name: 'Cyclic Redundancy Check (CRC)',
				route: 'crc'
			}
		]
	},
	{
		name: 'Signal Visualization',
		parts: [
			{
				name: 'Analog Signal',
				route: 'analog-visual'
			}
		]
	}
]
