'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Loader2, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  transcript: string
  onTranscriptChange: (text: string) => void
  onExtractSymptoms: (text: string) => void
  isExtracting: boolean
}

export function VoiceInputPanel({ transcript, onTranscriptChange, onExtractSymptoms, isExtracting }: Props) {
  const [isListening, setIsListening] = useState(false)
  const [liveText, setLiveText] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  function startListening() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      toast.error('Voice input not supported in this browser. Please use Chrome.')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' '
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (finalTranscript) {
        onTranscriptChange(transcript + finalTranscript)
      }
      setLiveText(interimTranscript)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setLiveText('')
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setIsListening(false)
    setLiveText('')
  }

  return (
    <Card className={cn(isListening ? 'ring-2 ring-red-400 border-red-200' : '')}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className={cn('h-4 w-4', isListening ? 'text-red-500' : 'text-slate-500')} />
          <CardTitle className="text-sm font-semibold text-slate-700">Voice Input</CardTitle>
        </div>
        {isListening && (
          <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">
            ● Recording...
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        {/* Controls */}
        <div className="flex gap-2">
          {!isListening ? (
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white h-8 text-xs"
              onClick={startListening}
            >
              <Mic className="h-3.5 w-3.5 mr-1.5" />
              Start Recording
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 h-8 text-xs"
              onClick={stopListening}
            >
              <MicOff className="h-3.5 w-3.5 mr-1.5" />
              Stop Recording
            </Button>
          )}
        </div>

        {/* Live interim text */}
        {liveText && (
          <p className="text-xs text-slate-400 italic animate-pulse px-1">
            {liveText}
          </p>
        )}

        {/* Transcript area */}
        <Textarea
          placeholder="Doctor/patient conversation will appear here...
You can also type directly."
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          className="text-sm min-h-[100px] resize-none bg-slate-50"
        />

        {/* Extract button */}
        <Button
          size="sm"
          className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
          onClick={() => onExtractSymptoms(transcript)}
          disabled={!transcript.trim() || isExtracting}
        >
          {isExtracting ? (
            <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Extracting Symptoms...</>
          ) : (
            <><Wand2 className="h-3.5 w-3.5 mr-1.5" /> Extract Symptoms with AI</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
