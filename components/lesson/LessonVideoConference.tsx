'use client'

import { Track } from 'livekit-client'
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react'

/**
 * Минимальный UI видеозвонка урока:
 * - Только иконки вкл/выкл камеры и микрофона (без чата, шаринга, выхода, настроек).
 * - Режим «два окна»: каждый участник доски в своей плитке (сетка по камерам, с плейсхолдером если камеры нет).
 */
export function LessonVideoConference() {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  )

  return (
    <>
      <RoomAudioRenderer />
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col">
          <GridLayout tracks={tracks} className="flex-1 min-h-0">
            <ParticipantTile />
          </GridLayout>
        </div>
        <ControlBar
          variation="minimal"
          controls={{
            microphone: true,
            camera: true,
            chat: false,
            screenShare: false,
            leave: false,
            settings: false,
          }}
        />
      </div>
    </>
  )
}

