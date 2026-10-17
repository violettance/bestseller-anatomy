"use client"

import type React from "react"
import { BarChart3, LineChart, Activity, Clock, BookOpen, BookOpenText, Donut, Brain, Lightbulb } from "lucide-react"
import { mockBookMetrics, mockChapterMetrics, mockBookTitle } from "@/lib/mock-book-data"

interface BookDashboardProps {
  bookTitle?: string
}

export function BookDashboard({ bookTitle = mockBookTitle }: BookDashboardProps) {
  const bookMetrics = mockBookMetrics
  const chapterMetrics = mockChapterMetrics

  // Veri normalizasyon yardımcı fonksiyonu
  const normalizeData = (data: any[], key: string) => {
    // Minimum ve maksimum değerleri bul
    const values = data.map((item) => item[key] || 0)
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Eğer min ve max aynıysa veya çok yakınsa (çok küçük fark)
    if (max - min < 0.001) {
      // Yapay bir fark oluştur
      return data.map((item, index) => ({
        ...item,
        [key]: 0.3 + (index / (data.length - 1)) * 0.4, // 0.3 ile 0.7 arasında yapay değerler
      }))
    }

    // Normal durumda 0-1 arasına normalize et
    return data.map((item) => ({
      ...item,
      [key]: ((item[key] || 0) - min) / (max - min),
    }))
  }

  // Bölüm bazlı verileri hazırla ve normalize et
  const sentimentData = normalizeData(chapterMetrics, "avg_sentiment_score")
  const tensionData = normalizeData(chapterMetrics, "peak_tension_score")
  const paceData = normalizeData(chapterMetrics, "pace_variance")

  // Action density için özel normalizasyon (5-29 aralığından 0-1'e)
  const actionData = chapterMetrics.map((item) => {
    const value = item.action_density_per_block || 0
    // Eğer değer zaten 0-1 arasındaysa kullan, değilse normalize et
    const normalizedValue = value > 1 ? value / 30 : value // 30 maksimum değer varsayımı
    return {
      chapter: item.chapter_number || item.chapter,
      action: normalizedValue,
    }
  })

  const curiosityData = normalizeData(chapterMetrics, "question_density")

  // Ortalama sentiment score hesapla
  const avgSentimentScore =
    chapterMetrics.reduce((sum, item) => sum + (item.avg_sentiment_score || 0), 0) / chapterMetrics.length

  // Sensory data
  const sensoryData = {
    visual: bookMetrics.visual_keyword_density * 100,
    auditory: bookMetrics.auditory_keyword_density * 100,
    tactile: bookMetrics.tactile_keyword_density * 100,
    olfactory: bookMetrics.olfactory_keyword_density * 100,
    gustatory: bookMetrics.gustatory_keyword_density * 100,
  }

  // Timeline data
  const timelineData = [
    { label: "First Incident", percent: bookMetrics.estimated_disturbance_timing * 100 },
    { label: "Hero's Journey Truly Begins", percent: bookMetrics.estimated_doorway1_timing * 100 },
    { label: "Major Turning Point", percent: bookMetrics.estimated_midpoint_shift * 100 },
    { label: "Climax", percent: bookMetrics.estimated_doorway2_timing * 100 },
  ]

  const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "" }) => (
    <div className={`bg-zinc-800 rounded-xl p-6 shadow-[0_0_20px_8px_rgba(24,24,27,0.5)] h-full ${className}`}>
      {children}
    </div>
  )

  const MetricCard = ({ title, value, icon: Icon, unit }: any) => (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">
            {value}
            {unit && <span className="text-sm text-zinc-400 ml-1">{unit}</span>}
          </h3>
        </div>
        <div className="p-3 rounded-full bg-[#8b5cf6]/10">
          <Icon className="h-6 w-6 text-[#8b5cf6]" />
        </div>
      </div>
    </Card>
  )

  const LineChartMock = ({
    data,
    dataKey,
    title,
    description,
    color = "#8b5cf6",
    variant = "line", // default line
  }: any) => (
    <Card>
      <header className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>
        {variant === "line" ? (
          <LineChart className="h-5 w-5 text-zinc-400" />
        ) : (
          <BarChart3 className="h-5 w-5 text-zinc-400" />
        )}
      </header>

      <div className="h-48 w-full relative">
        {variant === "line" ? (
          <div className="h-full w-full relative">
            {/* Chart area with reduced height to make room for labels */}
            <div className="h-[90%] w-full relative">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {/* Arka plan alanı */}
                <path
                  fill="#2b213f"
                  d={`M0,${100 - (data[0]?.[dataKey] || 0) * 100} ${data
                    .map((item: any, idx: number) => {
                      const x = (idx / (data.length - 1)) * 100
                      const y = 100 - (item[dataKey] || 0) * 100
                      return `L${x},${y}`
                    })
                    .join(" ")} L100,${100 - (data[data.length - 1]?.[dataKey] || 0) * 100} L100,100 L0,100 Z`}
                />

                {/* Smooth çizgi için path */}
                <path
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={`M0,${100 - (data[0]?.[dataKey] || 0) * 100} ${data
                    .map((item: any, idx: number) => {
                      const x = (idx / (data.length - 1)) * 100
                      const y = 100 - (item[dataKey] || 0) * 100
                      return `${idx === 0 ? "M" : "S"} ${x},${y} ${x},${y}`
                    })
                    .join(" ")}`}
                />
              </svg>
            </div>

            {/* X-axis labels - Now positioned below the chart */}
            <div className="h-[10%] w-full flex justify-between items-center px-1 mt-1">
              {data.map((item: any, idx: number) => (
                <span key={idx} className="text-[10px] text-zinc-300 font-medium">
                  {item.chapter || idx + 1}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full relative">
            {/* Bar chart with reduced height */}
            <div className="absolute inset-0 bottom-5 flex items-end gap-[1px]">
              {data.map((item: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(item[dataKey] || 0) * 100}%`,
                      backgroundColor: color,
                      minHeight: "4px", // En azından 4px yükseklik
                    }}
                  />
                </div>
              ))}
            </div>

            {/* X-axis labels for bar chart - positioned at the bottom */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-center px-1 h-5">
              {data.map((item: any, idx: number) => (
                <span key={idx} className="text-[10px] text-zinc-300 font-medium">
                  {item.chapter || idx + 1}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )

  const SensoryPie = ({ data }: any) => {
    const total = Object.values(data).reduce((sum: number, val: number) => sum + val, 0)
    let start = 0
    const colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]
    const sensoryLabels = Object.entries(data).map(([key, val], idx) => {
      const pct = val / total
      const angle = pct * 360
      const midAngle = start + angle / 2

      // Etiket konumunu hesapla
      // İç ve dış yarıçaplar
      const innerRadius = 20
      const outerRadius = 30
      const labelRadius = outerRadius + 15 // Etiket için biraz daha dışarıda

      // Etiket koordinatları
      const x = 50 + labelRadius * Math.cos((midAngle * Math.PI) / 180)
      const y = 50 + labelRadius * Math.sin((midAngle * Math.PI) / 180)

      // Çizgi başlangıç ve bitiş noktaları
      const lineStartX = 50 + outerRadius * Math.cos((midAngle * Math.PI) / 180)
      const lineStartY = 50 + outerRadius * Math.sin((midAngle * Math.PI) / 180)
      const lineEndX = 50 + (labelRadius - 5) * Math.cos((midAngle * Math.PI) / 180)
      const lineEndY = 50 + (labelRadius - 5) * Math.sin((midAngle * Math.PI) / 180)

      // Text anchor (metin hizalaması) hesapla
      const textAnchor = midAngle > 90 && midAngle < 270 ? "end" : "start"

      // Etiket metni
      const label = `${key} (${Math.round((val / total) * 100)}%)`

      // Sonraki dilim için başlangıç açısını güncelle
      start += angle

      return {
        key,
        color: colors[idx % colors.length],
        midAngle,
        x,
        y,
        lineStartX,
        lineStartY,
        lineEndX,
        lineEndY,
        textAnchor,
        label,
      }
    })

    return (
      <Card>
        <header className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Sensory Balance</h3>
            <p className="text-zinc-400 text-sm">Sensory distribution</p>
          </div>
          <Donut className="h-5 w-5 text-zinc-400" />
        </header>

        <div className="flex justify-center items-center">
          {/* Donut Chart - Etiketlerle birlikte */}
          <div className="w-full h-64 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Donut dilimlerini çiz */}
              {Object.entries(data).map(([key, val], idx) => {
                const pct = val / total
                const angle = pct * 360
                const end = start + angle
                const large = angle > 180 ? 1 : 0
                const x1 = 50 + 40 * Math.cos((start * Math.PI) / 180)
                const y1 = 50 + 40 * Math.sin((start * Math.PI) / 180)
                const x2 = 50 + 40 * Math.cos((end * Math.PI) / 180)
                const y2 = 50 + 40 * Math.sin((end * Math.PI) / 180)
                const d = [`M50 50`, `L${x1} ${y1}`, `A40 40 0 ${large} 1 ${x2} ${y2}`, `Z`].join(" ")
                const result = <path key={key} d={d} fill={colors[idx % colors.length]} />
                start = end
                return result
              })}
              <circle cx="50" cy="50" r="25" fill="#1f1f1f" />

              {/* Etiketleri ve çizgileri çiz */}
              {sensoryLabels.map((item) => (
                <g key={item.key}>
                  {/* Çizgi */}
                  <line
                    x1={item.lineStartX}
                    y1={item.lineStartY}
                    x2={item.lineEndX}
                    y2={item.lineEndY}
                    stroke={item.color}
                    strokeWidth="1"
                  />

                  {/* Etiket */}
                  <text
                    x={item.x}
                    y={item.y}
                    fill="white"
                    fontSize="5"
                    textAnchor={item.textAnchor}
                    dominantBaseline="middle"
                  >
                    {item.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </Card>
    )
  }

  const Timeline = ({ data }: { data: { label: string; percent: number }[] }) => (
    <Card>
      <header className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Timeline</h3>
          <p className="text-zinc-400 text-sm">Major plot points</p>
        </div>
        <Activity className="h-5 w-5 text-zinc-400" />
      </header>

      <div className="relative flex flex-col items-start pl-6 gap-6 mt-6">
        {data.map(({ label, percent }, idx) => (
          <div key={idx} className="relative">
            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#8b5cf6] border-2 border-zinc-800" />
            <div className="ml-6 text-sm text-white font-medium">{label}</div>
            <div className="ml-6 text-xs text-zinc-400">{Math.round(percent)}%</div>
            {idx < data.length - 1 && <div className="absolute left-1.5 top-5 w-0.5 h-6 bg-zinc-600" />}
          </div>
        ))}
      </div>
    </Card>
  )

  // Sentiment score değerini metin olarak göster
  const getSentimentText = (value: number) => {
    if (value > 0.05) return "Positive"
    if (value < -0.05) return "Negative"
    return "Neutral"
  }

  // Climax momentum değerini metin olarak göster
  const getClimaxMomentumText = (value: number) => {
    if (value > 1.5) return "Steep"
    if (value > 1.0) return "Rising"
    if (value > 0.5) return "Moderate"
    return "Gradual"
  }

  // Emotional volatility değerini metin olarak göster
  const getEmotionalVolatilityText = (value: number) => {
    if (value > 0.8) return "High"
    if (value > 0.5) return "Medium"
    return "Low"
  }

  const IntensityDynamics = () => (
    <Card>
      <header className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Intensity Dynamics</h3>
        </div>
        <Brain className="h-5 w-5 text-zinc-400" />
      </header>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Average sentiment score</span>
          <span className="text-xl font-bold text-white">{getSentimentText(avgSentimentScore)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Tension spike count</span>
          <span className="text-xl font-bold text-white">{Math.round(bookMetrics.tension_spike_count)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Climax momentum</span>
          <span className="text-xl font-bold text-white">
            {getClimaxMomentumText(bookMetrics.climax_tension_gradient)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Emotional volatility</span>
          <span className="text-xl font-bold text-white">
            {getEmotionalVolatilityText(bookMetrics.emotional_volatility)}
          </span>
        </div>
      </div>
    </Card>
  )

  // Pronoun style değerini metin olarak göster
  const getPronounStyleText = (value: number) => {
    if (value > 0.7) return "Observer"
    if (value > 0.4) return "Mixed"
    return "Intimate"
  }

  // Detached tone değerini metin olarak göster
  const getDetachedToneText = (value: number) => {
    if (value > 0.6) return "High"
    if (value > 0.3) return "Medium"
    return "Low"
  }

  // Descriptiveness değerini metin olarak göster
  const getDescriptivenessText = (adjDensity: number, advDensity: number, metaphorDensity: number) => {
    const total = adjDensity + advDensity + metaphorDensity
    if (total > 0.2) return "High"
    if (total > 0.1) return "Medium"
    return "Low"
  }

  const NarrativeExpression = () => (
    <Card>
      <header className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Narrative Expression</h3>
        </div>
        <Lightbulb className="h-5 w-5 text-zinc-400" />
      </header>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Pronoun style</span>
          <span className="text-xl font-bold text-white">
            {getPronounStyleText(bookMetrics.third_person_pronoun_ratio)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Detached tone</span>
          <span className="text-xl font-bold text-white">{getDetachedToneText(bookMetrics.passive_voice_ratio)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-300">Descriptiveness</span>
          <span className="text-xl font-bold text-white">
            {getDescriptivenessText(
              bookMetrics.adjective_density,
              bookMetrics.adverb_density,
              bookMetrics.metaphor_simile_density,
            )}
          </span>
        </div>
      </div>
    </Card>
  )

  return (
    <section className="w-full px-4 lg:px-6">
      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 mb-6 text-amber-200">
        <p className="text-sm">
          <strong>Sample dashboard:</strong> These metrics are example data and do not come from an uploaded manuscript.
        </p>
      </div>

      <Card className="mb-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">{bookTitle}</h2>
          <p className="text-zinc-400">Analysis Results</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Readability Score"
            value={bookMetrics.flesch_kincaid_grade.toFixed(1)}
            icon={BookOpen}
            unit="grade"
          />
          <MetricCard
            title="Word Count"
            value={bookMetrics.total_word_count.toLocaleString()}
            icon={Activity}
            unit="words"
          />
          <MetricCard
            title="Avg. Chapter Length"
            value={Math.round(bookMetrics.avg_chapter_length).toLocaleString()}
            icon={BookOpenText}
            unit="words"
          />
          <MetricCard
            title="Estimated Reading Time"
            value={Math.round(bookMetrics.estimated_reading_time_hours)}
            icon={Clock}
            unit="hours"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <LineChartMock
          data={sentimentData}
          dataKey="avg_sentiment_score"
          title="Emotional Flow"
          description="Sentiment score by chapter"
        />
        <LineChartMock
          data={paceData}
          dataKey="pace_variance"
          title="Pacing Variation"
          description="Pace variance by chapter"
        />
        <LineChartMock
          data={tensionData}
          dataKey="peak_tension_score"
          title="Tension Arc"
          description="Tension score by chapter"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Timeline data={timelineData} />
        <SensoryPie data={sensoryData} />
        <IntensityDynamics />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LineChartMock
          data={actionData}
          dataKey="action"
          title="Action Score"
          description="Action score by chapter"
          variant="bar"
        />
        <NarrativeExpression />
        <LineChartMock
          data={curiosityData}
          dataKey="question_density"
          title="Curiosity Score"
          description="Question density by chapter"
          variant="bar"
        />
      </div>
    </section>
  )
}
