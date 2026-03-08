import {
	Envelope,
	LinkIcon,
	Phone,
	Calendar,
	IconGithub,
	IconTwitter,
	IconBluesky,
} from '@/components/icons'

const skills = [
	'Product Planning',
	'Problem Solving',
	'Team Systems',
	'Budgeting + Roadmaps',
	'Communication',
	'Prototyping, R+D',
	'Architecture + Migrations',
]

const technical_skills = [
	'React / NextJS',
	'Node / Express',
	'TailwindCSS',
	'PostGRES / MySQL',
	'Cloud / Serverless',
	'Git',
]

function Page() {
	return (
		<div className="bg-gray-300 md:p-10 font-display">
			<div className="md:shadow-[rgba(0,_0,_0,_0.3)_0px_0px_15px_5px] md:rounded-sm bg-white p-2 py-6 md:p-12 mx-auto max-w-[1100px]">
				<header className="flex mb-4">
					<div id="header-left" className="grow">
						<h1 className="text-cyan-content text-4xl lg:text-6xl font-bold mb-6">
							Michael Snook
						</h1>

						<div
							id="contact-details"
							className="grid grid-cols-2 gap-2 md:gap-4 max-w-[540px]"
						>
							<PWithIcon>
								<Envelope />
								<span>me@msnook.xyz</span>
							</PWithIcon>
							<PWithIcon>
								<LinkIcon />
								<span>msnook.xyz</span>
							</PWithIcon>
							<PWithIcon>
								<Phone />
								<span>+1 434.882.4164</span>
							</PWithIcon>
						</div>
					</div>

					<div
						id="header-right"
						className="hidden md:block md:flex-none lg:px-24 md:px-12 pt-8"
					>
						<img
							src="/images/my-face-288.png"
							width="144"
							height="144"
							align="right"
							className="mx-auto flex-none rounded-full"
							alt="A comic sketch of Michael Snook"
						/>
					</div>
				</header>

				<section>
					<div className="w-100">
						<H2>My career path</H2>
						<p>
							I&rsquo;ve spent the last 10 years managing tech for campaigners –
							from elections, to advocacy, to facilitating collaborations across
							five continents, building the core tech that powers a campaigning
							organisation. Now I&rsquo;m looking to get back to my roots:
							organising, outreach, putting my skills and experience to work on
							a job in tech management, product, and digital campaigning
							solutions to directly support the campaigners and activists
							working to change the world.
						</p>
					</div>
				</section>
				<section className="grid grid-cols-1 md:grid-cols-3 gap-12">
					<div className="col-span-2">
						<H2>Experience</H2>
						<JobHeader
							title="Director of Technology"
							subtitle="The Online Progressive Engagement Network"
							timeframe="Sep 2014 – Jun 2020"
						/>
						<p>
							At OPEN I facilitated the network&rsquo;s tech teams to learn,
							share and collaborate across 19 countries, languages and political
							contexts, hosting events and facilitating community development of
							their core organizing tech to supercharge innovation and
							collaboration.
						</p>
						<ul role="list" className="list-disc pl-6 my-4">
							<li role="listitem" className="text-sm">
								Community management: I made sure every one of the
								network&rsquo;s 60 tech staff knew who everyone else was, what
								resources were available to them, who to go to for advice on
								whatever topic comes to mind, and often facilitated those
								conversations.
							</li>
							<li role="listitem" className="text-sm">
								Tech director coach and support: I worked with tech leaders
								across the network to help them set good middle- and long-term
								goals, roadmap, budget, and plan for the features, tools and
								capacities they needed to provide the best capabilities to their
								campaigners.
							</li>
							<li role="listitem" className="text-sm">
								Software collaborations and stakeholder management: Our tech
								collaborations were only partly staffed by the OPEN team. The
								rest of the capacity came from a delicate balance of getting all
								the partners to agree to capacity-adjusted commitments of staff
								time and money, and making sure they were happy with the product
								we&apos;d set out to build together.
							</li>
							<li role="listitem" className="text-sm">
								Organisational responsibilities: These included fundraising,
								strategic planning, reporting to the board, hiring, event
								management and facilitation, development of organizational
								policies and practices.
							</li>
						</ul>

						<JobHeader
							title="Chief Information Officer"
							subtitle="The Progressive Change Campaign Committee"
							timeframe="Jan 2009 – Aug 2014"
						/>
						<p>
							As employee #1 at the PCCC, I got to help the organisation grow
							from a scrappy, 5-person operation to a national powerhouse with a
							team of 35, while I grew from a data manager to the head of a team
							of six developers, designers and analysts supporting a nimble,
							ambitious, wide-ranging advocacy program.
						</p>
						<ul role="list" className="list-disc pl-6 my-4">
							<li role="listitem" className="text-sm">
								Managed all our online tools like ActionKit, Wordpress, and our
								in-house builds.
							</li>
							<li role="listitem" className="text-sm">
								Led on hiring, staff and project management for an
								interdisciplinary in-house tech team.
							</li>
							<li role="listitem" className="text-sm">
								For years I also ran point on direct staff support, training,
								and the technical aspects of campaign production and launch.
							</li>
							<li role="listitem" className="text-sm">
								Ran our national GOTV operation each cycle, where we pioneered a
								model of online distributed predictive-dialer phonebanking, long
								before it became a common practice.
							</li>
						</ul>

						<JobHeader
							title="Data and Targeting Analyst"
							subtitle="Tom Perriello for Congress (VA-05)"
							timeframe="Dec 2007 – Jan 2009"
						/>
						<p>
							As the first and last member of the team, I ended up doing a
							little bit of everything, but my core focus was on the field
							program: using the voter file, polling and demographic data to set
							target voters, precincts, to plan and budget our outreach. I also
							wrote a lot of emails, snail-mail, some candidate speeches. We won
							the race by 727 votes in deep rural Virginia with a message well
							to the left of the district.
						</p>
					</div>

					<div className="col-span-1">
						<H2>Tools</H2>
						<p role="list" className="badges">
							<Badge>ActionKit</Badge>
							<Badge>WordPress</Badge>
							<Badge>ActionNetwork</Badge>
							<Badge>Civis</Badge>
							<Badge>NextJS</Badge>
							<Badge>ControlShift</Badge>
							<Badge>Trello, ProductBoard, etc.</Badge>
						</p>

						<H2>Skills</H2>
						<p role="list" className="badges">
							{skills.map((s) => (
								<Badge key={s}>{s}</Badge>
							))}
						</p>

						<H2>Technical (Intermediate)</H2>
						<p role="list" className="badges">
							{technical_skills.map((s) => (
								<Badge key={s}>{s}</Badge>
							))}
						</p>

						<H2>&nbsp;</H2>
						<div className="flex flex-row gap-6 mt-4 h-20 justify-center text-cyan-bright">
							<Socials />
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export const Socials = () => (
	<>
		<a className="h-12 w-12" href="https://github.com/mhsnook">
			<IconGithub />
		</a>
		<a className="h-12 w-12" href="https://twitter.com/mhsnook">
			<IconTwitter />
		</a>
		<a className="h-12 w-12" href="https://bsky.app/profile/msnook.xyz">
			<IconBluesky />
		</a>
	</>
)
export default Page

const Badge = ({ children }) => {
	return (
		<span
			role="listitem"
			className="inline-flex gap-4 border-cyan border-2 rounded-sm py-1 px-3 text-cyan font-bold text-sm m-1"
		>
			{children}
		</span>
	)
}

const H2 = ({ children }) => {
	return (
		<h2 className="text-2xl font-bold border-b-2 border-dashed border-gray-400 pb-2 mb-2 mt-4">
			{children}
		</h2>
	)
}

const PWithIcon = ({ children }) => {
	return (
		<p className="max-sm:text-sm flex flex-row place-items-center gap-2 text-cyan-content">
			{children}
		</p>
	)
}

const JobHeader = ({ title, subtitle, timeframe }) => {
	return (
		<div className="my-4">
			<h3 className="text-2xl font-bold mt-4">{title}</h3>
			<h3 className="text-lg font-bold text-cyan-content">{subtitle}</h3>
			<PWithIcon>
				<Calendar />
				<span>{timeframe}</span>
			</PWithIcon>
		</div>
	)
}
