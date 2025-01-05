import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'

const Switch = styled.a`
    display: block;
    text-decoration: none;
    background-color: #c5bfbf;
    color: #000;
    font-size: 0.75rem;
    min-width: 100px;
    text-align: center;
    margin: 0;
    padding: 12px 15px;
    position: absolute;
    top: 15px;
    right: 15px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.6);
    cursor: pointer;
    transition: 0.2s;
    z-index: 1000;

    svg {
        margin-right: 8px;
    }

    &:hover {
        top: 10px;
        right: 10px;
        box-shadow: -5px 5px 10px 2px rgba(0, 0, 0, 0.6);
    }
`

const LanguageSwitch = () => {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    if(i18n.language === 'en') {
      i18n.changeLanguage('pl')
    } else {
      i18n.changeLanguage('en')
    }
  }

  return(
    <Switch onClick={toggleLanguage}>
      {t('switchLanguage')}
    </Switch>
  )
}

export default LanguageSwitch
