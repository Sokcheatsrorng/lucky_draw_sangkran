"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw, Sparkles, Menu, X } from "lucide-react";
import confetti from "canvas-confetti";
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
} from "@/components/ui/alert-dialog";

type WinnerRecord = {
  name: string;
  timestamp: string;
  category: string;
};

const couponImages: Record<string, string> = {
  "Voucher 80$": "/80.png",
  "Voucher 100$": "/100.png",
  "Voucher 130$": "/130.png",
  "Voucher 150$": "/150.png",
  "Voucher 200$": "/200.png",
  "Voucher 250$": "/250.png",
  "Voucher 300$": "/300.png",
  "Voucher 350$": "/350.png"
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
    "Voucher 80$" | "Voucher 100$" | "Voucher 130$" | "Voucher 150$" | "Voucher 200$" | "Voucher 250$" | "Voucher 300$" | "Voucher 350$"
  >("Voucher 80$");

  const [textareaValue, setTextareaValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Audio
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sangkranWinners2026");
    if (saved) setWinnerHistory(JSON.parse(saved));

    spinAudioRef.current = new Audio("/spinning.mp3");
    spinAudioRef.current.loop = true;
    winAudioRef.current = new Audio("/win.mp3");
  }, []);

  const resetWinners = () => {
    setWinnerHistory([]);
    localStorage.removeItem("sangkranWinners2026");
    setWinner(null);
  };

  const updateParticipants = () => {
    const names = textareaValue
      .trim()
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    setParticipants(names);
  };

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
    myConfetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => myConfetti({ particleCount: 130, angle: 55, spread: 75, origin: { x: 0.1 } }), 250);
    setTimeout(() => myConfetti({ particleCount: 130, angle: 125, spread: 75, origin: { x: 0.9 } }), 450);
  };

  const startDraw = () => {
    if (availableStudents.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setWinner(null);
    setCurrentSelection("");

    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play().catch(() => { });
    }

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

        if (spinAudioRef.current) spinAudioRef.current.pause();
        if (winAudioRef.current) {
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play().catch(() => { });
        }

        triggerConfetti();
        setShowWinnerModal(true);   // ← Show Modal

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

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
    setWinner(null);
  };

  const handleNewDraw = () => {
    closeWinnerModal();
  };

  const currentCouponImage = couponImages[drawCategory];

  return (
    <div
      className="min-h-screen p-6 md:p-10 font-kantumruy relative"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(226, 50, 38, 0.92), rgba(37, 99, 235, 0.88))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <canvas ref={confettiCanvasRef} className="fixed inset-0 z-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" mb-10 mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center gap-4 text-center">
            <Sparkles className="text-yellow-300 h-12 w-12" />
            LuckyDraw ISTAD សង្ក្រាន្ត ២០២៦
            <Sparkles className="text-yellow-300  h-12 w-12" />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Main Draw Area */}
          <div className={`${showSidebar ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-300`}>
            <Card className="bg-white/10 backdrop-blur-2xl border-white/30 shadow-2xl">
              <CardContent className="p-12 min-h-[620px] flex flex-col items-center justify-center">
                {isDrawing ? (
                  <div className="text-center">
                    <div className="text-yellow-300 text-4xl mb-10 animate-pulse">
                      កំពុងផ្សងសំណាង...
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

          {/* Sidebar remains the same - paste your sidebar cards here */}
          {showSidebar && (
            <div className="lg:col-span-4 space-y-8 transition-all duration-300">
              {/* Your Participants, Category, and History Cards go here */}
            </div>
          )}
        </div>
      </div>

      {/* ====================== WINNER MODAL ====================== */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/40 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl">
            <Button
              onClick={closeWinnerModal}
              variant="outline"
              className="border p-8 text-4xl bg-transparent border-none fixed right-0  text-red-500 rounded-2xl"
            >
              បិទ
            </Button>
            <div className="p-10 md:p-14 text-center">
              <p className="text-yellow-300 text-5xl md:text-6xl font-bold mb-8 drop-shadow-lg">
                🎉 សូមអបអរសាទរ 🎉
              </p>

              {/* Big Winner Name */}
              <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-12 break-words leading-tight drop-shadow-2xl">
                {winner}
              </p>

              {/* Big Coupon Image */}
              <div className="mx-auto max-w-full md:max-w-4xl shadow-2xl rounded-3xl overflow-hidden border-8 border-yellow-300/80 mb-10">
                <img
                  src={currentCouponImage}
                  alt={`${drawCategory} Coupon`}
                  className="w-full h-auto"
                />
              </div>

              <p className="text-4xl text-yellow-200 font-medium mb-10">
                អ្នកឈ្នះ {drawCategory}
              </p>
            </div>
          </div>
        </div>
      )}

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
                <option value="Voucher 80$">Voucher 80$</option>
                <option value="Voucher 100$">Voucher 100$</option>
                <option value="Voucher 130$">Voucher 130$</option>
                <option value="Voucher 150$">Voucher 150$</option>
                <option value="Voucher 200$">Voucher 200$</option>
                <option value="Voucher 250$">Voucher 250$</option>
                <option value="Voucher 300$">Voucher 300$</option>
                <option value="Voucher 350$">Voucher 350$</option>


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
  );
}