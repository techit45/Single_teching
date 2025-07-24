"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, Clock, BookOpen } from "lucide-react"

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

interface StudentHistoryProps {
  student: Student
  sessions: Session[]
  onClose: () => void
}

export function StudentHistory({ student, sessions, onClose }: StudentHistoryProps) {
  const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="w-5 h-5 text-blue-500" />
            ประวัติการเรียน
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          {/* Student Summary */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-5 mb-6">
            <h3 className="font-semibold text-xl text-blue-800">{student.name}</h3>
            <p className="text-gray-700 mb-4">
              {student.grade} • {student.contact}
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700">{student.totalHours}</p>
                <p className="text-xs text-gray-700">ชั่วโมงรวม</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{student.usedHours}</p>
                <p className="text-xs text-gray-700">ชั่วโมงที่ใช้</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{student.remainingHours}</p>
                <p className="text-xs text-gray-700">ชั่วโมงคงเหลือ</p>
              </div>
            </div>
          </div>

          {/* Sessions History */}
          <div className="space-y-5">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              ประวัติการเรียน ({sessions.length} ครั้ง)
            </h4>

            {sortedSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>ยังไม่มีประวัติการเรียน</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-medium">
                          ครั้งที่ {sortedSessions.length - index}
                        </Badge>
                        <span className="text-sm text-gray-700">
                          {new Date(session.date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-blue-700 mb-1">
                          <Clock className="w-4 h-4" />
                          {session.hoursUsed} ชั่วโมง
                        </div>
                        <div className="text-xs text-gray-600">ผู้สอน: {session.teacher}</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-1">เนื้อหาที่สอน:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{session.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-blue-200">
            <Button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-700 text-white">
              ปิด
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
