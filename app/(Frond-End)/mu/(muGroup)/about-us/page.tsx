import AboutUs from '@/app/(Frond-End)/_components/mainPage/aboutUs/AboutUs'
import React from 'react'
import WhoAre from '../../../_components/mainPage/aboutUs/WhoAre'
import ConnectingExpertise from '@/app/(Frond-End)/_components/mainPage/aboutUs/ConnectingExpertise'
import MeetTheTeam from '@/app/(Frond-End)/_components/mainPage/aboutUs/MeetTheTeam'
import VideoTutorial from '@/app/(Frond-End)/_components/mainPage/aboutUs/VedioTutorial'
import FAQ from '@/app/(Frond-End)/_components/mainPage/aboutUs/Faq'
import ContactUs from '@/app/(Frond-End)/_components/mainPage/aboutUs/ContactUs'

export default function page() {
    return (
        <div>
            <div>
                <AboutUs />
            </div>
            <div>
                <WhoAre />
            </div>
            <div>
                <ConnectingExpertise />
            </div>
            <div>
                <MeetTheTeam />
            </div>
            <div>
                <VideoTutorial />
            </div>
            <div>
                <FAQ />
            </div>
            <div>
                <ContactUs />
            </div>
        </div>
    )
}
