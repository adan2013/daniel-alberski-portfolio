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
        description: 'Blog technologiczny stworzony w 2018 roku z my??l?? o dzieleniu si?? swoj?? wiedz?? z dziedziny IT. Przez pierwsze dwa lata pracowa?? on pod kontrol?? WordPressa z autorskim motywem PHP. Z powodu cz??stych problem??w ze stabilno??ci?? oraz rosn??cych potrzeb personalizacji i szybko??ci dzia??ania w 2020 roku zosta?? on pomy??lnie przeniesiony na Reacta oraz Gatsby\'ego. Ca??y projekt sta?? si?? open-source i jest dost??pny na GitHubie, a wszystkie artyku??y pisane s?? teraz w MDX - plikach Markdown wzbogaconych o sk??adni?? JSX. Przy pomocy tych samych technologii powsta??a strona portfolio, kt??r?? w??a??nie czytasz.',
        tags: ['React', 'Gatsby', 'MDX'],
        buttons: [
            { name: 'Strona g????wna', icon: null, url: 'https://redark.pl' },
            { name: 'GitHub', icon: faGithub, url: 'https://github.com/adan2013/Redark-Gatsby-Blog' },
        ],
    },
    {
        id: 'irltracker',
        name: 'IRL Tracker',
        image: 'projects/irl-tracker.jpg',
        description: 'System do ??ledzenia lokalizacji stworzony do prowadzenia stream??w IRL. Aplikacja na telefon odbiera dane GSM/GPS, przesy??a je na serwer, a nast??pnie do widgetu z map?? widocznego na transmisji internetowej. Aplikacja ponadto obs??uguje sensory t??tna oraz opaski sportowe Bluetooth do pokazywania szybko??ci bicia serca streamera, a tak??e posiada specjaln?? wbudowan?? przegl??dark?? czatu Twitcha. Biblioteka widget??w jest stale powi??kszana i posiada r??wnie?? wersje pozwalaj??ce na ??ledzenie kilku u??ytkownik??w jednocze??nie np. podczas przeja??d??ek rowerowych.',
        tags: ['React', 'React Native', 'Node.js', 'Firebase'],
        buttons: [
            { name: 'Strona projektu', icon: null, url: 'https://neurit.net/portfolio/irl-tracker/' },
        ],
    },
    {
        id: 'avc',
        name: 'AVC',
        image: 'projects/avc.jpg',
        description: 'Kompleksowy system do zarz??dzania aeroklubami oraz szk????kami lotniczymi. Obejmuje kartoteki do zarz??dzania statkami powietrznymi, uprawnieniami pilot??w oraz cz??onkami klub??w. Modu?? chronometra??a monitoruje aktualnie znajduj??ce si?? w powietrzu jednostki oraz dba o wszystkie formalno??ci, w tym rozliczanie op??at za przelot.',
        tags: ['React', 'Firebase', 'Algolia'],
        buttons: [
            { name: 'Strona projektu', icon: null, url: 'http://avc.neurit.net' },
        ],
    },
    {
        id: 'diyarduinodashboard',
        name: 'DIY Arduino Dashboard',
        image: 'projects/diy-arduino-dashboard.jpg',
        description: 'Projekt DIY, kt??ry by?? zar??wno moim wst??pem do ??wiata elektroniki, jak i najbardziej skomplikowanym dzie??em. W sk??ad projektu wchodzi??y cztery elementy. Pierwsz?? rzecz?? by?? napisany w C# i WPF interpreter telemetrii gier Euro Truck Simulator 2 oraz American Truck Simulator. Drug?? by?? kod C++ dla Arduino, trzeci?? generator tarcz zegar??w napisany w C# i WPF. Ostatnim elementem uk??adanki by??y r??cznie wykonane zegary samochodowe. Powsta??y one na bazie Volkwagena Golfa 4. generacji i posiada??y 4 zegary analogowe, 16 kontrolek ostrzegawczych oraz wy??wietlacz LCD z pe??ni interaktywnym komputerem pok??adowym. Tarcze zegar??w zosta??y zaprojektowane przeze mnie od podstaw, a nast??pnie wykonane z kilku sklejonych ze sob?? materia????w. Kod wszystkich program??w oraz schematy elektryczne s?? dost??pne na GitHubie. Dzia??anie oraz proces budowy zegar??w mo??na zobaczy?? na blogu Redark.pl.',
        tags: ['WPF', 'C#', 'C++'],
        buttons: [
            { name: 'Artyku??', icon: null, url: 'https://redark.pl/diy-arduino-dashboard-ets-ats' },
            { name: 'Wideo', icon: faYoutube, url: 'https://youtu.be/KW6sZINNi9Y' },
            { name: 'GitHub', icon: faGithub, url: 'https://github.com/adan2013/DIY-Arduino-Dashboard' },
        ],
    },
    {
        id: 'raspberrybookreader',
        name: 'Raspberry Book Reader',
        image: 'projects/rpi-book-reader.jpg',
        description: 'Czytnik audiobook??w dostosowany do obs??ugi przez osoby starsze/niedowidz??ce. By?? to m??j drugi projekt DIY i stworzy??em go dla swojej babci. Sercem uk??adu jest Raspberry Pi 3 B+ oraz m??j pierwszy skrypt napisany w Pythonie. Ca??o???? pracowa??a na Linuxie w interfejsie tekstowym i korzysta??a z biblioteki VLC. Za proste oraz bezpieczne w????czanie i wy????czanie mikrokomputera odpowiada?? uk??ad Arduino ATtiny85, kt??ry komunikowa?? si?? z systemem operacyjnym oraz sterowa?? zasilaniem uk??adu. Dzia??anie oraz proces budowy czytnika mo??na zobaczy?? na blogu Redark.pl.',
        tags: ['Python', 'C++', 'C#'],
        buttons: [
            { name: 'Artyku??', icon: null, url: 'https://redark.pl/diy-raspberry-book-reader' },
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