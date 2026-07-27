import React from 'react'

import WhoAre from '../../../_components/mainPage/aboutUs/WhoAre'
import AboutUs from '@/app/(Frond-End)/_components/mainPage/aboutUs/AboutUs'
import ConnectingExpertise from '@/app/(Frond-End)/_components/mainPage/aboutUs/ConnectingExpertise'
import ContactUs from '@/app/(Frond-End)/_components/mainPage/aboutUs/ContactUs'
import FAQ from '@/app/(Frond-End)/_components/mainPage/aboutUs/Faq'
import MeetTheTeam from '@/app/(Frond-End)/_components/mainPage/aboutUs/MeetTheTeam'
import VideoTutorial from '@/app/(Frond-End)/_components/mainPage/aboutUs/VedioTutorial'

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
                {/* <MeetTheTeam /> */}
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
