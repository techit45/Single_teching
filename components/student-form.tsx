"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface Student {
  id: string
  name: string
  grade: string
  contact: string
  courseType: "theory" | "practical"
  totalHours: number
  usedHours: number
  remainingHours: number
}

interface StudentFormProps {
  student?: Student | null
  onSubmit: (data: Omit<Student, "id" | "usedHours" | "remainingHours">) => void
  onClose: () => void
}

export function StudentForm({ student, onSubmit, onClose }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    contact: "",
    courseType: "theory" as "theory" | "practical",
    totalHours: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        grade: student.grade,
        contact: student.contact,
        courseType: student.courseType,
        totalHours: student.totalHours,
      })
    }
  }, [student])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อ-นามสกุล"
    }

    if (!formData.grade.trim()) {
      newErrors.grade = "กรุณากรอกระดับชั้น"
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "กรุณากรอกข้อมูลติดต่อ"
    }

    if (!formData.courseType) {
      newErrors.courseType = "กรุณาเลือกประเภทคอร์ส"
    }

    if (formData.totalHours <= 0) {
      newErrors.totalHours = "จำนวนชั่วโมงต้องมากกว่า 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{student ? "แก้ไขข้อมูลผู้เรียน" : "เพิ่มผู้เรียนใหม่"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="grade">ระดับชั้น *</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => handleInputChange("grade", e.target.value)}
                placeholder="เช่น ม.6, ป.4"
                className={errors.grade ? "border-red-500" : ""}
              />
              {errors.grade && <p className="text-sm text-red-500 mt-1">{errors.grade}</p>}
            </div>

            <div>
              <Label htmlFor="contact">ข้อมูลติดต่อ *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="เบอร์โทรศัพท์หรือ Line ID"
                className={errors.contact ? "border-red-500" : ""}
              />
              {errors.contact && <p className="text-sm text-red-500 mt-1">{errors.contact}</p>}
            </div>

            <div>
              <Label htmlFor="courseType">ประเภทคอร์ส *</Label>
              <select
                id="courseType"
                value={formData.courseType}
                onChange={(e) => handleInputChange("courseType", e.target.value as "theory" | "practical")}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.courseType ? "border-red-500" : ""}`}
              >
                <option value="theory">ทฤษฎี</option>
                <option value="practical">ปฏิบัติ</option>
              </select>
              {errors.courseType && <p className="text-sm text-red-500 mt-1">{errors.courseType}</p>}
            </div>

            <div>
              <Label htmlFor="totalHours">จำนวนชั่วโมงรวม *</Label>
              <Input
                id="totalHours"
                type="number"
                min="1"
                step="0.5"
                value={formData.totalHours}
                onChange={(e) => handleInputChange("totalHours", Number.parseFloat(e.target.value) || 0)}
                placeholder="จำนวนชั่วโมงที่ซื้อ"
                className={errors.totalHours ? "border-red-500" : ""}
              />
              {errors.totalHours && <p className="text-sm text-red-500 mt-1">{errors.totalHours}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                ยกเลิก
              </Button>
              <Button type="submit" className="flex-1">
                {student ? "บันทึกการแก้ไข" : "เพิ่มผู้เรียน"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
