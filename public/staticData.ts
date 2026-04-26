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



export const usaMapData = [
  { id: "al", name: "Alabama", value: 47 },
  { id: "ak", name: "Alaska", value: 83 },
  { id: "az", name: "Arizona", value: 62 },
  { id: "ar", name: "Arkansas", value: 31 },
  { id: "ca", name: "California", value: 95 },
  { id: "co", name: "Colorado", value: 74 },
  { id: "ct", name: "Connecticut", value: 28 },
  { id: "de", name: "Delaware", value: 53 },
  { id: "fl", name: "Florida", value: 88 },
  { id: "ga", name: "Georgia", value: 41 },
  { id: "hi", name: "Hawaii", value: 19 },
  { id: "id", name: "Idaho", value: 66 },
  { id: "il", name: "Illinois", value: 39 },
  { id: "in", name: "Indiana", value: 77 },
  { id: "ia", name: "Iowa", value: 24 },
  { id: "ks", name: "Kansas", value: 82 },
  { id: "ky", name: "Kentucky", value: 55 },
  { id: "la", name: "Louisiana", value: 43 },
  { id: "me", name: "Maine", value: 91 },
  { id: "md", name: "Maryland", value: 37 },
  { id: "ma", name: "Massachusetts", value: 68 },
  { id: "mi", name: "Michigan", value: 59 },
  { id: "mn", name: "Minnesota", value: 72 },
  { id: "ms", name: "Mississippi", value: 26 },
  { id: "mo", name: "Missouri", value: 84 },
  { id: "mt", name: "Montana", value: 15 },
  { id: "ne", name: "Nebraska", value: 49 },
  { id: "nv", name: "Nevada", value: 63 },
  { id: "nh", name: "New Hampshire", value: 71 },
  { id: "nj", name: "New Jersey", value: 44 },
  { id: "nm", name: "New Mexico", value: 34 },
  { id: "ny", name: "New York", value: 92 },
  { id: "nc", name: "North Carolina", value: 57 },
  { id: "nd", name: "North Dakota", value: 18 },
  { id: "oh", name: "Ohio", value: 76 },
  { id: "ok", name: "Oklahoma", value: 38 },
  { id: "or", name: "Oregon", value: 64 },
  { id: "pa", name: "Pennsylvania", value: 85 },
  { id: "ri", name: "Rhode Island", value: 22 },
  { id: "sc", name: "South Carolina", value: 51 },
  { id: "sd", name: "South Dakota", value: 33 },
  { id: "tn", name: "Tennessee", value: 69 },
  { id: "tx", name: "Texas", value: 98 },
  { id: "ut", name: "Utah", value: 45 },
  { id: "vt", name: "Vermont", value: 13 },
  { id: "va", name: "Virginia", value: 56 },
  { id: "wa", name: "Washington", value: 79 },
  { id: "wv", name: "West Virginia", value: 29 },
  { id: "wi", name: "Wisconsin", value: 67 },
  { id: "wy", name: "Wyoming", value: 42 },
  { id: "dc", name: "District of Columbia", value: 87 }
];


