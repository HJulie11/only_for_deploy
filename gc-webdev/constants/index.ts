import AIicon from '@/public/AI.png'
import GraphIcon from '@/public/Graph.png'
import ManageIcon from '@/public/manage.png'
import LandfillIcon from '@/public/landfill.png'


// NAVIGATION
export const NAV_LINKS = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/calendar', key: '캘린더', label: '캘린더' },
  { href: '/my_audio', key: '나의 오디오', label: '나의 오디오' },
  { href: '/news_page', key: '뉴스', label: '뉴스' },
  
];

export const ADMIN_NAV_LINKS = [
  { href: '/adminhome', key: 'home', label: '🏠' },
  { href: '/studentadmin', key: '학생 관리', label: '학생 관리' },
  { href: '/adminaccount', key: '관리자 계정', label: '계정 정보' },
  
];

// CAMP SECTION
export const PEOPLE_URL = [
  '/person-1.png',
  '/person-2.png',
  '/person-3.png',
  '/person-4.png',
];

// FEATURES SECTION
//AI sorting; statistics; Manage all yours bins in one place; reduce landfill tax
export const FEATURES = [
  {
    title: 'AI Sorting',
    icon: AIicon,
    variant: 'green',
    description:
      "Our AI system automatically waste sorts into the correct recycling categories, reducing contamination and human error.",
  },
  {
    title: 'Statistics',
    icon: GraphIcon,
    variant: 'green',
    description:
    "View statistics on how your company is recycling, and how much waste is being diverted from landfill."
  },
  {
    title: 'Manage all your bins in one place',
    icon: ManageIcon,
    variant: 'green',
    description:
    "Monitor the status of all your bins in one place."
  },
  {
    title: 'Reduce landfill tax',
    icon: LandfillIcon,
    variant: 'green',
    description:
    "By recycling more with RecyclED, you can reduce the amount of waste sent to landfill, and therefore reduce your landfill tax."},
];

// FOOTER SECTION
// FOOTER SECTION
export const FOOTER_LINKS = [
  {
    title: 'Learn More',
    links: [
      'About Us',
      'How It Works',
      'Contact Us'
    ],
    urls: [
      '/캘린더',
      '/나의 오디오',
      '/뉴스'
    ]
  }
];

export const FOOTER_CONTACT_INFO = {
  title: 'Contact Us',
  links: [
    { label: 'Email', value: 'gyeong.cheong23@gmail.com' },
  ],
};

export const SOCIALS = {
  title: 'Social',
  links: [
    '/facebook.svg',
    '/instagram.svg',
    '/twitter.svg',
    '/youtube.svg',
    '/wordpress.svg',
  ],
};
