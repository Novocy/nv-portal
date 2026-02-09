import { NextResponse } from 'next/server';
import { HubSpotClient } from '@/lib/hubspot/client';
import { createClient } from '@supabase/supabase-js';

const accessToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type HubSpotListResponse<T> = { results: T[] };

async function fetchServiceRecords(): Promise<HubSpotListResponse<any>> {
  const hubspot = new HubSpotClient(accessToken);
  const res = await hubspot.getServiceRecords();

  if (res.status === 'error') throw new Error(res.reason);

  return res.data as HubSpotListResponse<any>;
}

async function fetchCompanyRecordById(id: string): Promise<any> {
  const hubspot = new HubSpotClient(accessToken);
  const res = await hubspot.getCompanyById(id);

  if (res.status === 'error') throw new Error(res.reason);

  return res.data;
}

async function fetchOwnerById(id: string): Promise<any> {
  const hubspot = new HubSpotClient(accessToken);
  const response = await hubspot.getOwnerById(id);

  if (response.status === 'error') throw new Error(response.reason);

  return response.data;
}

export async function GET() {
  try {
    const services = await fetchServiceRecords();

    const validServices: any[] = [];
    const invalidServices: any[] = [];

    for (const service of services.results) {
      const companies = service.associations?.companies?.results ?? [];

      const ownerId = service.properties?.hubspot_owner_id;
      const owner = await fetchOwnerById(ownerId);

      if (companies.length === 1) {
        const companyId = companies[0].id;
        const company = await fetchCompanyRecordById(companyId);

        validServices.push({
          id: service.id,
          name: service.properties?.hs_name,
          status: service.properties?.hs_status,
          start_date: service.properties?.hs_start_date,
          target_end_date: service.properties?.hs_target_end_date,
          owner: ownerId,
          owner_first_name: owner.firstName,
          owner_last_name: owner.lastName,
          owner_email: owner.email,
          hubspot_company_id: companyId,
          company_name: company?.properties?.name,
        });
      } else {
        invalidServices.push({
          id: service.id,
          companyCount: companies.length,
        });
      }
    }

    // Query clients where hubspot_company_id == service.hubspot_company_id
    

    for (const service of validServices) {

      const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("hubspot_company_id", service.hubspot_company_id)
      .single();

      if (clientError) {
        return NextResponse.json({
          error: clientError.message
        }, {
          status: 400
        })
      }

      const clientId = clientData.id;

      const { data, error } = await supabase
      .from("projects")
      .insert({
       hubspot_service_id: service.id,
       name: service.name,
       status: service.status,
       start_date: service.start_date,
       target_end_date: service.target_end_date,
       hubspot_owner_id: service.owner,
       owner_first_name: service.owner_first_name,
       owner_last_name: service.owner_last_name,
       owner_email: service.owner_email,
       client_id: clientId

    })
    }
    

    return NextResponse.json({
      success: true,
      count: validServices.length,
      results: validServices,
      warnings: invalidServices.length > 0 ? invalidServices : undefined,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
