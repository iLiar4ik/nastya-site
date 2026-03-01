'use client'

import { Track } from 'livekit-client'
import {
  ControlBar,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react'

/**
 * Два окна видеозвонка на доске (внизу слева):
 * - Каждый участник в отдельном окне; только иконки камеры и микрофона.
 */
export function LessonVideoConference() {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  )
  const [first, second] = [tracks[0], tracks[1]]

  return (
    <>
      <RoomAudioRenderer />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          {/* Первое окно участника */}
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xl w-[200px] h-[150px] min-w-[200px] min-h-[150px]">
            {first ? (
              <ParticipantTile trackRef={first} className="!h-full !rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/30 text-xs text-muted-foreground">
                Участник 1
              </div>
            )}
          </div>
          {/* Второе окно участника */}
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xl w-[200px] h-[150px] min-w-[200px] min-h-[150px]">
            {second ? (
              <ParticipantTile trackRef={second} className="!h-full !rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/30 text-xs text-muted-foreground">
                Участник 2
              </div>
            )}
          </div>
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
          className="!p-1"
        />
      </div>
    </>
  )
}

