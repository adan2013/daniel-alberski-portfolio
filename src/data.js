import {
    faGithub,
    faLinkedin,
    faTwitter,
    faYoutube,
    faNodeJs,
    faReact,
    faInstagram,
} from '@fortawesome/free-brands-svg-icons'
import {
    faDatabase,
} from '@fortawesome/free-solid-svg-icons'
import SocketIoLogo from './images/icons/socket-io-logo.svg'
import StyledComponentsLogo from './images/icons/styled-components-logo.svg'
import GatsbyLogo from './images/icons/gatsby-logo.svg'
import CSharpLogo from './images/icons/csharp-logo.svg'
import VisualStudioLogo from './images/icons/visual-studio-logo.svg'
import WebStormLogo from './images/icons/webstorm-logo.svg'
import FirebaseLogo from './images/icons/firebase-logo.svg'
import TailwindLogo from './images/icons/tailwind-logo.svg'
import TypeScriptLogo from './images/icons/ts-logo.svg'
import FusionLogo from './images/icons/fusion360-logo.svg'

export const seoConfig = {
    url: 'https://danielalberski.adanit.pl',
    fullTitle: 'Daniel Alberski - Frontend Developer',
    shortTitle: 'Daniel Alberski',
    description: 'Portfolio Daniel Alberski Frontend Developer',
    author: 'Daniel Alberski',
}

export const social = [
    {
        id: 'github',
        url: 'https://github.com/adan2013',
        name: 'GitHub',
        color: '#fff',
        icon: faGithub,
    },
    {
        id: 'linkedin',
        url: 'https://www.linkedin.com/in/daniel-alberski/',
        name: 'LinkedIn',
        color: '#0e76a8',
        icon: faLinkedin,
    },
    {
        id: 'twitter',
        url: 'https://twitter.com/REDARKpl',
        name: 'Twitter',
        color: '#1da1f2',
        icon: faTwitter,
    },
    {
        id: 'instagram',
        url: 'https://www.instagram.com/redark.pl/',
        name: 'Instagram',
        color: '#dd2a7b',
        icon: faInstagram,
    },
    // {
    //     id: '',
    //     url: '',
    //     name: '',
    //     color: '',
    //     icon: null,
    // },
]

export const skills = [
    { id: 'ts', name: 'TypeScript', svg: TypeScriptLogo, color: '#3178c6' },
    { id: 'nodejs', name: 'Node.js', icon: faNodeJs, color: '#3c873a' },
    { id: 'react', name: 'React', icon: faReact, color: '#51dbfb' },
    { id: 'reactnative', name: 'React Native', icon: faReact, color: '#51dbfb' },
    { id: 'sql', name: 'SQL/NoSQL', icon: faDatabase, color: '#f29111' },
    { id: 'gatsby', name: 'Gatsby', svg: GatsbyLogo, color: '#663399' },
    { id: 'styled', name: 'Styled Components', svg: StyledComponentsLogo, color: '#db7290' },
    { id: 'tailwind', name: 'Tailwind CSS', svg: TailwindLogo, color: '#06B6D4' },
    { id: 'firebase', name: 'Firebase', svg: FirebaseLogo, color: '#ffa611' },
    { id: 'socketio', name: 'Socket.IO', svg: SocketIoLogo, color: '#888' },
    { id: 'csharp', name: 'C# (.Net)', svg: CSharpLogo, color: '#9a4993' },
    // { id: 'git', name: 'Git', icon: faGitAlt, color: '#f1502f' },
    // { id: 'github', name: 'GitHub', icon: faGithub, color: '#888' },
    { id: 'vs', name: 'Visual Studio', svg: VisualStudioLogo, color: '#b179f1' },
    { id: 'webstorm', name: 'WebStorm', svg: WebStormLogo, color: '#00c7d3' },
    { id: 'fusion', name: 'Autodesk Fusion 360', svg: FusionLogo, color: '#ff6b00' },
    // { id: '', name: '', icon: null, svg: null, color: '#000' },
]

export const projects = [
    {
        id: 'redark',
        name: 'redark.title',
        image: 'projects/redark.jpg',
        description: 'redark.description',
        tags: ['React', 'Gatsby', 'MDX', 'WordPress'],
        buttons: [
            { name: 'mainPageButton', icon: null, url: 'https://redark.pl' },
            { name: 'githubButton', icon: faGithub, url: 'https://github.com/adan2013/Redark-Gatsby-Blog' },
        ],
    },
    {
        id: 'smartHome',
        name: 'smartHome.title',
        image: 'projects/smarthome.jpg',
        description: 'smartHome.description',
        tags: ['React', 'Node.js', 'Home Assistant', 'Tailwind CSS', 'WebSockets'],
        buttons: [
            { name: 'screenshotsButton', icon: null, url: 'https://github.com/adan2013/HA-Dashboard?tab=readme-ov-file#screenshots' },
            { name: 'frontendButton', icon: faGithub, url: 'https://github.com/adan2013/HA-Dashboard' },
            { name: 'backendButton', icon: faGithub, url: 'https://github.com/adan2013/HA-Backend' },
        ],
    },
    {
        id: 'irlTracker',
        name: 'irlTracker.title',
        image: 'projects/irl-tracker.jpg',
        description: 'irlTracker.description',
        tags: ['React', 'React Native', 'Node.js', 'Firebase', 'Bluetooth LE'],
        buttons: [
            { name: 'projectPageButton', icon: null, url: 'https://neurit.net/portfolio/irl-tracker/' },
        ],
    },
    {
        id: 'diyArduinoDashboard',
        name: 'diyArduinoDashboard.title',
        image: 'projects/diy-arduino-dashboard.jpg',
        description: 'diyArduinoDashboard.description',
        tags: ['WPF', 'C#', 'C++', 'Arduino'],
        buttons: [
            { name: 'articleButton', icon: null, url: 'https://redark.pl/diy-arduino-dashboard-ets-ats' },
            { name: 'videoButton', icon: faYoutube, url: 'https://youtu.be/KW6sZINNi9Y' },
            { name: 'githubButton', icon: faGithub, url: 'https://github.com/adan2013/DIY-Arduino-Dashboard' },
        ],
    },
    {
        id: 'raspberryBookReader',
        name: 'raspberryBookReader.title',
        image: 'projects/rpi-book-reader.jpg',
        description: 'raspberryBookReader.description',
        tags: ['Python', 'C++', 'C#', 'Raspberry Pi'],
        buttons: [
            { name: 'articleButton', icon: null, url: 'https://redark.pl/diy-raspberry-book-reader' },
            { name: 'videoButton', icon: faYoutube, url: 'https://youtu.be/_oJZlEEj5N0' },
            { name: 'githubButton', icon: faGithub, url: 'https://github.com/adan2013/RaspberryBookReader' },
        ],
    },
    // {
    //     id: '',
    //     name: '',
    //     description: '',
    //     tags: [],
    //     buttons: [
    //         { name: '', url: '' },
    //     ],
    // },
]
