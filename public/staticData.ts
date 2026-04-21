import { OurImpactType } from "@/app/type";
import { 
    UsersIcon, 
    MonitorIcon, 
    PremiumAnalyticsIcon, 
    OpenBookIcon, 
    ShootingStarIcon,
    UserWithStarIcon,
    OfficeBuildingIcon,
    ChartIcon
} from "./svgIcons/Icons";

export const landingPageFeatures = [
    {
        id: 1,
        title: "Professional Networking",
        description: "Connect with peers, mentors, industry leaders in psychology & neuroscience. Build meaningful relationships that advance yor Career.",
        icon: UsersIcon,
        iconBgColor: "bg-[#BCF3FB]",
        cardBgColor: "bg-[#E2FBFF]"
    },
    {
        id: 2,
        title: "Career Opportunities",
        description: "Browse curated job listings from top institutions & organizations. Find positions that mulch your expertise & career goals.",
        icon: MonitorIcon,
        iconBgColor: "bg-[#0145DB1A]",
        cardBgColor: "bg-[#E4EEFF]"
    },
    {
        id: 3,
        title: "Knowledge Sharing",
        description: "Share your research, insights, & expertise wth the community. Learn from others & stay updated on the latest developments.",
        icon: OpenBookIcon,
        iconBgColor: "bg-[#9F77C62B]",
        cardBgColor: "bg-[#F8F2FF]"
    },
    {
        id: 4,
        title: "Premium Analytics",
        description: "Get advanced profile insights, track your visibility & understand how recruiters engage with your prefile,",
        icon: PremiumAnalyticsIcon,
        iconBgColor: "bg-[#C1F9EF]",
        cardBgColor: "bg-[#EBFFFA]"
    },
]


export const howWeWorkSteps = [
    {
        id: "1",
        title: "Explore Programs by Location",
        description: "Find the right universities and programs near you with our interactive map. Browse state-wise options and explore psychology, neuroscience, and counseling programs. Click any listing to view details.",
    },
    {
        id: "2",
        title: "Create Your Profile",
        description: "Build a professional profile that reflects your academic and career journey. Add education, experience, skills, certifications, achievements, and resumes to showcase your expertise to professionals and companies.",
    },
    {
        id: "3",
        title: "Connect & Engage",
        description: "Grow your network within a focused professional community. Connect with professionals, researchers, and organizations. Share updates, research, and insights to stay active, visible, and build meaningful connections.",
    },
    {
        id: "4",
        title: "Apply & Grow Your Career",
        description: "Turn connections and discovery into real opportunities. Apply for relevant jobs, track applications, boost profile visibility, and access premium tools designed to accelerate your career growth.",
    }
]



export const opportunities = [
    {
        id: "1",
        job_title: "Neuroscience Research Lead",
        company_name: "Johns Hopkins University",
        company_logo: "/images/company-logo-1.png",
        location: "Baltimore, MD 21218, United States",
        created_at: "2026-03-25T10:00:00Z",
        job_field: "neuroscience",
        job_type: "full-time",
        job_position: "leadership",
        isSaved: false
    },
    {
        id: "2",
        job_title: "Clinical Psychologist",
        company_name: "Stanford University",
        company_logo: "/images/company-logo-2.png",
        location: "Stanford, CA 94305, United States",
        created_at: "2026-04-02T10:00:00Z",
        job_field: "clinical",
        job_type: "full-time",
        job_position: "research",
        isSaved: false
    },
    {
        id: "3",
        job_title: "Licensed Counselor",
        company_name: "Penn State University",
        company_logo: "/images/company-logo-3.png",
        location: "Cambridge, MA 02139, United States",
        created_at: "2026-04-10T10:00:00Z",
        job_field: "counselling",
        job_type: "part-time",
        job_position: "remote",
        isSaved: false
    },
    {
        id: "4",
        job_title: "Behavioral Analyst",
        company_name: "University of Washington",
        company_logo: "/images/company-logo-4.png",
        location: "Seattle, WA 98195, United States",
        created_at: "2026-04-16T10:00:00Z",
        job_field: "behavioral",
        job_type: "full-time",
        job_position: "analysis",
        isSaved: false
    },
]



export const ourImpactData : OurImpactType[] = [
    {
        id: "1",
        title: "Professionals Joined",
        description: "Growing community of experts",
        value: "500",
        Icon: UserWithStarIcon,
        uniqueKey: "professionals_joined",
        bgColor: "bg-[#E2FBFF]",
        IconBgColor: "bg-[#BCF3FB]"
    },
    {
        id: "2",
        title: "Organizations Acive",
        description: "Top institutions & companies",
        value: "200",
        Icon: OfficeBuildingIcon,
        uniqueKey: "organizations_active",
        bgColor: "bg-[#E4EEFF]",
        IconBgColor: "bg-[#CEDEFC]"
    },
    {
        id: "3",
        title: "Research Articles",
        description: "Shared insights studies",
        value: "50",
        Icon: ChartIcon,
        uniqueKey: "research_articles",
        bgColor: "bg-[#F8F2FF]",
        IconBgColor: "bg-[#E9DDF6]"
    },
    {
        id: "4",
        title: "Satisfaction Rate",
        description: "From community members",
        value: "95",
        Icon: ShootingStarIcon,
        uniqueKey: "satisfaction_rate",
        bgColor: "bg-[#EBFFFA]",
        IconBgColor: "bg-[#C1F9EF]"
    }
]


export const trustedLeadingInstitutions = [
    "/images/company-logo-4.png",   
    "/images/university_of_bos.png",   
    "/images/university_of_cali.png",   
    "/images/company-logo-1.png",   
    "/images/company-logo-2.png",   
    "/images/university_of_mis.png",   
    "/images/university_of_tex.png",   
]


export const features = [
    "Free professional profile",
    "Access to exclusive job listings",
    "Connect with industry leaders",
    "Share your research & insights"
]


export const countryList = [
  { value: "all", label: "All" },
  { value: "scotland", label: "Scotland" },
  { value: "northern-ireland", label: "Northern Ireland" },
  { value: "isle-of-man", label: "Isle of Man" },
  { value: "north-west", label: "North West" },
  { value: "north-east", label: "North East" },
  { value: "yorkshire-and-the-humber", label: "Yorkshire and the Humber" },
  { value: "east-midlands", label: "East Midlands" },
  { value: "west-midlands", label: "West Midlands" },
  { value: "wales", label: "Wales" },
  { value: "eastern", label: "Eastern" },
  { value: "london", label: "London" },
  { value: "south-west", label: "South West" },
  { value: "south-east", label: "South East" }
];


export const regionalList = [
  "scotland",
  "northern-ireland",
  "isle-of-man",
  "north-west",
  "north-east",
  "yorkshire-and-the-humber",
  "east-midlands",
  "west-midlands",
  "wales",
  "eastern",
  "london",
  "south-west",
  "south-east"
]


export const regionCounts = [
  {
    country: "scotland",
    total_notices: 0
  },
  {
    country: "northern-ireland",
    total_notices: 0
  },
  {
    country: "isle-of-man",
    total_notices: 0
  },
  {
    country: "north-west",
    total_notices: 0
  },
  {
    country: "north-east",
    total_notices: 0
  },
  {
    country: "yorkshire-and-the-humber",
    total_notices: 0
  },
  {
    country: "east-midlands",
    total_notices: 0
  },
  {
    country: "west-midlands",
    total_notices: 0
  },
  {
    country: "wales",
    total_notices: 0
  },
  {
    country: "eastern",
    total_notices: 0
  },
  {
    country: "london",
    total_notices: 0
  },
  {
    country: "south-west",
    total_notices: 0
  },
  {
    country: "south-east",
    total_notices: 0
  }
];