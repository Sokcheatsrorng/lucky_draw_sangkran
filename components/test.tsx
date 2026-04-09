"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw, Trophy, Sparkles, Menu, X } from "lucide-react";
import confetti from "canvas-confetti";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

type WinnerRecord = {
  name: string;
  timestamp: string;
  category: string;
};

const couponImages: Record<string, string> = {
  "Scholarship 50%": "/1.png",
  "Scholarship 70%": "/2.png",
  "Scholarship 100%": "/3.png"
};

export default function LuckyDrawSangkran2026() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [availableStudents, setAvailableStudents] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [excludePreviousWinners, setExcludePreviousWinners] = useState(true);
  const [winnerHistory, setWinnerHistory] = useState<WinnerRecord[]>([]);
  const [drawCategory, setDrawCategory] = useState<
    "Scholarship 50%" | "Scholarship 70%" | "Scholarship 100%"
  >("Scholarship 50%");

  const [textareaValue, setTextareaValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);   // ← Sidebar toggle

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load winner history
  useEffect(() => {
    const saved = localStorage.getItem("sangkranWinners2026");
    if (saved) setWinnerHistory(JSON.parse(saved));
  }, []);

  // Process participants from textarea
  const updateParticipants = () => {
    const names = textareaValue
      .trim()
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    setParticipants(names);
  };

  // Filter available students
  useEffect(() => {
    let list = [...participants];

    if (excludePreviousWinners) {
      const previous = new Set(winnerHistory.map((w) => w.name));
      list = list.filter((name) => !previous.has(name));
    }

    setAvailableStudents(list);
  }, [participants, excludePreviousWinners, winnerHistory]);

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({ particleCount: 180, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => myConfetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0.1 } }), 200);
    setTimeout(() => myConfetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 0.9 } }), 400);
  };

  const startDraw = () => {
    if (availableStudents.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setWinner(null);
    setCurrentSelection("");

    const totalSteps = 55;
    let counter = 0;

    drawIntervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      setCurrentSelection(availableStudents[randomIndex]);

      counter++;
      if (counter >= totalSteps) {
        clearInterval(drawIntervalRef.current!);

        const finalIndex = Math.floor(Math.random() * availableStudents.length);
        const selectedWinner = availableStudents[finalIndex];

        setCurrentSelection("");
        setWinner(selectedWinner);
        setIsDrawing(false);

        triggerConfetti();

        const newRecord: WinnerRecord = {
          name: selectedWinner,
          timestamp: new Date().toLocaleString("km-KH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          category: drawCategory,
        };

        const updated = [...winnerHistory, newRecord];
        setWinnerHistory(updated);
        localStorage.setItem("sangkranWinners2026", JSON.stringify(updated));
      }
    }, 70);
  };

  const resetWinners = () => {
    setWinnerHistory([]);
    localStorage.removeItem("sangkranWinners2026");
    setWinner(null);
  };

  const handleNewDraw = () => {
    setWinner(null);
  };

  const currentCouponImage = couponImages[drawCategory];

  return (
    <div
      className="min-h-screen p-6 md:p-10 font-kantumruy relative"
      style={{
          backgroundImage: `linear-gradient(to bottom right, rgb(255, 0,0, 0.8), rgba(0,0,255,0.8))`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
    >
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header with Sidebar Toggle */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center gap-4">
           <Sparkles className="mx-auto h-12 w-12 mb-10 text-yellow-300" />
            LuckyDraw ISTAD សង្ក្រាន្ត ២០២៦
            <Sparkles className="mx-auto h-12 w-12 mb-10 text-yellow-300" />
          </h1>

          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            variant="outline"
            className="bg-white/20 border-white/40 text-white hover:bg-white/30 text-xl px-6 py-6 rounded-full flex items-center gap-3"
          >
            {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            {showSidebar ? "លាក់ Sidebar" : "បង្ហាញ Sidebar"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Draw Area - Takes more space when sidebar hidden */}
          <div className={`${showSidebar ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-300`}>
            <Card className="bg-white/10 backdrop-blur-2xl border-white/30 shadow-2xl">
            

              <CardContent className="p-12 min-h-[620px] flex flex-col items-center justify-center">
                {winner ? (
                  <div className="text-center w-full">
                    <p className="text-yellow-300 text-4xl mb-6">🎉 សូមអបអរសាទរ 🎉</p>
                    <p className="text-6xl md:text-7xl font-bold text-white mb-12 break-words leading-tight">
                      {winner}
                    </p>

                    <div className="mx-auto max-w-lg shadow-2xl rounded-3xl overflow-hidden border-8 border-white/60">
                      <img
                        src={currentCouponImage}
                        alt={`${drawCategory} Coupon`}
                        className="w-full h-auto"
                      />
                    </div>

                    {/* <p className="mt-10 text-3xl text-white/90">{drawCategory} អ្នកឈ្នះ</p> */}

                    {/* <Button
                      onClick={handleNewDraw}
                      className="mt-12 px-12 py-7 text-2xl bg-white/20 hover:bg-white/30 border border-white/50 text-white rounded-full"
                    >
                      ដកឆ្នោតម្តងទៀត
                    </Button> */}
                  </div>
                ) : isDrawing ? (
                  <div className="text-center">
                    <div className="text-yellow-300 text-4xl mb-10 animate-pulse">
                      កំពុងដកសំណាង...
                    </div>
                    <div className="text-6xl md:text-7xl font-bold text-white min-h-[200px] flex items-center justify-center px-6 break-words text-center leading-tight">
                      {currentSelection || "..."}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Sparkles className="mx-auto h-28 w-28 mb-10 text-yellow-300" />
                    <p className="text-4xl text-white mb-6">ជ្រើសរើសប្រភេទរង្វាន់</p>
                    <p className="text-2xl text-white/70">បន្ទាប់មកចុច «ចាប់ផ្ដើមចាប់រង្វាន់»</p>
                  </div>
                )}
              </CardContent>

              <div className="p-10 pt-0">
                <Button
                  onClick={startDraw}
                  disabled={availableStudents.length === 0 || isDrawing}
                  className="w-full py-10 text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-full shadow-xl active:scale-95 transition-transform"
                >
                  {isDrawing ? "កំពុងចាប់រង្វាន់..." : "🚀 ចាប់ផ្ដើមចាប់រង្វាន់"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar - Can be hidden */}
          {showSidebar && (
            <div className="lg:col-span-4 space-y-8 transition-all duration-300">
              {/* Participants Input */}
              <Card className="bg-white/10 backdrop-blur-2xl border-white/30">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">បញ្ចូលឈ្មោះអ្នកចូលរួម</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    onBlur={updateParticipants}
                    placeholder="បញ្ចូលឈ្មោះអ្នកចូលរួម..."
                    className="w-full h-64 p-5 bg-white/10 border border-white/40 rounded-2xl text-white text-lg resize-y focus:outline-none focus:border-yellow-400 font-kantumruy"
                  />
                  <Button onClick={updateParticipants} className="w-full py-6 text-xl text-black">
                    បញ្ចូលឈ្មោះ
                  </Button>

                  <div className="text-white pt-4 text-xl">
                    ចំនួនអ្នកចូលរួមសរុប: <span className="text-yellow-300 font-bold text-3xl">{participants.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Category Selection */}
              <Card className="bg-white/10 backdrop-blur-2xl border-white/30">
                <CardHeader>
                  <CardTitle className="text-white">ជ្រើសរើសប្រភេទរង្វាន់</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <select
                    value={drawCategory}
                    onChange={(e) => setDrawCategory(e.target.value as any)}
                    className="w-full p-5 bg-white/10 border border-white/40 rounded-2xl text-black text-2xl focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Scholarship 50%">អាហារូបករណ៍ ៥០%</option>
                    <option value="Scholarship 70%">អាហារូបករណ៍ ៧០%</option>
                    <option value="Scholarship 100%">អាហារូបករណ៍ ១០០%</option>
                  
                  </select>

                  <div className="flex items-center justify-between py-4">
                    <Label className="text-white text-xl">មិនឱ្យឈ្មោះដែលឈ្នះរួច</Label>
                    <Switch
                      checked={excludePreviousWinners}
                      onCheckedChange={setExcludePreviousWinners}
                    />
                  </div>

                  <div className="pt-6 text-white border-t border-white/20 text-xl">
                    អាចដកបាន៖ <span className="text-yellow-300 font-bold text-4xl">{availableStudents.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Winner History */}
              <Card className="bg-white/10 backdrop-blur-2xl border-white/30">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-white">ប្រវត្តិអ្នកឈ្នះ</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-400">
                        <RotateCcw className="h-6 w-6" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-red-950 border-red-700 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>កំណត់ឡើងវិញទាំងអស់?</AlertDialogTitle>
                        <AlertDialogDescription>សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>បោះបង់</AlertDialogCancel>
                        <AlertDialogAction onClick={resetWinners} className="bg-red-600">
                          កំណត់ឡើងវិញ
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>

                <CardContent>
                  {winnerHistory.length === 0 ? (
                    <p className="text-white/60 py-20 text-center text-xl">នៅមិនទាន់មានអ្នកឈ្នះនៅឡើយទេ</p>
                  ) : (
                    <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
                      {winnerHistory.map((w, i) => (
                        <div key={i} className="bg-white/10 p-6 rounded-2xl">
                          <p className="font-bold text-white text-2xl break-words">{w.name}</p>
                          <p className="text-sm text-yellow-200 mt-2">{w.timestamp}</p>
                          <p className="text-xl mt-3 text-yellow-300">{w.category}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}