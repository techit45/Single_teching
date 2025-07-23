"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Clock, BookOpen } from "lucide-react"

interface Student {
  id: string
  name: string
  grade: string
  contact: string
  totalHours: number
  usedHours: number
  remainingHours: number
}

interface Session {
  id: string
  studentId: string
  date: string
  hoursUsed: number
  content: string
  teacher: string
}

interface SessionFormProps {
  student: Student
  onSubmit: (data: Omit<Session, "id">) => void
  onClose: () => void
}

export function SessionForm({ student, onSubmit, onClose }: SessionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    hoursUsed: 0,
    content: "",
    teacher: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = "กรุณาเลือกวันที่"
    }

    if (formData.hoursUsed <= 0) {
      newErrors.hoursUsed = "จำนวนชั่วโมงต้องมากกว่า 0"
    }

    if (formData.hoursUsed > student.remainingHours) {
      newErrors.hoursUsed = `จำนวนชั่วโมงไม่สามารถเกิน ${student.remainingHours} ชั่วโมง`
    }

    if (!formData.content.trim()) {
      newErrors.content = "กรุณากรอกเนื้อหาที่สอน"
    }

    if (!formData.teacher.trim()) {
      newErrors.teacher = "กรุณากรอกชื่อผู้สอน"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        studentId: student.id,
        date: formData.date,
        hoursUsed: formData.hoursUsed,
        content: formData.content,
        teacher: formData.teacher,
      })
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
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            บันทึกการสอน
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {/* Student Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-medium text-gray-900">{student.name}</p>
            <p className="text-sm text-gray-600">{student.grade}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                เหลือ {student.remainingHours} ชั่วโมง
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">วันที่เรียน *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="teacher">ผู้สอน *</Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) => handleInputChange("teacher", e.target.value)}
                placeholder="ชื่อผู้สอน"
                className={errors.teacher ? "border-red-500" : ""}
              />
              {errors.teacher && <p className="text-sm text-red-500 mt-1">{errors.teacher}</p>}
            </div>

            <div>
              <Label htmlFor="hoursUsed">จำนวนชั่วโมงที่สอน *</Label>
              <Input
                id="hoursUsed"
                type="number"
                min="0.5"
                max={student.remainingHours}
                step="0.5"
                value={formData.hoursUsed}
                onChange={(e) => handleInputChange("hoursUsed", Number.parseFloat(e.target.value) || 0)}
                placeholder="จำนวนชั่วโมง"
                className={errors.hoursUsed ? "border-red-500" : ""}
              />
              {errors.hoursUsed && <p className="text-sm text-red-500 mt-1">{errors.hoursUsed}</p>}
              <p className="text-xs text-gray-500 mt-1">สามารถใช้ได้สูงสุด {student.remainingHours} ชั่วโมง</p>
            </div>

            <div>
              <Label htmlFor="content">เนื้อหาที่สอน *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="ระบุเนื้อหาที่สอนในครั้งนี้..."
                rows={4}
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                ยกเลิก
              </Button>
              <Button type="submit" className="flex-1">
                บันทึกการสอน
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
