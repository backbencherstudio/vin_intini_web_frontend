import PlanPricingCard from '@/app/(Frond-End)/_components/adminDashboard/subscription/planPricingCard/PlanPricingCard'
import PlanPricingTable from '@/app/(Frond-End)/_components/adminDashboard/subscription/planPricingCard/PlanPricingTable'
import React from 'react'

export default function page() {
  return (
    <div>
      <div>
        <PlanPricingCard/>
      </div>
      <div className='mt-4'>
        <PlanPricingTable/>
      </div>
    </div>
  )
}
