import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1'
  
  console.log('Testing API connection to:', apiUrl)
  
  const results = []
  
  // Test health endpoints first
  const healthEndpoints = [
    '/health',
    '/api/health', 
    '/api/v1/health',
    '/',
    '/api',
    '/api/v1'
  ]
  
  for (const endpoint of healthEndpoints) {
    try {
      console.log(`Testing health endpoint: ${endpoint}`)
      
      const response = await fetch(`${apiUrl.replace('/api/v1', '')}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })
      
      const result = {
        endpoint,
        status: response.status,
        success: response.ok,
        message: response.ok ? 'Available' : `HTTP ${response.status}`,
        authenticated: false,
        data: response.ok ? await response.text().catch(() => 'No content') : null
      }
      
      results.push(result)
      console.log(`Health endpoint ${endpoint}: ${result.success ? 'OK' : 'FAILED'}`)
      
    } catch (error: any) {
      results.push({
        endpoint,
        status: 'ERROR',
        success: false,
        message: error.message,
        authenticated: false,
        data: null
      })
      console.log(`Health endpoint ${endpoint}: ERROR - ${error.message}`)
    }
  }
  
  // Test chat endpoints
  const chatEndpoints = [
    '/api/v1/chat/participants',
    '/api/v1/chat/conversations', 
    '/api/v1/chat/unread/count',
    '/chat/participants',
    '/chat/conversations',
    '/chat/unread/count',
    '/api/chat/participants',
    '/api/chat/conversations',
    '/api/chat/unread/count'
  ]
  
  for (const endpoint of chatEndpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`)
      
      const response = await fetch(`${apiUrl.replace('/api/v1', '')}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })
      
      let responseData = null
      if (response.ok) {
        try {
          responseData = await response.json()
        } catch {
          responseData = await response.text()
        }
      }
      
      const result = {
        endpoint,
        status: response.status,
        success: response.ok,
        message: response.ok ? 'Success' : `HTTP ${response.status}`,
        authenticated: false,
        data: responseData,
        dataStructure: responseData ? {
          isArray: Array.isArray(responseData),
          hasDataProperty: responseData && typeof responseData === 'object' && 'data' in responseData,
          keys: responseData && typeof responseData === 'object' ? Object.keys(responseData) : null,
          type: typeof responseData
        } : null
      }
      
      results.push(result)
      console.log(`Endpoint ${endpoint}: ${result.success ? 'OK' : 'FAILED'} (No Auth)`)
      
    } catch (error: any) {
      results.push({
        endpoint,
        status: 'ERROR',
        success: false,
        message: error.message,
        authenticated: false,
        data: null
      })
      console.log(`Endpoint ${endpoint}: ERROR - ${error.message}`)
    }
  }
  
  const hasWorkingEndpoint = results.some(r => r.success)
  
  return NextResponse.json({
    success: hasWorkingEndpoint,
    message: hasWorkingEndpoint ? 'API connection successful' : 'All endpoints failed',
    results,
    config: {
      apiUrl: apiUrl,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  })
} 