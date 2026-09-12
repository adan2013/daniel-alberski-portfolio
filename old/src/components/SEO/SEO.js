import React from 'react'
import { Helmet } from 'react-helmet'
import { seoConfig } from '../../data'

const socialImageUrl = `${seoConfig.url}/socialimg.jpg`

const SEO = () => (
    <Helmet htmlAttributes={{ lang: 'pl' }}>
        <meta charSet='utf-8' />
        <title>{seoConfig.fullTitle}</title>
        <meta name='description' content={seoConfig.description} />
        <meta name='og:site_name' content={seoConfig.shortTitle} />
        <meta name='og:title' content={seoConfig.fullTitle} />
        <meta name='og:description' content={seoConfig.description} />
        <meta name='og:url' content={seoConfig.url} />
        <meta name='og:type' content='website' />
        <meta name='og:image' content={socialImageUrl} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:creator' content={seoConfig.author} />
        <meta name='twitter:title' content={seoConfig.fullTitle} />
        <meta name='twitter:description' content={seoConfig.description} />
        <meta name='twitter:image' content={socialImageUrl} />
        {/* <meta name='' content='' /> */}
    </Helmet>
)

export default SEO