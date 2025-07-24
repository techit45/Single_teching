"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Clock,
  BookOpen,
  User,
  Edit,
  Trash2,
  History,
  Building2,
  GraduationCap,
  Users,
  TrendingUp,
} from "lucide-react"
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
      ? { label: "ทฤษฎี", className: "bg-blue-100 text-blue-700 border-blue-200" }
      : { label: "ปฏิบัติ", className: "bg-indigo-100 text-indigo-700 border-indigo-200" }
  }

  const getCompanyColor = (company: CompanyType, isActive: boolean) => {
    const baseColors = {
      Login: isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      Meta: isActive
        ? "bg-blue-700 text-white shadow-lg"
        : "bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-300",
      Med: isActive ? "bg-blue-800 text-white shadow-lg" : "bg-blue-50 text-blue-900 hover:bg-blue-100 border-blue-400",
      IRE: isActive
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
      "Ed-tech": isActive
        ? "bg-indigo-700 text-white shadow-lg"
        : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border-indigo-300",
    }
    return baseColors[company]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">ระบบจัดการการสอนเดี่ยว</h1>
              <p className="text-lg text-blue-600 font-medium">Tutor Management System</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ระบบบริหารจัดการชั่วโมงเรียนและติดตามความก้าวหน้าของผู้เรียนรายบุคคลอย่างมีประสิทธิภาพ
          </p>
        </div>

        {/* Company Tabs */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Building2 className="w-6 h-6" />
              เลือกองค์กร / สถาบัน
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {companies.map((company) => (
                <Button
                  key={company}
                  onClick={() => setActiveCompany(company)}
                  variant="outline"
                  className={`${getCompanyColor(company, activeCompany === company)} transition-all duration-200 border-2 font-medium px-6 py-3 h-auto`}
                >
                  <span className="text-lg">{company}</span>
                  {companyData[company].students.length > 0 && (
                    <Badge
                      className={`ml-3 ${
                        activeCompany === company
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {companyData[company].students.length} คน
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                กำลังจัดการข้อมูลของ: <span className="text-blue-900 font-bold">{activeCompany}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">ผู้เรียนทั้งหมด</p>
                  <p className="text-3xl font-bold">{currentStudents.length}</p>
                  <p className="text-blue-200 text-sm">คน</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <User className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 font-medium">ชั่วโมงรวม</p>
                  <p className="text-3xl font-bold">
                    {currentStudents.reduce((sum, student) => sum + student.totalHours, 0)}
                  </p>
                  <p className="text-indigo-200 text-sm">ชั่วโมง</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">ชั่วโมงที่สอนแล้ว</p>
                  <p className="text-3xl font-bold">
                    {currentStudents.reduce((sum, student) => sum + student.usedHours, 0)}
                  </p>
                  <p className="text-blue-200 text-sm">ชั่วโมง</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 font-medium">เซสชันทั้งหมด</p>
                  <p className="text-3xl font-bold">{currentSessions.length}</p>
                  <p className="text-indigo-200 text-sm">ครั้ง</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setEditingStudent(null)
                setShowStudentForm(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-6 py-3 h-auto font-medium"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              เพิ่มผู้เรียนใหม่
            </Button>
          </div>

          {currentStudents.length > 0 && (
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-full border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">
                  ปกติ ({currentStudents.filter((s) => s.remainingHours > 5).length} คน)
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-full border border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">
                  ใกล้หมด ({currentStudents.filter((s) => s.remainingHours <= 5).length} คน)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <GraduationCap className="w-6 h-6" />
              รายชื่อผู้เรียน {activeCompany} ({currentStudents.length} คน)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {currentStudents.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">ยังไม่มีข้อมูลผู้เรียนใน {activeCompany}</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  เริ่มต้นการจัดการการสอนโดยการเพิ่มผู้เรียนคนแรกของ {activeCompany}
                </p>
                <Button
                  onClick={() => {
                    setEditingStudent(null)
                    setShowStudentForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-3 h-auto font-medium"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  เพิ่มผู้เรียนใหม่
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-blue-100">
                        <th className="text-left py-4 px-4 font-semibold text-blue-900">ชื่อ-นามสกุล</th>
                        <th className="text-left py-4 px-4 font-semibold text-blue-900">ระดับชั้น</th>
                        <th className="text-left py-4 px-4 font-semibold text-blue-900">ประเภทคอร์ส</th>
                        <th className="text-left py-4 px-4 font-semibold text-blue-900">ติดต่อ</th>
                        <th className="text-center py-4 px-4 font-semibold text-blue-900">ชั่วโมงรวม</th>
                        <th className="text-center py-4 px-4 font-semibold text-blue-900">ใช้แล้ว</th>
                        <th className="text-center py-4 px-4 font-semibold text-blue-900">คงเหลือ</th>
                        <th className="text-left py-4 px-4 font-semibold text-blue-900">ความคืบหน้า</th>
                        <th className="text-center py-4 px-4 font-semibold text-blue-900">เซสชัน</th>
                        <th className="text-center py-4 px-4 font-semibold text-blue-900">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                        >
                          <td className="py-4 px-4">
                            <div className="font-semibold text-gray-900">{student.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              {student.grade}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getCourseTypeBadge(student.courseType).className}>
                              {getCourseTypeBadge(student.courseType).label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{student.contact}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-semibold text-blue-900">{student.totalHours}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-blue-600 font-semibold">{student.usedHours}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge
                              className={
                                student.remainingHours <= 5
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                              }
                            >
                              {student.remainingHours}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-full">
                              <div className="flex justify-between text-xs text-blue-600 mb-2 font-medium">
                                <span>{Math.round(getProgressPercentage(student.usedHours, student.totalHours))}%</span>
                              </div>
                              <Progress
                                value={getProgressPercentage(student.usedHours, student.totalHours)}
                                className="h-3 bg-blue-100"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-blue-700 font-medium">
                              {getStudentSessions(student.id).length} ครั้ง
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowSessionForm(true)
                                }}
                                className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowHistory(true)
                                }}
                                className="h-9 px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <History className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingStudent(student)
                                  setShowStudentForm(true)
                                }}
                                className="h-9 px-3 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteStudent(student.id)}
                                className="h-9 px-3 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
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
                    <Card key={student.id} className="border-l-4 border-l-blue-500 shadow-md bg-white">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                {student.grade}
                              </Badge>
                              <Badge className={getCourseTypeBadge(student.courseType).className}>
                                {getCourseTypeBadge(student.courseType).label}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mt-1">{student.contact}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingStudent(student)
                                setShowStudentForm(true)
                              }}
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-blue-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-900">{student.totalHours}</p>
                            <p className="text-xs text-blue-600 font-medium">ชั่วโมงรวม</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{student.usedHours}</p>
                            <p className="text-xs text-blue-600 font-medium">ใช้แล้ว</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-indigo-600">{student.remainingHours}</p>
                            <p className="text-xs text-blue-600 font-medium">คงเหลือ</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-blue-600 mb-2 font-medium">
                            <span>ความคืบหน้า</span>
                            <span>{Math.round(getProgressPercentage(student.usedHours, student.totalHours))}%</span>
                          </div>
                          <Progress
                            value={getProgressPercentage(student.usedHours, student.totalHours)}
                            className="h-3 bg-blue-100"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowSessionForm(true)
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            บันทึกการสอน
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowHistory(true)
                            }}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <History className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="mt-3 text-center">
                          <span className="text-sm text-blue-600 font-medium">
                            เซสชันทั้งหมด: {getStudentSessions(student.id).length} ครั้ง
                          </span>
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
