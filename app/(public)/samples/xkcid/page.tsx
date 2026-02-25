import Banner from '@/components/banner'
import xkcid from './xkcid'
import { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
	title: 'xkcID: A Friendly, K-sortable Compact Identifier | msnook.xyz',
	description:
		'An experiment in making a new kind of compact global identifier for more human-friendly identifiers to paste into groupchats and stash in databases',
}

const classes = {
	rows: 'odd:bg-gray-100 py-1',
	keys: 'font-bold opacity-70',
	values: 'font-[courier] font-right px-2',
	heading: 'font-bold text-center',
}

export default async function Page() {
	const list = [xkcid(), xkcid('shortest')]
	return (
		<div>
			<Banner
				title={metadata.title.toString()}
				description={metadata.description}
				small
			/>
			<main className="container py-5">
				{list.map((cid) => {
					const id = cid.make()
					return (
						<section
							key={cid.variant}
							className="max-w-[40rem] border overflow-x-hidden"
						>
							<h3 className="h3">xkcID &ldquo;{cid.variant}&rdquo; variant</h3>
							<table className="table-auto">
								<thead className={classes.heading}>
									<tr>
										<th>xkcid instance properties</th>
										<th>value</th>
									</tr>
								</thead>
								<tbody className="overflow-x-hidden">
									{Object.keys(cid).map((k) => (
										<tr key={k} className={classes.rows}>
											<td>{k}</td>
											<td className={classes.values}>
												{typeof cid[k] === 'function' ? 'function()' : cid[k]}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<table>
								<thead className={classes.heading}>
									<tr>
										<th>xkcid factory properties/methods</th>
										<th>value</th>
									</tr>
								</thead>
								<tbody>
									{Object.keys(id).map((k) => (
										<tr key={k} className={classes.rows}>
											<td>{k}</td>
											<td className={classes.values}>
												{typeof id[k] === 'function' ? 'function' : id[k]}
											</td>
										</tr>
									))}
									<tr>
										<td colSpan={2}>Testing the number conversion</td>
									</tr>
									<tr className={classes.rows}>
										<td>Initial</td>
										<td className={classes.values}>{id.id}</td>
									</tr>
									<tr>
										<td>Convert back and forth a bunch of times</td>
										<td className={classes.values}>
											{cid.testBackAndForth(5674567835673, 6)}
										</td>
									</tr>
								</tbody>
							</table>
						</section>
					)
				})}
			</main>
		</div>
	)
}
