## From WordPress to my own platform

I launched Redark in 2018 to share what I knew about computers and software. Over time, I also began documenting my own projects there, including Arduino Dashboard, a Raspberry Pi audiobook player and VHS HTPC. I wanted to publish the kind of detailed guides I would have found useful when solving the same problems.

The first version ran on WordPress. I already knew the system and could launch the site quickly, but none of the available themes suited me, so I wrote my own in PHP. It got the blog online, although every new requirement added more code and more workarounds.

[media:1]

Maintaining WordPress gradually took more of my time. Updates to WordPress and its plugins could introduce new problems, moving the site to HTTPS was needlessly difficult, and absolute URLs made it harder to run a copy in another environment. Redark itself was never attacked, but I had repeatedly helped rescue other WordPress installations. I had seen the damage caused by a vulnerable plugin or a neglected update.

For about two months, I tested less drastic options. I tried using WordPress as a headless CMS and embedding React into the existing theme. Both approaches left the hardest part untouched: I would still have to maintain WordPress and fit the rest of the system around it. I eventually removed it completely and rebuilt the blog as a static React and Gatsby site.

## Migrating around 80 articles

This was not an empty site. Redark already had around 80 published articles, images, categories, tags, related posts and URLs listed in search results. Copying the content by hand was out of the question, but an automated import still needed supervision. This was 2020, so I could not hand the archive to a language model and ask it to find every discrepancy.

I wrote a Node.js migration script and tests that identified broken links to pages and media. I replaced URLs tied to the Redark domain with relative paths so that local, test and production environments could all use the same content. Once the automated checks passed, I reviewed the result manually. The migration took more than a month.

The articles moved to MDX files stored alongside the code in the repository. Each file contained the article and its metadata, including the title, date, slug, categories, tags and featured image. MDX also let me embed my own components for galleries, buttons and information blocks without tying the content to the WordPress editor.

[media:2]

Preserving search visibility was one of the requirements, but I do not have the statistics to promise a “zero SEO loss” migration. What I can describe is the work behind it: I preserved the URL structure, checked links and images, added metadata and social sharing images, verified the sitemap and tested the site with several SEO analysers. I also checked the appearance and content of the migrated articles.

## Publishing without an admin panel

Removing WordPress also removed the admin panel and database. I stored the code and articles on GitHub, while the server received the generated site files. This reduced the attack surface and gave me a complete change history, but it also took away the convenient Publish button. I had to build my own process.

The first version built the entire site and uploaded it over FTP. In 2020, this took around 60–70 minutes, mainly because of the number of images Gatsby had to process. I then configured a Buddy Works pipeline that built the project and uploaded only changed files, cutting the process to around four minutes.

[media:3]

Redark soon outgrew the service’s free plan. Instead of returning to manual deployments, I wrote my own Node.js tool. It pulled changes from GitHub, built the site, compared the output with the previous version, uploaded the difference over FTP and sent an email report. At the time, a deployment usually took 2–3 minutes. These figures describe the project in 2020, not its current performance.

[media:4]

The custom process took more work to set up, but it removed tasks I would otherwise have repeated for every article. I released both the blog and deployment tool as open-source projects.

## The decision six years later

I still consider leaving WordPress a very good decision. Redark remains online at the same domain, and the documentation for my projects is still available. I publish occasionally, although the blog is no longer my main focus.

Both the internet and the site’s subject matter have changed. Readers increasingly ask AI tools instead of searching for guides, while answers generated directly in search results reduce visits to source websites. Long-form articles therefore became harder to justify in terms of time. The GPU shortage, followed later by high RAM and storage prices, also made building PCs less worthwhile than it once was. These changes affected Redark’s readership.

With hindsight, I would choose a different framework. Gatsby did its job well in 2020, but over the following years its builds became long, its artefacts grew and deployments became heavier. Its community also lost momentum. I built a Next.js prototype of Redark in 2025, but with lower traffic there was no reason to risk another migration of a working site. If I were starting the process today, I would still leave WordPress, but I would choose Next.js from the beginning.
