import type { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { JobHeader } from '@/components/resume-developer/job-header'
import { LeftContainer, RightContainer } from '@/components/resume-developer/containers'

export const Route = createFileRoute('/(projects)/resume/founder')({
	head: () => ({
		meta: [{ title: 'Michael Snook — Technology Operations Resume' }],
	}),
	component: FounderResume,
})

const focusAreas = [
	'Hiring & team-building',
	'Engineering process & rituals',
	'Roadmaps, milestones, budgets',
	'Technical due diligence',
	'Stakeholder facilitation',
	'Onboarding & team systems',
]

const teamLeader = [
	'Sprint planning & stand-ups',
	'Backlog grooming & prioritization',
	'Daily unblocking and pairing',
	'Retrospectives & process iteration',
	'Code review & mentoring',
	'Triage, on-call, incident response',
]

const technical = [
	'TypeScript, React, React Native',
	'Node & edge runtimes (Cloudflare Workers)',
	'Postgres, BigQuery, SQL data modeling',
	'LLM integration & AI tooling',
	'CI/CD, Docker, Git workflows',
	'Observability & monitoring',
]

const experience = [
	{
		title: 'Product Manager',
		org: 'VoteAmerica',
		time: 'Jul 2020 – Dec 2020',
		points: [
			'Led product for a six-engineer team at a nonpartisan voter-turnout nonprofit, defining scope and process to ship on a fixed deadline.',
			'Coordinated engineering, data, and stakeholders around a single, well-scoped roadmap.',
		],
	},
	{
		title: 'Director of Technology',
		org: 'The Online Progressive Engagement Network',
		time: 'Sep 2014 – Jun 2020',
		points: [
			'Consulted across an international network of roughly 20 nonprofits in 20 countries, advising technology directors on hiring, team structure, roadmaps, and budgets.',
			'Ran architecture reviews and technical due diligence to guide build-versus-buy and vendor decisions.',
			'Designed and facilitated an annual technology summit — about 50 staff convening to share practice and plan collaborations.',
			'Staffed and shipped shared software products used by organizations across the network.',
		],
	},
	{
		title: 'Chief Information Officer',
		org: 'Progressive Change Campaign Committee',
		time: 'Jan 2009 – Aug 2014',
		points: [
			'Joined as the first employee and built the technology department from the ground up.',
			'Defined roles, hired, and managed a six-person team of engineers, designers, and analysts as the organization scaled from 5 to 35 staff.',
			'Selected the core software stack and established the team’s engineering and release processes.',
		],
	},
]

function FounderResume() {
	return (
		<>
			<style>{`@media print { @page { size: 1050px 1485px; margin: 0; } }`}</style>
			<Page>
				<LeftContainer sparse>
					<PictureSection />
					<SkillList title="Focus Areas" items={focusAreas} />
					<SkillList title="Team Leader" items={teamLeader} />
					<SkillList title="Technical Fluency" items={technical} />
				</LeftContainer>

				<RightContainer>
					<header>
						<h2 className="text-3xl font-bold text-cyan-content font-display mt-6">
							Technology Operations &amp; Hiring
						</h2>
						<p className="text-lg text-lilac-content font-display">
							Building and staffing teams for education software
						</p>
					</header>

					<div className="prose space-y-3 text-gray-700">
						<p>
							For 15+ years I&rsquo;ve built and staffed the technology behind mission-driven
							organizations &mdash; joining early, hiring the first engineers, and establishing the
							processes that let small teams ship reliably.
						</p>
						<p>
							Much of that work has been as a consultant, advising technology leaders at nonprofits
							across more than 20 countries on hiring, roadmapping, budgeting, and team structure.
						</p>
						<p>
							I&rsquo;m now focused on educational software, and I want to bring this operations and
							hiring experience to an ed-tech team building learning products that genuinely help
							people.
						</p>
					</div>

					<section className="space-y-3">
						<h2 className="text-2xl font-bold font-display">Selected Experience</h2>
						{experience.map((job) => (
							<div key={job.org}>
								<JobHeader title={job.title} subtitle={job.org} timeframe={job.time} />
								<ul className="list-disc ml-5 mt-4 space-y-2 marker:text-lilac-content">
									{job.points.map((point, i) => (
										<li key={i}>{point}</li>
									))}
								</ul>
							</div>
						))}
					</section>

					<section className="space-y-1">
						<h2 className="text-2xl font-bold font-display">Education Software</h2>
						<p className="text-gray-700">
							I designed and built{' '}
							<a className="link" href="https://sunlo.app">
								Sunlo (https://sunlo.app)
							</a>
							, a social language-learning app exploring how friends and family can support a
							learner. It keeps me close to the craft of building education products end to end
							&mdash; from data model to classroom-ready UX.
						</p>
					</section>

					<section className="space-y-1">
						<h2 className="text-2xl font-bold font-display">Education</h2>
						<p className="text-gray-700">
							University of Virginia &mdash; Bachelor of Arts, Class of 2009.
						</p>
					</section>
				</RightContainer>
			</Page>
		</>
	)
}

// A single, fixed-size print page. Unlike the shared developer-resume Wrapper,
// this omits `break-after-page` so the resume prints as exactly one page.
function Page({ children }: { children: ReactNode }) {
	return (
		<div className="bg-gray-300 print:bg-transparent md:py-10 px-1 print:p-0 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
			<div className="grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 md:shadow-[rgba(0,_0,_0,_0.3)_0px_0px_15px_5px] print:shadow-none md:rounded-sm bg-white p-2 mx-auto min-[1060px]:w-[1050px] min-[1060px]:h-[1485px] print:w-[1050px] print:h-[1485px]">
				{children}
			</div>
		</div>
	)
}

function PictureSection() {
	return (
		<div className="text-center flex flex-col gap-1">
			<h1 className="text-2xl font-bold text-lilac-content">Michael Snook</h1>
			<p className="text-base/7 mb-3">Bangalore, India</p>
			<a href="https://msnook.xyz/resume/founder" title="View this resume on the web">
				<img
					src="/images/my-face-288.png"
					alt="A cartoon face of the author, Michael"
					className="w-36 rounded-full mx-auto mb-3"
					width={144}
					height={144}
				/>
			</a>
			<div className="flex flex-col gap-0.5 text-sm text-lilac-content">
				<a className="hover:underline" href="mailto:me@msnook.xyz">
					me@msnook.xyz
				</a>
				<a className="hover:underline" href="https://msnook.xyz">
					msnook.xyz
				</a>
				<a className="hover:underline" href="tel:+14348824164">
					+1 434 882 4164
				</a>
			</div>
		</div>
	)
}

function SkillList({ title, items }: { title: string; items: string[] }) {
	return (
		<div className="py-1">
			<h2 className="font-bold text-lg">{title}</h2>
			<ul className="list-disc ml-4 marker:text-lilac-content">
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	)
}
