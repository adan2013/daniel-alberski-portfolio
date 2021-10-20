import {
    faGithub,
    faLinkedin,
    faTwitter,
    faYoutube,
    faHtml5,
    faCss3Alt,
    faJsSquare,
    faNodeJs,
    faReact,
    faGitAlt,
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

export const seoConfig = {
    url: 'https://danielalberski.redark.pl',
    fullTitle: 'Daniel Alberski - JavaScript Frontend Developer',
    shortTitle: 'Daniel Alberski',
    description: 'Portfolio Daniel Alberski JavaScript Frontend Developer',
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
    { id: 'html', name: 'HTML 5', icon: faHtml5, color: '#e34c26' },
    { id: 'css', name: 'CSS 3', icon: faCss3Alt, color: '#264de4' },
    { id: 'sql', name: 'SQL', icon: faDatabase, color: '#f29111' },
    { id: 'js', name: 'JavaScript', icon: faJsSquare, color: '#f0db4f' },
    { id: 'nodejs', name: 'Node.js', icon: faNodeJs, color: '#3c873a' },
    { id: 'react', name: 'React', icon: faReact, color: '#51dbfb' },
    { id: 'reactnative', name: 'React Native', icon: faReact, color: '#51dbfb' },
    { id: 'gatsby', name: 'Gatsby', svg: GatsbyLogo, color: '#663399' },
    { id: 'styled', name: 'Styled Components', svg: StyledComponentsLogo, color: '#db7290' },
    { id: 'firebase', name: 'Firebase', svg: FirebaseLogo, color: '#ffa611' },
    { id: 'csharp', name: 'C# (.Net)', svg: CSharpLogo, color: '#9a4993' },
    { id: 'socketio', name: 'Socket.IO', svg: SocketIoLogo, color: '#888' },
    { id: 'git', name: 'Git', icon: faGitAlt, color: '#f1502f' },
    { id: 'github', name: 'GitHub', icon: faGithub, color: '#888' },
    { id: 'vs', name: 'Visual Studio', svg: VisualStudioLogo, color: '#b179f1' },
    { id: 'webstorm', name: 'WebStorm', svg: WebStormLogo, color: '#00c7d3' },
    // { id: '', name: '', icon: null, svg: null, color: '#000' },
]

export const projects = [
    {
        id: 'redark',
        name: 'Redark',
        image: 'projects/redark.jpg',
        description: 'Blog technologiczny stworzony w 2018 roku z myślą o dzieleniu się swoją wiedzą z dziedziny IT. Przez pierwsze dwa lata pracował on pod kontrolą WordPressa z autorskim motywem PHP. Z powodu częstych problemów ze stabilnością oraz rosnących potrzeb personalizacji i szybkości działania w 2020 roku został on pomyślnie przeniesiony na Reacta oraz Gatsby\'ego. Cały projekt stał się open-source i jest dostępny na GitHubie, a wszystkie artykuły pisane są teraz w MDX - plikach Markdown wzbogaconych o składnię JSX. Przy pomocy tych samych technologii powstała strona portfolio, którą właśnie czytasz.',
        tags: ['React', 'Gatsby', 'MDX'],
        buttons: [
            { name: 'Strona główna', icon: null, url: 'https://redark.pl' },
            { name: 'GitHub', icon: faGithub, url: 'https://github.com/adan2013/Redark-Gatsby-Blog' },
        ],
    },
    {
        id: 'irltracker',
        name: 'IRL Tracker',
        image: 'projects/irl-tracker.jpg',
        description: 'System do śledzenia lokalizacji stworzony do prowadzenia streamów IRL. Aplikacja na telefon odbiera dane GSM/GPS, przesyła je na serwer, a następnie do widgetu z mapą widocznego na transmisji internetowej. Aplikacja ponadto obsługuje sensory tętna oraz opaski sportowe Bluetooth do pokazywania szybkości bicia serca streamera, a także posiada specjalną wbudowaną przeglądarkę czatu Twitcha. Biblioteka widgetów jest stale powiększana i posiada również wersje pozwalające na śledzenie kilku użytkowników jednocześnie np. podczas przejażdżek rowerowych.',
        tags: ['React', 'React Native', 'Node.js', 'Firebase'],
        buttons: [
            { name: 'Strona projektu', icon: null, url: 'https://neurit.net/portfolio/irl-tracker/' },
        ],
    },
    {
        id: 'avc',
        name: 'AVC',
        image: 'projects/avc.jpg',
        description: 'Kompleksowy system do zarządzania aeroklubami oraz szkółkami lotniczymi. Obejmuje kartoteki do zarządzania statkami powietrznymi, uprawnieniami pilotów oraz członkami klubów. Moduł chronometraża monitoruje aktualnie znajdujące się w powietrzu jednostki oraz dba o wszystkie formalności, w tym rozliczanie opłat za przelot.',
        tags: ['React', 'Firebase', 'Algolia'],
        buttons: [
            { name: 'Strona projektu', icon: null, url: 'http://avc.neurit.net' },
        ],
    },
    {
        id: 'diyarduinodashboard',
        name: 'DIY Arduino Dashboard',
        image: 'projects/diy-arduino-dashboard.jpg',
        description: 'Projekt DIY, który był zarówno moim wstępem do świata elektroniki, jak i najbardziej skomplikowanym dziełem. W skład projektu wchodziły cztery elementy. Pierwszą rzeczą był napisany w C# i WPF interpreter telemetrii gier Euro Truck Simulator 2 oraz American Truck Simulator. Drugą był kod C++ dla Arduino, trzecią generator tarcz zegarów napisany w C# i WPF. Ostatnim elementem układanki były ręcznie wykonane zegary samochodowe. Powstały one na bazie Volkwagena Golfa 4. generacji i posiadały 4 zegary analogowe, 16 kontrolek ostrzegawczych oraz wyświetlacz LCD z pełni interaktywnym komputerem pokładowym. Tarcze zegarów zostały zaprojektowane przeze mnie od podstaw, a następnie wykonane z kilku sklejonych ze sobą materiałów. Kod wszystkich programów oraz schematy elektryczne są dostępne na GitHubie. Działanie oraz proces budowy zegarów można zobaczyć na blogu Redark.pl.',
        tags: ['WPF', 'C#', 'C++'],
        buttons: [
            { name: 'Artykuł', icon: null, url: 'https://redark.pl/diy-arduino-dashboard-ets-ats' },
            { name: 'Wideo', icon: faYoutube, url: 'https://youtu.be/KW6sZINNi9Y' },
            { name: 'GitHub', icon: faGithub, url: 'https://github.com/adan2013/DIY-Arduino-Dashboard' },
        ],
    },
    {
        id: 'raspberrybookreader',
        name: 'Raspberry Book Reader',
        image: 'projects/rpi-book-reader.jpg',
        description: 'Czytnik audiobooków dostosowany do obsługi przez osoby starsze/niedowidzące. Był to mój drugi projekt DIY i stworzyłem go dla swojej babci. Sercem układu jest Raspberry Pi 3 B+ oraz mój pierwszy skrypt napisany w Pythonie. Całość pracowała na Linuxie w interfejsie tekstowym i korzystała z biblioteki VLC. Za proste oraz bezpieczne włączanie i wyłączanie mikrokomputera odpowiadał układ Arduino ATtiny85, który komunikował się z systemem operacyjnym oraz sterował zasilaniem układu. Działanie oraz proces budowy czytnika można zobaczyć na blogu Redark.pl.',
        tags: ['Python', 'C++', 'C#'],
        buttons: [
            { name: 'Artykuł', icon: null, url: 'https://redark.pl/diy-raspberry-book-reader' },
            { name: 'Wideo', icon: faYoutube, url: 'https://youtu.be/_oJZlEEj5N0' },
            { name: 'GitHub', icon: faGithub, url: 'https://github.com/adan2013/RaspberryBookReader' },
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