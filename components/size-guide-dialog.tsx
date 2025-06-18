"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ruler, Info } from "lucide-react"
import type { SizeGuide, SizeGuideTable } from "@/data/size-guides"

interface SizeGuideDialogProps {
  isOpen: boolean
  onClose: () => void
  sizeGuide: SizeGuide
}

export default function SizeGuideDialog({ isOpen, onClose, sizeGuide }: SizeGuideDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("tables")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{sizeGuide.title}</DialogTitle>
          <DialogDescription>{sizeGuide.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tables" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span>Storlekstabeller</span>
            </TabsTrigger>
            {sizeGuide.howToMeasure && (
              <TabsTrigger value="how-to-measure" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Så här mäter du</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tables" className="mt-4 space-y-6">
            {sizeGuide.tables.map((table, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium text-lg">{table.title}</h3>
                <div className="overflow-x-auto">
                  <SizeTable table={table} />
                </div>
                {table.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      {table.notes.map((note, noteIndex) => (
                        <li key={noteIndex}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          {sizeGuide.howToMeasure && (
            <TabsContent value="how-to-measure" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">{sizeGuide.howToMeasure.title}</h3>
                <div className="space-y-4">
                  {sizeGuide.howToMeasure.steps.map((step, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-medium">
                        {index + 1}. {step.name}
                      </h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Tips:</strong> För bästa resultat, använd ett måttband och mät direkt mot kroppen. Stå
                    avslappnat och andas normalt när du mäter.
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function SizeTable({ table }: { table: SizeGuideTable }) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {table.headers.map((header, index) => (
            <th key={index} className="py-2 px-4 text-left font-medium border border-gray-200">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="py-2 px-4 border border-gray-200 font-medium">{row.size}</td>
            {row.measurements.map((measurement, measurementIndex) => (
              <td key={measurementIndex} className="py-2 px-4 border border-gray-200">
                {measurement}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
