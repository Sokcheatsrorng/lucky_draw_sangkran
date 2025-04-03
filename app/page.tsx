"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Trophy, Users, RotateCcw, History } from "lucide-react"
import confetti from "canvas-confetti"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Student data from the provided JSON
const studentData = [
  { Name: "Yeng Sokroza", Gender: "Female", "Advanced Subject": "Data Analytics" },
  { Name: "Phal Seakngim", Gender: "Female", "Advanced Subject": "Spring" },
  { Name: "Leang Helen", Gender: "Female", "Advanced Subject": "Cybersecurity" },
  { Name: "Hom pheakakvotey", Gender: "Female", "Advanced Subject": "Cybersecurity" },
  { Name: "Art Vandeth", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "Pol Sokkhann", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "Chan samangrathana", Gender: "Female", "Advanced Subject": "Spring" },
  { Name: "Phy Lymann", Gender: "Male", "Advanced Subject": "Data Analytics" },
  { Name: "Sanh Panha ", Gender: "Male", "Advanced Subject": "Blockchain" },
  { Name: "Leang Naikim ", Gender: "Female", "Advanced Subject": "Flutter" },
  { Name: "Long Piseth", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "Sol Vathanak", Gender: "Male", "Advanced Subject": "DevOps" },
  { Name: "Srorng Sokcheat", Gender: "Female", "Advanced Subject": "Blockchain" },
  { Name: "Phiv Lyhou", Gender: "Male", "Advanced Subject": "Cybersecurity" },
  { Name: "Chhem Chhunhy", Gender: "Female", "Advanced Subject": "Data Analytics" },
  { Name: "Hout Sovannarith", Gender: "Male", "Advanced Subject": "Data Analytics" },
  { Name: "Ruos Sovanra", Gender: "Male", "Advanced Subject": "DevOps" },
  { Name: "Thoeng Mengseu", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "Channtha Seamey", Gender: "Female", "Advanced Subject": "Data Analytics" },
  { Name: "Heng Sothib", Gender: "Female", "Advanced Subject": "Flutter" },
  { Name: "Nouth chanraksa", Gender: "Male", "Advanced Subject": "Blockchain" },
  { Name: "Noun sovanthorn", Gender: "Female", "Advanced Subject": "Flutter" },
  { Name: "Yith Sopheaktra", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "PhalPhea Pheakdey", Gender: "Male", "Advanced Subject": "Cybersecurity" },
  { Name: "Phal Sophanmai", Gender: "Female", "Advanced Subject": "Spring" },
  { Name: "on soben", Gender: "Male", "Advanced Subject": "DevOps" },
  { Name: "Mom Makara", Gender: "Male", "Advanced Subject": "DevOps" },
  { Name: "Pov Sokny", Gender: "Male", "Advanced Subject": "DevOps" },
  { Name: "Eung Lyzhia", Gender: "Female", "Advanced Subject": "Spring" },
  { Name: "pov soknem", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "Vuth sarandy", Gender: "Male", "Advanced Subject": "Spring" },
  { Name: "Chhoeurn kimla ", Gender: "Male", "Advanced Subject": "Data Analytics" },
  { Name: "Nhoem Tevy ", Gender: "Female", "Advanced Subject": "Flutter" },
  { Name: "Kay Kang", Gender: "Male", "Advanced Subject": "Blockchain" },
  { Name: "Heng Layhak", Gender: "Male", "Advanced Subject": "DevOps" },
]


// Get unique subjects for filtering
const uniqueSubjects = Array.from(new Set(studentData.map((student) => student["Advanced Subject"])))

// Type for winner history
type WinnerRecord = {
  name: string
  timestamp: string
  category: string
}

export default function LuckyDraw() {
  const [filteredStudents, setFilteredStudents] = useState<string[]>([])
  const [availableStudents, setAvailableStudents] = useState<string[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentSelection, setCurrentSelection] = useState<string | null>(null)
  const [filterGender, setFilterGender] = useState<string>("all")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [excludePreviousWinners, setExcludePreviousWinners] = useState(true)
  const [winnerHistory, setWinnerHistory] = useState<WinnerRecord[]>([])
  const [drawCategory, setDrawCategory] = useState("Default")
  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  // Load winner history from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWinners = localStorage.getItem("luckyDrawWinners")
      if (savedWinners) {
        try {
          setWinnerHistory(JSON.parse(savedWinners))
        } catch (e) {
          console.error("Error parsing winners from localStorage:", e)
          // Reset if there's an error
          localStorage.removeItem("luckyDrawWinners")
        }
      }
    }
  }, [])

  // Apply filters to student data and exclude previous winners if needed
  useEffect(() => {
    let result = [...studentData]

    if (filterGender !== "all") {
      result = result.filter((student) => student.Gender === filterGender)
    }

    if (filterSubject !== "all") {
      result = result.filter((student) => student["Advanced Subject"] === filterSubject)
    }

    const allFilteredNames = result.map((student) => student.Name)
    setFilteredStudents(allFilteredNames)

    // If we should exclude previous winners, filter them out
    if (excludePreviousWinners) {
      const previousWinnerNames = winnerHistory.map((record) => record.name)
      const availableNames = allFilteredNames.filter((name) => !previousWinnerNames.includes(name))
      setAvailableStudents(availableNames)
    } else {
      setAvailableStudents(allFilteredNames)
    }
  }, [filterGender, filterSubject, excludePreviousWinners, winnerHistory])

  const startDraw = () => {
    if (availableStudents.length < 1) return

    setIsDrawing(true)
    setWinner(null)

    // Rapidly cycle through students to create animation effect
    let counter = 0
    drawIntervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableStudents.length)
      setCurrentSelection(availableStudents[randomIndex])

      counter++
      if (counter > 20) {
        // Slow down the selection after 20 iterations
        clearInterval(drawIntervalRef.current!)
        drawIntervalRef.current = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * availableStudents.length)
          setCurrentSelection(availableStudents[randomIndex])

          counter++
          if (counter > 30) {
            // Final selection
            clearInterval(drawIntervalRef.current!)
            const winnerIndex = Math.floor(Math.random() * availableStudents.length)
            const selectedWinner = availableStudents[winnerIndex]
            setCurrentSelection(null)
            setWinner(selectedWinner)
            setIsDrawing(false)

            // Add to winner history
            const newWinnerRecord: WinnerRecord = {
              name: selectedWinner,
              timestamp: new Date().toLocaleString(),
              category: drawCategory,
            }

            const updatedHistory = [...winnerHistory, newWinnerRecord]
            setWinnerHistory(updatedHistory)

            // Save to localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem("luckyDrawWinners", JSON.stringify(updatedHistory))
            }

            // Trigger confetti
            if (confettiCanvasRef.current) {
              const myConfetti = confetti.create(confettiCanvasRef.current, {
                resize: true,
                useWorker: true,
              })

              myConfetti({
                particleCount: 100,
                spread: 160,
                origin: { y: 0.6 },
              })
            }
          }
        }, 200) // Slower interval
      }
    }, 100) // Fast interval
  }

  const resetWinners = () => {
    setWinnerHistory([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("luckyDrawWinners")
    }
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (drawIntervalRef.current) {
        clearInterval(drawIntervalRef.current)
      }
    }
  }, [])

  return (
<div
  className="min-h-screen p-4 md:p-8"
  style={{
    backgroundImage: "url('https://www.shutterstock.com/image-vector/khmer-new-year-traditional-game-260nw-2345743687.jpg'), linear-gradient(to bottom right, #4c1d95, #5b21b6, #312e81)",
    backgroundSize: "cover",
    backgroundBlendMode: "overlay",
  }}
>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center">
            <Sparkles className="mr-2 h-8 w-8 text-yellow-400" />
            ISTAD SANGKRAN LUCKY DRAW
            <Sparkles className="ml-2 h-8 w-8 text-yellow-400" />
          </h1>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-white/10 backdrop-blur-lg border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Students
                </div>
                <Badge variant="outline" className="ml-2 bg-purple-500/30">
                  {availableStudents.length}/{filteredStudents.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20">
                  <TabsTrigger value="list" className="text-white data-[state=active]:bg-white/30">
                    List
                  </TabsTrigger>
                  <TabsTrigger value="filter" className="text-white data-[state=active]:bg-white/30">
                    Filter
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="mt-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1">
                    {filteredStudents.map((student, index) => {
                      const isWinner = winnerHistory.some((w) => w.name === student)
                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-md text-white flex items-center justify-between ${
                            isWinner ? "bg-purple-500/30 line-through opacity-70" : "bg-white/10"
                          }`}
                        >
                          <span>{student}</span>
                          {isWinner && <Trophy className="h-4 w-4 text-yellow-400" />}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="filter" className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-purple-200 block mb-2">Filter by Gender</label>
                    <Select value={filterGender} onValueChange={setFilterGender}>
                      <SelectTrigger className="bg-white/20 border-purple-400/30 text-white">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900 text-white border-purple-400/30">
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-purple-200 block mb-2">Filter by Subject</label>
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className="bg-white/20 border-purple-400/30 text-white">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-900 text-white border-purple-400/30">
                        <SelectItem value="all">All Subjects</SelectItem>
                        {uniqueSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="exclude-winners"
                      checked={excludePreviousWinners}
                      onCheckedChange={setExcludePreviousWinners}
                    />
                    <Label htmlFor="exclude-winners" className="text-purple-200">
                      Exclude previous winners
                    </Label>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-purple-200">
                      {availableStudents.length} student{availableStudents.length !== 1 ? "s" : ""} available for
                      drawing
                    </p>
                    {excludePreviousWinners && winnerHistory.length > 0 && (
                      <p className="text-xs text-purple-300 mt-1">
                        ({winnerHistory.length} previous winner{winnerHistory.length !== 1 ? "s" : ""} excluded)
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-300 border-red-400/30 hover:bg-red-500/20">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-purple-900 text-white border-purple-400/30">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Winner History?</AlertDialogTitle>
                    <AlertDialogDescription className="text-purple-200">
                      This will clear all previous winners from the history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetWinners} className="bg-red-500 text-white hover:bg-red-600">
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" className="text-purple-200 border-purple-400/30 hover:bg-purple-500/20">
                <History className="h-4 w-4 mr-2" />
                {winnerHistory.length} Winner{winnerHistory.length !== 1 ? "s" : ""}
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 bg-white/10 backdrop-blur-lg border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Lucky Draw Results
                </div>
                <div>
                  <Select value={drawCategory} onValueChange={setDrawCategory}>
                    <SelectTrigger className="bg-white/20 border-purple-400/30 text-white w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 text-white border-purple-400/30">
                      <SelectItem value="Default">Default</SelectItem>
                      <SelectItem value="First Prize">First Prize</SelectItem>
                      <SelectItem value="Second Prize">Second Prize</SelectItem>
                      <SelectItem value="Third Prize">Third Prize</SelectItem>
                      <SelectItem value="Special Prize">Special Prize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20">
                  <TabsTrigger value="current" className="text-white data-[state=active]:bg-white/30">
                    Current Draw
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-white data-[state=active]:bg-white/30">
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="mt-4">
                  <div className="flex flex-col items-center justify-center min-h-[300px]">
                    {winner ? (
                      <div className="text-center animate-fadeIn">
                        <div className="text-2xl text-purple-200 mb-2">And the winner is...</div>
                        <div className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">{winner}</div>
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg py-1 px-4">
                          {drawCategory} Winner!
                        </Badge>
                      </div>
                    ) : isDrawing ? (
                      <div className="text-center">
                        <div className="text-xl text-purple-200 mb-4">Selecting...</div>
                        <div className="text-3xl md:text-5xl font-bold text-white animate-bounce">
                          {currentSelection}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-purple-200">
                        {availableStudents.length < 1 ? (
                          <p>No students available for drawing</p>
                        ) : (
                          <p>Click the button below to start the lucky draw</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    {winnerHistory.length === 0 ? (
                      <div className="text-center text-purple-200 py-10">
                        No winners yet. Start a draw to see results here.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {winnerHistory.map((record, index) => (
                          <div key={index} className="bg-white/10 p-3 rounded-md text-white">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-lg">{record.name}</div>
                                <div className="text-xs text-purple-300 mt-1">{record.timestamp}</div>
                              </div>
                              <Badge className="bg-purple-500/50">{record.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={startDraw}
                disabled={availableStudents.length < 1 || isDrawing}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
              >
                {isDrawing ? "Drawing..." : "Start Lucky Draw"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

