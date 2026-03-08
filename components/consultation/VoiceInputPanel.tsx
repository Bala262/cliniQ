'use client'

import { useState, useRef } from 'react'
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
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        await sendToWhisper()
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsListening(true)
    } catch {
      toast.error('Microphone access denied. Please allow microphone permission.')
    }
  }

  function stopListening() {
    mediaRecorderRef.current?.stop()
    setIsListening(false)
  }

  async function sendToWhisper() {
    if (audioChunksRef.current.length === 0) return

    setIsTranscribing(true)
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/ai/transcribe-audio', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription request failed')
      }

      const data = await response.json()
      const newText = data.transcript?.trim()

      if (newText) {
        onTranscriptChange(transcript ? `${transcript} ${newText}` : newText)
      } else {
        toast.error('No speech detected. Please try again.')
      }
    } catch (error) {
      console.error('Whisper transcription error:', error)
      toast.error('Transcription failed. Please try again.')
    } finally {
      setIsTranscribing(false)
      audioChunksRef.current = []
    }
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
        {isTranscribing && (
          <Badge className="bg-amber-100 text-amber-600 text-xs animate-pulse">
            <Loader2 className="h-3 w-3 mr-1 animate-spin inline" />
            Transcribing...
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
              disabled={isTranscribing}
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
