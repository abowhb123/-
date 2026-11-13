import React from 'react';
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';

export type Cue = { at: number; sfx: 'whoosh' | 'pop' | 'pop-high' | 'ding'; volume?: number };

/**
 * موسيقى خلفية + مؤثرات على توقيتات محددة (بالثواني).
 * music: مسار داخل public/، مثلاً 'audio/music.wav' (أو ملف mp3 من عندك).
 */
export const SoundTrack: React.FC<{ music?: string | null; musicVolume?: number; cues: Cue[] }> = ({
  music = 'audio/music.wav',
  musicVolume = 0.55,
  cues,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      {music && (
        <Audio
          src={staticFile(music)}
          // دخول تدريجي بالبداية وخروج تدريجي بآخر ثانية
          volume={(f) =>
            interpolate(f, [0, fps * 0.8, durationInFrames - fps, durationInFrames], [0, musicVolume, musicVolume, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={fps * 2} layout="none">
          <Audio src={staticFile(`audio/${c.sfx}.wav`)} volume={c.volume ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
};
