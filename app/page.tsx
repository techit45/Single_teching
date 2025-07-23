"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Clock, BookOpen, User, Edit, Trash2, History, Building2 } from "lucide-react"
import { StudentForm } from "@/components/student-form"
import { SessionForm } from "@/components/session-form"
import { StudentHistory } from "@/components/student-history"

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

interface Session {
  id: string
  studentId: string
  date: string
  hoursUsed: number
  content: string
  teacher: string
}

interface CompanyData {
  students: Student[]
  sessions: Session[]
}

type CompanyType = "Login" | "Meta" | "Med" | "IRE" | "Ed-tech"

const companies: CompanyType[] = ["Login", "Meta", "Med", "IRE", "Ed-tech"]

const initialData: Record<CompanyType, CompanyData> = {
  Login: {
    students: [
      {
        id: "1",
        name: "นางสาวสมใจ ใจดี",
        grade: "ม.6",
        contact: "081-234-5678",
        courseType: "theory",
        totalHours: 20,
        usedHours: 8,
        remainingHours: 12,
      },
      {
        id: "2",
        name: "นายวิชัย เก่งมาก",
        grade: "ม.5",
        contact: "082-345-6789",
        courseType: "practical",
        totalHours: 15,
        usedHours: 5,
        remainingHours: 10,
      },
    ],
    sessions: [
      {
        id: "1",
        studentId: "1",
        date: "2024-01-15",
        hoursUsed: 2,
        content: "สมการกำลังสอง และการแยกตัวประกอบ",
        teacher: "อาจารย์สมชาย",
      },
      {
        id: "2",
        studentId: "1",
        date: "2024-01-18",
        hoursUsed: 3,
        content: "ฟังก์ชันและกราฟ",
        teacher: "อาจารย์สมหญิง",
      },
    ],
  },
  Meta: {
    students: [
      {
        id: "3",
        name: "นางสาวปัญญา ฉลาด",
        grade: "ม.4",
        contact: "083-456-7890",
        courseType: "theory",
        totalHours: 25,
        usedHours: 18,
        remainingHours: 7,
      },
    ],
    sessions: [
      {
        id: "3",
        studentId: "3",
        date: "2024-01-16",
        hoursUsed: 2.5,
        content: "เรขาคณิตวิเคราะห์",
        teacher: "อาจารย์วิชัย",
      },
    ],
  },
  Med: {
    students: [],
    sessions: [],
  },
  IRE: {
    students: [],
    sessions: [],
  },
  "Ed-tech": {
    students: [],
    sessions: [],
  },
}

export default function IndividualCourseManagement() {
  const [activeCompany, setActiveCompany] = useState<CompanyType>("Login")
  const [companyData, setCompanyData] = useState<Record<CompanyType, CompanyData>>(initialData)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  // Get current company data
  const currentStudents = companyData[activeCompany].students
  const currentSessions = companyData[activeCompany].sessions

  const handleAddStudent = (studentData: Omit<Student, "id" | "usedHours" | "remainingHours">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      usedHours: 0,
      remainingHours: studentData.totalHours,
    }

    setCompanyData((prev) => ({
      ...prev,
      [activeCompany]: {
        ...prev[activeCompany],
        students: [...prev[activeCompany].students, newStudent],
      },
    }))
    setShowStudentForm(false)
  }

  const handleEditStudent = (studentData: Omit<Student, "id" | "usedHours" | "remainingHours">) => {
    if (editingStudent) {
      const updatedStudent: Student = {
        ...studentData,
        id: editingStudent.id,
        usedHours: editingStudent.usedHours,
        remainingHours: studentData.totalHours - editingStudent.usedHours,
      }

      setCompanyData((prev) => ({
        ...prev,
        [activeCompany]: {
          ...prev[activeCompany],
          students: prev[activeCompany].students.map((s) => (s.id === editingStudent.id ? updatedStudent : s)),
        },
      }))
      setEditingStudent(null)
      setShowStudentForm(false)
    }
  }

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลผู้เรียนคนนี้?")) {
      setCompanyData((prev) => ({
        ...prev,
        [activeCompany]: {
          students: prev[activeCompany].students.filter((s) => s.id !== studentId),
          sessions: prev[activeCompany].sessions.filter((s) => s.studentId !== studentId),
        },
      }))
    }
  }

  const handleAddSession = (sessionData: Omit<Session, "id">) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString(),
    }

    setCompanyData((prev) => ({
      ...prev,
      [activeCompany]: {
        ...prev[activeCompany],
        sessions: [...prev[activeCompany].sessions, newSession],
        students: prev[activeCompany].students.map((student) => {
          if (student.id === sessionData.studentId) {
            const newUsedHours = student.usedHours + sessionData.hoursUsed
            return {
              ...student,
              usedHours: newUsedHours,
              remainingHours: student.totalHours - newUsedHours,
            }
          }
          return student
        }),
      },
    }))

    setShowSessionForm(false)
    setSelectedStudent(null)
  }

  const getProgressPercentage = (usedHours: number, totalHours: number) => {
    return (usedHours / totalHours) * 100
  }

  const getStudentSessions = (studentId: string) => {
    return currentSessions.filter((session) => session.studentId === studentId)
  }

  const getCourseTypeBadge = (courseType: "theory" | "practical") => {
    return courseType === "theory"
      ? { label: "ทฤษฎี", variant: "default" as const, className: "bg-blue-100 text-blue-800" }
      : { label: "ปฏิบัติ", variant: "secondary" as const, className: "bg-green-100 text-green-800" }
  }

  const getCompanyColor = (company: CompanyType) => {
    const colors = {
      Login: "bg-blue-500 hover:bg-blue-600",
      Meta: "bg-purple-500 hover:bg-purple-600",
      Med: "bg-red-500 hover:bg-red-600",
      IRE: "bg-green-500 hover:bg-green-600",
      "Ed-tech": "bg-orange-500 hover:bg-orange-600",
    }
    return colors[company]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการการสอนเดี่ยว</h1>
          <p className="text-gray-600">ระบบบริหารจัดการชั่วโมงเรียนของผู้เรียนรายบุคคล</p>
        </div>

        {/* Company Tabs */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5" />
              เลือกบริษัท/องค์กร
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {companies.map((company) => (
                <Button
                  key={company}
                  onClick={() => setActiveCompany(company)}
                  variant={activeCompany === company ? "default" : "outline"}
                  className={`${
                    activeCompany === company ? `${getCompanyColor(company)} text-white` : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  {company}
                  {companyData[company].students.length > 0 && (
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${activeCompany === company ? "bg-white/20 text-white" : "bg-gray-100"}`}
                    >
                      {companyData[company].students.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              กำลังดูข้อมูลของ: <span className="font-medium text-gray-900">{activeCompany}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ผู้เรียนทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">{currentStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ชั่วโมงรวม</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentStudents.reduce((sum, student) => sum + student.totalHours, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ชั่วโมงที่สอนแล้ว</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentStudents.reduce((sum, student) => sum + student.usedHours, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <History className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">เซสชันทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">{currentSessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setEditingStudent(null)
                setShowStudentForm(true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้เรียนใหม่
            </Button>
          </div>

          {currentStudents.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>ปกติ ({currentStudents.filter((s) => s.remainingHours > 5).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>ใกล้หมด ({currentStudents.filter((s) => s.remainingHours <= 5).length})</span>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              รายชื่อผู้เรียน {activeCompany} ({currentStudents.length} คน)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStudents.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีข้อมูลผู้เรียนใน {activeCompany}</h3>
                <p className="text-gray-600 mb-4">เริ่มต้นโดยการเพิ่มผู้เรียนคนแรกของ {activeCompany}</p>
                <Button
                  onClick={() => {
                    setEditingStudent(null)
                    setShowStudentForm(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มผู้เรียนใหม่
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">ชื่อ-นามสกุล</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">ระดับชั้น</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">ประเภทคอร์ส</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">ติดต่อ</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">ชั่วโมงรวม</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">ใช้แล้ว</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">คงเหลือ</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">ความคืบหน้า</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">เซสชัน</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">
                              {student.grade}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getCourseTypeBadge(student.courseType).className}>
                              {getCourseTypeBadge(student.courseType).label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{student.contact}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-medium">{student.totalHours}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-blue-600 font-medium">{student.usedHours}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge
                              variant={student.remainingHours <= 5 ? "destructive" : "secondary"}
                              className="font-medium"
                            >
                              {student.remainingHours}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-full">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{Math.round(getProgressPercentage(student.usedHours, student.totalHours))}%</span>
                              </div>
                              <Progress
                                value={getProgressPercentage(student.usedHours, student.totalHours)}
                                className="h-2"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm text-gray-600">{getStudentSessions(student.id).length} ครั้ง</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowSessionForm(true)
                                }}
                                className="h-8 px-2"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowHistory(true)
                                }}
                                className="h-8 px-2"
                              >
                                <History className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingStudent(student)
                                  setShowStudentForm(true)
                                }}
                                className="h-8 px-2"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteStudent(student.id)}
                                className="h-8 px-2 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {currentStudents.map((student) => (
                    <Card key={student.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{student.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {student.grade}
                              </Badge>
                              <Badge className={getCourseTypeBadge(student.courseType).className}>
                                {getCourseTypeBadge(student.courseType).label}
                              </Badge>
                              <span className="text-xs text-gray-500">{student.contact}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingStudent(student)
                                setShowStudentForm(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                          <div>
                            <p className="text-lg font-bold text-gray-900">{student.totalHours}</p>
                            <p className="text-xs text-gray-500">ชั่วโมงรวม</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-blue-600">{student.usedHours}</p>
                            <p className="text-xs text-gray-500">ใช้แล้ว</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-orange-600">{student.remainingHours}</p>
                            <p className="text-xs text-gray-500">คงเหลือ</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>ความคืบหน้า</span>
                            <span>{Math.round(getProgressPercentage(student.usedHours, student.totalHours))}%</span>
                          </div>
                          <Progress
                            value={getProgressPercentage(student.usedHours, student.totalHours)}
                            className="h-2"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowSessionForm(true)
                            }}
                            className="flex-1"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            บันทึกการสอน
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowHistory(true)
                            }}
                          >
                            <History className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="mt-2 text-xs text-gray-500 text-center">
                          เซสชันทั้งหมด: {getStudentSessions(student.id).length} ครั้ง
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        {showStudentForm && (
          <StudentForm
            student={editingStudent}
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
            onClose={() => {
              setShowStudentForm(false)
              setEditingStudent(null)
            }}
          />
        )}

        {showSessionForm && selectedStudent && (
          <SessionForm
            student={selectedStudent}
            onSubmit={handleAddSession}
            onClose={() => {
              setShowSessionForm(false)
              setSelectedStudent(null)
            }}
          />
        )}

        {showHistory && selectedStudent && (
          <StudentHistory
            student={selectedStudent}
            sessions={getStudentSessions(selectedStudent.id)}
            onClose={() => {
              setShowHistory(false)
              setSelectedStudent(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
