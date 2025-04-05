"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Trophy, Users, RotateCcw, History, Volume2, VolumeX } from "lucide-react"
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
import { studentData } from "@/students"

// Get unique subjects for filtering
const uniqueSubjects = Array.from(new Set(studentData.map((student) => student["Class"])))

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
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  // Audio refs
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const drawMusicRef = useRef<HTMLAudioElement | null>(null)
  const winnerMusicRef = useRef<HTMLAudioElement | null>(null)

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

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create audio elements
      // backgroundMusicRef.current = new Audio("/background-music.mp3")
      drawMusicRef.current = new Audio("/spin-232536.mp3")
      winnerMusicRef.current = new Audio("/winner-music.mp3")

      // Set properties
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.loop = true
        backgroundMusicRef.current.volume = 0.3

        // Add event listeners to track loading
        backgroundMusicRef.current.addEventListener("canplaythrough", () => {
          console.log("Background music loaded and ready to play")
          setAudioLoaded(true)
        })

        backgroundMusicRef.current.addEventListener("error", (e) => {
          console.error("Error loading background music:", e)
        })
      }

      if (drawMusicRef.current) {
        drawMusicRef.current.volume = 0.5
      }

      if (winnerMusicRef.current) {
        winnerMusicRef.current.volume = 0.6
      }
    }

    // Cleanup on unmount
    return () => {
      stopAllMusic()
    }
  }, [])

  // Handle mute state changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted
    }
    if (drawMusicRef.current) {
      drawMusicRef.current.muted = isMuted
    }
    if (winnerMusicRef.current) {
      winnerMusicRef.current.muted = isMuted
    }
  }, [isMuted])

  // Music control functions
  const playBackgroundMusic = () => {
    console.log("Manually playing background music")
    if (backgroundMusicRef.current) {
      // Ensure other sounds are stopped
      if (drawMusicRef.current) {
        drawMusicRef.current.pause()
        drawMusicRef.current.currentTime = 0
      }
      if (winnerMusicRef.current) {
        winnerMusicRef.current.pause()
        winnerMusicRef.current.currentTime = 0
      }

      // Play background music
      const playPromise = backgroundMusicRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Background music playing successfully")
          })
          .catch((error) => {
            console.log("Could not play background music:", error)
          })
      }
    }
  }

  const playDrawMusic = () => {
    if (drawMusicRef.current && !isMuted) {
      // Pause background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }

      // Reset and play draw music
      drawMusicRef.current.currentTime = 0
      const playPromise = drawMusicRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Could not play draw music:", error)
        })
      }
    }
  }

  const playWinnerMusic = () => {
    if (winnerMusicRef.current && !isMuted) {
      // Pause other music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }
      if (drawMusicRef.current) {
        drawMusicRef.current.pause()
        drawMusicRef.current.currentTime = 0
      }

      // Reset and play winner music
      winnerMusicRef.current.currentTime = 0
      const playPromise = winnerMusicRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Could not play winner music:", error)
        })
      }

      // Set timeout to resume background music after winner music finishes
      setTimeout(() => {
        playBackgroundMusic()
      }, 5000) // Adjust based on winner music length
    }
  }

  const stopAllMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current.currentTime = 0
    }
    if (drawMusicRef.current) {
      drawMusicRef.current.pause()
      drawMusicRef.current.currentTime = 0
    }
    if (winnerMusicRef.current) {
      winnerMusicRef.current.pause()
      winnerMusicRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)

    // If unmuting, try to play background music
    if (isMuted && backgroundMusicRef.current && !backgroundMusicRef.current.paused) {
      playBackgroundMusic()
    }
  }

  // Apply filters to student data and exclude previous winners if needed
  useEffect(() => {
    let result = [...studentData]
    console.log(result.length)

    if (filterGender !== "all") {
      result = result.filter((student) => student.Gender === filterGender)
    }

    if (filterSubject !== "all") {
      result = result.filter((student) => student["Class"] === filterSubject)
    }

    const allFilteredNames = result.map((student) => student.Full_Name)
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

    // Play draw music
    playDrawMusic()

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

            // Play winner music
            playWinnerMusic()

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
                particleCount: 150,
                spread: 160,
                origin: { y: 0.6 },
                colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#F9DC5C", "#E84A5F"],
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
      stopAllMusic()
    }
  }, [])

  return (
    <div
      className="min-h-screen  p-2 sm:p-4 md:p-8 lg:p-12 xl:p-16 font-kantumruy  mx-auto"
      style={{
        backgroundImage: `
            linear-gradient(to bottom right, rgba(220, 38, 38, 0.8), rgba(37, 99, 235, 0.75)),
          url('https://i.pinimg.com/736x/d6/7a/96/d67a962bb905da7072c22d2f741dc07e.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Confetti canvas */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 z-50 pointer-events-none" />

      {/* Audio elements - Adding visible audio elements for debugging */}
      {/* <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="bg-white/20 backdrop-blur-sm border-yellow-500/30 hover:bg-white/30 text-white"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={playBackgroundMusic}
          className="bg-white/20 backdrop-blur-sm border-yellow-500/30 hover:bg-white/30 text-white text-xs"
        >
          Play Music
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (backgroundMusicRef.current) {
              backgroundMusicRef.current.pause()
              backgroundMusicRef.current.currentTime = 0
            }
          }}
          className="bg-white/20 backdrop-blur-sm border-red-500/30 hover:bg-red-500/20 text-white text-xs"
        >
          Stop Music
        </Button>
      </div> */}

      {/* Fallback audio elements */}
      {/* <audio id="background-music" src="/background-music.mp3" loop preload="auto" className="hidden" /> */}
      <audio id="draw-music" src="/draw-music.mp3" preload="auto" className="hidden" />
      <audio id="winner-music" src="/winner-music.mp3" preload="auto" className="hidden" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-1 bg-yellow-300 rounded-full"></div>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center">
            <Sparkles className="mr-1 sm:mr-2 h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
            <span className="relative">
              <span className="relative z-10">ISTAD SANGKRAN LUCKY DRAW</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-red-600/30 rounded-full transform -rotate-1"></span>
            </span>
            <Sparkles className="ml-1 sm:ml-2 h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
          </h1>
          <p className="text-yellow-100 mt-2 max-w-2xl mx-auto">
            សួស្តីឆ្នាំថ្មី - Happy Khmer New Year! May this Sangkran bring joy, prosperity, and good fortune to all.
          </p>
          <div className="flex justify-center mt-4">
            <div className="w-16 h-1 bg-yellow-300 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <Card className="md:col-span-1 bg-white/10 backdrop-blur-lg border-yellow-500/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300"></div>
            <CardHeader className="relative">
              <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-yellow-500/20 rounded-full blur-xl"></div>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-yellow-300" />
                  Students
                </div>
                <Badge variant="outline" className="ml-2 bg-yellow-500/30 border-yellow-400 text-yellow-100">
                  {availableStudents.length}/{filteredStudents.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20">
                  <TabsTrigger
                    value="list"
                    className="text-white data-[state=active]:bg-orange-500/50 data-[state=active]:text-white"
                  >
                    List
                  </TabsTrigger>
                  <TabsTrigger
                    value="filter"
                    className="text-white data-[state=active]:bg-orange-500/50 data-[state=active]:text-white"
                  >
                    Filter
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="mt-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {filteredStudents.map((student, index) => {
                      const isWinner = winnerHistory.some((w) => w.name === student)
                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-md text-white flex items-center justify-between transition-all ${
                            isWinner ? "bg-yellow-500/30 line-through opacity-70" : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <span>{student}</span>
                          {isWinner && <Trophy className="h-4 w-4 text-yellow-300" />}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="filter" className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-yellow-100 block mb-2">Filter by Gender</label>
                    <Select value={filterGender} onValueChange={setFilterGender}>
                      <SelectTrigger className="bg-white/20 border-yellow-500/30 text-white focus:ring-yellow-400/50">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-orange-900/90 text-white border-yellow-500/30 font-kantumruy">
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-yellow-100 block mb-2">Filter by Subject</label>
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className="bg-white/20 border-yellow-500/30 text-white focus:ring-yellow-400/50">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-orange-900/90 text-white border-yellow-500/30 font-kantumruy">
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
                      className="data-[state=checked]:bg-yellow-500"
                    />
                    <Label htmlFor="exclude-winners" className="text-yellow-100">
                      Exclude previous winners
                    </Label>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-yellow-100">
                      {availableStudents.length} student{availableStudents.length !== 1 ? "s" : ""} available for
                      drawing
                    </p>
                    {excludePreviousWinners && winnerHistory.length > 0 && (
                      <p className="text-xs text-yellow-200/70 mt-1 bg-white">
                        ({winnerHistory.length} previous winner{winnerHistory.length !== 1 ? "s" : ""} excluded)
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between px-3 sm:px-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-300 border-red-400/30 bg-white hover:bg-red-500/20 w-full sm:w-auto"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-orange-900/95 text-white border-yellow-500/30 font-kantumruy">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Winner History?</AlertDialogTitle>
                    <AlertDialogDescription className="text-yellow-200/70">
                      This will clear all previous winners from the history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-yellow-500/30">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={resetWinners} className="bg-red-500 text-white hover:bg-red-600">
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                className="!text-black !bg-white border-yellow-500/30 hover:bg-yellow-500/20 w-full sm:w-auto"
              >
                <History className="h-4 w-4 mr-2" />
                {winnerHistory.length} Winner{winnerHistory.length !== 1 ? "s" : ""}
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 bg-white/10 backdrop-blur-lg border-yellow-500/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300"></div>
            <CardHeader className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-yellow-500/20 rounded-full blur-xl"></div>
              <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-300" />
                  Lucky Draw Results
                </div>
                <div className="w-full sm:w-auto">
                  <Select value={drawCategory} onValueChange={setDrawCategory}>
                    <SelectTrigger className="bg-white/20 border-yellow-500/30 text-white w-full sm:w-[150px] focus:ring-yellow-400/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-orange-900/90 text-white border-yellow-500/30 font-kantumruy">
                      <SelectItem value="ScholarShip 50%">ScholarShip 50%</SelectItem>
                      <SelectItem value="ScholarShip 70%">ScholarShip 70%</SelectItem>
                      <SelectItem value="ScholarShip 100%">ScholarShip 100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20">
                  <TabsTrigger
                    value="current"
                    className="text-white data-[state=active]:bg-orange-500/50 data-[state=active]:text-white"
                  >
                    Current Draw
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="text-white data-[state=active]:bg-orange-500/50 data-[state=active]:text-white"
                  >
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="mt-4">
                  <div className="flex flex-col items-center justify-center min-h-[300px] relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 opacity-20">
                      <div className="w-full h-full rounded-full bg-yellow-300 blur-md"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20">
                      <div className="w-full h-full rounded-full bg-orange-300 blur-md"></div>
                    </div>

                    {winner ? (
                      <div className="text-center animate-fadeIn relative z-10">
                        <div className="text-2xl text-yellow-200 mb-2">
                          <span className="relative">
                            And the winner is...
                            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400/50"></span>
                          </span>
                        </div>
                        <div className="text-xl sm:text-4xl md:text-6xl font-bold text-white mb-6 relative px-2 break-words">
                          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 break-words">
                            {winner}
                          </span>
                          <span className="absolute -bottom-2 left-0 right-0 h-2 bg-yellow-500/30 transform -rotate-1"></span>
                        </div>
                        <div className="relative inline-block">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black text-sm sm:text-lg py-1 px-3 sm:px-6 border-none">
                            {drawCategory} Winner!
                          </Badge>
                          <div className="absolute -inset-1 bg-yellow-400/20 blur-sm rounded-full -z-10"></div>
                        </div>
                      </div>
                    ) : isDrawing ? (
                      <div className="text-center relative z-10">
                        <div className="text-xl text-yellow-200 mb-4">
                          <span className="inline-block animate-spin-slow mr-2">✨</span>
                          Selecting...
                          <span className="inline-block animate-spin-slow ml-2">✨</span>
                        </div>
                        <div className="text-xl sm:text-3xl md:text-5xl font-bold text-white animate-pulse break-words px-2">
                          {currentSelection}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-yellow-100 relative z-10">
                        {availableStudents.length < 1 ? (
                          <p>No students available for drawing</p>
                        ) : (
                          <div>
                            <p className="mb-2">Click the button below to start the lucky draw</p>
                            <div className="text-yellow-300 text-5xl animate-bounce">↓</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {winnerHistory.length === 0 ? (
                      <div className="text-center text-yellow-100 py-10">
                        No winners yet. Start a draw to see results here.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {winnerHistory.map((record, index) => (
                          <div
                            key={index}
                            className="bg-white/10 hover:bg-white/15 p-2 sm:p-3 rounded-md text-white border-l-4 border-yellow-500 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div>
                                <div className="font-semibold text-base sm:text-lg break-words">{record.name}</div>
                                <div className="text-xs text-yellow-200/70 mt-1">{record.timestamp}</div>
                              </div>
                              <Badge className="bg-yellow-500/50 border-yellow-400/50 text-yellow-50">
                                {record.category}
                              </Badge>
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
                className="relative group overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg border-2 border-yellow-300/50 w-full sm:w-auto"
              >
                <span className="relative z-10">{isDrawing ? "Drawing..." : "Start Lucky Draw"}</span>
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Footer with Khmer New Year message */}
        <div className="mt-6 sm:mt-8 text-center text-yellow-200 text-sm sm:text-base md:text-lg px-2">
          <p className="text-xl sm:text-2xl font-medium">សូមឲ្យមានសុខភាពល្អ សិរីមង្គល និងសំណាងល្អក្នុងឆ្នាំថ្មីនេះ</p>
          <p className="mt-1">May you have good health, prosperity, and good luck in this New Year</p>
        </div>
      </div>
      {/* Add custom scrollbar styles */}
      <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
      }
      @media (max-width: 640px) {
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
      }
    `}</style>
    </div>
  )
}

