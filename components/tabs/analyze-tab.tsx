"use client"

import type React from "react"
import { useRef, useState } from "react"
import { BookOpen, Clock3, FileText, Loader2, MessageCircleQuestion, Upload } from "lucide-react"
import { BookDashboard } from "@/components/book-dashboard"
import { mockBookTitle } from "@/lib/mock-book-data"

type ChapterStats = {
  title: string
  words: number
  sentences: number
  questions: number
}

type BookStats = {
  title: string
  wordCount: number
  sentenceCount: number
  chapterCount: number
  averageChapterLength: number
  averageSentenceLength: number
  readingMinutes: number
  chapters: ChapterStats[]
}

const chapterHeading = /^\s*((?:chapter|part|bölüm|kısım)\s+(?:\d+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten)\b.*)$/i

function countWords(text: string) {
  return text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0
}

function countSentences(text: string) {
  return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.filter((sentence) => sentence.trim().length > 0).length ?? 0
}

function analyzeText(title: string, source: string): BookStats {
  const text = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim()
  const lines = text.split("\n")
  const headings = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(({ line }) => chapterHeading.test(line))

  let chapters: ChapterStats[]
  if (headings.length === 0) {
    chapters = [{ title: "Full manuscript", words: countWords(text), sentences: countSentences(text), questions: (text.match(/\?/g) ?? []).length }]
  } else {
    chapters = []
    const firstHeading = headings[0]
    const opening = lines.slice(0, firstHeading.index).join("\n").trim()
    if (countWords(opening) > 0) {
      chapters.push({
        title: "Opening",
        words: countWords(opening),
        sentences: countSentences(opening),
        questions: (opening.match(/\?/g) ?? []).length,
      })
    }

    headings.forEach((heading, index) => {
      const end = headings[index + 1]?.index ?? lines.length
      const chapterText = lines.slice(heading.index + 1, end).join("\n").trim()
      chapters.push({
        title: heading.line,
        words: countWords(chapterText),
        sentences: countSentences(chapterText),
        questions: (chapterText.match(/\?/g) ?? []).length,
      })
    })
  }

  const wordCount = chapters.reduce((sum, chapter) => sum + chapter.words, 0)
  const sentenceCount = chapters.reduce((sum, chapter) => sum + chapter.sentences, 0)
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220))

  return {
    title,
    wordCount,
    sentenceCount,
    chapterCount: chapters.length,
    averageChapterLength: chapters.length ? Math.round(wordCount / chapters.length) : 0,
    averageSentenceLength: sentenceCount ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0,
    readingMinutes,
    chapters,
  }
}

function StatCard({ label, value, unit, icon: Icon }: { label: string; value: string; unit: string; icon: typeof BookOpen }) {
  return (
    <div className="rounded-xl bg-zinc-800 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {value} <span className="text-sm font-normal text-zinc-400">{unit}</span>
          </p>
        </div>
        <Icon className="h-5 w-5 text-violet-400" aria-hidden="true" />
      </div>
    </div>
  )
}

function LocalResults({ result }: { result: BookStats }) {
  const maxChapterWords = Math.max(1, ...result.chapters.map((chapter) => chapter.words))

  return (
    <section className="space-y-6" aria-label="Local manuscript analysis results">
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-6">
        <div className="mb-5 flex items-start gap-3">
          <FileText className="mt-1 h-6 w-6 shrink-0 text-violet-400" aria-hidden="true" />
          <div>
            <h2 className="text-2xl font-bold text-white">{result.title}</h2>
            <p className="mt-1 text-sm text-zinc-400">Basic manuscript statistics · calculated in this browser</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Word count" value={result.wordCount.toLocaleString()} unit="words" icon={BookOpen} />
          <StatCard label="Chapters found" value={result.chapterCount.toLocaleString()} unit="chapters" icon={FileText} />
          <StatCard label="Average chapter" value={result.averageChapterLength.toLocaleString()} unit="words" icon={BookOpen} />
          <StatCard label="Reading time" value={result.readingMinutes.toLocaleString()} unit="min" icon={Clock3} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Sentences" value={result.sentenceCount.toLocaleString()} unit="sentences" icon={FileText} />
          <StatCard label="Average sentence length" value={result.averageSentenceLength.toLocaleString()} unit="words" icon={MessageCircleQuestion} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-6">
        <h3 className="mb-1 text-xl font-semibold text-white">Chapter length</h3>
        <p className="mb-5 text-sm text-zinc-400">Word count by detected chapter</p>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-2">
          {result.chapters.map((chapter, index) => (
            <div key={`${chapter.title}-${index}`}>
              <div className="mb-1 flex justify-between gap-4 text-sm">
                <span className="truncate text-zinc-300">{chapter.title}</span>
                <span className="shrink-0 text-zinc-400">{chapter.words.toLocaleString()} words</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-700">
                <div
                  className="h-2 rounded-full bg-violet-500"
                  style={{ width: `${Math.max(1, (chapter.words / maxChapterWords) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-400">
        This browser-only report counts words, sentences, and chapter lengths. It does not upload or save the manuscript,
        and it does not claim to measure emotion, tension, or literary quality.
      </p>
    </section>
  )
}

export function AnalyzeTab() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [bookTitle, setBookTitle] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [result, setResult] = useState<BookStats | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith(".txt")) {
      setErrorMessage("Please choose a plain-text .txt file.")
      setFile(null)
      event.target.value = ""
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("The file is larger than the 10 MB limit.")
      setFile(null)
      event.target.value = ""
      return
    }

    setFile(selectedFile)
    setErrorMessage("")
  }

  const resetForm = () => {
    setFile(null)
    setBookTitle("")
    setErrorMessage("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAnalyze = async () => {
    if (!bookTitle.trim()) {
      setErrorMessage("Please enter a book title.")
      return
    }
    if (!file) {
      setErrorMessage("Please choose a .txt manuscript.")
      return
    }

    setIsAnalyzing(true)
    setErrorMessage("")
    try {
      const text = await file.text()
      const analysis = analyzeText(bookTitle.trim(), text)
      if (analysis.wordCount === 0) {
        setErrorMessage("No readable text was found in this file.")
        return
      }
      setResult(analysis)
      setIsUploadModalOpen(false)
      resetForm()
    } catch {
      setErrorMessage("The file could not be read. Please try another .txt file.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const openUploadModal = () => {
    resetForm()
    setIsUploadModalOpen(true)
  }

  const closeUploadModal = () => {
    if (isAnalyzing) return
    setIsUploadModalOpen(false)
    resetForm()
  }

  return (
    <>
      <div className="absolute left-0 top-0 mx-0 w-screen max-w-none overflow-x-hidden px-0 py-6">
        <div className="mx-6 mb-12 mt-24 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-10 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">Analyze My Book</h2>
          <p className="mb-4 text-sm text-zinc-300 md:text-base">
            Get a quick structural overview of a plain-text manuscript. The file is read locally in your browser and is not uploaded.
          </p>
          <button
            type="button"
            onClick={openUploadModal}
            className="flex items-center rounded-lg bg-[#8b5cf6] px-5 py-2.5 text-white transition-colors hover:bg-[#7c3aed]"
          >
            <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
            {result ? "Analyze Another Book" : "Choose a .txt Manuscript"}
          </button>
        </div>

        <div className="pointer-events-auto px-6">
          {result ? <LocalResults result={result} /> : <BookDashboard bookTitle={mockBookTitle} />}
        </div>
      </div>

      {isUploadModalOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-zinc-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Analyze a manuscript locally</h2>
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={isAnalyzing}
                aria-label="Close"
                className="text-zinc-400 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 rounded-lg bg-zinc-800 p-4">
              <h3 className="mb-2 text-lg font-semibold text-white">What this report includes</h3>
              <ul className="list-disc space-y-1 pl-5 text-zinc-300">
                <li>Plain-text .txt file, up to 10 MB</li>
                <li>Word count, sentence count, estimated reading time, and chapter lengths</li>
                <li>Chapter headings such as “Chapter 1” or “Part II” are detected automatically</li>
                <li>The manuscript stays in this browser tab; nothing is sent to a server</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="bookTitle" className="mb-2 block text-zinc-300">Book title</label>
                <input
                  type="text"
                  id="bookTitle"
                  value={bookTitle}
                  onChange={(event) => setBookTitle(event.target.value)}
                  placeholder="Enter your book title"
                  disabled={isAnalyzing}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                />
              </div>

              <div>
                <label htmlFor="fileUpload" className="mb-2 block text-zinc-300">Manuscript (.txt, max 10 MB)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="fileUpload"
                  accept=".txt,text/plain"
                  onChange={handleFileChange}
                  disabled={isAnalyzing}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-3 text-white file:mr-4 file:rounded-md file:border-0 file:bg-[#8b5cf6] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#7c3aed]"
                />
                {file && <p className="mt-2 text-sm text-zinc-400">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
              </div>

              {errorMessage && <p role="alert" className="rounded-md border border-red-700 bg-red-900/50 p-3 text-red-200">{errorMessage}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={isAnalyzing}
                  className="rounded-md bg-zinc-700 px-4 py-2 text-white transition-colors hover:bg-zinc-600 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center rounded-md bg-[#8b5cf6] px-4 py-2 font-medium text-white transition-colors hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isAnalyzing ? "Analyzing locally..." : "Analyze My Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
