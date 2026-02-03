import { NextResponse } from 'next/server'
import { HubSpotClient } from '@/lib/hubspot/client'

const accessToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL

type HubSpotListResponse<T> = {
  results: T[];
};


async function fetchServiceRecords(): Promise<HubSpotListResponse<any>> {
  const hubspot = new HubSpotClient(accessToken)
  const res = await hubspot.getServiceRecords()

  if (res.status === "error") throw new Error(res.reason)

    return res.data as HubSpotListResponse<any>
}


export async function GET() {
  try {
    const services = await fetchServiceRecords()

    const validServices = []
    const invalidServices = []
    for (const service of services.results) {
      const companies = service.associations?.companies?.results ?? []

      if (companies.length === 1) {
        validServices.push({
          id: service.id,
          name: service.properties?.hs_name,
          status: service.properties?.hs_status,
          start_date: service.properties?.hs_start_date,
          target_end_date: service.properties?.hs_target_end_date,
          client_id: companies[0].id,
        })
      } else {
        invalidServices.push({
          id: service.id,
          companyCount: companies.length,
        })
      }
    }

    return NextResponse.json({
      success: true,
      count: validServices.length,
      results: validServices,
      warnings: invalidServices.length > 0 ? invalidServices : undefined,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}

