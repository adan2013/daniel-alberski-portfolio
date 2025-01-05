import React from 'react'
import PageContainer from '../components/PageContainer/PageContainer'
import Hero from '../sections/Hero/Hero'
import AboutMe from '../sections/AboutMe/AboutMe'
import Skills from '../sections/Skills/Skills'
import Projects from '../sections/Projects/Projects'
import Contact from '../sections/Contact/Contact'
import Footer from '../sections/Footer/Footer'
import '../i18n';

const IndexPage = () => {

  return (
    <PageContainer>
      <Hero />
      <AboutMe />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </PageContainer>
  )
}

export default IndexPage
