"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, X } from "lucide-react"

interface ValidationError {
  status: number
  error: string
  requestId: string
  errors: string[]
}

interface ErrorDisplayProps {
  error: ValidationError | null
  onDismiss?: () => void
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null

  const parseErrorMessage = (errorMsg: string) => {
    // Parse error messages like "ImportOrderRequest.shippingAddress.country: country must be a valid ISO 3166-1 alpha2 country code"
    const parts = errorMsg.split(": ")
    if (parts.length === 2) {
      const field = parts[0].split(".").pop() || parts[0]
      const message = parts[1]
      return { field, message }
    }
    return { field: "", message: errorMsg }
  }

  const getSwedishFieldName = (field: string) => {
    const fieldMap: Record<string, string> = {
      country: "Land",
      familyName: "Efternamn",
      givenName: "Förnamn",
      address: "Adress",
      postalCode: "Postnummer",
      city: "Stad",
      phone: "Telefon",
      email: "E-post",
      telephoneNumber: "Telefonnummer",
    }
    return fieldMap[field] || field
  }

  const getSwedishErrorMessage = (message: string) => {
    const messageMap: Record<string, string> = {
      "country must be a valid ISO 3166-1 alpha2 country code":
        "Landet måste vara en giltig landskod (t.ex. SE för Sverige)",
      "familyName is a required field": "Efternamn är obligatoriskt",
      "givenName is a required field": "Förnamn är obligatoriskt",
      "telephoneNumber is a required field": "Telefonnummer är obligatoriskt",
      "is a required field": "är obligatoriskt",
    }

    for (const [english, swedish] of Object.entries(messageMap)) {
      if (message.includes(english)) {
        return message.replace(english, swedish)
      }
    }
    return message
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Beställningen kunde inte genomföras</CardTitle>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className="text-red-700">
          Det finns problem med din beställningsinformation som behöver åtgärdas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <h4 className="font-medium text-red-800">Följande fel måste åtgärdas:</h4>
          <div className="space-y-2">
            {error.errors.map((errorMsg, index) => {
              const { field, message } = parseErrorMessage(errorMsg)
              const swedishField = getSwedishFieldName(field)
              const swedishMessage = getSwedishErrorMessage(message)

              return (
                <Alert key={index} className="border-red-200 bg-white">
                  <AlertDescription className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      {swedishField && (
                        <span className="font-medium text-red-800">{swedishField}: </span>
                      )}
                      <span className="text-red-700">{swedishMessage}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              )
            })}
          </div>
        </div>

        {error.requestId && (
          <div className="pt-2 border-t border-red-200">
            <p className="text-xs text-red-600">
              Referensnummer:{" "}
              <code className="bg-red-100 px-1 py-0.5 rounded text-red-800">{error.requestId}</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
