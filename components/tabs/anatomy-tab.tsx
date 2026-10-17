"use client"

import { ChartViewer } from "@/components/chart-viewer"
import { PodcastPlayer } from "@/components/podcast-player"
import { TableOfContents } from "@/components/table-of-contents"
import { useEffect, useState, useMemo } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { fetchChartData } from "@/lib/chart-data"
import { Clock } from "lucide-react"

// Define chart data type for better type safety
interface ChartData {
  data: any[]
  layout: any
}

export function AnatomyTab() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<Record<string, ChartData | null>>({})

  // Calculate estimated reading time
  const estimatedReadingTime = useMemo(() => {
    // Average adult reading speed is about 250 words per minute
    // This article has approximately 4500 words (estimated)
    const wordCount = 4500
    const wordsPerMinute = 250
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }, [])

  // Define sections for the table of contents
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "key-takeaways", title: "Key Takeaways" },
    { id: "open-door", title: "The Open Door" },
    { id: "cast-canvas", title: "The Cast and the Canvas" },
    { id: "spine-story", title: "The Spine of the Story" },
    { id: "flow-fiction", title: "The Flow of Fiction" },
    { id: "emotion-layer", title: "The Emotion Layer" },
    { id: "turning-point", title: "The Turning Point" },
    { id: "texture-language", title: "The Texture of Language" },
    { id: "dominance-sight", title: "The Dominance of Sight" },
    { id: "attention-recipe", title: "The Attention Recipe" },
    { id: "disclaimer", title: "Disclaimer" },
  ]

  // Define all chart names
  const chartNames = [
    // Basic readability charts
    "readability_flesch_kincaid_chart",
    "readability_quadrant_chart",
    "readability_average_reading_time_by_genre",

    // Character-related charts
    "character_related_features",
    "character_pronoun_style_by_genre",
    "character_chapter_count_by_focus",
    "character_rating_count_by_focus",
    "character_mood_distribution_by_narrative_focus",

    // Structure and engagement charts
    "structure_approval_engagement",
    "temporal_reader_engagement_by_quadrant",
    "temporal_storytelling_rhythm_approval_engagement",

    // Emotional tone charts
    "emotional_tone_by_genre",
    "emotional_tone_by_narrative_focus",
    "emotional_genre_based_mood_signatures",
    "tension_load_by_narrative_focus",

    // Timing and structure charts
    "timing_narrative_structure_timeline",
    "timing_climax_momentum_by_genre",
    "timing_climax_momentum_by_narrative_focus",

    // Style and sensory charts
    "style_detached_tone_reader_approval_engagement",
    "style_descriptive_language_by_genre",
    "sensory_dominant_sensation_breakdown_by_narrative_focus",

    // Feature importance charts
    "feature_importance_rating_score",
    "feature_importance_rating_count",
  ]

  useEffect(() => {
    // Load bundled chart data from the site's public directory
    const loadChartData = async () => {
      try {
        setIsLoading(true)
        console.log("Starting to load chart data...")

        // Create an object to store all chart data
        const chartDataObj: Record<string, ChartData | null> = {}

        // Load each chart individually to prevent one failure from affecting others
        for (const chartName of chartNames) {
          try {
            console.log(`Loading chart: ${chartName}`)
            const data = await fetchChartData(chartName)
            chartDataObj[chartName] = data
            console.log(`Successfully loaded chart: ${chartName}`)
          } catch (err) {
            console.error(`Failed to load chart ${chartName}:`, err)
            chartDataObj[chartName] = null
          }
        }

        // Update state with all chart data
        setChartData(chartDataObj)
        setIsLoading(false)
        console.log("Finished loading all charts")
      } catch (error) {
        console.error("Error in chart loading process:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        setIsLoading(false)
      }
    }

    loadChartData()
  }, [])

  // Helper function to render chart with loading and error states
  const renderChart = (chartName: string, height: number = isMobile ? 350 : 450) => {
    if (isLoading) {
      return (
        <div className="bg-zinc-800 p-4 rounded-lg h-[300px] flex items-center justify-center mb-6">
          <p className="text-zinc-400">Loading chart data...</p>
        </div>
      )
    } else if (error) {
      return (
        <div className="bg-zinc-800 p-4 rounded-lg h-[300px] flex items-center justify-center mb-6">
          <p className="text-zinc-400">Error: {error}</p>
        </div>
      )
    } else if (chartData[chartName]) {
      return (
        <div className="mb-6">
          <ChartViewer chartData={chartData[chartName]} height={height} />
        </div>
      )
    } else {
      return (
        <div className="bg-zinc-800 p-4 rounded-lg h-[300px] flex items-center justify-center mb-6">
          <p className="text-zinc-400">Chart data not available for {chartName}</p>
        </div>
      )
    }
  }

  // Helper function to make the last sentence of a paragraph bold
  const makeBoldLastSentence = (text: string) => {
    // Split by sentences (looking for period followed by space)
    const sentences = text.split(/(?<=\. )/)

    if (sentences.length <= 1) {
      return text
    }

    const lastSentence = sentences.pop()
    const restOfText = sentences.join("")

    return (
      <>
        {restOfText}
        <strong>{lastSentence}</strong>
      </>
    )
  }

  return (
    <div className="relative">
      {/* Table of Contents */}
      <TableOfContents sections={sections} />

      {/* Main Content */}
      <div className="pt-4">
        <h1
          id="introduction"
          className={`${isMobile ? "text-2xl" : "text-3xl md:text-4xl"} font-bold mb-2 text-white leading-tight scroll-mt-32`}
        >
          The Bestseller's Blueprint: Unveiling the Secrets Behind Today's Most Captivating Stories
        </h1>

        {/* Estimated Reading Time */}
        <div className="flex items-center mb-6 text-zinc-400">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">Estimated reading time: {estimatedReadingTime} minutes</span>
        </div>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-white mb-6`}>
          {makeBoldLastSentence(
            'What truly makes a book a bestseller? This project is designed to peel back the layers of 2024\'s most talked-about fiction, venturing beyond simple plot summaries. A unique analytical framework has been developed, enabling the examination of everything from the subtle dance of narrative tension and the rhythm of emotional journeys to the very structure of sentences and the sensory worlds painted by authors. Through a combination of deep textual analysis and real reader perceptions from StoryGraph, a quest is undertaken to decode the "DNA" of bestselling narratives. This exploration focuses on data-driven patterns and artistic choices that appear to transform a good story into an unforgettable, chart-topping experience.',
          )}
        </p>

        {/* Podcast Player */}
        <PodcastPlayer
          spotifyUrl="https://open.spotify.com/episode/0VUkAMSWPEDEjaGNjG1vGC?si=a9h0mEtVRCWiQ4LnLdf8TA"
          className="my-8"
        />

        {/* Key Takeaways Section with Bullet Points - Moved up */}
        <h2
          id="key-takeaways"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          Key Takeaways
        </h2>

        <ul className="list-disc pl-6 space-y-6 mb-6">
          <li className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300`}>
            <span className="font-bold">Strategic Simplicity Drives Engagement:</span> Bestselling fiction leans heavily
            into clarity. Most of these books are written at a 5th grade readability level, often combining ease of
            comprehension with brevity or maintaining moderate complexity while staying structurally concise. This
            reflects a deliberate reduction of cognitive load-making it easier for readers to stay emotionally connected
            without feeling overwhelmed. Simplicity, in this context, is a strategic choice rather than a limitation.
          </li>

          <li className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300`}>
            <span className="font-bold">Emotional Depth Emerges Through Character:</span> Stories built around
            multidimensional characters-those with psychological nuance, visible flaws, and emotional
            weight-consistently earn stronger reader engagement. While plot sustains momentum, it's the internal
            architecture of character that drives resonance. What stays with readers isn't just what happens, but how
            deeply they care about who it happens to.
          </li>

          <li className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300`}>
            <span className="font-bold">Precision and Tension Leave a Stronger Mark Than Volume:</span> The most
            impactful stories are not necessarily the busiest ones, but those that pair measured pacing with meaningful
            turns. When tension is delivered with control, its effect lasts longer. A noticeable lean toward darker
            emotional tones suggests that readers aren't looking for comfort-they're drawn to stories that challenge,
            unsettle, and ultimately reward them with something memorable.
          </li>
        </ul>

        {/* Cover Image */}
        <div className="mb-6">
          <img
            src="/images/cover.jpeg"
            alt="The Bestseller's Blueprint"
            className="w-full rounded-lg"
          />
        </div>

        <h2
          id="open-door"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Open Door: How Bestsellers Make Complex Stories Approachable
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Captivating stories often begin by ensuring their complex narratives are made approachable.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Most bestselling books are written at a readability level between 4th and 5th grade, indicating that clear, accessible language is a defining trait of commercial literary success. This suggests that authors aiming for mass appeal tend to favor simplicity over complexity, making their narratives more digestible for a wider audience. The relatively narrow spread also implies a strategic alignment with the cognitive comfort zone of the general readership, where comprehension flows effortlessly without compromising narrative depth.",
          )}
        </p>

        {/* Readability Flesch Kincaid Chart */}
        {renderChart("readability_flesch_kincaid_chart", isMobile ? 300 : 400)}

        {/* Second paragraph */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "The chart shows a clear trend: bestselling books overwhelmingly favor shorter texts written in simpler language. Two dominant clusters stand out - stories that are both easy to read and brief, and those that maintain moderate ease while still being concise. This pattern reveals something deeper than stylistic preference - it reflects an intentional calibration of cognitive effort. Authors and publishers seem to recognize that today's readers value clarity and pace; they want to engage emotionally without wading through dense or overly elaborate prose. In a saturated market, it's the stories that respect the reader's attention span - without sacrificing substance - that rise to the top.",
          )}
        </p>

        {/* Readability Quadrant Chart */}
        {renderChart("readability_quadrant_chart", isMobile ? 350 : 450)}

        {/* Third paragraph */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Genres like Fantasy and Romance require significantly more reading time than the overall average of 9.5h, indicating their tendency toward longer or denser narratives. In contrast, Drama, Mystery, and Thriller fall well below the average, suggesting relatively shorter or more accessible content.",
          )}
        </p>

        {/* Reading Time By Genre Chart */}
        {renderChart("readability_average_reading_time_by_genre", isMobile ? 350 : 450)}

        {/* Fourth section - Character and Narrative */}
        <h2
          id="cast-canvas"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Cast and the Canvas: How Bestsellers Populate Rich Worlds with Resonant Characters
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Once approachability is established, attention shifts to the resonant characters and rich worlds presented.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "A pronounced tendency has been observed among recent bestselling novels to foreground key characterological dimensions such as strong character development, affective appeal, diversity within the cast, and the explicit narrative integration of character flaws. The prevalence of affirmative responses across all these axes suggests a market-driven prioritization of multidimensional, relatable, and psychologically complex protagonists. Ambiguity or absence of these features is notably rare, indicating a clear alignment between commercial literary success and the systematic incorporation of deep character work. These findings underscore the extent to which contemporary fiction is structured around inclusivity and emotional resonance, with robust character construction serving as a critical vector for reader engagement and broader market viability.",
          )}
        </p>

        {/* Character Related Features Chart */}
        {renderChart("character_related_features", isMobile ? 350 : 450)}

        {/* Fourth paragraph */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            'Narrative perspective choices in bestselling fiction suggest a strategic balance between intimacy and breadth. The dominance of "External Observer" and "Mixed Voice" styles points to a tendency among popular authors to maintain a certain emotional distance while offering selective interiority when needed. This hybrid approach may serve dual purposes: preserving narrative momentum while still enabling character-driven resonance. The lower prevalence of "Omniscient Narrator" implies a shift away from all-knowing perspectives toward more grounded, humanized storytelling. In essence, bestselling narratives appear to favor a controlled proximity - close enough for empathy, distant enough for scale.',
          )}
        </p>

        {/* Pronoun Style By Genre Chart */}
        {renderChart("character_pronoun_style_by_genre", isMobile ? 350 : 450)}

        {/* Fifth paragraph - Chapter Count by Narrative Focus */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Books with a plot driven narrative focus tend to have significantly more chapters on average than those with character driven or mixed structures. This suggests that plot-oriented stories may rely on frequent structural breaks - such as cliffhangers or pacing pivots - to sustain momentum and keep readers engaged. In contrast, character-focused narratives might favor longer, more immersive chapters to allow deeper psychological or emotional development within each section.",
          )}
        </p>

        {/* Chapter Count By Focus Chart */}
        {renderChart("character_chapter_count_by_focus", isMobile ? 350 : 450)}

        {/* Sixth paragraph - Rating Count by Narrative Focus */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Character-driven novels generate substantially higher reader engagement - measured by median rating counts - than mixed or plot-driven narratives. This pattern implies that when a story leans into the inner lives and relationships of its characters, readers feel more compelled to respond and discuss, whereas purely plot-focused works may maintain momentum but sacrifice the deeper personal connection that drives ongoing interaction. In fact, among bestsellers, no books are perceived by readers as slow-paced; over 80% fall into the medium pace category. This underscores a critical balance: while pacing sustains attention, it's the emotional depth, especially through strong character development and the presence of distinctly loveable personalities, that cultivates reader loyalty and repeat engagement. In the attention economy, momentum may open the door, but it's emotional anchoring that makes readers stay.",
          )}
        </p>

        {/* Rating Count By Focus Chart */}
        {renderChart("character_rating_count_by_focus", isMobile ? 350 : 450)}

        {/* Seventh paragraph - Mood Distribution by Narrative Focus */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "This mood segmentation reveals a clear psychological divergence in how readers experience different narrative structures. Character-driven stories evoke strong emotional and hopeful responses, suggesting readers engage empathetically and seek inner transformation. Mixed narratives strike a balance between affect and action, indicating versatility in appealing to varied reader preferences. Plot-driven stories, on the other hand, register minimal emotional depth, emphasizing external tension and adventure. This skew toward surface-level intensity may explain their broader commercial utility but potentially lower long-term resonance. These patterns underscore how narrative focus doesn't just guide storytelling - it actively shapes emotional investment and reader satisfaction.",
          )}
        </p>

        {/* Mood Distribution By Narrative Focus Chart */}
        {renderChart("character_mood_distribution_by_narrative_focus", isMobile ? 400 : 500)}

        {/* The Spine of the Story Section */}
        <h2
          id="spine-story"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Spine of the Story: How Narrative Structure Shapes Reader Engagement
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Populating worlds with resonant characters necessitates a narrative structure to effectively shape reader engagement.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Fragmented narrative structures - stories that break away from strict chronological order and follow a less predictable, non-linear flow - performed significantly better in reader approval and engagement than their linear counterparts. Among them, fragmented stories told through a single, consistent point of view stood out as the most favored. This indicates that readers respond most positively when narrative unpredictability is combined with emotional stability. While linear and single-perspective formats remain the most commonly used, their lower ratings suggest that familiarity in form does not guarantee satisfaction. The data points to a core reader preference: keep the voice steady so I can stay connected, but let the structure surprise me so I don't get bored.",
          )}
        </p>

        {/* Structure Approval Engagement Chart */}
        {renderChart("structure_approval_engagement", 450)}

        {/* The Flow of Fiction Section */}
        <h2
          id="flow-fiction"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Flow of Fiction: How Structural Tempo Patterns Define Story Identity
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Narrative structure shaping engagement often utilizes distinct structural tempo patterns defining overall story identity.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Reader engagement does not scale linearly with narrative intensity or volume, it scales with narrative precision. Stories that deliver dramatic developments through controlled, measured pacing (low motion, high action) achieve the highest engagement per book and per word, indicating that readers respond more to structural focus than surface activity. In contrast, narratives lacking both momentum and consequential events (low motion, low action) yield the lowest return on attention, even when extended in length. This reveals a core principle of narrative efficiency: tension - not turbulence - sustains interest. While high-motion formats tend to generate broader reach through volume and visibility, it is the strategic timing and clarity of narrative impact that most effectively drive reader response.",
          )}
        </p>

        {/* Temporal Reader Engagement Chart */}
        {renderChart("temporal_reader_engagement_by_quadrant", isMobile ? 350 : 450)}

        {/* New paragraph about narrative rhythm */}
        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Narrative rhythm subtly governs how stories are absorbed and remembered. While chaotic rhythms achieve the highest reader approval, their reach remains limited, suggesting they appeal deeply but to fewer. In contrast, moderate rhythms balance structure and spontaneity, yielding both wide engagement and high approval. Stable rhythms, though consistent, fall short in sparking lasting reader interaction. This pattern reveals that readers don't just favor excitement or clarity, they respond to rhythm that feels intentional yet alive. The most resonant storytelling strikes a deliberate tempo that mimics emotional cadence, not mechanical repetition.",
          )}
        </p>

        {/* Storytelling Rhythm Chart */}
        {renderChart("temporal_storytelling_rhythm_approval_engagement", isMobile ? 350 : 450)}

        {/* The Emotion Layer Section */}
        <h2
          id="emotion-layer"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Emotion Layer: How Fiction's Structure Crafts Mood Beyond Words
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Story identity defined by structural tempo allows fiction's deeper structure subsequently to craft an emotional mood.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Emotional tone varies not just by genre but by the way stories are told. Sentiment is shaped less by the subject matter itself and more by how that subject is framed through language. Genres like Thriller, Mystery, and Crime Fiction show high levels of negative emotional tone, which makes sense - they rely on fear, conflict, and uncertainty to build tension. Drama, despite dealing with heavy topics, comes out as positively mild. That's because drama often tells stories of pain that eventually lead to healing, connection, or personal growth. So while the emotions are deep, the language used tends to carry a hopeful or compassionate tone. This positive framing, rather than the content alone, influences the overall emotional signal. In short, emotional tone does not depend solely on what is felt, but on how that feeling is communicated.",
          )}
        </p>

        {/* Emotional Tone By Genre Chart */}
        {renderChart("emotional_tone_by_genre", isMobile ? 350 : 450)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Character-driven narratives exhibit a quieter form of emotional complexity rooted in personal struggles, inner growth, and relational nuance resulting in a mildly negative tone. Rather than shocking the reader, these stories invite reflection, resilience, and subtle hope. Plot-driven fiction, by contrast, registers the most intensely negative tone, driven by high-stakes action, external tension, and narrative urgency. Mixed narratives hover in between, marked by suspense and unpredictability without the emotional saturation of character-focused arcs. While plot-driven stories display sharper emotional edges, the broader trend across bestselling fiction is a tilt toward overall negativity suggesting that commercial storytelling thrives not on optimism, but on tension. Readers may not seek comfort, but instead emotional friction that feels meaningful, memorable, and narratively earned.",
          )}
        </p>

        {/* Emotional Tone By Narrative Focus Chart */}
        {renderChart("emotional_tone_by_narrative_focus", isMobile ? 350 : 450)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Based on how readers describe their emotional experience on StoryGraph, the emotional landscape of bestselling fiction reveals a clear preference for psychological tension over comfort. Moods like mysterious, tense, and adventurous dominate reader responses, signaling that ambiguity, risk, and forward thrust are perceived as defining features of today's most engaging stories. Meanwhile, traditionally uplifting tones - hopeful, lighthearted, inspiring - trail far behind, suggesting that emotional satisfaction is not synonymous with emotional ease. Readers seem to seek out stories that stimulate and unsettle - ones that create just enough friction to stay immersive, but never predictable. In this landscape, clarity soothes, but tension sticks.",
          )}
        </p>

        {/* Genre Based Mood Signatures Chart */}
        {renderChart("emotional_genre_based_mood_signatures", isMobile ? 400 : 500)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Plot-driven stories tend to carry the highest emotional tension load, often delivering more intense and frequent emotional shocks than other narrative styles. Mixed narratives strike a middle ground, balancing dramatic moments with character development, while character-driven stories maintain the lightest load, favoring emotional depth and gradual transformation over sudden disruption. This pattern suggests that the more a story leans on plot mechanics, the more likely it is to generate emotionally charged moments that hit fast and hard.",
          )}
        </p>

        {/* Tension Load By Narrative Focus Chart */}
        {renderChart("tension_load_by_narrative_focus", isMobile ? 350 : 450)}

        {/* The Turning Point Section */}
        <h2
          id="turning-point"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Turning Point: How Fiction Times and Tunes Its Story Arcs
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Emotional mood crafted by structure provides crucial context for fiction strategically timing and tuning its story arcs.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Structure in bestselling fiction isn't arbitrary, it's instinctive. Regardless of genre, stories tend to pivot around the same internal architecture: the hero steps irreversibly into the narrative around 20%, the world reshapes at 50%, and the final act ignites at 75%. These aren't just aesthetic choices - they mirror how readers process tension, consequence, and momentum. The timing of transformation, not just its content, is what anchors attention. What emerges is a universal blueprint beneath diverse stories: a hidden rhythm that tells us when change feels right.",
          )}
        </p>

        {/* Narrative Structure Timeline Chart */}
        {renderChart("timing_narrative_structure_timeline", isMobile ? 350 : 450)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Bestseller stories tend to follow a shared structural logic in their final act delivering either a sharp rise in emotional intensity or a more tempered ascent with genres like Mystery and Thriller frequently building toward high-stakes climactic payoffs, while others such as Drama, Romance, and Fantasy lean into a softer trajectory where tension rises modestly to support emotional closure, and Literary Fiction standing apart by exhibiting a consistent downward shift in emotional momentum, as these stories often center on internal reconciliation rather than external resolution, offering readers space to process themes, absorb transformation, and reflect through endings that are quiet, melancholic, and emotionally unspooled rather than explosively resolved.",
          )}
        </p>

        {/* Climax Momentum By Genre Chart */}
        {renderChart("timing_climax_momentum_by_genre", isMobile ? 350 : 450)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Climactic structure appears to shift meaningfully based on how readers perceive a story's narrative focus. Plot-driven stories tend to culminate in sharp emotional escalation. In contrast, stories perceived as character-driven frequently resolve with a downward shift in tension, favoring introspective closure over explosive payoff. Mixed-focus narratives split the difference, balancing both trajectories. This pattern suggests that the emotional shape of a story's ending is not just a function of genre, but a reflection of the kind of transformation the narrative chooses to foreground.",
          )}
        </p>

        {/* Climax Momentum By Narrative Focus Chart */}
        {renderChart("timing_climax_momentum_by_narrative_focus", isMobile ? 350 : 450)}

        {/* The Texture of Language Section */}
        <h2
          id="texture-language"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Texture of Language: Uncovering the Stylistic Pulse of Fiction
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Effectively timed and tuned story arcs are then conveyed through language's distinct texture, uncovering fiction's stylistic pulse.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Across bestselling fiction, passive voice appears not as a flaw but as a calibrated tool used sparingly to create narrative distance, formality, or ambiguity. With an average usage rate of 6.77%, these stories sit comfortably within the optimal detachment zone, balancing stylistic control with reader connection. Research in cognitive linguistics suggests that excessive passivity impairs readability and slows comprehension, while too little may render prose overly direct or lacking nuance. This balance becomes visible in reader behavior: books with high detached tone -where passive voice exceeds 9%- maintain approval but see a marked drop in engagement, suggesting that excessive narrative distance can dampen emotional investment, while moderate detachment preserves both clarity and connection.",
          )}
        </p>

        {/* Detached Tone Reader Approval Chart */}
        {renderChart("style_detached_tone_reader_approval_engagement", isMobile ? 350 : 450)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Genres shape their use of descriptive language to fit the mood and pace their readers expect. Literary Fiction embraces rich and vivid descriptions to deepen emotional impact and explore complex ideas, allowing readers to fully immerse themselves in the subtleties of character and setting. In contrast, Thriller and Mystery prioritize brevity in description, keeping the story fast-paced and tense to maintain a high level of suspense and urgency. This deliberate contrast highlights how authors masterfully adjust their language to create distinct reading experiences. By tailoring narrative style to the unique demands of their genre, writers evoke specific emotional and psychological responses, guiding readers through carefully constructed journeys that maximize engagement and satisfaction. Ultimately, the nuanced deployment of descriptive language becomes a powerful tool, one that balances artistry with storytelling strategy to craft bestsellers that resonate deeply with their audiences.",
          )}
        </p>

        {/* Descriptive Language By Genre Chart */}
        {renderChart("style_descriptive_language_by_genre", isMobile ? 350 : 450)}

        {/* The Dominance of Sight Section */}
        <h2
          id="dominance-sight"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Dominance of Sight: When Vision Becomes the Narrative Backbone
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Linguistic texture revealing fiction's stylistic pulse frequently highlights vision becoming a narrative backbone.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Character-driven and mixed narratives distribute sensory cues more evenly across modalities, integrating visual, auditory, and tactile elements to build a richer, multi-sensory atmosphere. However, plot-driven stories display an overwhelming reliance on visual cues - nearly 89% - of them are visually dominant, with no books led by sound or touch. This striking skew suggests that in fast-paced, event-centric storytelling, authors often lean on visual descriptions to maintain clarity and momentum, potentially at the cost of sensory diversity. The absence of olfactory and gustatory dominance across all categories further reveals a broader literary pattern: while these senses may be present, they rarely define a story's sensory identity.",
          )}
        </p>

        {/* Sensory Breakdown Chart */}
        {renderChart("sensory_dominant_sensation_breakdown_by_narrative_focus", isMobile ? 400 : 500)}

        {/* The Attention Recipe Section */}
        <h2
          id="attention-recipe"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          The Attention Recipe: Top Features Behind Reader Engagement
        </h2>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-4 italic`}>
          {makeBoldLastSentence(
            "Vision forming a narrative backbone, alongside all preceding crucial elements, ultimately allows for distilling top features behind genuine reader engagement.",
          )}
        </p>

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Stories that immerse readers in emotional depth and track genuine character growth consistently earn the highest praise. When narratives invite readers to empathize with complex, evolving protagonists, satisfaction and engagement naturally follow. In contrast, books that demand heightened mental effort - through intricate timelines or challenging structures - can create distance, making it harder for readers to fully invest in the story. Excessive urgency, while effective for driving plot, may overwhelm rather than captivate, especially if it comes at the expense of emotional connection. Ultimately, it is the balance of clarity, relatability, and emotional resonance -not complexity for its own sake- that transforms a book into a reader favorite.",
          )}
        </p>

        {/* Feature Importance Rating Score Chart */}
        {renderChart("feature_importance_rating_score", isMobile ? 350 : 450)}

        <p className={`${isMobile ? "text-base" : "text-lg"} text-zinc-300 mb-6`}>
          {makeBoldLastSentence(
            "Books that draw the most interaction are rarely defined by a single, tightly focused theme. Stories that build momentum toward a compelling climax, invite readers into an atmosphere of adventure, and center around protagonists with relatable flaws tend to generate the richest participation. These elements encourage curiosity and emotional investment, turning readers into active contributors rather than passive observers. In contrast, narratives with a narrowly concentrated theme or an overwhelmingly positive emotional tone often see less engagement, suggesting that a certain level of thematic openness and emotional complexity is essential for sparking genuine community response.",
          )}
        </p>

        {/* Feature Importance Rating Count Chart */}
        {renderChart("feature_importance_rating_count", isMobile ? 350 : 450)}

        {/* Disclaimer Section */}
        <h2
          id="disclaimer"
          className={`${isMobile ? "text-xl" : "text-xl md:text-2xl"} font-semibold mt-10 mb-4 text-white scroll-mt-32`}
        >
          Disclaimer
        </h2>

        <div className="italic text-zinc-400 mb-8">
          <p className="mb-4">
            This dataset is based on textual analysis of 80 fiction books selected from the 2024 New York Times
            Bestselling Fiction list. Only titles with a structurally consistent format were included, and both
            chapter-level and paragraph-level metrics were extracted.
          </p>
          <p className="mb-4">
            The dataset covers a wide range of genres, including: Drama, Romance, Magical Realism, Fantasy, Young Adult,
            Historical Fiction, Thriller, Literary Fiction, Mystery, and Crime Fiction.
          </p>
          <p className="mb-4">
            However, the genre distribution is not fully proportional to the overall bestseller list. On average,
            certain genres are underrepresented by ~5%. For example, Fiction and Thriller appear 7% more frequently in
            the sample, while Romance is underrepresented by ~3%. These imbalances should be kept in mind when
            interpreting genre-based insights.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mb-4">
            <a
              href="https://www.linkedin.com/in/ytu-iremkurt/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-zinc-400 hover:text-[#8b5cf6] transition-colors text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/violettance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-zinc-400 hover:text-[#8b5cf6] transition-colors text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
          </div>

          <p className="mb-4">
            Coming Soon: Bestseller Prediction
            <br />
            This module will estimate a book's commercial potential based on linguistic and narrative patterns.
          </p>
          <p className="mb-4">Key citations for this upcoming feature:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              The Bestseller Code Tells Us What We Already Know – New Yorker
              <br />
              <a
                href="https://www.newyorker.com/books/page-turner/the-bestseller-code-tells-us-what-we-already-know"
                className="text-[#8b5cf6] hover:underline"
              >
                https://www.newyorker.com/books/page-turner/the-bestseller-code-tells-us-what-we-already-know
              </a>
            </li>
            <li>
              Bestseller-ometer Algorithm Predicting Bestsellers – The Atlantic
              <br />
              <a
                href="https://www.theatlantic.com/technology/archive/2016/09/bestseller-ometer/499256/"
                className="text-[#8b5cf6] hover:underline"
              >
                https://www.theatlantic.com/technology/archive/2016/09/bestseller-ometer/499256/
              </a>
            </li>
            <li>
              NLP Picks Bestsellers: Feature Extraction – DataScienceCentral
              <br />
              <a
                href="https://www.datasciencecentral.com/nlp-picks-bestsellers-a-lesson-in-using-nlp-for-hidden-feature-ex/"
                className="text-[#8b5cf6] hover:underline"
              >
                https://www.datasciencecentral.com/nlp-picks-bestsellers-a-lesson-in-using-nlp-for-hidden-feature-ex/
              </a>
            </li>
            <li>
              NYT Bestseller Prediction Using NLP Model – Devpost
              <br />
              <a
                href="https://devpost.com/software/prediction-of-the-best-seller-book-using-an-nlp-model"
                className="text-[#8b5cf6] hover:underline"
              >
                https://devpost.com/software/prediction-of-the-best-seller-book-using-an-nlp-model
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
