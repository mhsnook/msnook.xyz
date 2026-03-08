import { JobHeader } from './job-header'
import PictureSection from './picture-section'
import { Wrapper, LeftContainer, RightContainer } from './containers'
import { SkillsDeveloper, SkillsProductManager } from './content-sections'
import { PrintMarkdown } from '@/components/lib'
import { Metadata } from 'next'

// 1050 by 1485. p1 is currently some 642 words, needs to be ~640

export const metadata: Metadata = {
	title: 'Em Snook, Developer Resume 2024',
}

const intro = `Hello, 👋 I&rsquo;m Em, a former
organiser, data analyst, tech director, then facilitator,
turned product manager, data engineer and full stack developer.

In 2020 I decided to leave management to focus on my own work
as an individual contributor, honing my craft at Product Management,
Data Engineering, and Full-stack Web Development.
I love it, but as a freelancer and solo developer,
I miss being _part of a team_ &ndash; if you want to stay in flow,
nothing beats good teamwork.

So I'm looking for full-time employment, membership in a coop, or partnership in an
agency &ndash; to keep learning, keep shipping, keep going.

I'm most comfortable with full-stack JS frameworks like NextJS or
React Router, and with databases, so naturally I prefer to keep the API layer nice and simple.
But I consider myself flexible and practical with solutions, no matter what tools we decide to use for the job.

Mostly I care about working on a team that fosters productivity,
growth and accountability.
I want to learn new things, be excellent to my colleagues,
ship quality product every cycle &ndash;
and then close the computer and enjoy my weekend. If this sounds like
your workplace, please reach out!

&nbsp;&nbsp;&ndash;_M_`

const projects = [
	{
		title: 'Mapplication Rebuild',
		time: '2022',
		content: `Rebuilt [map.350.org](https://map.350.org/groups), using react-map-gl, NextJS, BigQuery & DataForm, and TailwindCSS.
  The old version was a custom ETL app built with DRF, and a 2017-era React/Redux app. I was contracted to make recommendations
  for the in-house team, and ended up building it as well.

  The org was already using BigQuery to warehouse data from each of the 3 required datasources, so I was able to replace the
  (big) ETL back-end with a (small) DataForm project. Each API endpoint pulled data from one of three Views that
  handled the data & privacy logic into a system with its own (strict) review and deployment
  policies, letting me work with more confidence and velocity on the rest of the app.

  I did the rest with NextJS, React Query and TailwindCSS, replacing most of the embed options with a handful
  of [independent routes/pages](https://map.350.org/).
  The result is a simple app with a handful of re-useable components, hooks, API routes,
  assembled under different pages which we can extend, adjust, and theme as-needed
  without sacrificing code quality or exploding complexity.`,
	},
	{
		title: 'Sunlo.app',
		time: '2020-2024',
		content: `[Sunlo](https://sunlo.app) is a Social Language-Learning app
  I started sketching in 2015 when I first came to India and wanted to learn
  Hindi and Tamil. I found myself unable to build momentum
  on apps like Duolingo, which try to be "social" through gamification but don't
  do anything to make use of the role that friends and family can play, particularly in learning a language.

  The app is currently unreleased because I mostly use it as a playground to learn.
  Over the last few months I've used it to experiment in depth with SolidJS, SvelteKit, and [React Router](https://sunlo-tanstack.vercel.app).
  I've learned so much about TypeScript, hoisting data requirements, the non-React ecosystem (Signals/Runes), Vite, Vinxi, and more.
  Sunlo also compiles to native iOS and Android apps with Tauri, allowing for a buttery smooth UX that's the same on device or in the browser.`,
	},
	/*
  {
    title: 'MutualAidIndia.com',
    time: '2021',

    content: `This volunteer project began as a Google Doc with a crowdsourced list of ways that people could contribute to mutual aid funds,
  during the first devastating wave of the COVID-19 pandemic in India.
  Before long we had dozens of volunteers and
  loads of traffic, and we needed a site, a database, a CMS, and a vetting workflow for volunteers to vet and update listings, goals, etc.
  I built the MAI site with a Gatsby/Tailwind/Airtable starter kit, and built the contact- and content-management in Airtable.

  Here's [an article by Riddhi Dastidar](https://thebaffler.com/latest/how-it-feels-dastidar), who started the whole thing with just a Google Doc and a sense of desperation to help people struggling with the first big wave of the COVID pandemic in India.`,
  },
  */
	{
		title: 'VoteAmerica Data Pipeline',
		time: '2020',
		content: `VoteAmerica started as a Product Management job,
  but we didn't have a dedicated data engineer
  who also had experience with voter outreach.
  I had a 10+ years with each, so 6 weeks before election-day we shifted my role to data engineering:
  creating of a data pipeline that powered our 100-Million count SMS program.

  With the help of another engineer and an analyst, we factored in weekly and nightly data updates from
  upstream vendors and the state voter data registries, to deliver millions of actionable leads per day
  in target regions and demographics.`,
	},
]

export default function Page() {
	return (
		<>
			<Wrapper>
				<LeftContainer>
					<PictureSection link="https://msnook.xyz/resume/developer" />
					<SkillsDeveloper />
					<SkillsProductManager />
				</LeftContainer>

				<RightContainer>
					<h2 className="text-3xl font-bold text-cyan-content font-display">
						Full-stack Developer, Product Manager
					</h2>
					<div className="prose-sm md:columns-2">
						<PrintMarkdown markdown={intro} />
					</div>
					<h2 className="text-2xl font-bold font-display">
						Recent Projects (Lead Developer)
					</h2>
					<div className="space-y-4">
						{projects.map((project, i) => (
							<div key={i} className="prose w-full">
								<h3 className="text-lg text-lilac-content flex flex-row justify-between items-center">
									<span>{project.title}</span>
									<span className="text-sm">{project.time}</span>
								</h3>
								<div className="prose-sm prose-lilac">
									<PrintMarkdown markdown={project.content} />
								</div>
							</div>
						))}
					</div>
				</RightContainer>
			</Wrapper>
			<Wrapper>
				<div className="col-span-4 md:px-10 py-12 mt-2 text-md">
					<h2 className="text-2xl font-bold font-display my-2 mb-4">
						Previous Employment
					</h2>
					<div className="md:columns-2 space-y-8 gap-8">
						<div className="space-y-6">
							<JobHeader
								title="Product Manager & Data Engineer"
								subtitle="VoteAmerica.com"
								timeframe="July 2020 – November 2020"
							/>
							<p>
								At VoteAmerica I was called in to be the Product Manager for the
								last 4 months of the election cycle. We had a team of about 6
								Engineers working on a national system of form-helpers and
								reminders and everything we could think to achieve one clear
								goal: to help voters look up their registration, request an
								absentee ballot, or get help with their voting journey. Our
								product motto was:{' '}
							</p>
							<blockquote className="italic border-l-4 px-4 md:pr-8">
								The best Voter Experience allowed by law in all 50 states and
								the District of Columbia.
							</blockquote>
							<p>
								When Election Day got closer and we launched our campaign to
								send 100 Million text messages to voters across the country, the
								outreach team came to us for help with their data pipeline.
								Since election day was about 6 weeks away, most of the product
								was already managed, so I put on another hat and built the SQL
								pipeline that selectively merged high-quality updates from
								upstream data vendors, selected the most likely phone number for
								each household (or the most likely voter identity for a #) and
								built the priority lists for each state on a rolling/nightly
								basis.
							</p>
							<p>
								And I had the pleasure to manage an experiment in a truly new
								way of doing voter outreach: a system called The Voter Helpline
								which received the SMS <em>responses</em> from our outreach
								program and funneled them into different channels in a Slack
								team, where our legal assistance volunteers would claim the
								conversation and chat with the voter until their question was
								answered. The volunteer never had to leave Slack and the voter
								never had to leave their SMS. It was a dream for engagement and
								contact completion, and I think it helped a lot of people.
							</p>
							<Alert>
								Our main tools at VoteAmerica were React, Gatsby, Django Rest
								Framework, with Cloudflare Workers for PDFs and Faxes, Bulma for
								CSS and Redshift and the Civis Platform for data engineering.
							</Alert>
						</div>
						<div className="space-y-6">
							<JobHeader
								title="Director of Technology"
								subtitle="The Online Progressive Engagement Network"
								timeframe="Sep 2014 – Jun 2020"
							/>
							<p>
								The OPEN is a networking body that works with around 20
								organisations from 20 different countries to help them share
								knowledge, engage in collaborations, and provide both material
								and moral support across countries, borders and cultures.
							</p>
							<p>
								During my 6 years leading the tech team, we helped over a dozen
								organisations put their tech team and stack together to launch,
								and then scale and hire, refactor or pivot, and more. By the end
								of my time there we were managing multiple shared-source
								products that were used across the network for our members&apos;
								critical business concerns, like sending mass communications to
								members and receiving donations.
							</p>
							<p>
								And I got to facilitate some of the most incredible events of my
								career: the annual tech summit, where every organisation would
								send their tech director and maybe one or two other staff and
								we&apos;d get about 50 people together in a conference center
								for a week and talk and share and hack and ask for help and
								share our plans for the future and see where the overlaps
								cropped up. So the job was part tech management and, on some
								levels, part diplomacy. I loved the relational aspect of the
								job, but it was also highly political and so eventually I burned
								out and decided to take my career toward the &ldquo;individual
								contributor&rdquo; role as a product manager.
							</p>
							<Alert>
								The tools we maintained at OPEN mostly used Rails, React,
								Express, Wordpress, jQuery, Bootstrap, Docker, Kubernetes,
								Postgres – and the unstoppable power of collaboration!
							</Alert>
						</div>
						<div className="space-y-6">
							<JobHeader
								title="Chief Information Officer"
								subtitle="BoldProgressives.org"
								timeframe="Jan 2009 – Aug 2014"
							/>
							<p>
								I started at BoldProgressives.org as the first employee, as a
								data manager and digital production manager, basically building
								and targeting emails and landing pages. When we decided to build
								out a web team to make more of our own organizing tools and take
								control of our most key workflows, I had the job of planning,
								hiring and managing it.
							</p>
							<p>
								It was a crash course in technical management as well as
								organisational management. As one of the trusted early staffers
								I was thrown into so many different situations like managing a
								TV ad shoot, or flying out to help a campaign set up a
								door-to-door volunteer operation and integrate the national
								voter database with their work, or taking donor meetings with
								foundations, or advising the founders on org structure as we
								scaled and adapted.
							</p>
							<p>
								And even after six years there and running a department, there
								were still times we&apos;d be on deadline and I&apos;d jump in
								to write SQL to target an email or double-check that a page had
								been built correctly (some things never change).
							</p>
							<Alert>
								We used a SAAS platform called ActionKit with our own Django
								templates, loads of jQuery, MySQL for targeting and Analytics,
								Bootstrap for styles, and a handful of Django apps and admins.
							</Alert>
							<br />
						</div>
					</div>
				</div>
			</Wrapper>
		</>
	)
}

const Alert = ({ children }) => {
	return (
		<div
			style={{ WebkitPrintColorAdjust: 'exact' }}
			className="text-cyan-content rounded-sm border-2 border-cyan/70 bg-cyan-soft/40 py-3 px-4 text-sm"
		>
			{children}
		</div>
	)
}
