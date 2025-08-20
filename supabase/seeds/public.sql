SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: media_meta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("content", "created_at", "excerpt", "image", "published", "slug", "title", "updated_at", "id", "author_id", "published_at") VALUES
	('**I suppose the point** of this post is to speak on a commonly accepted contradiction, say, about people who think with their head or their heart, people who are analytical and those who are empathic. 

Recently we''ve recently had Discourse about this thing, _Long Termism_, which you might say relies on numbers to say ~ "If we want to bring the most benefit to the most humans, we should ______" and then proceed to fill in the blank with something that sounds a lot like eugenics or ecofascism draped in the smug magnanimity that only Silicon Valley can really muster.

That''s not what this post is about – but it is about numbers, about the future, about organizing some habits of mine into a bit of a theory for understanding.

I''ll try and go quickly at first, just establishing some starting points that I''m trying to sort of understand together:

* We know that helping others is good, preventing bad people from hurting others is good, giving people rights is good, saving lives is good, etc.
* If you''re able to help more people with the same sort of magnitude, or if you''re able to deepen the magnitude that you can help those people, that''s good.
* It''s not about me and what I "get" to do to help (I have to accept that sometimes the thing I must do isn''t particularly what I want to be doing)
* Many times, I am not the person who knows the best outcome needed or the strategy to achieve it, but I am still responsible for deciding where I place my time, and aligning myself with that work
* We have to look to the future in order to imagine better ones, but we can''t rely as much on claims about long-term effects.

I think these are all pretty solid; they''re not meant to be airtight, but they feel like pretty good foundations for moving forward. 


![](https://imgs.xkcd.com/comics/the_problem_with_wikipedia.png)

**For as long** as I can remember, I''ve been a Wikipedia surfer. I can spend hours! Especially looking up animals and animal classifications, seeing how the whole tree of life is related, why are mammals broken up into the placenta ones and the other ones? why are there so many kinds of bats? Actually where do most bats live? I wonder which of those areas are threatened by clear-cutting...

Sometimes I''ll spend an afternoon copying and curating data about life expectancy, infant mortality, maternal mortality, income, HDI, for different countries and regions, because I want to see the numbers, and see the outliers, and look them up ("holy shit that war in that region correlates with a _massive_ drop in life expectancies.")

Obviously I have a curiosity for numbers, for thinking about the scale of the thing. If we could stop a bad mining project that endangers an entire indigenous people and a dozen endangered species of bat... obviously that would be huge. These things matter.

Maybe this sounds obvious and uncontroversial – Michael, why are you even bothering to write this? – I suppose because I hear this other voice that says, "When you think only of numbers you might focus on cosmetic or uncertain interventions" (like on things that are very tenuous like investing in a Presidential campaign for a guy who''s maybe, at the end of the day, going to screw you and everyone you hoped they would help). I hear one that says "You''re not thinking about how certain _types_ of harms lead to more and more and more, like traumatic or disabling events, or things that harm a democracy or a society''s ability to operate long term". 

So this is why I''m writing. I think questions like these two – which in some way defy numerics – are essential for consideration, and I propose to kind of just mash them together.

', '2023-05-17 13:41:27.384189+00', NULL, '', false, 'moral-worth-of-numbers', 'The Moral Worth of Numbers', '2023-05-17 18:16:29.240507+00', 'd2f169e6-b64d-4f2d-8d32-01c349f95f9a', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('Last year I decided to stop freelancing and focus on building my long-time side project into something more, perhaps a business, but at the very least, a more complete version of itself. It''s called Sunlo; it''s a social language learning app, and [you''re welcome to try it out if you like](https://sunlo.app).

At the time it was a NextJS app with Supabase for the back-end and Tauri compiling to native apps for Android and iOS. But I was running into problems: most notably, NextJS''s server-first approach doesn''t include client-side routing, so if I want people to be able to create a flash card and then ', '2025-06-06 17:55:49.061172+00', NULL, '', false, 'write-it-three-times', 'The "Write It Three Times" approach', NULL, 'b46c597a-f9a1-4435-ab89-88b962757a7e', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('My ADHD makes more sense to me when I think of it as an addiction response. My biggest medical concern is that someday I''ll develop diabetes, which I''ll get because I''m addicted to sugar. I spend my life in a constant low-gravity tug with my somewhat casual but still very real relationship with a caffeine addiction. I have rendered it with some sort of bourgeois craft consciousness but it is just an addiction I made friends with.

So I sit at my desk and I turn on my machine and I open up work. Staring at the blank page, or the code un-edited, somewhere deep in my brain a metronome clicks over, 


* True moderation is very difficult for the addictive or compulsive user; it''s often much easier to say "I''ll entirely cut out X" but this can be an unhealthy or unsustainable mindset, so I say, "What are the situations where this isn''t serving me?" And then I''ll cut those out (almost) entirely. It creates some of the moderation mindset and prevents binging, makes it feel like my indulgences are mindful -- and appreciated! Not shamed.

* If I start earlier in the day, I''ll do it more. The addictive behavior will accelerate until interrupted. 
![](https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/signal-2024-01-27-151718_002-1a096d.png)
So I''ll say "I won''t have a smoke till after second coffee" or "I won''t have a drink till after dinner"

* _Mindful Exceptions_ are a beautiful thing. I basically am a hard "no" on plenty of different things like animal meat or cake icing, just for example. But if it''s you''re birthday and your partner made this cake for us all to eat together I''m not going to scrape it off. Likewise if a dear friend wants to make me some special dish, and it has meat in it, I''m going to eat it and love it because I love them and want to experience the thingh they''re sharing with me. So my "down-to-zero" approach is never actually zero; it''s more like... 2%... or 10% even (like with sugar). Being confident to make mindful exceptions makes it possible to still be pretty extreme in how I cut out my addictions, without feeling like I''m throwing out the good things in life along with the bad.

', '2024-01-27 09:49:08.17101+00', NULL, '', false, 'lens-of-addiction', 'The Lens of Addiction', '2024-01-28 06:49:50.896689+00', 'ea99c482-f176-45c4-aef2-eca1ed88589b', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('&lt;iframe src="https://urgewald.org/weltspartag" frameBorder="0" style="min-height: 95vh; width: 100%;" /&gt;', '2021-10-13 16:18:53.985097+00', NULL, '', false, 'just-testing', 'just testing ', '2021-10-20 21:06:43.718536+00', 'a61a34eb-8124-4d29-8d9a-158155c82b99', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('content', '2024-05-04 14:35:22.625448+00', NULL, '', false, 'sample-testing-js', 'sample testing sb js 2', NULL, '8519dd5c-1afd-459a-b0bc-47ace7f52694', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('I had a manager once who said, "When in doubt, write it three times. Then you''ll know." Know what, exactly? They didn''t say. But time and again this has proven true for me, and the most recent is no exception, when I started by giving myself "2 days" to try writing my app in SvelteKit, and kicked off a 3-month process that taught me more about the web and the underlying technologies that power the web than I could ever have asked for.

## June 2024: Svelte

The story starts in June of 2024, when Svelte 5 had just released, with a new approach to state management built on _signals_, inline with emerging standards (basically every major framework [except React] is using _signals_ now), while implementing it with this Runes API that feels a bit more like react''s useState or like Redux''s idea of state and then actions that act like reducers to modify state. 

I''ve always loved Svelte, and I was a bit stalled out on developing the "main quest" of my app, so it was a great time for a distracting side-project, or (best case) a quick spike of work to investigate the viability of a new framework to build the app in. I would spend a couple days on it, update my understanding of the Svelte approach to things and get a chance to try out using signals for the first time.

I love writing with Svelte, and I had fun trying SvelteKit too, but ultimately I couldn''t get React Query to work with this Signals framework -- Tanstack''s `solid-query` should work for Svelte and SvelteKit now, but at the time it just wasn''t ready for Svelte 5 -- so it proved itself inviable after just a few days. 

But at the time, one of my biggest technical blockers was actually a kind of _vibe_ I was getting about being inefficient with the ways I fetch data from the server, how I''m doing N+1 queries far too often, or loading all the data on the Index page, and then re-loading a smaller, included subset of that data later. So because my blocker was that `solid-query` wasn''t ready to go yet, I ended up jumping in to the docs of `@tanstack/query` which is the basis for both `solid-query` and `react-query`, which was backing the queries in the main NextJS app.

I learned about [The Query Options API](https://tkdodo.eu/blog/the-query-options-api) for managing related queries in React Query, and I rebuilt my main layouts to look more like layouts in a modern JS app like SvelteKit. And mostly I abandoned the Svelte rewrite after about 4 days working, and spent the next 3 weeks taking all this new knowledge and tilling it back into the NextJS app, really proving to myself that I understood what was going on, the relationship between query keys, query functions, and useQuery hooks, and ditching several layers of tree-depth that had built up in my layouts over time.

##July 2024: Solid Start

I took the first week of July off, and for the second week, I spent my time rewriting Sunlo in Solid Start. Now this one, I didn''t get too far. I did this out of respect for the people behind Solid and because I had learned so much 

-----
earlier draft: 
I loved this process, so much. And while I''m not fully 100% done figuring out where to take the main code base, I wanted to tell the story a bit now, while the point isn''t about the outcomes but about the process: how much I *learned*, now just about this code base but about the fundamentals of the web we''re buidling. How it showed me the best and worst parts of my code and helped me remove complexity -- or at least move it to an appropriate place and organize it better. 

I''m actually still deciding whether to go ahead with rewrite number 2, or stick with NextJS; read on below and I''ll go through each of the three rewrites and how each one helped me understand both my project and web development as a whole.

## Modest Beginnings: Svelte, June 2024

When this began, it wasn''t part of any grand plan. Svelte 5 had just come out and I''ve always loved Svelte -- but never really used it in production / on large projects. The framework I _wanted_ to love. But I''ve always used React (and usually NextJS) because, honestly, I just ship faster this way. I''m super comfortable with React''s state/props model, and when I''m playing "professional software engineer" it''s difficult to ignore the benefits of knowing the framework everyone else knows, with the most integrations, the most plugins, the most 3rd-party support, the most examples and tutorials.

But this is my own app, [Sunlo.app](https://sunlo.app), and I can choose which technologies to invest in, and I am so invested in its structure, UX, and architecture, that I can take time to get the architecture really right. So I couldn''t pass up the opportunity to try SvelteKit 2 with Svelte 5.

----
in other news I think I am abandoning my THIRD rewrite of sunlo!! I have now tried everything but Vue and I''m p happy with my journey:

1. React + Airtable (2016)
2. React + Rails (2018)
3. React/NextJS (2020 - the currently deployed app; eventually came to a great mix of server work and client data fetching with Tanstack/query cache, but it''s too obsessed with SSR, and I just hate this webpack approach / builds are so slow. I want Vite ecosystem.)
4. SvelteKit (June) too obsessed with SSR for my purposes; my app is deliberately an SPA so I can deploy it as a mobile app with Tauri; but I do like file-based routing)
5. Tanstack Router (July) -- still React, but not NextJS. Uses Vite, client-side-first approach. They offer file-based routing but in this cool way where the CLI watches you create files and adds imperative routing boilerplate (which you then version control, and can edit)
6. SolidJS / SolidStart (August) -- very cool! Very vanilla! I really like!! But the reactivity model is just fundamentally different and I ... just... don''t feel like doing it lol. I LOVE how connected it is to the Vite world / uses Vinxi. I love how they are leaders in the Signals approach and convo and I like signals I just... I feel really quite natural dealing with React''s model of reactivity and don''t see the benefit of the switch; the ecosystem is cooler but just so much smaller.

So after all this... I think I''m going back to the Tanstack Router approach 🙈 . I can use the benefits of the huge React ecosystem but not with NextJS and not with Webpack and with client work as the default -- these guys are speaking my language more than any of the other approaches. So my stack will just be Supabase for the database and auth/storage/API, and React/Tanstack Router which serves a teeny tiny html shell with some metadata and the app''s client entry point.

Before I do this I have one more experiment to try -- switching NextJS to full SPA mode... 
', '2024-09-11 12:27:38.020433+00', NULL, '', false, 'rewriting-sunlo-three-times', 'Rewriting Sunlo.app Three Times', '2025-07-12 18:48:10.196543+00', '7da5e849-4458-4166-a2cb-56e7e3504e43', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('', '2021-10-30 14:07:18.483097+00', NULL, NULL, false, 'aaaaaa', 'aaa', NULL, 'c5cbdeeb-88d8-4359-895c-08f5ec45fd45', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('In April 2021, while much of the world was starting to see a light at the end of the COVID-19 tunnel, India was in the middle of a health crisis of nearly unimaginable proportions. During the last week in April, the country averaged over 300,000 cases per day, and that number is likely a massive under-count.

There were shortages of just about everything – especially O2 beds in hospitals – and many wage labourers losing most or all of their income. For family health reasons, my household was on near-complete isolation, but you couldn''t avoid reality. My timeline was flooded with requests, friends retweeting leads for supplies; some tech companies stopped their work to build directory apps to help supply meet demand; municipal government hotlines were flooded with calls asking for the right place to go to get the help people desperately needed; heroic efforts from volunteers and self-organising collectives to respond to the pleas for help and call every hospital in town on behalf of patients with more limited time and resources. 

This post is about the technology we used to build the site [MutualAidIndia.com](https://mutualaidindia.com), but the human factor, the crisis and desperation, are a crucial part of the story.

After a few weeks of doing this gruelling volunteer work and dealing with the second-hand trauma of the unfolding health crisis, a friend of a friend named Riddhi decided they would change tacks and focus on a different problem: during the lockdown, lots of people would die of hunger, or lose their homes, or the shortage of spots in government hospitals would mean that the poor may be unable to afford treatment in private facilities. 
 
What people needed was **_money_**. Big INGOs were accepting money into their bank accounts in London and New York, paying their staff and funding programs here that would take weeks or months and often focus on things far less urgent than basic survival. When news broke of critical Oxygen shortages in Delhi, one major fundraising site partnered with a bunch of big NGOs and raised millions to buy Oxygen cylinders – this of course did little to increase the actual supply of Oxygen cylinders, which are produced in industrial facilities that don''t scale up and down quickly; it just meant that the urban hospitals that had tie-ins with this NGO could now dictate where the Oxygen went.

It was easy to feel like we were all just re-arranging deck chairs on the titanic. So, fed up with basically everything, Riddhi started a list. [It started as a tweet.](https://twitter.com/gaachburi/status/1385139275109343236)

&gt; Hi, I''m getting a lot of questions around whom can we support financially. Want to collate  
&gt; Can you pls comment on this thread if you know of a good organisation doing verified relief work/ supporting vulnerable communities / figuring food and essentials for migrant workers etc?

And within a few hours it was a google doc, with an ever-growing list of fundraisers that needed attention, and a small band of volunteers jumping in to help.

![A screenshot of a google doc showing "Categories" and a section called "Food" and the first couple entries of fundraisers for mutual aid work for people providing food to vulnerable communities and people without adequate financial support](https://i.imgur.com/Zkg6x6A.png)

I saw Riddhi''s tweet and request for help the next day, and volunteered to help verify which fundraisers on various platforms could accept foreign contributions. It was straightforward enough; i joined the gdoc and started verifying fundraisers. 

Within a few days traffic on the doc was so high, Google had turned off a bunch of features and was permanently showing us the "please use our ''embed'' feature instead of linking people directly to the doc" alert. We were editing the doc live with a team of about a dozen volunteers. And with an aggressive social media strategy I lovingly describe as "shaming influencers," we had several days of very spikey traffic, cresting at around 50,000 visitors a day.

## Our Emerging Product Needs

The list was taking off and we were quickly getting a sense for our needs:

1. A scalable mobile-ready web interface (not Google Docs)
1. A more structured workflow for editors / people updating fundraisers
1. More structured data store to keep track of fundraisers, beneficiaries, and the times our team would contact them to ask them how their fundraiser was going (remember a lot of these didn''t have a website; they were just posting their GPay ID)
1. An easy way to tag and/or filter different fundraisers as accepting foreign contributions, as urgent, as having met their goals, etc.
1. An easier way to keep a "highlighted campaigns" section up at the top, and rotate them regularly
1. We needed it to be visually very simple, but to feature some of the amazing art that our volunteer team was producing and which had been central to our viral success
1. Bonus points: 
   1. Easy one-click GPay or UPI links (in India, GPay is one of the most common e-wallets)
   1. Some kind of analytics, maybe!


Oh, and a big one:
1. **The entire thing had to be completely free.**

We weren''t taking or raising a single Rupee in operating costs, and every time someone offered to spend a few bucks to pay for our hosting we sent them a link or a GPay ID and said "donate here instead". Heck, at times I was tempted to do the same, and every time I would just open up the list and donate ₹1500 to the top item on the list.

I know this isn''t _usually_ how we like to make tech and product choices. Usually it''s fine to spend ~20 USD to amplify efforts raising thousands, but our whole _thing_ was that we were different from traditional NGOs; we were offering people who didn''t feel comfortable buying into a sort of corporate-ized charity scene something entirely different: the opportunity to engage in and support _mutual aid_. And this wasn''t just a vanity requirement, it felt like a part of why we had been so successful getting influencers to speak out, particularly on Instagram. So we accepted this zero-dollar product requirement and worked from there.

## Options considered

We had a meeting; gathered all the inputs, wrote up a brief and some options, and considered the following:

1. Some free hosted WordPress site (might require a WP person because I don''t know WP well)
2. GlideApp which lets you build a site based on a Google Spreadsheets back-end (very attractive option)
3. We could roll our own site using some low-maintenance static site generator (I had just gotten a bunch of experience with Gatsby, so that was one option)

We ended up kind of going in a few different directions with this, putting out a call for volunteers to start prototyping each of the sites. I took the Gatsby/Airtable site; worked with another volunteer to make the GlideApp version; and we never got the WordPress site off the ground. Regardless, we discussed the tradeoffs with the team, and within about 5 days of it becoming clear we needed this website to exist, we had made our choice: we would go with Gatsby + Airtable. 


## Building The Site

As I generally don''t consider myself "a developer," I was really only prepared to do the simplest possible version of this site. So I went looking around, of course, for tutorials and ''splainer articles and sample code. The best source was actually the Netlify Examples Directory, where I found [this site: a travel destinations listing built with Gatsby, Airtable, fetch, and TailwindCSS](https://gatsby-airtable-listing.netlify.app/).

For me, this was absolutely perfect. I had worked with Gatsby but didn''t know how to set it up. I had never used Tailwind before but was already looking to try it out. I had used React+Airtable before for a hobby project, but didn''t want to have to figure out how to make `gatsby-node.js` work from scratch. This example site took care of all this getting-started work. All I had to do was tear it up: I know how to edit layouts, make little "badge" components, reshape an Airtable, create views and write how-to guides for volunteers to get onboard.

## What worked well

### Art and Soul

Thanks to the artwork of our volunteers and particularly our resident artist [Sonaksha](https://instagram.com/sonaksha), we were able to showcase the kind of art that had helped spur the original viral success of the site. 

As an example, [here is the cover art for the Zine](https://github.com/michaelsnook/mutual-aid-listing/blob/main/src/images/zine-banner.jpg) – nay, a full e-book! – that Sonaksha and Riddhi wrote for one of our fundraising pushes to help raise funds. It''s just beautiful, and so human, and kind. It captured what we were all feeling.

### Tailwind
Tailwind was a joy to work with. I love the separation of concerns (and sometimes the lack thereof), and I love the way they put configuration in javascript and then let the CSS just do styles.

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework that has become all the rage recently, especially for folks using React, and for good reason: In react, you separate components into different files, and each component contains its own markup and business logic, and often its own styles too.  With Tailwind, you write extremely granular classes like `my-4 md:my-6 bg-red-600 text-white absolute top-0 hover:underline`. Each of these classes basically maps onto just one or two CSS rules (or in the case of `md:my-6` a media query and then a margin-top and margin-bottom). 

So why not just write bare CSS? Well, Tailwind uses PostCSS to apply all the browser prefixes you could ever need, and then "purges" the CSS output to include only the classes that are actually used in your application, so it''s close to the same bundle size as writing bare CSS, and a lot less error-prone. It''s also a lot quicker to type `my-4` than `margin-top: 2rem; margin-bottom: 2rem` and easier to read. It provides good support for transitions, gradients, dark mode, and more.

Now, I had already started adopting something close to this approach with recent releases of Bootstrap, which had started offering many more utility classes, as well as grid utilities that made it easier to break out of the pre-defined layouts and components and just make your own. But I was doing it with SCSS, and relying on SCSS to create my own branding and design language. What I loved immediately about Tailwind was the choice they had made to define their post-processing behavior into a [`tailwind.config.js`](https://github.com/michaelsnook/mutual-aid-listing/blob/main/tailwind.config.js) file, where you can rename colors ("blue" -&gt; "primary"), define new font family classes like "body", "slab" or "serif", and customize your colors by choosing from a library of variants like "pink", "rose", "fuscia", and so on.

This, for me, took it from being a CSS "library" to a real framework. It meant I wasn''t making my own decisions about whether to use `variables.scss` to define my own color values and paddings, and then figure out how to use the pre-written mixins to extend various utilities; I just had to _configure_ the processor, and it would generate all the classes I needed.

### Anything but a Google Doc

Moving off of the unstructured text of a Google Doc led to _immediate_ gains in productivity, lower time to edit and update fundraisers, fewer errors and easier inspection of what went wrong when errors did crop up. Airtable gives you creature comforts like a "last edited" field, and even lets you set more specific conditions like "when was the last time someone edited one of the following 6 fields...".

**Down sides:** Airtable, at least the free version, doesn''t give you the ability to apply validation rules to your inputs, so we could say "this field is a URL" and it would only accept inputs that looked like URLs, but we couldn''t say "this field is a slug and it must match this regex" or "if the record has the ''google pay'' tag then the ''gpay_account_id'' field must be filled in". It seems this is just the kind of power and flexibility you lose when you are not in control of your own content management. So you have to handle these things with training, keeping the team small, and reviewing records frequently.

### CloudFlare Pages

We hosted the project on CloudFlare pages, which has an extraordinarily simple interface for developers, connects straight to your GitHub repo, and builds a new version of the site any time you push a commit to any branch. 

**Down sides:** At the time, you couldn''t have it automatically rebuild the site every few hours. So a fellow volunteer set up a Github Action to push an empty commit every 2 hours.

**Bonus up side:** The CloudFlare discord was really helpful and I had a couple questions answered directly by CF staff!

### React Hooks-based Components

I had never used Hooks in react before, but I was ready to get started! I never liked or trusted the old class-based approach so I was lucky that the repo I was copying already had a few examples of useState and useEffect, as well as one custom effect that combined both. I was able to build on this working sample code and adapt it to my own needs and had a fantastic experience learning this new paradigm.

Because I''m not very technical, I often struggle to learn new things when I don''t have a mentor around, but this kind of very simple listings-page website was a great way to dip my toe in the water. For example, this [DismissableAlert component](https://github.com/michaelsnook/mutual-aid-listing/blob/main/src/components/DismissableAlert.jsx) only needs to know whether it has been dismissed or not, and needs to be able to dismiss itself. So the opening lines of the component''s code look like this:

```javascript
export const DismissableAlert = () =&gt; {
  const [isAlertClosed, setIsAlertClosed] = useState(false)
  return isAlertClosed ? null : (
    &lt;div className="relative bg-yellow-100 py-5 px-8"&gt;
      &lt;button className="absolute top-0 right-0 p-3"
        onClick={() =&gt; setIsAlertClosed(true)}
        aria-pressed="false"&gt;
        ✕
      &lt;/button&gt;
```

Simple enough, right? We just use React.useState to declare a state `isAlertClosed` and when someone clicks the "X" we call a "set" function to close it. This is exactly the kind of easy on-ramp that a dev like me – without a ton of React experience and no senior developer to guide me – was looking for.

## What Didn''t Work So Well

### Gatsby

When Gatsby was released it was heralded as the next best thing to happen to websites. And in terms of popularizing the JAMstack approach to web dev (Javascript, APIs, and Markup), it kind of was. It''s a static site generator that has a rich plugin architecture to manage things like your `&lt;head&gt;` section, image scaling and thumbnails, Google analytics and outbound link clicks, rendering markdown, and so on.

But my experience was that I had landed right back into the kind of WordPress''y hell where you have 5 community-supported plugins that do the same thing, and the official plugin hasn''t been released yet or has been deprecated in favor of something else.

But what really slowed me down was Gatsby''s insistence on making me use GraphQL for _everything_. I''ll be upfront: I don''t know GraphQL. I understand it seems like it is meant to perform a valuable function – let devs issue queries to the database/API and be very specific about what fields and/or nested objects they want it to return. 

But I absolutely do not understand why I need to use some Gatsby plugin-specific code nested inside a graphql query in order to fetch and display an Image. Plugin, I just met you. We are not friends. I am just copying and pasting code from the docs. Thank goodness most of the fetch-and-display logic was written into the site before I found it because, although [I could vaguely explain what this code ends up doing, I really couldn''t explain how it knows to do that](https://github.com/michaelsnook/mutual-aid-listing/blob/main/src/components/Hero.jsx#L73).

I even managed to re-use the fragment in several places, but, [what is happening here](https://github.com/michaelsnook/mutual-aid-listing/blob/5e1b2d6e43393a63cfa0c701a238343af0b74e06/src/pages/mixtape-2.jsx#L80)? There is some type declaration happening too? Am I using TypeScript now also?

Suffice it to say, I tried two or three times to upgrade the Image plugin to the non-deprecated one recommended for Gatsby-3, but it had a different way of going about these graphql queries and I was never able to figure it out. This approach to managing data means that just to feel even slightly comfortable using Gatsby the developer has to:
* Use GraphQL which there''s a good chance they''ve never used before
* Understand how the "export" directive works and also how Gatsby will use it for other pages and components
* Understand how Graphql uses parameters and types, in a base-level-syntax kind of way that can actually be tricky if you don''t have guidance
* Understand how your particular plugin works and creates Graphql functions or fragments that we don''t ever seem to explicitly import but which are there and are mandatory.

You also have to [figure out `gatsby-node.js`, which, even for a very simple site like ours, looks pretty strange](https://github.com/michaelsnook/mutual-aid-listing/blob/main/gatsby-node.js), like a weird mix of configuration and code. (And what is this `return new Promise((resolve, reject) =&gt; { ... })`? I know about async/await but this is another level.)

Months later, after about a year of working with Gatsby, some of it with support from senior engineers, and several months working with a much more sensible static react site generator (NextJS), with stronger fundamentals in es6 and promises, it all makes a bit more sense, but for a developer uncertain about any or all of these issues, I would just say don''t even touch it, or find yourself a framework where generating paths and fetching state site data makes a ton more sense.

### Airtable is Not a CMS

Airtable was actually really convenient for keeping track of the fundraisers, tagging them, keeping track of their goals and when they''d met their goals. But it''s not a CMS. The lack of basic validation features, mentioned above, is aa big hindrance when the team grows beyond the very small set of people I speak too on a daily basis. 

And perhaps more to the point, when we wanted to add new pages with custom content, while it was _possible_ to add arbitrary HTML to an Airtable field, how would you even structure a page with, say, 4 sections on it? Would you make a Table called "sections" and each section has a heading and content and a field for "what page does this show up on" and/or "what order does it appear on that page"? Or would you give each fragment a unique name or slug and then write pages that just for "display this fraagment, next display that fragment", so you''re sort of hard-coding the layout and order of things, but not the words themselves?

I understand that the paid Airtable has some options for improving on this, but I would much prefer to use a system that is _meant_ to manage content, like using a headless WordPress or a system like Contentful.

In theory, a JAMstack site like this one _should_ make it easy to pull fundraisers from Airtable and then build content pages from the CMS – e.g. a featured campaign with a more in depth story about that particular fundraiser – and have the content pages include up-to-date data about the campiagn in question, pulled from the Airtable. But then again, I might have to promise my firstborn child to the gods of gatsby-node.js in order to make that work. (jk, [I think I know where](https://github.com/michaelsnook/mutual-aid-listing/blob/main/gatsby-node.js#L38) I would do it.)

## Conclusion

The Mutual Aid India site was a joy to build, perhaps most directly because I was working with a really clean code base of React and Tailwind, that felt new and fresh and still mostly comfortable, and because the requirements were pretty straightforward and didn''t require a complex back-end or a larger team. And because the team I was working with, and whose project I was building all of this for, was full of such incredible people with such great hearts and sharp minds.

We got the site off the ground in less than a week, while the second wave was still peaking and attention was high, and we were able to raised tens of thousands of dollars that went directly to people in need.

We got to show, and practice, a new way – actually, a much older way – of helping others. We didn''t ask them to send us receipts of their purchases or make poverty-porn videos to post on social media, and we attracted enough notoriety to help them tell their stories to the press, and to explain why supporting mutual aid is important for everyone to do. We treated everyone with dignity and respect, like full human beings with a right to live, to survive and so much more.

I learned so much from this project – not only about making websites but about myself and the people around me. I made friends I respect and admire, who built a community out of the darkness and the thorniest pieces of our shared feelings of isolation, disability, and despair, and whom I hope to stay close with for a long time. Here in India, the pandemic continues, though the media-and-influencer attention has moved on to other things. But I am proud of our work, our team, and the help we were able to provide. 10 out of 10, would build it all again.', '2021-07-08 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/mutual-aid-india-screengrab-18f581.png', true, 'mutual-aid-india', 'Building MutualAidIndia.com with Gatsby, Airtable & Tailwind', '2024-05-08 08:37:39.560608+00', 'c5caddb5-cb8b-4166-ba19-717c017098d7', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2021-08-18'),
	('My feature idea: conditional formatting rules in Google Docs -- not spreadsheets, text documents. Useful for highlighting names of colleagues who are owning certain tasks in a project document, or for highlighting tags like "critical" or "completed".

Right now it''s surprisingly difficult to tell the application, "find every line that starts with ''DONE'' and format that line as strikethrough", or "Find every time my boss''s name is mentioned and highlight it with bright colors." -- I can turn it into "==!!== NAME ==!!==" with Find & Replace, but I can\''t set its font size or background color and I can''t enforce consistency of that rule throughout the document, which is a problem if other people are editing it and shouldn''t be troubled to follow my crazy formatting whims.

[The original musing about it on Facebook](https://www.facebook.com/michael.snook/posts/10102094430057186)', '2015-05-05 00:00:00+00', NULL, NULL, true, 'conditional-formatting-docs', 'Wanted: Conditional Formatting in Collaborative Text', '2020-04-07 13:06:21.905+00', '1783e6a1-3a79-4f2e-b5fe-d9965c0c7647', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-05-05'),
	('Long ago I "managed a team" and I wanted to keep managing teams, and bigger ones with more people and bigger budgets. But the anarchist in me hated this vision of success, and I left for more of an IC/freelancer approach. Recently I had the opportunity to work with a team who was without a direct manager for some time, and I was there to help maintain some leadership continuity, but didn''t have nearly the time to provide line management to a team of this size on my limited hours. But in that scarcity of time, I was forced to say, okay, I can''t be your boss or your manager; I don''t have the time to wield that kind of power well, so I''m just going to _suggest_ a bunch of things and _describe_ a bunch of things. It worked kind of beautifully in some ways I''d like to write about. 

First I should say, I went into this job being very explicit, that I was there as a "coach and analyst". Ultimately, everything the team members do is up to them; they''re responsible for the outcome. But as an technical or product analyst, one of the first things I''m going to do is look for the diagram of the system, read the documentation, or (as is often the case) make my own diagram. Or I''m going to ask to see the roadmap, and I''ll look over it and ask people if their section is up-to-date; if some past project should be marked as done, or overdue; etc.

And what happens when you simply _observe_, and record, and repeat back what is already in place and what people are currently working on... is people can see what they need to do already! Or, in one example, I asked about a long-overdue project that was marked "in process" (not "done" or "blocked") and the person said oh phase 1 is done but we actually can''t start phase 2 for another 2 months. So at that point, I suggested we edit the roadmap to cut the project into phase 1 (complete) and phase 2 (not started yet). And we got to have a conversation as a team about _other_ projects that seem to drag on forever, and why it feels that way, and whether we can either reframe our work, or actually restructure it, to create an ebb and flow of our attention, a beginning and ending to predictable time periods, allowing for a sort of in-breath and out-breath to the project structure.

If this were a software team, you might call them sprints, but sprints are just one-at-a-time units of doing tasks. So you''d be better off calling them Epics of related tickets. And in Epics you often focus on having fewer epics open at a time -- you might set a limit like "only 3 epics open at once" to manage attention for the team, reduce context switching during sprints, and so on. 

By the end of it, it turned out that nearly everyone on the team had _some_ project that was dragging on and feeling like dead weight overhead, which we could actually just split into a couple phases, or we could say, "Come to think of it, we''re done with this project. We can close it out, and take the final remaining items and either ditch them or move them to some other upcoming piece of work."

It was great! I feel like the mood lifted a bit and people had a better sense of what was on and what was off the burner at that moment. And when you have this, and you can depend on its accuracy, it''s easier to see what projects are coming up, and it can motivate you to _finish_ the one you''re working on now so you don''t get behind on the next. This is the kind of _self-management_ that motivated professionals will do if they are seeing their work clearly like this, so I don''t have to pressure them to finish up a project; they already understand _why_ they need to be a bit ruthless about putting a bow on this piece of work, because they want to start fresh next week without feeling distracted.

## Part 2: Equal Coaching
', '2022-09-08 16:20:02.605352+00', NULL, '', false, 'management-from-my-inner-anarchist', 'A Management Lesson From The Anarchist In Me', NULL, '7a0e52a6-713a-48ce-976e-a00fee1d61bd', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('A radical socialist libertarian pacifist futurist party, dedicated to the peaceful exploration of space in the name of all humankind.

So far The Space Party mostly exists as:

* Members of [a project](http://coactivate.org/projects/spaceparty/) on CoActivate.org. The coactivate project has about 8 members and a wiki.
* There is some sort of website happening at [TheSpaceParty.org](http://thespaceparty.org).
* The [Facebook page](https://facebook.com/SpacePartyUSA) has over 4,000 people on it!
* And there''s a fun but sporadic Twitter feed, [@SpacePartyUSA](https://twitter.com/SpacePartyUSA).', '2014-05-25 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/space-228-1980ce.png', true, 'The-Space-Party', 'The Space Party', '2022-12-18 14:31:50.92552+00', 'e96799c4-a714-4489-a3da-23b3eae64c97', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2014-05-25'),
	('In March of 2020 I decided it was time to rebuild my personal website using some new things I had learned. 

I have had a personal website since I finally got a real footing in website building with Jekyll and Foundation, using Markdown pushed to my GitHub repo for posts. My work is more Product than Code, but there''s a fair amount in the realm of the actual coding, _building things_ that I can do, and it brings me a lot of joy and makes me more effective in my professional and activist life. And it''s fun. I love learning and I love the idea that I can conceive of a thing and _then build it_ and not be held back by all the little parts of the "full stack" that I can''t do up to my own standards of excellence.

Since that site was built, I did a lot more work with various large-scale server-side applications (like Rails), and learned a fair amount working in React, mostly on small projects. So I kind of came at this project sideways – my primary goal was actually to learn, to use and build on new  knowledge, and to have fun. 

So I the final product/goal was decided:
* A personal blog, basically
* With the ability to add some custom pages, which I would be fine to / happy to code myself as needed
* A really nice developer experience and the ability to hook into and play around with little interface things that suit my personal interests like content editing UX, accessibility and language and content that''s dynamic and responsive to the audience, etc. 

And the initial direction for implementation paths was basically already set based on my recent experience and motivations for the project: A Rails server with a React client. We''d use Rails to define API routes that would return JSON, and the react app would have components that fetch the data and display it to the reader, e.g. `&lt;Post id={id} /&gt;`

## Architecting a Solution: Two Apps or One?

How to mount a React app and a Rails app together turned into the biggest question for how to implement this site. I''m not doing much non-standard with the server, and  for the front-end I would be happy to use Bootstrap SASS and the Rails asset pipeline.

I knew I didn''t want to mess with versioning a server and client app in tandem (maintaining this site is not a job for me, it is an incredibly part-time side-project). But how to mount a React app _inside_ a Rails app is actually a big question all across the community with a few different rapidly-evolving solutions. Here was my list of implementation constraints:

1. One repo/project for both Client and Server
1. Hostable on Heroku (the only place I really felt good running a Rails server/DB)
1. I didn''t want a really thick layer of coupling between the Rails and React code. I wanted to _feel_ like I was just writing a Rails server and a React client, keeping things fairly vanilla so that the new skills I learned would be portable
1. Both Rails world and React world are fast-changing, with libraries and paradigms and pipelines and dev tools coming in and going out of fashion all the time. And since this is such a part-time thing for me, I had yet another reason to keep things very vanilla, to use very stable dependencies and tools

## Two Common Solutions: react-rails and react_on_rails

Much of the debate I was privy to at the time was about these two methods, using either [react-rails](https://github.com/reactjs/react-rails) or [react_on_rails](https://github.com/shakacode/react_on_rails), which are Rails gems that allow you to write React components directly inside your Rails views, like this:

```
&lt;%= react_component(
    "PostsPage", 
    props: @posts_list, 
    prerender: true
) %&gt;
```

The approach is exciting for a big production app, especially if you have an existing Rails app and you are trying to migrate over parts of the front end from some other solution to React. At work we had a big giant Rails app with jQuery/AJAX to handle forms and transitions, that badly needed an upgrade to a more React-like solution, so I could see the value of this Component-in-ERB approach. 

But for me... I just wanted to learn more about working with Rails and React; I didn''t want to learn this middle-layer''s special ticks and idiosyncrasies. So I ruled this entire category out and kept looking, not so much for some gem or npm package, but for a really solid example or instructions manual on how to seamlessly place a React app inside a Rails app''s natural Javascript asset-building/-serving process.

As my search progressed and the ideal approach started to take shape, I found [an absolutely fantastic tutorial on Digital Ocean''s community tutorials site](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-project-with-a-react-frontend) that met all my requirements and then some. It''s an example site and repo with step by step instructions for how to get started and how each critical piece is added in order. I highly, highly recommend it.

This approach works by placing a pretty standard React app with its own react-router inside the folder `/app/javascript/packs`. The Rails app''s router has a namespace for `/api/v1` and very simple controllers to create, edit, destroy, and update posts. Every other url gets sent off to application.erb, which includes a simple tag provided by webpacker, which is our entry into the React app:

```
&lt;%= javascript_pack_tag ''Index'' %&gt;
```

At this point, the react-router picks up the work of deciding which components to display, and those components are responsible for knowing how to fetch data from the Rails API. It''s nice and clean, a proper Rails app and a proper React app, without much time spent dealing with the layer of glue between them. 

Though the glue layer is thin, using the the Rails view as the entry-point to the React bundle means we can use Rails''s built-in CSRF tag seamlessly and pick it up in the React app:

```
# in application.html.erb
&lt;%= csrf_meta_tags %&gt;

// in any React component with a form
token = document.querySelector(''meta[name="csrf-token"]'').content
```

This was such a nice touch for me! I really feel like, given the requirements and constraints I had at the time, this solution hit the nail on the head. I''m quite pleased with Digital Ocean for cultivating such a great set of tutorials, and to [Chuks Opia](https://www.digitalocean.com/community/users/troy34) for writing this one.

## The Final Product

In the end, the final product for the site was kinda-sorta satisfying. I give it a 6, mostly because I just never went very far beyond what was in the tutorial because ultimately, I still felt pretty much out on a limb. I did build a nice little side-by-side realtime-preview editing interface though, which I am quite happy with!

![A screenshot showing a browser window where the left-hand side shows a form for items like Title, Excerpt, and post Content, and the right hand side shows a preview of what the blog post will look like.](https://i.imgur.com/gMNoPIa.png)

And the design of the site itself, I''m pretty happy there too! It''s quite minimalist, but has some of its own flare. It''s a bit more "vanilla bootstrap" than I love, but with my own colors and fonts and enough personality that I''m not worried it looks thoughtless.

![A screenshot of this website''s front page showing a big banner image of mountains and a lake, the site''s title and blurb, a cartoon drawing of the author, and the first few entries in the list of posts.](https://i.imgur.com/Tf0Rwck.png)

## What I Would Change

There are still some issues from the basic feature set that I just never really got around to dealing with: 

1. A proper login system to administer content securely without having to go into the database itself
2. Some integration with s3 to upload and store images without having to host them on imgur or similar
3. A "draft" post status
4. Moving other aspects of site management – like the metadata, share links, title, blurb – into the database so they can be updated without changing code

And frankly, if I could do it all over again, I would do a few things differently, either because I''ve learned more and have different skills constraints, or because some of the choices weren''t right in the first place.

**I would ditch Bootstrap for TailWind.**

What I liked most about Bootstrap 4 over version 3 was that it had so many new utility classes that you could style most things using utilities alone, rather than using (and constantly fighting against) their built-in component concepts. Well, I''ve since learned that there are others doing this better, truly utility-first front-end frameworks like [Tailwind CSS](tailwindcss.com). I''ve used Tailwind for [another project](https://mutualaidindia.com), and I''m pretty much in love. It''s just so much easier to use; I write less code, I have fewer abstractions and middle-steps to think about, and the resulting bundle size is a lot smaller. 

My work with Bootstrap required me to essentially learn this other language – Bootstrap''s own markup+class combinations – and I would over-rely on SASS to let me create a bunch of my own custom classes and components, which meant I was kind of creating my own design language on the fly, which I then had to learn, remember, debug and QA. (In some cases it will of course be worth the time and care to create your own design language, but then again, Tailwind and PostCSS have tools for that too.) If I were doing this over again, I would try Tailwind for my styles.

**More Framework than just React**

In this case I specifically avoided going down a Server-Side-Rendering rabbit-hole because of the complexity involved, but since the time I initially build this site there have been huge leaps forward in frameworks like Gatsby and NextJS that allow you to "just write react" and _also_ get advanced features like server side rendering, preloading links, lazy loading images, tools to help with your lighthouse scores, and so on. The tools are there; I should catch up; it''s not so hard.

I would be keen to try NextJS in the future, and I do plan to try out their blog tutorial to see how I like it. It looks like an interesting mix between "alternative to create-react-app" and "alternative to Gatsby", with a lot of these ecosystem details like Webpack and linting all set up and taken care of, plus some conveniences like their own [file-system-based routing system](https://nextjs.org/docs/routing/dynamic-routes), and a Hook called [useSWR](https://swr.vercel.app/) that wraps the fetch process in some nice defaults and utilities handy for this "SSR + live-and-reactive" world I want to live in.

And I''m interested in [Svelte](https://svelte.dev/) – it almost seems too good to be true, so why not give it a whirl.

The point is I feel like I should be able to use the site as a bit of a playground for different front-end approaches, while keeping the Rails app, the database, and even the branding/styling pretty consistent and stable. This fits with my overall philosophy toward developing stable but innovative software in small teams and medium-sized networks. 

For the networks of activist groups I''ve spent most of my career working with, their data is the key to their membership and their donor base – so it has to stay stable, and any security breach could tank the organization overnight. But when it comes to providing rich and creative experiences for users, engaging with online content, consuming news and information, sharing on social media and messaging apps, engaging with and creating and remixing and submitting video, photos and audio... we have to be able to be creative with the sites we build! If we don''t, we''ll lose out to all the other things fighting for people''s attention, or to activism businesses like Change dot org and corporate marketing campaigns. But if are able to keep our apps fresh and dynamic, and keep our dev teams limber, so to speak, we can keep innovating and be responsive to great ideas, even when our scale is big and our teams are small.', '2021-07-02 00:00:00+00', 'A quick run-down of how this site is built', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/logos-for-rails-react-heroku-1980ce.jpg', true, 'under-the-hood-2', 'Under the Hood 2.0: Rails, React', '2022-12-18 14:50:41.777391+00', '81dc168f-b84c-40e1-bd27-79493e58da76', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2021-07-02'),
	('Go on, I dare you  
I could hurt you  

Then what''s stopping you?   
Well I don''t want to hurt you  

It''s okay, you can''t   
You don''t know

Haan okay if you do, make sure to leave marks. Some ink under the skin, a spell rendered, a story to recall  
Oh perfect, I''ll be a story...

... but you might regret it    
I could never  

What if I regret you   
I won''t let that happen

I''d murder you if you did  
Go on then, I dare you
', '2023-05-26 16:29:15.984426+00', NULL, '', false, 'free-hand-26-05-2023', 'Free hand 26 May', '2023-05-26 16:43:00.567204+00', 'a61833a8-72cb-4d74-92de-175fad91bfa0', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('', '2021-10-31 18:39:47.783+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/image-from-supabase-example-18f41a.jpg', false, 'asasas', 'asasas', '2021-10-31 22:33:28.824705+00', '2e3edfa6-8f4f-45d9-86c3-cb0e684eacc6', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('App idea: CanvassStarter. Pick the neighborhoods your progressive organization wants to canvass; enter a question or two, and a bid for price per door.

Three or four organizations all want to canvass in the same place? Great – now we can all afford to do it! Not all their target voters are the same? fine by us! We''ll use different scripts for those voters, and the increased target density will still make the canvasses cheaper for all involved. This leverages not just economy of scale, but economy of density.

**CanvassStarter is especially geared towards relatively low-budget organizations looking to build a bridge between online and field** (such as by building up a local organizing chapter around a high-energy moment or event), and for organizations who have a loose sense of others they\''d want to partner up with, but **who find it unwieldy to assemble coalition efforts due to the logistics field organizing and the complexity of ad-hoc coalition-building across different target geos and demos.** So in this sense, it''s like KickStarter for canvassing a neighborhood. And if you''re one of the funders, your question(s) get asked.

We''d want to partner up with proven canvass-managing organizations, and there''d be some work to figure out what options are needed for neighborhood-based and voter-based bid options (like rolling our own Google Adwords bidding system, but not in a competition model, but then sometimes on a script-level basis in a competition-for-placement model). So the technical and logistical challenges are real, but mostly the service would attempt to stay lean and solve a lot of financial, political, and networking problems for highly aligned but distinct progressive advocacy organizations.', '2015-05-24 00:00:00+00', 'An app idea/concept, like KickStarter, but for your canvassing campaigns', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/canvasser-holding-some-lit-1980ce.jpg', true, 'canvass-starter', 'CanvassStarter', '2022-12-18 14:39:20.545204+00', '7035f715-29cb-40c8-9bb1-d947f73a2cf9', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-05-24'),
	('_roof shingles  
not mine  
but Someone''s  
home and comfort  
not here  
but Somewhere  
there''s peace and quiet  
not for all  
but For me  
foreign streets still welcome  
not loving  
but Relenting  
to power and force  
and Will to dominate  
these parks and harbours and proud others  
not strategic allies  
but Sisters and brothers We see  
when we look believe  
when they speak give up our  
day Off to fix the leaky roof  
or Give up our distance and our  
exclusion and our comfort  
so They may know the  
peace We covet because life is short and memory is long--  
or life is long and memory is short--  
who can remember?  
we give up our comfortable beds to  
another or for the stepping out we have  
chosen not to take, chosen not  
to See the textures, the wrinkled  
faces and cracked shingles of  
brothers and sisters We forgot_', '2015-09-17 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/notepad-and-pen-1980ce.jpg', false, 'unnamed-poem', 'Unnamed Poem Written Far From Home', '2022-12-18 14:44:37.785406+00', 'b980f435-8394-46aa-80df-33200fd3574d', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-09-17'),
	('This frustration has been bubbling up for a while, and it''s almost difficult to write about because there are so so many examples of Democrats, Liberals and Leftists getting this wrong. And not just a little wrong but Wrong with a capital "W" and a great deal of certainty. But I guess this is somewhere to begin, so I''ll jump right in.

When the right does things that seem hypocritical, lefties and liberals love to point out the hypocrisy. Love it. Just absolutely in love with the hypocrisy attack. 

* You claim to be pro life but when the babies are born you oppose funding childcare!
* You claim to care about women''s rights in Afghanistan but war is bad but Afghan women opposed US intervention!
* You claim to want small government but over-policing is big government!

This is silly for a number of reasons, but I''ll lead with two: 1) it doesn''t persuade voters or change minds, 2) there is ALWAYS a better line of attack. And bonus, number 3) The right is _lying_ when they say they are pro life, care about women''s rights, or want small government, and you are basing your argument on the notion that they are telling the truth. You are 100% playing into their ruse, playing on their turf, and handing over your power to them.

&gt; ## Hypocrisy isn''t the takedown you think it is

', '2021-08-27 14:18:54.973+00', NULL, NULL, false, 'no-such-thing-as-hypocrisy', 'Don''t Call Bad People Hypocrites When You Can Call Them Bad People', '2021-08-27 14:18:54.973+00', '171c8683-87aa-4408-88de-2fbe599dd6b3', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('It is making my stomach turn to have to say this, but: 

&gt; I absolutely cannot support the idea of using the terrorist watch list as our way of regulating access to guns. 

It''s not just a little off, it''s downright wrong. It legitimizes 
the existence of this list, which has no transparency or due process, no judicial oversight, and whose existence the ACLU opposes. 
And worse, it''s a cowardly attempt to "get something done" that _still_ relies on the use of [brown] terrorists as 
the political and rhetorical boogey-man.

I love, love, love, that someone in Congress is finally standing up and disrupting business as usual to make something happen on gun regulation. I welled up when I first saw the headlines. I was so proud of having helped Chris Murphy (in my own small way) get elected to the Senate in 2012. 

But that feeling quickly wore off when I read what was actually happening. Even on this issue, which should be a slam dunk for Democrats right now, it happens that the party that''s ostensibly on my side is doing things I find to be not just imperfect but harmful and counter-productive. **Taking shortcuts with civil liberties and racial animus should never be acceptable strategies for getting a bill across the finish line.** Shame on the Senate Democrats for their opportunism, for this moral and political cowardice. And now we''re going to have a facebook feed full of liberals and progressives vehemently defending this approach in terms of both the policy and the politics.

I''m not against compromise, but compromise means you put up a bill to ban *a lot of guns* and eventually say yes to a deal that just bans *some guns* plus high-capacity mags. It doesn''t mean that you pick an approach that appeals in one part to your base and in another part to the worst instincts that feed and strengthen your opponents over the long-term. 

This seems to be the Democratic way of doing things – validate the bad worldview to get the good result. (And it''s seen as a virtue! a sign that one knows how to Get Things Done™.) But it''s a recipe for a generational backslide like the one we''ve been experiencing all my life, and it does nothing to build the kind of political culture and meaningful narratives that will help us when the next Iraq War comes up for a vote, or the next Welfare Reform, or the next Crime Bill. The GOP is a huge and active driver of culture in their own way; on the left, social media and hollywood and pride parades and #BlackLivesMatter drive culture – and Democrats just keep sucking.
', '2016-06-16 00:00:00+00', 'It is making my stomach turn to have to say this, but I can''t support using the terrorist watch list as our way of regulating guns. It''s not just a little off, it''s downright wrong.', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/watchlist-1980cf.jpg', true, 'gun-regulation', 'How Democrats Managed to Fuck Up the Gun Control Filibuster', '2022-12-18 14:45:53.619019+00', '01a57c3a-c461-4ef8-b459-cd66a0181fd7', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2016-06-16'),
	('Today I finally got around to trying out a new technique I heard about a couple
weeks ago -- and wow, I wish I had known about this earlier. By placing a simple
link on your website, you can give your mobile and tablet visitors the ability to instantly share your page with friends using the popular WhatsApp messaging service.

**If you''re on a WhatsApp-enabled mobile or tablet device, [click this link to try it out](whatsapp://send?text=Wow%20this%20WhatsApp%20thing%20is%20amazing%21).** It''s that simple. No Javascript, no OAuth, no wrangling of permissions.

Here''s how it''s done:

1. Add this code to your page:
    ```
    &lt;a href="whatsapp://send?text=[[ URL encoded message ]]"&gt;
      click this link
    &lt;/a&gt;
    ```
1. Celebrate.

Aside from the incredibly easy setup, one of my favorite things about this is the seamless user experience: the link opens up my WhatsApp conversations list, showing the friends I talk with the most and am the most likely to want to talk to about the action I''m sharing.

Perhaps even more promising, this approach has the potential to spark ***real conversations*** between your members and their friends. It''s not a broadcast medium like Twitter or Facebook, so you''ll probably only get one impression out of it, but it''s likely to be orders of magnitude more impactful than any impression from those other networks -- and engaging in real dialogue could do a lot more to galvanize your members than simply getting them to start a thread on Facebook.

For something so easy to deploy, it''s worth a test, right?

**[Love this idea? Click here to share it with your WhatsApp friends.](whatsapp://send?text=Check%20out%20this%20fast%20easy%20way%20to%20get%20people%20sharing%20your%20page%20on%20WhatsApp!%20http%3A%2F%2Fsnook.pub%2Fposts%2F2015%2F06%2F05%2FEasy-WhatsApp-Shares.html)**', '2015-06-05 00:00:00+00', 'A quick how-to on easy WhatsApp sharing links', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/whatsapp-logo-with-two-silhouettes-1980ce.jpg', true, 'easy-whatsapp-shares', 'Easy WhatsApp Shares', '2024-05-03 10:17:51.830038+00', 'dd2cc05f-5101-4108-8200-289e8ecc9401', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-06-05'),
	('content', '2024-05-07 18:26:15.993654+00', NULL, '', false, 'test-title', 'mmm a title', NULL, '931e6853-2199-4da3-ab8b-1c1c224b9dc7', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('I was procrastinating the other day, and went Googling for a better ID. I''ve been using UUIDv4 for years, but I was reading about how their randomness can cause the database to do a bunch of extra work rebalancing your index trees when you''re doing a lot of inserts all over the tree. 

And to be honest, I kind of hate how they look: `11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000`. ("Help, they''re plugging me into the matrix!" vibes. Strings like this are how I imagine I might express my desires after my consciousness is uploaded to the cloud.) 

I don''t mind the shape of them, but they''re huge, and formal, and they look pretty bad in a chat:

&gt; Hey friend, how''s it going? check out this phrase https://xampl.app/phrase/share/4677f15a-1cd9-40a3-876c-30662c5eec3f

So a couple hours of searching and reading turned into some hacking, and then writing, and then re-hacking and re-writing... and now **I present to you a new GUID called xkcid: "😘 K-sortable Compact Identifier"**.

I''ll walk you through my reasons and my thought process, but first, here''s what it looks like: `2zwt79n5-kbr3i5`

&gt; Hey friend, how''s it going? check out this phrase https://xampl.app/phrase/share/2zwt79n5-kbr3i5

## 0. Background

Okay, UUIDs are ugly but... why? Why are they all so long. Why are there 8 versions of the UUID spec, plus a cottage industry of custom implementations like:
* `1831102147731652608` (Snowflake ID)
* `01ARZ3NDEKTSV4RRFFQ69G5FAV` (ULID)
* `1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2` (Bitcoin uuid)  

Why are they all so... aggressive? Why do they seem so stuffy?

Well, for starters, I assume it''s because they''re balancing a lot of different requirements, so if we''re going to make improvements, we should be prepared to make some compromises and prioritize happiness ❤️

So what''s wrong with the existing IDs? (Let''s get really personal here. What do we really hate about them? What do they do that makes us feel bad feelings?)

1. I''ll tell you -- they''re ugly! When I get lost in the middle and have to find my place again, it''s frustrating and makes me feel stupid. 
2. They''re so loooooong I immediately know I will never type this or ask another human being to type it. 
3. They have such bad vibes you don''t even want to look at them long enough to see if two things have the same ID. Even this level, this "just tell me the last 4 digits" approach feels painful. If I had a headache already, this would make it worse.
4. Can you imagine trying to type this bitcoin style ID, going from lowercase to uppercase letters over and over and over again... You''ll never get through it on a phone. Just go to the computer. This is now a big-screen activity.

Okay so now we''re feeling repulsed, ashamed, isolated, disoriented, and discouraged... let us cook.

## 1. Sticking with "Global"

No matter how cute and welcoming we make our ID, it still has to be a good ID. So we still want to encode a timestamp and be roughly time-sortable (alphabetically). And it should still encode a bunch of randomness so that if for some reason a boatload of events fire off at the same time and create a bunch of records, you''re still safe from collisions.

This stuff is really important. (I do not want to code the "collision recovery" logic into all my UIs 🙏 whenever I need the ID generated on the client.) But honestly, when you ask the bros about what''s so good about their favourite ID, the answers will stress you out.

They will say stuff like, "if you put one Earth around all 200 Billion stars in the galaxy, and then everyone on all those planets signed up for your app at the same time, and then they had to beam their form submission data using a subspace relay to get them back to your server, you would _still_ not have a collision."

Dude. Calm down. When we have 1.4 sextillion users I will no longer be working at this company, it will be someone else''s problem.

So we are just doing a Global ID over here. How about we say... what if 1 Billion people sign up over the course of 3 hours. That''s more than global. If we get it that good, we can go home  early and hang out with our buddies; we don''t need to do more. Do you hear me? _We don''t need. To do more._

"What if a few things come in at the same millisecond and those things end up not sorting perfectly?" I don''t care! Let''s just get good enough that _an individual person_ won''t be filling out new forms or clicking new buttons within the same timeframe, and we will be fine.


## 2. Keep it short

In pursuit of readability, type-ability, low headache factor, etc., the _length_ of the string keeps coming back up. It feels like trimming the length is one of the biggest drivers of this change. So we initially chose the largest reasonable character set, a base 58 set with all the numbers and letters except 4 of the ones that look like other ones:

```
const symbols: string = ''123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz''
```

We then encode the timestamp in base-58 and get a 7-digit string like this:

```typescript
function toBase58(remaining: number, result = ''''): string {
	const newResult = `${symbols[remaining % 58]}${result}`
	const newRemaining = Math.round(remaining / 58)
	return newRemaining === 0 ? newResult : toBaseX(newRemaining, newResult)
}

const milliseconds = new Date().getTime() // 1726790729252
const converted = toBase58(milliseconds) //  2nNtbrLd
```

## 3. It should be satisfying to read, speak and type


The biggest readability/typeability factor, as mentioned in (2), is _length_. But we also know from credit card numbers and phone numbers that a delimiter can really help even an inconveniently long number easier to read and type. Imagine an ID optimised for telling your mom on the phone what the letters are, or optimised for writing it on a piece of paper and having the person type it in: `555-123-4343` is a lot easier to read off than `5551234343`. Ick that one actually is so uncomfortable just to look at. Even though it''s also just 10 digits.

So the xkcid was designed to be kind of pleasant to read.

`kMWe5y-NiApL`

When you first look at it you can immediately tell that it''s two pieces. The mix of cases might at first be a bit intimidating (one of the things I''m least happy with, with this spec), but when you train your eyes on the first one you can see it''s a manageable 6 characters.

You read it out to yourself: "kay, big em, big dublyu.  ee, five, waiy. dash -- big en, little eye, big A. little pee big ell."

Did you hear that? At the end? You went `3 letters, pause. 3 letters, pause. dash, 3 letters, pase. 2 letters.`

Can you feel it? Someone will ask you to read it back to them so they''ll say, "Hey can you read that back to me?" And you''ll say "Why don''t you read it back to me and I''ll tell you if you got it right?" And they''ll say okay and they''ll read it back. Can you hear it? At the end: "big N, little i, big A. little p, big L." That down-note on "big-L", you can feel it. It feels final. It feels like "yeah, we did it. 3, 3, dash, 3, 2. 

&gt; 3, 3, dash, 3, 2.

Science tells us we can easily remember 5-7 characters at a time, but when we have to put the uppercase/lowercase in there, it feels like it gets a lot harder. So hopefully people will naturally break them up into 3s, but I have to be honest: I really wish we could just use the lowercase letters. 

## Lowercase is much nicer

If we go to lowercase, we slash our dictionary to just 34 characters. Sounds huge, but let''s see what that does at our sizes.

The new dictionary would be `''123456789abcdefghijkmnopqrstuvwxyz''`

And the previous 5-digits randomness = 660 Million in base 58 would require just 6 digits in base 34 to represent, with just around 1.5 Billion possible values. And the previous 7-digit millisecond time would become a 9-digit millisecond time. We would still only want to drop 1 digit of significance for 34-millisecond ticks in the post-epoch era. This gives us an xkcd like so: `2zwt77as-g2au8y`. A few created in a row look like this:

* `2zwt77as-g2au8y`
* `2zwt784h-fa5jb6`
* `2zwt78ch-a9fdj8`
* `2zwt79n5-kbr3i5`

Try reading them out... what do you get? I think it goes a bit like this:

Me: "Okay I''m gonna read it. You ready? .. it''s all lowercase, ready?"
You: "ya tell"
me: two zee w tee, 7 9 en 5 _dash_ kay bee arr, 3 i 5
you: got it

By eliminating the uppercase letters it''s easier to read and speak, even though it''s longer. And it''s not that much longer. In fact I would say, if it''s easier to read and speak, the only other problem with length is if it''s ugly, and let''s compare the two approaches:

&gt; Hey friend, how''s it going? check out this phrase https://xampl.app/phrase/share/kMWe5y-NiApL

And now lowercase:
&gt; Hey friend, how''s it going? check out this phrase https://xampl.app/phrase/share/2zwt79n5-kbr3i5

I can barely tell the difference. The lowercase version is _much_ easier to speak, and I think it''s even prettier to look at. Look at that "kMWe" -- what is going on there. "EN eye AYE pee ELL" oh my god we get it you have lots of uniqueness -- it looks like a meme is yelling at me. I don''t want my ID to be yelling at me; actually the use of lowercase letters in the uuidv4 is one of the things they really got right! 

I think it''s kind of nice actually, and familiar, that this "8-6" in base 34 with lowercase letters is _visually_ similar to the uuid''s "8-4-4-4-12" hexadecimal.

* 2zwt79n5-kbr3i5
* f81d4fae-7dec-11d0-a765-00a0c91e6bf6

But having the extra characters in there is nice, I think. Hexadecimal feels sterile; it feels like how I will express my desires when I am uploaded into the cloud. The "2zwt" actually has some kind of personality... it is more open, and more diverse; letters now make up the healthy majority. It feels nice. 

-------------------------------------------

The biggest factor in being able to read and type one of these IDs feels like their character count. The xkcid is 12 characters , 5 characters of timestamp (resolution: 3.4 seconds), a dash, and 6 characters of randomness (cardinality: 38 Billion).


It should be easy to follow as you try to read it out character by character and write. We know from how we write phone numbers that `555-123-9876` is easier to read and even to speak, than `5551239987`. You forget where you were; you lose your spot. I imagine the difference could get worse when you''re tired or if you are having some cognitive impairment like brain fog or low blood sugar. Basically it makes interacting more of a _chore_ and a _drain_, and we want users to feel joy. So the xkcid is split between a 5-character section for the time, and a 6-character section for randomness. 

```javascript
const id = xkcid() // ''kMWe5-NiApLy''
```


&gt; Note: I only learned while reading this that a 58-digit dictionary is already used by BitCoin and Flickr and there are existing standards/implementations. But they typically omit `0` and use `o`. So they don''t pad the time section with 0s they pad it with 1s 🤔 I''m not sure how I feel about this `111wKe-34pb9` vs. `000wKe-34pb9`

I also know I need to handle dates prior to 1970, and I had an idea for this... currently we''ve gone 54 years and we have 5x to go so that''s 270 years -- till 2294. You can start positive numbers at 1 let a leading "0" mean "this is negative", and then remove one digit of significance.

This means that before 1970 we don''t have "double-click" precision on events (going from 58 ms to 3.4 s ticks), but we can now handle negative numbers back to 1646. But let''s do just one more of these -- let''s let the leading 0 blow up the ticks not once but twice, to about 3 minutes and 15 seconds. Now we can handle dates back about 17,000 years ago, and 200 years into the future, with precision pre-1970 of about 3 minutes and precision of 58 milliseconds since then. 

This is good. I am pretty happy with this solution. I want to be able to put timestamps for past things, but we simply don''t need the same precision for these things because nothing was recorded so quickly in the first place. Nothing was so immediate. The idea of a "time stamp" actually has an interesting kind of immediacy and moment-ness to it which makes me wonder if folks pre-modernity would find it silly from the start. 

And, again, if you really need precision, use a datetime field; don''t ask the ID to do everything.', '2024-09-19 18:54:36.488146+00', '2zwt79n5-kbr3i5', '', false, 'a-good-id', 'In Search of a Good ID', '2024-10-11 09:58:15.177996+00', '76dc2ac9-288f-4274-b3e4-905a635d6e46', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('a', '2021-10-29 21:39:46.667268+00', NULL, '', false, 'aaaa', 'a', NULL, '5283ae62-1ac4-4a4d-a158-07528f9588fb', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('I''m learning to breathe backwards. Why? I don''t know, but it feels important.

When you think of "a breath", a single complete unit of breathingness of a person, how do you think of it? You might say it''s "an inhale and an exhale," or you breath in and then you breath out. If you''ve ever tried a technique like _box breathing_, you''ll have learned it the same way "inhale 4 seconds, hold 4, exhale 4, hold 4, repeat."

I don''t actually know the provenance of this idea that the breath begins with the inhale and ends with the exhale. I suppose given the fact that sentences in our language(s) almost usually place words in an order, if you want to describe any cycle, you have to at some point tell them the different phases of the thing and then tell them the order you go in. c

Does the clock start at 12 or at 1? We all know the answer is 12, because that''s where the second and minute hand sit when they''re at zero. But if you had a clock with just one hand on it, going around slowly every 12 hours... in essence, it doesn''t _matter_ where it starts and stops, right? But we all know it doesn''t start at 2. We all know it doesn''t start at 3 or 4. It''s generally agreed as 12, but I''m sure someone out there will make the argument for 1, and we may hear them out on it, but we all _know_ in our gut that it doesn''t "start" at 2, or 3, 4, 5, 6, 7, 8, 9, 10, or 11 o''clock.

What does this have to do with breathing? Well, I''m trying to say that we mostly hold pretty solid ideas of how to describe a cycle. The day starts at 12:00:00, the breath starts with in, the moon starts off waxing and finishes by waning, the tide comes in before it goes out, the sun goes up and then it comes down.

But what if the start of the day were not midnight but noon? What if one culture believes the seasons go "winter, spring, summer, fall" (as in [the iconic song](https://www.youtube.com/watch?v=K_MdSu0I620)), but another culture sees it as "spring, summer, fall, winter". They might have important cultural or religious beliefs around this, people thinking of abundance and newness as the beginning, whereas the winter-first people think of the beginning as the relative emptiness of winter, and the bite of the cold, and the cosying up that we do in such times.

If these two cultures are too rigid about how they see the cycles of life, what will they do when they encounter a culture whose seasons are totally different, like "hot, wet, dry"? How will you understand their metaphors of death and life, of sowing and reaping, if you only how to know how to breathe inhale-first?

So I have been teaching myself to breathe backwards, inhaling last, and exhaling first. 

What if the end was the beginning. What if Autumn was the first season, before Winter, Spring and Summer finishes it out. If harvesting came before planting, might we remember that the land was fertile and feeding creatures and people before the farm was invented? If we breathed out first, do you think we''d be more mindful that we need to make space to put more into a container that is already full? Why is Saturday/Sunday the week-end and not the week-beginning?

I''m serious though. Why does the time-off come at the _end_ and not the beginning? And what does this arbitrary choice of language mean for how we think about our place in society and our relationship to employment labour? To me, it seems to say, "You have worked for 5 days and so now the lords grant you 2 days off." It says, "Be thankful we have granted you this 28% of your life. 

This is such a terrible notion, and I think maybe we could do something about it, if we got better at just switching things around a little bit. Don''t you think we all carry too much of this lie, that work is required to _earn_ our life, and wouldn''t we be a bit better off if we practiced chipping away at it? What if we center the knowledge that humans were free long before their land was taken by feudal lords, and before they were forced into the cities to work in factories, that the _natural_ state for a person to be in is not working a 60-hour-a-week job for someone who hates you, that the time we spend not-working is our birthright, and the 5 days that come after that represent what we must do to survive the system the bad guys built when they stole the commons from us and replaced it with factory farms and commodity capitalism and insurance companies and fintech startups.

At this point in the post, I don''t know if you''re with me, but in any case, even if you don''t get why it''s important, have you ever tried to seriously learn box breathing? It''s a simple technique used by ', '2025-07-15 11:32:43.125737+00', 'We tend to think of a breath as starting from the inhale and ending with an exhale...', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/soft-but-1ac2b7.jpeg', false, 'learning-to-breathe-backwards', 'Learning to Breathe Backwards', '2025-08-20 16:23:13.975619+00', '2531d6f2-c8aa-47d0-9db2-77332629c8ef', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('Many eons ago, in a land near the crossroads of civilisation, a child was born. Divine messengers spoke of their coming and called them a great builder, a leader and humble servant of the people, a light of justice for all to see. When the child was born the emperor sent agents to kill the child, but the angels protected them and they were disappeared into the hills to live with the people there. 

The child grew strong and learned fast. They wanted for nothing and never cried. They were never sick and never fell. In time the angels came and told the child, "You are the child of god and your life is without limit. Make your life whatever you wish, and show the people of this land that they may do the same. No one can harm you and you will accomplish anything you set your will to."

And so the child went to the nearby biggest village and studied alchemy and combat, carpentry and animal husbandry. They studied history and languages, made art and intricate carvings. At a young age still, the child spoke with great wisdom and helped broker peace between nearby villages, and helped them build a road and bridge to encourage the friendship between their peoples.

As the governor became aware of a growing alliance in the hill country, they sent a garrison to collect taxes, to challenge the leadership of the people and break their resolve. The child awoke this night from a dream, having seen vision of the coming force, and went to the village elders. They said, "My lords, the governor is sending a garrison to challenge your forces, if we do nothing, they will take away the progress you have made, but if we band together with the nearby villages between this mountain and the next, we can win some freedom and keep what we have built."

And so the battle was held on the hillside where the road enters the valley between this mountain and the next, and the people of the hills were ready for them with traps and spears and fortifications. And they defeated the garrison and sent a message far and wide.

More villages came to their aid, for the governor had over the years encroached upon their dignity too many times. And more troops came from this province and the next. The battle became a war and lasted for many years.

On the eve of the child''s 17th birthday, after 6 years of war, the angels came again. They said to the child "You are the child of god and your strength in battle is without limit. Your strength is a river that flows across the battlefield, unstoppable, your army will destroy any enemy they may face." The boy meditated on this message, for the child had given all their strength and still they had suffered as many defeats as victories.

That night as they slept, they had another dream, a premonition of a majestic ceremony with idols and food, and a great circle with all commanders. And so the next day they called upon the council to hold a feast for the soldiers, and at this feast they created the great circle, with food and idols and all the commanders, and the child reached within themselves and remembered the words "Your life is without limit" and from this truth poured out the light and energy of their power. It flowed into the commanders and they too became powerful. 

Their forces devastated the governor''s forces, and before long the emperor sent imperial forces to quell the growing rebellion. But they were no match; the child of god had built war machines and discovered the secrets of harder metals. Their power now flowed through the armies of the entire hill country who fought as if their hearts beat as one. They battled toward the lowlands, bringing their builders, touched themselves by the child of god, and building bridges and roads, irrigation and boats. And so the people of the lowlands became allies, adding their numbers and the wealth of their farmlands. And so it went with the coastal people, until three provinces were in open rebellion under the child of god''s command.

On the eve of the child''s 27th birthday, the angels came again. They said, "You are the child of god, and your rule shall be without limit. By the next moon, you will defeat the emperor and the world will be yours. But if you are to rule wisely, you must know the true nature of your power. It comes not only from god but also from god''s dark shadow, the one who brings pain into the world."

The child of god was troubled and meditated on this message all night, and took no sleep. They now commanded five armies and marched upon the imperial capitol, at the cross-roads of the world. They held no ceremony and shared no great circle. The siege was long and many were lost, but as the walls fell the child of god resolved to finish this war tonight, defeat the empire, and go back to the hills.

They entered the city alone and made their way to the castle gates, with only their their shield and spear. They fought their way to the inner keep of the castle, killing all who opposed them, eyes bloodshot and heart pounding. They thought about the village in the hills, making art and wood carvings, and kept their resolve to go on. They pounded on the gates of the castle keep.

"The city has fallen; the war is over. Come out and surrender." But no answer came. And so the child of god ordered the keep destroyed by catapults and fire, and it burned to ash with the imperial family and their guard inside.

Finally the war was over and the governors of the empire came before the child of god to give their allegiance to their new emperor, the great warrior with gifts straight from god. And they gathered in the circle, surrounded by food and idols, and held the great ceremony. And for the first time the child of god understood what the angels had said. As the life force left their body and went into the governors, binding them together, giving their wisdom and generous spirit, the child could also feel something that had been there all along -- a taking that happened in the same breath. A taking of allegiance. A kind of taking of the mind, the will. As they gained from the child''s will, so also did they lose something in return. 

After the ceremony the child disappeared into the mountains. They meditated by a waterfall and on a rocky cliff. They walked through the forest and drank from the streams. And they relived every ceremony from the first time to the last, and experienced every one again with new eyes. They felt the terrible taking of every one. They sensed the fear the others had felt, an undercurrent hidden beneath the exhilaration of access to power. It was a fear of loss, of disobedience, of failure. It was a shrinking of the self, becoming a tool for the master''s use.

And so they resolved never to use this power again. They cut their hair and discarded their general''s garb, and moved to a village and worked as a fisher making wood carvings and signing songs in the evening times. There they met someone who made them feel content and special, even without the use of their gifts, and the two became one, and they made a life together. They built boats and a new house, and invented gadgets to help them fish or farm, and helped out their neighbors, and lived their lives together in peace.

One winter the child of god''s partner fell ill and could not be healed. The child spent day and night with books of medicine and alchemy and nothing could be done. They went up onto the mountain and cried out to the angels, saying "How have you done this to me? You said I was the child of god and I can accomplish anything I wish." In a flash of light, one angel came to the child and said, "You are the child of god and your love is without limit."

The angel vanished before any more could be said, and a storm blew in from the mountain. The child of god despaired and the thunder drowned out their cries. They threw down their satchel and wept on the hillside. They ripped their shirt and threw their boots into the river. They cried out to the angels and to god, to the rain and lightning and begged for an answer, anything, a way to hold on to the life they had made and the person they loved without limit.

But no answer came, and they went back down the mountain, cold and bloodied by rain and rock. They returned home to find their partner weak, on the edge of life. They gave water and changed their sheets, set out food and idols, and drew a circle. "My love is without limit" they said. They knew the ceremony could save their beloved''s life, but would not do it if it meant shackling them to their will. They waited, and did not begin. They only sat in thought and prayer, lifting their heart and extending their will to their partner, an offering, a gift, asking nothing in return.

In the morning they awoke together. The storm had passed and the animals were hungry. They were both alive and they held each other and cried and thanked god and the mountain and the angels for giving back the life that could have been lost.

As the years went on their life continued. And after 13 years of peace, there was unrest across the countryside again. Without the child of god the empire had fallen into petty infighting and corruption. The same winter that a new war arrived in their province, there was a great landslide on the mountain. The child''s home was destroyed and they were injured badly. As the child''s partner nursed them back to health in the nearby town, they came to learn why the child was injured for the first time in their life, despite the blessings of god and god''s dark shadow, which had protected them in every way until now.

The child''s loving gift of life had brought their partner back, but in doing so the child gave something up. For the first time when their life force flowed to another, they took nothing in return, and so the well of power had been depleted. The child and their partner meditated on this together and sense that the child may still live many lifetimes, but their life would come to an end one day. The child of god could still be a great builder and leader, and would still be able to accomplish many things, but there would be a limit.

And so as the countryside was overtaken by a new generation''s war, there were many wounded soldier and sick people to care for. The child and their partner did all they could with their skills of medicine and alchemy. They stayed out of view of generals and commanders, but went where there was pain and fear and loss, and gave whatever healing touch they could offer.

When the war brought famine, there were many ailments that rest and medicine could not solve. The child would gather all the sick and the hungry into the tent and draw a circle, and they would set out some bread and some idols, and the child would lift up their heart and extend their life outwards. They had learned to take nothing, and give just enough to sustain the people until they might eat again, or until their wounds could heal.

They could feel their life shortening and their power waning. And they felt content that the dark shadow of fear and pain held no sway over them. They did no harm and gave of themselves, and moved on to the next village before they could be recognized. Life was still hard, but the two of them were together, and content.

When the war came to an end, they moved on to another province, to find a new hillside to make their home. They came to a mountainside where the villages were all rebuilding, and trading with one another peacefully. And there they built a house on a hillside and helped out their neighbors. And they built tools for farming, fishing, and games. 

They carved musical instruments and found the best fruit in the forest. When a new baby was born the village people would bring them before the child of god, and they would draw a circle and lay out fish or barley and carved idols, and the child would give some of their will to the newborn to bless them for a healthy childhood and long life.

As the child of god grew older, their power dwindled. They aged like anyone would age. Alongside their beloved, their life became quieter and more secluded. Children, students, distinguished scholars of medicine and engineering would come up into the hills to learn whatever the child and their partner were teaching, and they would all sit in a circle together and eat food and share some story about their life, and lift up their hearts, and share a bit of their lives with one another.', '2022-01-17 12:07:48.046105+00', 'A short fiction; a re-imagining of the christ story, trying to avoid its moral traps', '', false, 'child-of-god', 'Child of God', '2022-02-04 12:03:42.110469+00', '863b3d60-c033-42b6-9b29-bd31636d9e3f', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2022-01-17'),
	('This is a repost of Pramila Jayapal''s statement on the Black Lives Matter protest at Bernie Sanders''s campaign event yesterday in Seattle. [You can read, like or share the original here](https://www.facebook.com/pramila.jayapal/posts/10153194606313621).

&gt; Many people have been emailing and asking me for how I am thinking about what happened yesterday at the event on social security and medicare, when some protestors identifying as Black Lives Matter got up on stage to challenge Bernie Sanders on race and racism, and ended up shutting down the event so Bernie could not speak. I''m struggling but in the spirit of community, here''s what comes to mind. First, I want to give a huge shout out to the amazing leaders who worked for months and months to organize the event: Robby Stern and PSARA, Social Security Works Washington, Washington CAN, Burke Stansbury, and so many more. This was a huge event to put together, and their determination is what ultimately got Senator Bernie Sanders to Seattle in the first place. The rally was also packed--maybe around 5,000 people--and people stood in the hot sun for a couple of hours, engaging actively and cheering on the incredibly wide range of speakers the coalition had put together. I was proud to be the speaker just before Bernie was supposed to speak. Watching what unfolded made me heartbroken. I have so many somewhat jumbled thoughts--here are just a few.
&gt;
&gt; 1) This is one small result of centuries of racism. As a country, we still have not recognized or acknowledged what we have wrought and continue to inflict on black people. The bigger results are how black kids as young as 2 are being disciplined differently in their daycares and pre-k classes. That black people are routinely denied jobs that white people get with the same set of experiences and skills. That black people--women and men--continue to die at the hands of police, in domestic violence, on the streets. That black mothers must tell their children as young as 7 or 8 that they have to be careful about what pants or hoodies they wear or to not assert their rights if stopped. That this country supports an institutionalized form of racism called the criminal justice system that makes profit --hard, cold cash--on jailing black and brown people. I could go on and on. But the continued lack of calling out that indelible stain of racism everywhere we go, of refusing to see that racism exists and implicit bias exists in all of us, of refusing to give reparations for slavery, of refusing to have our version of a truth and reconciliation process--that is what pushes everything underneath and makes it seem like the fault is of black people not of the country, institutions and people that wrought the violence. That is the anger and rage that we saw erupt yesterday on stage. But it''s not the problem, it''s a symptom of the disease of unacknowledged and un-acted upon racism.
&gt;
&gt; 2) When the disruption first happened, the crowd (mostly white) turned ugly. It''s hard to say what is the chicken or the egg. Some of it may have stemmed from the protestors calling the whole crowd racist. Some of it was from annoyance at the disruption. Some was probably from deep disagreement about tactics in a movement to get attention to an issue. Some was from deep disappointment because people had stood in the hot sun for hours to hear Bernie. Whatever it was, the conversations that ensued--the name calling of white and black people against each other, including some people calling blacks who didn''t agree with what was happening racist--were so painful. I was in the speakers tent and Pam Keeley alerted me to two young black girls (Gina Owens grandchildren) who were weeping, they were so scared, so I went over to comfort them. We stood with our arms around each other, and in some small way, that gave me the greatest sense of doing something tangible--to be with people I love, assuring them they would be safe, and that none of us would ever let harm come to them. After the protests, several people came up and wanted to talk. Many were furious--some white people said they no longer support BLM. Others said they do support but this erodes their support. Some said outrageous things from anger. Others seemed befuddled. Some understood. People will have to work this out for themselves, but as we all do, I hope that we can open our hearts to all of the pain and suffering in the world and be as compassionate and kind as possible to each other so that we can also heal as we learn and listen.
&gt;
&gt; 3) I don''t have any answer on what is "right." Bernie Sanders was a guest in our city--invited by a multiracial coalition to speak on some very important issues. Enormous amounts of work went into yesterday''s event and it was so important to talk about preserving and expanding Social Security and Medicare. None of the papers today are covering those issues, because they were eclipsed by what happened. That''s not necessarily "wrong"--it just is what it is. But here''s what I would have loved to have happen: after the protestors were able to get the mic and say their piece and have the 4.5 minutes of silence for all the black people who have been killed, I would have loved for Bernie Sanders to take the mic and respond. And also to speak about Social Security and Medicare too. Here''s what I would love even more: for the Sanders campaign and BLM nationally to sit down and talk about an agenda on racial justice that he can use his presidential platform to help move. Imagine rolling out that agenda and inviting black people to talk about it on stage with him. Now that excites me.
&gt; 
&gt; 4) I had not yet endorsed Bernie Sanders (and still have not), although I was incredibly excited about his candidacy. One of the primary reasons is because I wanted to know more about his stands on race and racism. I asked the campaign for some time to discuss this with him, and he did very graciously make some time for me to have a short conversation with him. What I got from the conversation is that he knows he comes from a very white state and he''s a 70+ year old white guy. He knows that running for President, he must now speak to voters who are very different from those in his state. He IS deeply committed to equality on all counts but his primary lens for all of his work--and a HUGELY necessary and not-often-enough-acknowledged lens--is economic. He is a truth-teller on economic issues in a way that no other candidate is. he gets the connection between large corporations, elections, and income inequality. He does understand the problems of the criminal justice system and I fully believe he will work to change that if elected. But the deeper comfort with talking about race and racism is harder. As Mayor of Burlington, early on, he endorsed Jesse Jackson for President and Jackson went on to win the state. He was active in the civil rights movement. But more than that, he is someone who has fought for so many of the threads that connect our movements. He has to learn to talk about racism in that way, to connect his ideas on education, economics, incarceration, and race. As I said when I had the honor of introducing him at his evening rally, he is in a unique position to do so. And we are in a unique moment where we crave that leadership in a Presidential campaign. I told him in my conversation with him that he needed to talk head on about institutional racism--he said he agreed and he would do it in the evening. And he did--to an enormous, cheering crowd of 15,000 people. That''s a huge platform for our messages. There''s more to do and learn for sure, but is any one of us perfect? The most we can ask for is for someone who listens and cares deeply, who is trustworthy, and who will do what he says. I know I learned a lot in my campaign and I will continue to grow from listening to people''s voices. I believe Bernie Sanders is growing too--and I hope (and yes, believe) that we''ll look back on this and see his emergence as a leader who brings our movements for economic, racial and social justice together in a powerful way.
&gt;
&gt; 5) Here''s what I am trying to deeply think about: How do we call people in even as we call them out? As a brown woman, the only woman of color in the state senate, often the only person of color in many rooms, I am constantly thinking about this. To build a movement, we have to be smarter than those who are trying to divide us. We have to take our anger and rage and channel it into building, growing, loving, holding each other up. We need our outlets too, our places of safety where we can say what we think without worrying about how it''s going to land, where we can call out even our white loved ones, friends, allies for what they are not doing. But in the end, if we want to win for ALL of us on racial, economic and social justice issues, we need multiple sets of tactics, working together. Some are disruptive tactics. Some are loving tactics. Some are truth-telling tactics. Some can only be taken on by white people. Some can only be taken on by people of color. Sometimes we need someone from the other strand to step in and hold us up. Other times, we have to step out and hold them up. Each of us has a different role to play but we all have to hold the collective space for movement building together. That''s what I hope we all keep in mind and work on together. It''s the only way we move forward.
', '2015-08-09 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/pramila-jayapal-john-lewis-judy-chu-protest-1980ce.jpg', true, 'pramila-jayapal-on-seattle-bml-sanders-event', 'Pramila Jayapal on Seattle''s BLM protest at Bernie Sanders Campaign Event', '2022-12-18 14:43:25.14335+00', '26a73f34-229f-49e2-8609-de983cd71fa3', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-08-09'),
	('Before Obamacare, lack of health insurance killed 44,000 Americans per year.

I know some people feel personally aggrieved by the Affordable Care Act; they feel that their situation, or that of their loved ones, got worse because of Obamacare. They have a right to be hurt and upset about that. And it is impossible for me to look any one of them in the eye and say, "The struggle your family went through was necessary to save those other people," however much I wish I could make them believe it.

![A chart showing the rate of Americans without health insurance declining sharply after the Affordable Care Act took effect](//snook.pub/static/images/gallup-uninsured.png)

But before Obamacare came into effect, roughly a half a million Americans lost their lives, just since the year 2000, because they didn''t have health coverage and couldn''t afford to see a doctor. Half a million people. A small town, every year. A football stadium, all dead. Year after year. Not from fire and twisted metal, but from preventable and treatable diseases, for going without regular checkups and the healing touch of a trained nurse or physician.

Think about the great lengths we have gone to since the War On Terror began, the enormous sums of money we have devoted to this cause. And then think about a problem 100 times as deadly whose solution cost half as much – a solution found in healing not killing, in solidarity and support for our American family.

If we treated health as an integral part of security and allocated resources to match the enormity of the threat, we would have enough money for Obamacare, and a lot more. We could even lower the premiums and the copays – to zero, actually, which is what the fight should have been about from the start.
', '2017-01-05 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/gallup-uninsured-1980cf.png', true, 'obamacare', 'On Obamacare, and Priorities', '2022-12-18 14:47:08.598327+00', 'bc1bb043-1550-41c5-8359-caa9361e4732', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2017-01-05'),
	('I''ve been slowly noodling, more and more on the "they/them" singular pronoun, grappling with my thoughts a bit, and I feel like I''ve reached a point of being able to say "okay, I''m comfortable here, I can see how things develop" -- and they are developing!

Mostly English is not a super gendered language, but gender still shows up a lot, and a big part of this comes from our gendered pronouns; "she/he" "her/him" "hers/his" "herself/himself". We also apply gender to lots of job or role category nouns, like "actor/actress"), and use "woman/man" and "girl/boy" in parts of other words, like chairwoman and boyfriend.

But looking at other languages, we are not in a very bad situation, by comparison. In French they gender every single noun so that you then know how to gender the adjectives about them! In Hindi you even gender verbs sometimes!? ("accha lagta hai") 

But at least in Hindi (and, as I understand it, in many other Indian languages) they have some great gender-neutral pronouns. In hindi the word for "she" "he" and the singular "they" is just "voh" and you use it for everyone and everything. There is no option of using a "voh (m)" or "voh (f)" even if you wanted to. Everyone is a they/them in Hindi! -- just as long as you don''t use any verbs or adjectives about them (facepalm). 

But this is what I want to talk about, the English, singular they/them. (I''m not against it; that is not where this is going.) I am so happy that language is evolving and they/them is becoming really normal; it''s really nice that a lot of friends use they/them when telling a story just because the gender of the person isn''t a part of the story! Even if I know you know the person and their gender, if I am telling a story and by some miracle the story doesn''t involve their gender -- doesn''t touch on how they get treated, or the expectations placed upon them by others, or the amount they get paid, or the respect and deference they''re given, or how much their sexuality is policed, or their beauty standards, or anything like that -- I will simply use gender neutral terms throughout. Simple!

It''s not quite a revolution, but I notice something happen in my brain, when I notice myself looking for the gender referents so I know how to interpret events. And then I catch myself doing it, and I think wow silly brain conditioning, and then I simply will myself to picture the events without gendered imagery and attributes. The existence of gender-nonspecificity is momentarily frustrating, but it is so freeing to lean into it and just really hear what''s being communicated. 

For myself, personally, I like being they/them''d but I also don''t mind if people want to use their preferred gender-neutral pronound -- like if ze/zir is just your way of languaging-without-gender, then go for it. And if you can''t get over the grammars of it, then you can use she/her for me; just please don''t he/him me. Anything but my assigned-at-birth gender is fine, really. Because I want gender to be _less_ a part of everyone''s life; less a part of how salary negotiations go, how much freedom/obligation they have in raising kids and caretaking, how much of the home''s reproductive and emotional labour they have to do, etc. I don''t think we should get rid of gender -- so many people like their gender! -- but I don''t think people''s social, economic and personal lives should all be gendered, against their will, at all times and from all directions. I think it should be actually literally illegal to have a blue razor and a pink razor that cost different amounts. 

-------


And don''t really mind if people want to use other gender-neutral pronouns, or even she/her


 brain, over time. You notice yourself thinking "wait I can''t picture this person until I know their gender" and then you go "oh no silly, of course I can, I just have to picture a person doing the things in the story, and pick images in my 
But we aren''t out there gendering all our nouns and adjectives. There''s no French-style "acteur" "actrice", for example -- French has a whole system for creating gobs of nouns like this and you''re just constantly having to gender everything. And even when nouns aren''t including their gender in their spelling, they still have a gender and you have to know what it is because every adjective you use will have a gender, like (m) "blond" vs. (f) "blonde". 

My understanding is that Spanish and Italian and many romance-style languages have this. In my time learning Hindi I have found a whole new set of rules by which even verbs become gendered! ("accha lagta hai" means "I like it (m)" and "acchi lagti hai" means "I like it (f)". But in Hindi the pronouns are neutral -- "voh" is the singular he/she/they/it, but as soon as you make it possessive (his/hers/theirs/its) you have to gender it as "uska/uski".

Germanic languages also gender lots of things, but typically they include an explicitly gender-neutral form for these things, which from the perspective of language evolution, seems really helpful! If you want to just drop the gender-fication of all adjectives, for example, you can do that by using the neuter form, without having to wonder whether you are centering some gender by consolidating into one word.

And Swedish (a germanic language mostly) has developed an excellent pronoun, "hen" which is a gender-neutral version of the gendered "han/hon" singular personal pronouns. Similarly, French (another close neighbor to English) has combined the pronouns "il" and "elle" into just, "iel". To speak it, you just kind of elide the "i" and "eh" sounds and it just comes out kind of... in between! It''s quite lovely to say and hear.', '2023-01-16 10:13:16.436524+00', NULL, '', false, 'evolution-of-pronouns-and-gendered-language', 'All the pronouns feel silly', '2024-05-07 23:00:22.166776+00', '5ccd691c-aaf0-4d13-b775-6c252ffbd3c0', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('what is it to fly\
do you need air under beating wings\
or can you feel it in your chest\
head back, hair swept\
grinning, vision blurred\
body tense, pulling in\
holding fast, time held still\
in every sense but the beating heart\
the up-down of your heaving chest\
laughter over crackled lips\
life given, taken, freely exchanged\
for a chance to live

', '2023-07-24 08:14:37.3612+00', 'A poem written 24th July 2023', '', true, 'what-is-it-to-fly', 'what it is to fly', '2024-06-14 20:03:58.596316+00', '24632c3d-76e8-4246-bcdb-462a3aa00eed', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2023-07-24'),
	('', '2021-10-30 09:59:47.254+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/image-from-supabase-example-18f41a.jpg', false, 'lll', 'l', '2021-10-31 22:33:21.430696+00', '842753cc-5356-43c7-a577-352be1dbddbf', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('', '2022-01-23 08:03:40.877365+00', NULL, '', false, 'hear-me-out-video-games-counterstrike', 'Hear me out: Video Games', NULL, '7e352afc-0d81-4ebc-ad95-27eb935586a1', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('Mm one of my friends said I do this thing

I remember my dad doing this thing w the Encyclopedia at dinner

Discuss why, yes it''s a good thing

![https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/272669794_10209603569242500_1573035680893231454_n-19135e.jpg](https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/272669794_10209603569242500_1573035680893231454_n-19135e.jpg)

Caveats and obligations and changing of times but it''s a good thing to carry on', '2021-09-09 18:21:09.02+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/272669794_10209603569242500_1573035680893231454_n-19135e.jpg', false, 'looking-it-up', 'The Joy of Looking It Up', '2022-04-08 12:03:18.925187+00', '57a05e36-1efc-4a39-8e64-5d6347a2c5cf', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('**Update 2020:** This is how the old version of the site was built. The new one is Rails 6 + React.

----

This site is pretty simple: just HTML and CSS, with help from Github Pages, Jekyll, Foundation, SCSS, and Disqus. This post has a bit about why these tools, and why I think they''re a good fit for this project.

![](https://i.imgur.com/tYucYct.png)

## GitHub Pages

My favorite way to start building a new site -- it''s free, it''s easy, and it''s already integrated with my git repo. If you want to start putting HTML, javascript, and CSS up on the web, GitHub Pages is the quickest way to get started. This site is just [a GitHub repository](https://github.com/michaelsnook/snook.pub), which gets served up as static HTML.

The site has no Apache config to worry about, no URLs.py, and no database, with all the hosting burden having been moved onto Github.  It''s free and virtually uncrashable. You don''t even have to log into a server to deploy changes -- just `git push` and let GitHub Pages do the rest. [If you''re not familiar with Github Pages, check it out.](https://pages.github.com/)

## Jekyll

[Jekyll](http://jekyllrb.com/) is a tool for creating static sites, which is integrated into GitHub Pages. It allows you to use [Liquid templates](http://liquidmarkup.org/), which are almost identical to the templates I''m used to in Django and Flask, and the combination of Jekyll and GitHub Pages results in a pretty dreamy workflow: 

1. Serve the site locally with `jekyll serve --watch`. 
1. Work on the site. Refresh browser window to view changes.
1. When I''m ready to publish, commit and `git push`.

The `--watch` flag tells Jekyll to redeploy the site each time it detects that you''ve saved changes. GitHub pages takes care of the post-commit hook that tells Jekyll to recompile and redeploy the site whenever I push changes. And when a project grows to more than just HTML/CSS scaffolding and requires a real web application behind it, the familiar template format makes that a smooth transition.

## Foundation

I really can''t say enough good things about Foundation. I don''t love to write CSS, or feel terribly good at it. I don''t like worrying about whether my paddings have caused my paragraphs to overrun, or second-guessing the way I''ve set up my `.panel` style. Foundation, like its big cousin Bootstrap, provides an easy-to-use grid and utility classes, with simple JavaScript-y add-ons like dropdown menus and modals.

My preference for Foundation isn''t based on anything terribly scientific; I just find it easier to use. The markup just makes sense to me, and feels less repetitive. It leaves me needing to write less custom CSS, and I rarely if ever find myself writing code to fight against Foundation''s defaults or the assumptions that went into the design of their grid. 

## SCSS

Okay, I have to confess: I''m really not writing any less CSS than I was before I was using SCSS. The fact is, I have been meaning to learn SCSS/SASS or LESS for a while, so I finally did it, thanks to [Foundation''s incredibly simple instructions](http://foundation.zurb.com/docs/sass.HTML). 

This site''s styles are so simple, I may decide to revert back to old-fashioned CSS. The current arrangement just adds a step to my workflow (`grunt build` at the command line every time I update the stylesheet). That said, I''m excited to keep learning SCSS and to try out some of its more advanced features, so I''ll probably put up with the extra step for now.

## Disqus

What good is a blog without comments, right? And how are you going to handle comments on a static HTML website with no server or database? Well, that''s where Disqus came in. It was really a breeze to install. Sign up for an account; they email you the embed code; paste and go. I think some people object to Disqus (some of them liked it before it was cool), and I''m sure everyone finds it to be generic -- but it works! And it''s free! And it took me all of five minutes to install!

If you have a problem with that, I''d like you to read one of my favorite tweets of 2014:

&gt; A cool blog post would be: we used a bunch of boring technology to solve a business problem and got to go home early and play with our kids.

&mdash; [@moonpolysoft April 2, 2014](https://twitter.com/moonpolysoft/statuses/451494961557434368)

## More To Do

This is definitely my favorite stack to build a website on, so far. As I build out the "projects" section, I may end up with project pages that really want to be more like "apps" than "pages", in which case I''ll have to re-examine my priorities and the reasons that make this the ideal stack for me, for this site, for now. But for the time being, this is working just fine -- it''s fast, it''s free, and it''s fun!', '2014-05-26 00:00:00+00', 'From the Archives: How the Jekyll site was built', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/monitor-keyboard-tablet-clipart-1980ce.webp', true, '2014-05-26-Under-the-Hood', 'Under the Hood', '2022-12-18 14:37:31.167673+00', 'f0db7867-a587-469c-a075-4871234e624d', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2014-05-26'),
	(' If your beloved friend is a bird  
 And she sings  
 not for you but for all of creation  
 not in your song but in hers  
 not on cue but when the light is just so  
   and the ravens are playing and the hawks are resting  
   and she joins, and others join  
 and they fill the trees and the rooftops with their sing song  
   with their hellos and good afternoons to their beloved friends  
 Will you be angry that the song she sings is her own?

_29th Jan 2023_', '2023-01-31 17:10:41.577398+00', '(A poem from 29th Jan 2023)', '', true, 'poem-song', 'The song of a friend', '2023-02-01 07:16:28.378134+00', '3fb75203-45d4-4f26-b1de-426fadd679dd', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2023-01-31'),
	('Want to go exploring?', '2015-07-30 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/spelunking-1980ce.jpg', true, 'spelunking', 'Spelunking', '2022-12-18 14:42:07.583126+00', '528d58d2-24d5-49a1-b1c2-56503015aa48', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-07-30'),
	('The Blue Dawn is a volunteer collective that connects Bahujan people with
cast-aware mental health therapists, and sometimes with supporters who will
sponsor sessions directly. I recently built them a WordPress site using
Roots''s Bedrock and Timber/Twig templating.

This project started because a friend reached out asking if I''d speak with
a friend of a friend who was working on a new nonprofit and needed
a website. I connected with TBD''s founder, Divya Kandukuri, and spoke about
their needs. They didn''t need much – just a site with a CMS and some forms.
I got the sense that Divya was supremely competent and had picked a really
good intervention point: directly connecting people with resources that can
help them in their time of greatest need, raising awareness about one of 
the most vicious forms of oppression, and helping those affected build 
community resilience among those affected by it. 

How could I not get involved with such a great project! Besides, I was taking
some extra time off work anyway, and I am trying to find more ways to be _directly
useful_ to _smaller organisations_ rather than always (as I do at my day job) 
working with larger scale tech systems for more professionalised organisations.

_[Check out the repository here](https://github.com/michaelsnook/thebluedawn-wp-bedrock)_

We have been using Bedrock at work so I started there. The other WordPress 
site I maintain uses Sage, so I used that to deploy the first
draft of the site at [thebluedawn.org](https://thebluedawn.org). But the
design I wanted wasn''t easy to execute even with Sage''s relatively simple
(but still very WordPress-y), so I added the Timber plugin and started 
porting the theme into [Twig templates like this one](https://github.com/michaelsnook/thebluedawn-wp-bedrock/blob/master/web/app/themes/thebluedawn/resources/views/home.twig). 

![A screenshot of TheBlueDawn.org''s top section showing the site''s title and a brief description with two buttons to get started, overlaid over an image of Bahujan leaders](https://snook.pub/static/images/thebluedawn-jumbotron.png)
![A screenshot of The Blue Dawn''s google form to join the counselors network](https://snook.pub/static/images/thebluedawn-counselors.png)
![A screenshot of TheBlueDawn.org''s section titled ''What We Do'' showing three cards with brief explanations for matching people with good counselors, building the network of caste-aware counselors, and sponsoring counseling sessions for others](https://snook.pub/static/images/thebluedawn-whatwedo.png)

The styles are BootStrap 4 with very little customisation. The WordPress
server is my own Digital Ocean box where I host another WP site. And Cloudflare
manages the DNS and provides its free Universal SSL. Since I already had the
server, the site is basically free to run for the foreseeable future (which
is important for a volunteer collective that doesn''t have funding). 

Left to do:

* Replace the remaining Blade templates with Twig templates
* Different index pages for different post types, like Media/Press
* WP Admin control over the content on the Home page or in the Banner. Right now it''s just an index of recent posts, with a lot of hard-coded content before it, which means it''s only a good solution as long as I remain actively involved and available to make updates.
* Figure out how to better control plugins and mu-plugins.
* Establish some proper seed data to make the site easier for others to develop on.
', '2019-06-08 00:00:00+00', 'The Blue Dawn is a volunteer collective that connects Bahujan people with cast-aware mental health therapists.', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/thebluedawn-banner-1980cf.png', true, 'blue-dawn-website', 'Volunteer Project: The Blue Dawn Website', '2022-12-18 14:49:53.048935+00', '5e11b123-019a-4a15-b888-9dbb9ad3c1f9', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2019-06-08'),
	('Snoogle™ is a search engine that indexes all the hypothetical stuff you''ve ever hypothetical invented and tells you (and your annoying friend who won''t believe you) whether you totally came up with that thing first that someone else just brought to market.

Snoogle searches your chat/Facebook/Twitter/email history and notifies you when it detects "inventions" you mention in conversation or in public places. If the invention was only discussed in private, Snoogle prompts you to share your idea in public with a nice official-looking "copyright" symbol so no one can scoop you. Then whenever you''re trying to convince people you came up with something first, you''ll have sources.

The idea was inspired by [the time I invented Snapcash](https://www.facebook.com/michael.snook/posts/10101701184449536) on Facebook and then Snapchat came out with a very similar product under the *exact* same name about month later. (I''m posting it eight months later because I didn''t have Snoogle yet.) As a kid, I also co-invented *Second Life* and *Mike''s Hard Iced Tea* -- but alas, no Snoogle. So a couple other companies took those ideas and went and "built them" and "marketed them" and "sold them" and they got all the credit!

I''m not looking for royalties or anything, I just think it''d be nice if other people knew me as the guy who came up with SecondLife and Snapcash. That''s all I''m saying. In fact, this is an important rule of Snoogle: Snoogle is only for use in arguments with friends or as a source for stories; if we catch you using it to sue anyone, we''ll take your account away and steal all your ideas.

Comment below and I''ll let you know when it''s ready for beta testing.
', '2015-05-06 00:00:00+00', NULL, NULL, true, 'snoogle', 'Snoogle: For When You Totally Came Up With That First', '2020-04-07 13:18:29.662+00', 'f2f00fcb-ba1b-4d5f-a6bd-877ed5e53a45', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-05-06'),
	('**Update from 2020:** This is a post from the old website, copied over from the archives, but no longer entirely accurate!

---

Hello World! This is a post. This site is getting real, and this post is its introduction.

Welcome to it, by the way, and thank you for coming to see my website. You''ll find posts, projects, and, before too long, a contact form to get in touch with me if needed. 

I''m building this site for a few reasons. First is that I am a web developer (sort of) and so I should have my own website. Second is that I find longer-form writing to be a relief and a joy and I want to encourage myself to do it. I have a few hobby projects now and I like to talk about them, or at least I imagine when I finish one of them I will want to talk about it.

It''s with that in mind that I''ve set up my site, with this sidebar on the left here, to show the categories, "Posts" and "Projects". Posts will likely be much more numerous than projects, and some posts will be associated with a project. Right now there are no projects to list, but I suppose I will throw up a page about the Space Party, which is a free-time project of mine, and then I will show you all what I mean.

**Edit:** Now you can see what I mean.', '2014-05-23 00:00:00+00', 'From the Archives: How I built my first personal website with Jekyll and GitHub Pages', NULL, true, '2014-05-23-Hello-World', 'Hello World', '2020-04-12 07:21:50.72+00', '5249967f-1319-4d05-9882-093f603d7038', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2014-05-23'),
	('I loved how the new Star Wars defied old tropes, weaved new themes about the Jedi and the Force, and had important character arcs that weren''t the sort of typical (white dude, with a couple tokens) cast that most movies present to us. My problem was that I just didn''t think it was a very good movie in terms of telling a well-constructed story that moved us along, made sense, and created character interactions and character development that track to the developments in the plot.

When you look back at the movie, you find that major chunks of the action could have been cut out entirely without affecting the plotline, which kind of cheapened whatever character development happened during those parts. Much like my issue with _Rogue One_, a lot of the drama was about uncertainty between protagonists – which can be great if done well, and if it heightens the tension as you lead up to some climactic moment – but seemed too often to lead to some kind of anticlimax. When two opposing forces bring us to edge-of-your-seat suspense and the real fear about what might happen if something goes wrong, that''s drama! When two opposing forces just kind of cancel each other out and negate whatever has been happening for the last few minutes (or last hour), that''s not good filmmaking.

Some of the characters and character developments came across this way too – you have conflicted or contradictory characters, not because the person is an "antihero," or a "bad person with a heart of gold," or they committed a crime to feed their family, or due to past traumas they are now visiting traumas on others to achieve safety, or because they''re overzealous in pursuit of the good, or  they''re the scoundrel who saves the day anyway... but just because we weren''t sure if we should like them a lot. Or maybe for a moment we liked them and then later changed our minds, or vice versa. Simply creating characters that aren''t all good or bad isn''t particularly dramatic – you have to create conflict and allow that conflict to play out in the plot of the story! Here are a couple of examples from previous _Star Wars_ movies:

1. Vader is bad, but he loves his son, so he doesn''t kill him and eventually betrays his master to save him. This character conflict leads to conflict in the plot and results in moments where the plot arc changes dramatically because of a change in the character''s resolve or his loyalty. The conflict in Vader is not just indecision but _acting_ in one direction and then _acting_ in another.
2. Lando Calrissian is an old friend of Han''s, but he has lost his sense of loyalty; under duress he betrays our heroes, but when he realizes there''s no point trying to placate the Empire he decides to save them. Lando''s conflict is also _very important_ for driving the plot forward. And the discovery that Lando has betrayed them isn''t just a change in course, but actually rewrites our understanding of what had been happening during the current story line. As a result, we the audience also feel betrayed and lied to because we thought our heroes had found a sort of safe harbor.

But the character conflicts in _The Last Jedi_ often take the form of "the audience isn''t 100% sure how we feel about someone", rather than these reversals that truly drive the plot forward – or if they do, we''re not emotionally invested in the relationships and the values that are being betrayed so much as watching the plot take a left turn.

There were a few times I really felt the Star Wars tingles running down my spine. But to be honest, some of the jokes and the attempts at humor really broke it for me. Some moments that should have been sacred were interrupted with what seemed like an attempt at Guardians Of The Galaxy-type lightheartedness. Just when I thought I was getting into it... nope. The Jedi are a religious order 1,000 generations old, but this movie didn''t really seem to care, and I really never got close to feeling the sense of wonder I experienced as a boy watching Luke channel the force for the first time. So there was no Jar-Jar and barely a peep from C3PO; great. What we got instead is the Last Jedi in the galaxy cracking jokes during Jedi training (which, I might remind you, doubles as induction into an ancient religious order). Is this any better than Jar-Jar and C3PO? I honestly can''t tell.

All in all, I finished the the movie pretty bored. I''m happy that we have some story lines where Black and Asian characters – and plenty of women – have their own worth, their own authority, their own meaning. But I''m left feeling like... what a low standard we have set for ourselves, that in 2017 I have so few sci-fi and fantasy movies to choose from that we have to choose between well-crafted storytelling and characters more representative of the world we live in.

*Update:* Here''s [an excellent article about one of the interesting trope-defying character arcs](https://www.tor.com/2017/12/21/star-wars-vice-admiral-holdo-and-our-expectations-for-female-military-power/) of _The Last Jedi_. (Lots of spoilers in that article.) It presents a good counterweight to one of my concerns about "characters we''re just not sure about." I present it here for a few reasons:

1. It''s a great illustration of this idea that diversity and representation in casting and storytelling isn''t _just_ about some kind of quest for political correctness. In this case, we get to see an _interesting character_ who is not quite what we expect, and not quite what one of our heroes expects either, contributing to their character development arc. "Diversity" is really just good storytelling.
2. The piece of the story here actually kind of speaks to one of the concerns I have with the film: I like the thematic thing, but I thought the _craft_ was off. I didn''t love the acting; I didn''t think the relationships this character apparently had with other characters in the film were shown or explained in a way that was compelling on an emotional level, and so the way this person''s story worked out didn''t hit home for me as much as I wish it had.
3. One critique on the film that has been nagging at me more and more since I first wrote this piece is on display here: There actually _is_ a deep, emotional story to be told, but they didn''t _tell it_. The story was great but the screenplay left a lot on the table. The way this article describes friendships and emotions and the characteristics of the different players in the film is far more compelling than what actually played out of the silver screen.
', '2017-12-21 00:00:00+00', 'I loved how the new Star Wars defied old tropes, weaved new themes about the Jedi and the Force, and had important, atypical character arcs, but I had some reservations...', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/rey-and-kylo-ren-fighting-1980ce.jpg', true, 'the-last-jedi-critique', 'My mixed feelings about Star Wars: The Last Jedi', '2022-12-18 14:47:36.922797+00', 'b9a2fcb7-6a8b-4587-8790-dfe5bef42a27', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2017-12-21'),
	('', '2021-10-30 10:13:45.276+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/image-from-supabase-example-18f41a.jpg', false, 'title-goes-here', 'Title', '2021-10-31 22:33:16.868682+00', 'a7db0f6a-927d-4bf5-848f-ba6020ddd77d', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('I never felt at home with my assigned gender. I grew up as a boy and at some point I grew into a man, but there were a lot of things that just didn''t feel good about it.

Last year, while everything around me seemed to be falling apart, something about my gender just clicked. I sort of "tried on" the notion that I might be non-binary and... it fit. 

It felt right; it felt like it had been missing from my self-conception, like in my pursuit of self-discovery and actualization, I had been set free from certain roles and expectations, the constant performance of or failure to perform as a certain type of person. Masculinity was a cage, a crutch, and a cudgel, all in one, and at some point I realized that life is just too short and if I didn''t want it, I could put it down, opt out, unsubscribe, quit being a man and be whatever else I am instead.

----
I really, really hate bullies; and I''m not always up for small talk. And something about typical cis/het/male group dynamics often feels like a weird mix small talk and bullying. This constant jockeying... it''s really uncomfortable. I don''t enjoy it; it feels like a waste of time; it''s humiliating, and the only way to escape is often to "win" by humiliating someone else. I guess this is just another way of saying that toxic masculinity shows up in everyday interactions, and I could never really get over it. I didn''t want to be like that, or even be around it.

So I spent most of my teenage and young-adult years with a small group of guy friends, feeling welcome but a bit on the outside, and spending more of my time in mixed settings, with a romantic partner, or a woman best friend, or a [man] flatmate I could be comfortable with in one-on-one situations. Point is, Masculinity and I didn''t get off to a great start.

---

I should interject a caveat here to say that in some ways the expectations of masculinity were good _for_ me. i.e. I was a precocious (you could say cocky) boy who spoke out a lot in class and didn''t get along well with authority. Were I not a gender-conforming white boy this might have resulted in punishment and a lot of negative consequences. But I was, so as long as I kept conforming to certain expectations and succeeding in certain ways, I was rewarded – even sheltered from consequences that might otherwise have helped me grow and mature.

So in this way I am trying to say that my male privilege was working for me but in ways that didn''t prepare me to become the empathetic queer anarchist I am today; they prepared me to be a kind of straight liberal professional-managerial type who talks too much in meetings and never really confronts his role in _* gestures broadly *_ all of this. The patriarchy was working for me and against me at the same time, allowing me to remain comfortable when discomfort was needed, and surrounding me with bullies and jockeys when I badly needed emotional safety and intimacy to get to know myself and others.

---

and got back-pats for speaking out and even talking too much; there was not much accountability for being late to things; my ADHD, while not well treated, at least led to a "boys will be boys" reaction rather than to punishment and coercion as it does for so many girls. In these ways, the patriarchy has been set up to support me – no matter how much I resent it for doing so.

I''ve already written about my journey to identifying as Queer and then later as Bisexual

As I got more fully in touch with my bisexuality, and the fluidity I found in everyday relationships, gender seemed like a less and less helpful way of understanding people, particularly myself. And after months of lockdown, changing jobs and social situations, changing continents and being separated from my partner for months, living with my sister and her partner who love and support me...

Well at some point in mid-2020 I think a lot of people realized that a lot of things are bullshit. We were seeing en masse that money is made up and bullshit, that we could always have given out free school lunches and protect people from eviction, if we wanted to. That most of our jobs aren''t essential and we can often do them from home. We were realizing that a lot of the things that construct our', '2021-08-01 00:00:00+00', NULL, 'https://i.imgur.com/M6KNEUM.jpg', false, 'shedding-a-gender-binary', 'Shedding a gender binary', '2021-10-22 08:56:53.021653+00', '70665d37-c3dc-4afa-9289-375a19f0bc23', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('
It was National Coming Out Day yesterday, so I''m coming out... again. And here''s why.

I used to call myself "queer" because I thought bisexual implied a binary, but after studying my history a bit more I''ve come to feel that the spectrum of bisexuality has always been diverse, with people identifying that way who love men, women, nonbinary and intersex people, drag queens and crossdressers, gender-questioning and fluid, and agender people alike.
Many of the gender-fluid/enby people I know identify in some way with the term bisexual, so clearly they''re not all worried it''s forcing a binary, hm?

In this light I came to feel that, for me, using a more vague term like "queer", or a newer term like "pansexual" or "polysexual" would kind of be a cop-out, a bit like caving to my own internalized homophobia/biphobia, and would contribute to the bi erasure that makes LGBTQ spaces feel less welcoming for bi people like me.
(If you have your own personal reasons for identifying with terms like these, that''s cool; I''m just talking about my own journey.)

I think ultimately, I just didn''t want someone else''s label applied to me, with baggage and connotations I hadn''t entirely signed up for and wasn''t ready to embrace. But -- what a privilege! To just _decide_ (or pretend) to live outside the system of oppression and control, rather than join in with my comrades, enjoy their companionship and yes feel a bit of the burden they carry.
Isn''t that what family and community are about? You don''t always get to _choose_ whose struggles become your struggles. They just turn up at your doorstep sometimes, and you invite them in.

This is not my natural way of thinking. For one, I was raised in a highly individualistic society, and for two, as a cis white dude I was basically never forced to accept or live with the consequences of anyone else''s labels. I hate to be "pigeon-holed", having lived a life where in almost every respect I was permitted to define my own identity and reject externally imposed boundaries.
To this day, I still really hate it and get really agitated if you mislabel one of my flaws -- I will fight you over the difference between "sometimes has _trouble focusing_" and "sometimes _focuses on the wrong things_" ... (and then feel really silly about it later).

But this year, I just kind of... shook it off. I guess I had a few experiences that really made me feel at home in an LGBTQ space. I realized that in the process of rejecting the "label" I was rejecting my place in the _community_. This year I shed that fear and apprehension and started identifying as bisexual,
and let me tell you: it has been _really nice_. I''ve been able to relax and feel at home more in LGBTQ spaces and at LGBTQ events, I don''t feel like an imposter or an interloper, I''m less worried someone''s going to come along and ask to see my "queer card" -- not simply because I''m embracing the term bisexual, but because I just know that life is too damn short to keep myself at arms length from people, from communities, where I can understand and feel understood, where I can learn to be comfortable in my own skin and reconcile this crazy fascist world we live in with the need to be really truly free.

So here I am. Happy National Coming Out Day everyone, I''m bi.

![Bisexual Pride Flag](//snook.pub/static/images/bisexual-flag.png)
', '2018-10-12 00:00:00+00', 'It was National Coming Out Day yesterday, so I''m coming out... again. And here''s why.', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/bisexual-flag-1980cf.png', true, 'coming-out-again-bisexual', 'Coming Out Again: Bisexual Edition', '2022-12-18 14:48:15.054618+00', '6e79dbbf-57cf-4125-a6e6-d44200d8a0d5', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2018-10-12'),
	('It''s an app, like Google Reader morphs into the morning news hour on the Radio.
Take RSS feeds, your Medium follows, and any podcasts you like. Run text-to-speech on the
stories (or on platforms like Medium where
sometimes there''s an audio accompaniment built in, just grab that). And play the morning news
in audio format, using your favorite sources, but in a comfortable audio format so you can
listen while getting ready for the day or getting on the subway.

Does this exist? An RSS-feed-TTS-morning-news-app? If we were coming up with one today...
I would call it... Radiyr.
', '2018-12-17 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/old-timey-radio-1980ce.png', true, 'radiyr', 'Radiyr: If an RSS Reader Had a Baby with the Radio', '2022-12-18 14:49:13.652302+00', 'a07ce821-3402-4e9e-95be-4471196e9b1f', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2018-12-17'),
	('', '2023-05-15 08:30:27.299411+00', NULL, '', false, 'not-trapped-in-my-body', '"Trapped in a man''s body" Is a Violent Metaphor', NULL, '53c80afa-ea18-4f6d-a51b-8a385c8d7dad', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('***Note: This is a semi-technical post, best suited for techies or tech managers, about the web architecture behind this website, or, "How I got my site to be zero-maintenance, super fast and infinitely scalable"***

In early 2020 I rebuilt my old Jekyll site as a Rails + React, which [I wrote about previously, here](https://michaelsnook.com/posts/under-the-hood-2).

Overall it was a success, and I liked my new site a million times more than the old one, but there were a number of things that didn''t quite fit right, which I wrote about toward the end of that post.

* I was using more and more of Bootstrap''s utility classes, but still fighting against their built-in design language. 
* The code base still relied on React''s class-based components, and not in a particularly elegant way -- would be better to rewrite using Hooks.
* The Rails back-end was doing both more and less than I would have wanted -- for this site I don''t really need much fanciness in Models and Controllers, but I would have loved more built-in support for Auth and Storage rather than feeling a bit like I had to write them both from scratch.

## Step 1: Rebuilding "client" app (the React front-end)

My intent when I started off on this rewrite was always to be experimental and very light-weight. In my professional work I tend to focus heavily on the simplicity of the architecture, so that a small team of usually general-purpose devs can maintain a large-scale app without needing a bunch of specialists to keep it running, stable and secure. For example, I''d go with Heroku to avoid server admin or complex EC2 configuration; I''d put as much as possible behind a Cloudflare reverse-proxy rather than configuring and maintaining an NGINX server, etc.

So with the limited time I have to devote to personal projects, I tend to chase the same kinds of requirements for scalability and simplicity, even though the code I''m writing here is quite simple by comparison. 

[![A tweet that reads: "My very big brain 200 IQ method for making programming easier is I only build easy things. Try it out; it probably won''t work for you but if it does its sweet and you can combine with other methods like using functions or whatever"](https://i.imgur.com/xx2oKyj.png)](https://twitter.com/michaelsnook/status/1391476837474131969)

So I figured I would keep the Rails app in place, and rebuild the front end on some more framework-y react-type setup. Almost on a whim one weekend I tried prototyping the front end with Svelte, and it was surprisingly easy to get started!

Svelte is not a React framework, and they claim to have completely reimagined the way a reactive application should work – there''s no shadow DOM; now there''s a _compiler_ that examines all the components and state changes in your application and compiles the vanilla JavaScript needed to directly update the DOM in response to changes. It''s kind of incredible! 

But actually I wasn''t looking for a better React-DOM experience; what I was looking for was more like a less chaotic version of Gatsby to pre-render my React project and serve it statically.

### A Solution Emerges: NextJS
#### A Less Chaotic GatsbyJS

I had heard about NextJS for a few years, so over the weekend when I built my little Svelte front-end prototype, I decided to do the same thing with NextJS -- and it clicked, right away. With NextJS, the file structure of your `/pages` directory becomes the URL structure of your site, so in this sense it''s a bit like a Jekyll project, except instead of `index.jekyll` you have `pages/index.js` which is just a react component.

And if you give that file an `export async function getStaticProps`, it''ll run that function at build time and your react component can use that data to pre-render the page. Contrast this with Gatsby, where you manage a single `gatsby-node.js` that fetches all the data for every page and decide which templates to run the data through (all at once in one long asynchronous function that can take several minutes to run each time). This is the kind of separation-of-code that I feel like React world is moving away from, in favor of full-featured, self-contained components that know how they are styled and how to fetch their own data.

#### Supported Plugins and Polyfills

And instead of the relative plugin-hell of the Gatsby world, I found a handful of key utilities like `next/link`, `next/image`, `next/head`, `next/router`, and so on. They''re all maintained by the official team at Vercel, and they do basically what they are supposed to do.

Conveniently, NextJS also polyfills `fetch`, `window`, and `console` for the server, and `process` for the client, so you can write the same Javascript that runs in either environment without wrapping everything in "if this, do that, otherwise skip". The key here is that we are starting to get into truly Isomorphic Javascript -- i.e. it runs the same on client and server -- which allows the framework to do a bunch of interesting things.

For example, say you have a page which contains a mix of pre-render-able content and content that needs to be fetched per-user from the client. You can write your component with `getStaticProps` to fetch the main content, so when the user visits the page, the main article or post loads immediately and causes no server load, but then the framework runs through the React components/code as well in a process called "Hydration", activating any Hooks used for state, running any additional data-fetching that needs to happen from the client, and rendering whatever additional components rely on it. 

### Handling Forms and Live Preview

Within a few hours I had set up the app, rebuilt the basic page and component structure using Tailwind styles, and was fetching data from my Rails back-end. From this point it really wasn''t hard to just abandon the previous React code base. What little state management and user interactions were there, were easier to rewrite using Hooks than to try and port over.

The big challenge would be the _edit post_ screen! It really is my pride and joy. It''s a side-by-side realtime preview with a markdown editor, and it''s something I want to keep using and improving on as I go.

![A screenshot of the editor described above, showing this post being written](https://hmpueymmlhhphzvebjku.supabase.in/storage/v1/object/public/images/edit-screen-2021-11-24-12-56-54-18fd6b.png)

I find composition screens really fascinating partly because they end up encapsulating team management practices, processes, and workflows. Composition screens need to be sensitive to and tweakable based on your needs for brand fidelity, how much you care about the "rapid response" use case, the amount of training and support you can provide to the people who will be using these screens, i.e. the content managers and campaigners.

I''m still on the lookout for a great solution, but in the meantime I choose to just write my own interface and make little improvements over time as I use and extend it.

#### Controlling the form for a Live Preview

This side-by-side preview requires "controlling" the form or hooking into its every update to re-render the preview. In the class-components version, I''d just bind some state to the inputs and re-render the component when anything changes. But this time I wanted to be a bit smarter about how I handled forms, so I went on the hunt for a good library to manage them.

On a previous job I had used [Formik](https://formik.org/) for some pretty big/complex forms, so I checked that out, along with a newer solution called [React Hook Form](https://react-hook-form.com/). What I enjoyed about React Hook Form is that it had fully embraced the "Hook" paradigm; I just destructure `formState` and I get all these useful form state hooks like `errors, isSubmitting, isSubmitSuccessful` and so on ([example code here](https://github.com/michaelsnook/michaelsnook.com/blob/main/pages/posts/%5Bslug%5D/edit.js#L22..L28)).

```
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm()
```

Likewise, I just pass that `register` function into the inputs themselves: 

```
&lt;input
  id="postTitle"
  type="text"
  {...register(''title'', { required: true, maxLength: 120 })}
  aria-invalid={!!errors.title}
  className={errors.title ? ''border-red-600'' : ''''}
/&gt;
```

What I like about this approach is I''m not having to use a `&lt;SpecialForm /&gt;` component from one of these libraries and learn how to interact with it; I just work with the hooks and utilities, leaning on the library and the framework to get the functionality I need and inject it directly into the JSX and component logic where it makes the most sense.

And for the live preview, I can simply use the watch API:

```
const thePost = watch()
```

This `thePost` variable is a Hook that I pass to a component that renders the post, and every time the form state changes, I get an updated preview of the post. (I could debounce or throttle this update but I haven''t needed to yet, partly because the markdown parser, [remark-react](https://github.com/remarkjs/remark-react) is smart and doesn''t re-render the entire article when one paragraph changes.)

### Tailwind CSS

This writeup couldn''t be complete without a mention of TailwindCSS and how fun and easy it was to use. By now a lot of ink has been spilled about how great it is, but you should probably just [check it out for yourself](https://tailwindcss.com). In May of 2021 I had [a chance to use Tailwind and loved it](https://michaelsnook.com/posts/mutual-aid-india), so I was keen to give it a try for this project because I''d be writing the front end afresh, trying to reproduce a somewhat clumsy, but visually good-looking Bootstrap site; I expected it would be a good test case, and it delivered. 

To get a quick glance at how Tailwind is being used here, check out [this site''s global file](https://github.com/michaelsnook/michaelsnook.com/blob/main/styles/globals.css): it isn''t terribly remarkable except that it shows how little CSS is involved here. There are some very classes being declared here for headings, buttons and inputs, but the rest of the site''s styles are handled entirely in utility classes in JSX. Here''s a little sample of that 75-line long CSS file:

```
button.button,
a.button {
  @apply inline-block py-3 px-6 border rounded-md cursor-pointer;
}
button.button.outline,
a.button.outline {
  @apply text-cyan-700 hover:border-cyan-700 hover:underline;
}
button.button.solid,
a.button.solid {
  @apply text-white border-white bg-cyan-700
    hover:border-cyan-900 hover:bg-cyan-600;
}
```

The most common complaint I hear about Tailwind is that it means your markup is full of classes, and this is kind of true, but in the React world, I have no need for a `.article-card` CSS class because I have an `ArticleCard` _React component_, whose JSX contains the Tailwind utility classes I need. So I rarely find myself having to repeat myself, and in most cases where I do end up copying and pasting classnames, there''s usually some little difference or another that would have necessitated a second component class or a variation -- or worse: a mixin.

The founder of Tailwind, Adam Wathan, [wrote a great piece a few years ago](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/) about how all our CSS "Best Practices" have been failing us, explaining some of the philosophy behind Tailwind''s approach. In short, it means I get to worry about my CSS and my classes in two places instead of three; there are still classnames in my JSX, and there''s still a CSS framework in play, but it so closely resembles the names and properties in CSS itself that it''s easy to remember, and there''s no middle-layer, high-level component design language to write, remember and maintain.

To boot: with Tailwind CSS''s Purge utilities, the result is a 20kb (unzipped) file, less than 1/8th the size of just stock/vanilla Bootstrap CSS.

## Part 2: Supabase Back-End to Replace Rails

Like I said, I was originally planning to just rewrite the front-end and keep the Rails back-end, but once I got done with the front-end rewrite, I had these two separate repos michaelsnook.com-client and michaelsnook.com-server, and the next things I wanted to do immediately made it clear why Rails wasn''t right for me: handling user logins, and handling image uploads. I actually did implement user logins on the Rails server, and it wasn''t too bad, but when I got to image uploads... the number of different choices I would have to make, and the code I would have to write, all to do what seemed like an extremely common set of tasks... seemed unreasonable. 

### Enter Supabase
[Supabase](http://supabase.io/) bills itself as an open-source alternative to Firebase, and they have gotten a ton of attention (and some decent funding) in recent months. They rely heavily on Postgres and PostgREST for its API, and using Postgres''s Row-Level Security (RLS) to handle all authorization on the data you access. PostgREST is already a fantastic project, applying a thin (but fast and scalable) REST API layer ontop of your Postgres database, using your database''s table and column structure to generate REST API endpoints for basic CRUD applications. And Supabase packages it up inside the officially maintained Supabase-JS library so I can write code as simple as this:

```
export async function fetchPostList() {
  const { data, error } = await supabase
    .from(''posts'')
    .select(''*'')
    .eq(''published'', true)
    .order(''published_at'', { ascending: false })

  if (error) {
    console.log(error)
    throw error.message
  }
  return data
}
```

Because I know supabase is handling access permissions for me, I have no concerns at all about writing this code in client side Javascript! 

This has the effect of shifting the way the responsibilities are handled; a little bit more onto the database and a little bit more onto the react app, to the point that now, **the need for a Rails app vanishes into thin air.**

### Built in Storage and Auth

Supabase-JS isn''t just a JS wrapper for a PostgREST API; it is a collection of a handful of open source tools that they both use and contribute to. As [their Architecture explainer](https://supabase.com/docs/architecture) says, they are also including:
1. [GoTrue to handle Auth](https://github.com/supabase/gotrue)
1. [StorageJS to upload images and other media](https://github.com/supabase/storage-js). (It''s actually a JS client for Supabase''s own custom storage server, [which they wrote about here](https://supabase.com/blog/2021/03/30/supabase-storage).)
1. A realtime API for streaming updates

The big key for me here is I no longer feel like I have to write Auth and Storage from scratch -- they just work. I create a new storage bucket and use RLS to grant access to any logged-in user. I log a user in with:

```
const { session, error } = await supabase.auth.signIn({
  email,
  password,
})
```
And the image upload is then just as simple as calling the `upload` with the bucket to upload to, the filename, and the file:
```
const { error } = await supabase.storage
  .from(''images'')
  .upload(filename, file, {
    cacheControl: ''3600'',
    upsert: true,
  })
```

This would have been hours and hours of work (for me) in Rails, plus an s3 bucket and CORS and IAM user. Supabase''s auth system includes password recovery emails and magic links and sign in via SMS, so I never have to write those back-ends at all; I can just write a line of javascript in my client app and it works.

## Conclusion

I love this stack. I think it''s fantastic and I plan to keep using it, but I won''t pretend it''s for every project Most organizations won''t have the luxury of ditching the server altogether and moving to Supabase or a similar Back-end As A Service (BAAS) approach. But many organizations will have one or two projects where BAAS makes sense! 
 
Especially if you''re using this kind of serverless or isomorphic approach for the "front end" application. NextJS and similar platforms are increasingly supporting lambda functions and incremental rebuilds; React has released Server-Side Components and these hosting platforms will likely support that as well. NextJS allows you to write functions in an `/api/` folder which create API routes that execute only on the host server and have access to additional server-side Environment variables. So more and more, we can push functionality out of the back-end frameworks in helpful ways, ways that actually improve performance, security and scalability.

So I encourage folks to give BAAS a whirl, but the big take-away for me on this project has been how useful the combination of NextJS and Tailwind has been. It makes it easy to prototype, and then easy to build and customize and refine from there. And when I put the two pieces together, I finally start to feel like more and more of the things I want to build are straightforward, just a matter of writing the function. 

When I think about how this stack would scale, either in traffic or in complexity, I think I''m finally feeling like I''ve got the tools and the knowledge that just about anything I want to build would be just a matter of taking the time to sit down and write the feature, rather than a hard technical barrier. But here are a few things about the current setup that I think could bite me in time, either for complexity or scale:

* Moving to NextJS, I was able to do all this easy server-side generation because I''m hosting on Vercel, which seems like it could get expensive at scale, especially if we were using incremental site regeneration or server-side generation (not static but real-time, on the server). But right now there''s no ISG or SSR, so I''d only be charged for their CDN (cheap) and SSG (infrequent). 
  * It is possible to host the NextJS back-end on your own server, but it doesn''t appear to be a point of focus for the team.
* Similarly, Supabase seems like it will get expensive at scale. They offer their server(s) as open source software and in a Docker container, and it seems like it is a point of open-source pride for them to make sure that''s a good experience.
* The app doesn''t really handle context at all right now. I started writing a little user context provider hook but `supabase.auth.session()` is fast and caches responses so it essentially acts as its own context store. But as an app running on this stack grew in size I would have to make some choices, given the specific needs at hand, about how to proceed.

For now, all of this is working great! I have to say the thing I''m least comfortable with is how much it seems that relying on NextJS means relying on Vercel''s hosting long into the future.

I don''t like vendor lock-in, and it makes me uncomfortable to think I''d build something small that relies down to its core on a technology that will be very expensive at scale. So I''m thinking about checking out [Remix](https://remix.run/docs/en/v1/tutorials/blog), which appears to be aiming for the same pre-render-then-hydrate approach as NextJS, and uses a similar approach to building routes with the filesystem, and running server-side functions defined in the same app. 

It looks like actually a Remix port would be pretty easy to do, and would still work with Supabase and react-hook-form and Tailwind and all the rest of the tooling I''ve got now. I''d have to change some folder names and the way I define my data fetching functions (or maybe just what I call them). But there could be some benefits too -- in Remix, for example, you can define data fetching for, and then pre-generate individual components, not just pages, whereas I am not sure how gracefully NextJS will integrate server-side components when they are finally ready to be added into the framework. 

But I am happy for now; no plans for another rewrite any time soon. What I''m looking forward to next is just _using_ this nice, modern, lightweight, low-lift stack to build more things; maybe take another crack at writing [Sunlo](http://sunlo.co), the language learning app I have been dreaming and scheming about for 5+ years; or maybe just keep working on new features for this site like a media library and auto-save backups and the like. Right now though, I am so happy it''s done, and I''m ready to put the code away for a little while and finish up some of the posts in my drafts folder. Wish me luck!', '2021-07-08 00:00:00+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/XbL5Ljs-18fd68.png', true, 'trying-nextjs-supabase', 'Trying something new: NextJS + Supabase', '2021-11-27 10:25:56.242745+00', '4ed1a651-55ca-41b9-8898-7ccb5d7afc54', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2021-11-24'),
	('', '2022-01-23 09:59:59.978651+00', NULL, '', false, 'working-on-sunlo', 'Working on: Sunlo, a social language learning app', NULL, 'fc08137f-6585-4fb0-a3ad-89f34a177815', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('**This is just a test post.**

Each time the markdown re-renders, the image below will change. but the markdown renderer is pretty smart so it only re-renders what it needs to.

## Some Heading

```
some cod
```

![](https://picsum.photos/600/300)', '2021-10-05 07:06:34.256+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/image-from-supabase-example-18f41a.jpg', false, 'testing-1234567', 'Test Post 1234', '2021-10-31 22:29:49.642111+00', '401530f3-442c-4b0e-a416-4c87e8fefdc6', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2021-10-11'),
	('', '2021-10-30 10:16:28.163+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/image-from-supabase-example-18f41a.jpg', false, 'aaaaa', 'a', '2021-10-31 22:33:12.02848+00', 'c118dfe4-fc18-42c2-8c5d-5d70d229563c', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('When you''re working on a project, especially with a team, it''s great to have good process in place, followed routinely and without too much interference. So I''m here to make a (limited) case for some ways to use "No process", suggesting an order of preference that goes:

1. Good process
2. No process*
3. Bad process

What I mean by "Bad Process" 

This is only an easy claim to make because of the big giant "*" – where "No Process" actually means a finding very low-interference ways of advancing projects, coming up with creative solutions and reaching consensus. There are plenty of situations where processes can go wrong', '2021-08-16 17:43:32.739+00', NULL, NULL, false, 'bad-process-no-process', 'Bad Process is the Worst Process', '2021-08-16 17:43:32.739+00', 'f649db52-c1d3-4191-ace8-b7f16395b336', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('1. Identify actual enemies, and make them good ones. [here is a great example.](https://twitter.com/WaywardWinifred/status/1430555879993184262) Erik Prince is an objectively terrible person and this question is supremely relevant to what kinds of people we are and what kind of countrywide sense of identity we want to have. And for all the traction of hating on Elon Musk, you''d think we could make this guy radioactive outside of just political circles, eh? 
2. Imbalance coalitions, e.g. if you can make Erik Prince radioactive, can you then force out blackwater? And if you hammer on that, does it become a strained relationship for Members of Congress? We typically think of Reps being "beholden" to interests like the military industrial complex, but imagine they have weak spots, that they can be separated, and take your shot.
3. Think ahead, looking back on now. The right does this all the time in destructive ways by saying "soon they''ll have storm troopers confiscate your bibles", but we can do it in a different way like, "we can have nice things and this can be a turning point and gee won''t that be nice looking back." We can use this to give calm during crisis, almost like a soothing prayer, despite the feeling of emergency that we all feel these days when engaging in political action or labor.', '2021-08-25 20:15:35.498+00', NULL, NULL, false, 'ways-of-power', 'Ways of Power', '2021-08-25 20:15:35.498+00', '092f85ed-dc53-454c-9ba2-8d1e8345a905', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('## Hello
#### Smooth
 
**How are you**
![Samosa](https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/139372.jpg?resize=1200:*)


tythjyuj tr ', '2022-04-03 09:10:37.519617+00', NULL, 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/hyrax-197033.jpeg', false, 'feature-signal-documents', 'Missing Feature: Signal Document / Attachment Store', '2022-12-17 21:14:55.597283+00', '898eabe7-a24a-41af-97ec-94dd3383eb91', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', NULL),
	('Let the funeral be like a dinner party\
Aunties and uncles flitting to and fro\
Offering you the same seat or the same sweets\
While you strain to recall every name\
And look engaged while you tell the same story

Let it be like a dance party\
Where we all get up and down on cue and sing along for certain tunes --\
It opens up the heart, not to mention the lungs, and the hips (better to sit through the long prayer)\
And some struggle to recall the words but we agree not to notice

Let it be like a graduation party\
Where we all celebrate the wrong accomplishments, somehow, and speak of what''s to come\
Young and old mingle and some get emotional\
And flowers are brought and my friends recall different versions of the same story\
And they wear that pained face and say they did their best, and always stuck together

And let the funeral be like a baby shower\
With traditions sprung on you by elders who''ve done one before\
Chattering in circles around you, making remarks and such, and giving news of far-flung relatives\
Where many who sat where you will sit, my dear, will give advice on how to feel\
And say, Everything will turn out fine

', '2023-08-06 06:48:08.010366+00', 'A poem written 6th August, 2023', '', true, 'let-the-funeral-poem', 'Let My Funeral Be Like a Party ', '2024-12-19 09:40:58.551578+00', '26e34232-0fc1-4283-a85b-5f4e17f1d7b7', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2023-08-06'),
	('### Employr: Swipe right on resumes.

With Employr, job seekers and posters get a quick look at what the other has to offer, and match via the time-honored method of swiping right and left. If you both swipe right, you can chat and set up an interview!

Tag yourself or your hiring organization with different interests,
skills possessed or desired, and then swipe left or right at potential matches
for employment. If you both swipe right, message them and set up an interview.
Geographic filters allow for hiring in offices, remotely, or for small community
organizations and local businesses. Resume previews show only a summary of
skills and experiences, so the initial review process is equitable and
un-biased, with no HR overhead.

Local small non-profit owner / my neighbor says:

&gt; I would definitely use Employr to help for hiring. I run a small non-profit   that puts on dance classes for kids in the neighborhood and performs at festivals around Brooklyn. I post online, do a lot of word-of-mouth, and put up flyers when I need to hire for a position or a particular event. I would love to be able to set interests (like "dance, nonprofit, local") and set the range to "5 miles", and find good people committed to the community. Sounds amazing!

Well, it''s not amazing _yet_, because it hasn''t been built. But I think it''s a cool idea at least.
', '2015-04-29 00:00:00+00', 'Just a fictional/hypothetical app idea.', 'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/employr-1980ce.png', true, 'employr', 'Employr', '2022-12-18 14:38:29.742397+00', '4e1e29ed-4354-41af-9ef7-bbedda0a55b2', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2015-04-29'),
	('Writing something small can be hard. I don''t mean a tweet or a text but a Thing™ of some kind, something that''s not a huge piece with a thesis for each section and a table of contents, but still has a few parts and some order and means something.

I reckon at some point in professional middle-manager world, I got caught up in a kind of "bullet-point writing style," which is professionally practical but not the way I want to live my entire life. And whenever I break out of these easy structures, there''s the fear of doing "art" or "theory" and comparing myself quite unfavorably to professional writers, artists, or theorists, who write these incredible things like it''s nothing.

Or I end up crafting my small thought into the bones of some grand opus, and then I lose interest or just don''t have time for the commitment. So I skip straight to the unwieldy opus, without ever just writing the small thing down.

But winds are changing. I''m changing. I''m playing and singing every day, even though I''m a little embarrassed. I learned a TikTok dance and I''ll probably learn a few more. I showed off my app on social media, and got some nice feedback. I learned some digital painting and made a couple of cute characters for the app who are learning languages together. I don''t want this kind of thing to be a barrier for me; I don''t want to worry if it''s too loud or too annoying or too try-hard; I just want to write my little thoughts and put them on my little website.

I do have a journal for private thoughts, and I like it – but some things want to be said in public, just because they are public things. Meanwhile, Twitter is dying. I don''t know where I''ll want to put my small thoughts a year from now, but before I learn to shoehorn them into some new platform and format I want to at least confront this fear – why is it so hard to just write something on, my own site (which no one reads), and put it out there?


In _just one day_ you can go from: too bashful to be heard singing or seen dancing, too shy to walk the way you want to walk and wear clothes that say a little more, too afraid to let your voice rise to another pitch and fall back down throughout our conversation – it''s exhausting and frankly boring. I''m growing too tired to keep on shrinking from that fear that something I''m doing might be creative, might be seen as taking effort, being a Big Thing but failing to match professional quality.

So I''m going to practice this: just, writing something small, and letting it out. Maybe I will learn to love the fear. Maybe it will go away entirely, or fade to a more appropriate size. Or maybe I will succeed with other things first, like if I just end up singing and dancing more, and then all this anxiety about writing and being judged just ends up feeling kind of small.', '2023-05-15 19:26:44.848962+00', 'Writing something small can be hard. I don''t mean a tweet or a text but a Thing™ of some kind, something that''s not a huge piece with a thesis for each section and a table of contents, but still has...', '', true, 'writing-something-small', 'Writing Something Small', '2023-05-15 20:41:49.238388+00', '7857c35c-7551-4c49-8d4a-9cc610159776', 'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e', '2023-05-15');


--
-- PostgreSQL database dump complete
--

RESET ALL;
