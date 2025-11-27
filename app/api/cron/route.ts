import { NextResponse } from 'next/server'
import { initCronJobs } from '@/lib/cron/jobs'

export async function GET() {
  try {
    initCronJobs()
    return NextResponse.json({ 
      success: true, 
      message: 'Cron jobs iniciados' 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error iniciando cron jobs' },
      { status: 500 }
    )
  }
}
