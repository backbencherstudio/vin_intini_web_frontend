import LoginActivityTable from '@/app/(Frond-End)/_components/adminDashboard/settings/LoginActivityTable'
import SecuritySettings from '@/app/(Frond-End)/_components/adminDashboard/settings/SecuritySetting'
import React from 'react'

function page() {
  return (
    <div>
        <div>
                <SecuritySettings/>
                <div>
                    <LoginActivityTable/>
                </div>
            </div>
    </div>
  )
}

export default page