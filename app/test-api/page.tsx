'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, Shield } from 'lucide-react'

export default function TestApiPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const testApiWithAuth = async () => {
    if (!session?.accessToken) {
      alert('No access token available')
      return
    }

    setIsLoading(true)
    setResults([])

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1'
      const baseUrl = apiUrl.replace('/api/v1', '')
      
      const endpoints = [
        '/api/v1/chat/participants',
        '/api/v1/chat/conversations',
        '/api/v1/chat',
        '/api/v1/chat/unread/count'
      ]

      const testResults = []

      for (const endpoint of endpoints) {
        try {
          console.log(`Testing: ${endpoint}`)
          
          const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`
            }
          })

          let data = null
          if (response.ok) {
            try {
              data = await response.json()
            } catch {
              data = await response.text()
            }
          }

          testResults.push({
            endpoint,
            status: response.status,
            success: response.ok,
            data,
            isArray: Array.isArray(data),
            hasDataProperty: data && typeof data === 'object' && 'data' in data,
            keys: data && typeof data === 'object' ? Object.keys(data) : null,
            length: Array.isArray(data) ? data.length : null
          })

          console.log(`Result for ${endpoint}:`, data)

        } catch (error: any) {
          testResults.push({
            endpoint,
            status: 'ERROR',
            success: false,
            error: error.message
          })
        }
      }

      setResults(testResults)

    } catch (error: any) {
      console.error('Test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading session...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Connection Test</h1>
        <p className="text-muted-foreground">
          Test the connection to your backend API endpoints
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test API with Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testApiWithAuth} 
            disabled={isLoading || !session?.accessToken}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Test With Auth
              </>
            )}
          </Button>

          {!session?.accessToken && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                You need to log in first to test with authentication.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Results:</h3>
              {results.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-mono text-sm">{result.endpoint}</span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  {result.success && (
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {typeof result.data}</div>
                      <div><strong>Is Array:</strong> {result.isArray ? 'Yes' : 'No'}</div>
                      <div><strong>Has Data Property:</strong> {result.hasDataProperty ? 'Yes' : 'No'}</div>
                      {result.length !== null && (
                        <div><strong>Length:</strong> {result.length}</div>
                      )}
                      {result.keys && (
                        <div><strong>Keys:</strong> {result.keys.join(', ')}</div>
                      )}
                      <div>
                        <strong>Data:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {!result.success && result.error && (
                    <div className="text-red-600 text-sm">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 