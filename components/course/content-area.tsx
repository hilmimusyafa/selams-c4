"use client"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentAreaProps {
  courseId: string
  selectedMaterialId: string
  isCompleted: boolean
  onMarkAsDone: (materialId: string) => void
}

export function ContentArea({ courseId, selectedMaterialId, isCompleted, onMarkAsDone }: ContentAreaProps) {
  // Mock content data
  const contentMap: Record<string, any> = {
    "1": {
      type: "text",
      title: "Apa itu Algoritma?",
      content: `
        # Pengantar Algoritma

Algoritma adalah urutan langkah-langkah logis dan terbatas untuk menyelesaikan masalah atau mencapai tujuan tertentu. Dalam pemrograman, algoritma adalah fondasi dari setiap program yang kita buat.

## Karakteristik Algoritma yang Baik:

1. **Input**: Algoritma harus jelas tentang apa yang diinput
2. **Output**: Hasil yang jelas dan terdefinisi dengan baik
3. **Definiteness**: Setiap langkah harus jelas dan tidak ambigu
4. **Finiteness**: Algoritma harus berakhir dalam waktu yang terbatas
5. **Effectiveness**: Setiap operasi harus dapat dilakukan oleh komputer

## Contoh Algoritma Sederhana

Algoritma untuk mencari bilangan terbesar dari tiga angka:

1. Baca tiga bilangan: a, b, c
2. Jika a > b, lanjut ke langkah 3. Jika tidak, lanjut ke langkah 4
3. Jika a > c, maka a adalah yang terbesar. Jika tidak, c adalah yang terbesar
4. Jika b > c, maka b adalah yang terbesar. Jika tidak, c adalah yang terbesar

Algoritma ini terbatas, jelas, dan akan selalu menghasilkan output yang tepat.
      `,
    },
    "2": {
      type: "video",
      title: "Video: Algoritma Sederhana",
      videoUrl: "https://www.youtube.com/embed/rL8X2mlNHPM",
    },
    "3": {
      type: "quiz",
      title: "Quiz: Konsep Algoritma",
      questions: [
        {
          id: 1,
          question: "Apa itu algoritma?",
          options: [
            "Urutan langkah-langkah logis untuk menyelesaikan masalah",
            "Bahasa pemrograman",
            "Software development tool",
          ],
          correct: 0,
        },
        {
          id: 2,
          question: "Karakteristik mana yang BUKAN termasuk algoritma yang baik?",
          options: ["Finiteness", "Definiteness", "Infiniteness"],
          correct: 2,
        },
      ],
    },
    "4": {
      type: "text",
      title: "Array dalam Pemrograman",
      content: `# Array: Struktur Data Fundamental

Array adalah kumpulan elemen dengan tipe data yang sama yang disimpan dalam lokasi memori yang berurutan.

## Keuntungan Array:
- Akses elemen sangat cepat O(1)
- Hemat memori dibanding struktur lain
- Mudah diimplementasi

## Kelemahan Array:
- Ukuran fixed (tidak bisa berkembang)
- Penambahan/penghapusan di tengah lambat O(n)
      `,
    },
  }

  const material = contentMap[selectedMaterialId] || contentMap["1"]

  const renderContent = () => {
    if (material.type === "text") {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-foreground">{material.content}</div>
        </div>
      )
    }

    if (material.type === "video") {
      return (
        <div className="aspect-video w-full">
          <iframe
            src={material.videoUrl}
            title={material.title}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )
    }

    if (material.type === "quiz") {
      return (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">{material.questions.length} questions</div>
          {material.questions.map((q: any) => (
            <Card key={q.id} className="p-4">
              <h3 className="font-semibold mb-3">{q.question}</h3>
              <div className="space-y-2">
                {q.options.map((option: string, idx: number) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <input type="radio" name={`question-${q.id}`} className="w-4 h-4" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
          <Button className="w-full bg-primary hover:bg-primary/90">Submit Quiz</Button>
        </div>
      )
    }
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{material.title}</h2>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg p-6">{renderContent()}</div>

        {/* Mark as Done Button */}
        <div className="flex gap-3">
          <Button
            onClick={() => onMarkAsDone(selectedMaterialId)}
            disabled={isCompleted}
            className={`gap-2 ${isCompleted ? "bg-success hover:bg-success" : "bg-primary hover:bg-primary/90"}`}
          >
            <Check className="w-4 h-4" />
            {isCompleted ? "Completed" : "Mark as Done"}
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}
