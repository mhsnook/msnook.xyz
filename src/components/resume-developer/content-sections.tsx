export function SkillsDeveloper() {
	return (
		<div className="py-1 mb-1 marker:text-lilac-content">
			<h2 className="font-bold text-lg">Dev Skills</h2>
			<ul className="list-disc ml-4">
				<li>React, NextJS, React Router, React Query</li>
				<li>Postgres, BigQuery, Dataform, SQL</li>
				<li>TailwindCSS, Bulma, Bootstrap</li>
				<li>Prisma ORM, Django ORM, ActiveRecord, Supabase</li>
				<li>Data modeling, joins, window functions</li>
				<li>Svelte, SolidJS, Django/DRF, Rails, WordPress</li>
			</ul>
		</div>
	)
}

export function SkillsProductManager() {
	return (
		<div className="py-1 mb-1">
			<h2 className="font-bold text-lg">PM Skills</h2>
			<ul className="list-disc ml-4 marker:text-lilac-content">
				<li>Defining and scoping a product</li>
				<li>Roadmapping and milestone planning</li>
				<li>Architecture research and hiring consultation</li>
				<li>Technical PM: bridging eng and stakeholders</li>
				<li>Keeping scope tight for the MVP</li>
				<li>Communication across teams and time zones</li>
			</ul>
		</div>
	)
}
