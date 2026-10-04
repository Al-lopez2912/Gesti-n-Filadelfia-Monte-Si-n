import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft
} from 'lucide-react';

interface VideoPlayerViewProps {
  song: Song;
  onClose: () => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({ song, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(240); // 4 minutes default
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  const hideTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gainNode?: GainNode } | null>(null);

  // Parse duration string (e.g., "4:18" -> 258)
  useEffect(() => {
    if (song.duration) {
      const parts = song.duration.split(':').map(Number);
      if (parts.length === 2) {
        setDuration(parts[0] * 60 + parts[1]);
      }
    }
  }, [song.duration]);

  // Handle controls auto-hide during Google Meet presentation
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    if (isPlaying) {
      hideTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Keyboard navigation: Space = Play/Pause, F = Fullscreen, Esc = handled by browser/onClose
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      } else if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Timer loop for video playback
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Audio tone generation for realistic presentation playback
  const startAudio = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Harmonic chords (church organ/warm pad chords: C major / G / Am / F)
      if (!synthNodesRef.current) {
        const ctx = audioContextRef.current;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(261.63, ctx.currentTime); // C4

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4

        const effectiveVol = isMuted ? 0 : volume * 0.08;
        gainNode.gain.setValueAtTime(effectiveVol, ctx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        synthNodesRef.current = { osc1, osc2, gainNode };
      } else if (synthNodesRef.current.gainNode) {
        const effectiveVol = isMuted ? 0 : volume * 0.08;
        synthNodesRef.current.gainNode.gain.setValueAtTime(effectiveVol, audioContextRef.current.currentTime);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const stopAudio = () => {
    if (synthNodesRef.current?.gainNode && audioContextRef.current) {
      synthNodesRef.current.gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [isPlaying, isMuted, volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      try {
        if (synthNodesRef.current?.osc1) synthNodesRef.current.osc1.stop();
        if (synthNodesRef.current?.osc2) synthNodesRef.current.osc2.stop();
        if (audioContextRef.current) audioContextRef.current.close();
      } catch {
        // cleanup
      }
    };
  }, []);

  // Canvas visual rendering for realistic 1080p church hymn video
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Deep dark cinematic background suitable for presentation
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient light particle or gradient
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.45,
        width * 0.55
      );
      grad.addColorStop(0, 'rgba(30, 41, 59, 0.45)');
      grad.addColorStop(1, 'rgba(9, 13, 22, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Display hymn lyrics depending on progress
      const progressPercent = duration > 0 ? currentTime / duration : 0;
      
      // Split song lyrics or representative stanzas
      const stanzas = [
        {
          start: 0,
          end: 0.25,
          line1: song.name,
          line2: '— Introducción instrumental —',
          sub: 'Culto de Adoración y Alabanza'
        },
        {
          start: 0.25,
          end: 0.5,
          line1: song.lyricsSnippet || 'Santo, Santo, digno es el Señor todopoderoso,',
          line2: 'la tierra llena está de su majestad y gloria eternal.',
          sub: 'Estrofa I'
        },
        {
          start: 0.5,
          end: 0.75,
          line1: 'Inmerecido amor que alcanzó mi corazón,',
          line2: 'toda mi vida rindo hoy ante tu santo altar.',
          sub: 'Coro Congregacional'
        },
        {
          start: 0.75,
          end: 1.0,
          line1: 'Amén y Amén, bendito sea el Nombre del Señor,',
          line2: 'desde ahora y para siempre, por los siglos de los siglos.',
          sub: 'Doxología Final'
        }
      ];

      const currentStanza = stanzas.find(s => progressPercent >= s.start && progressPercent <= s.end) || stanzas[0];

      // Draw subtle decorative line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.35, height * 0.35);
      ctx.lineTo(width * 0.65, height * 0.35);
      ctx.stroke();

      // Subtitle (small)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = '500 20px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentStanza.sub.toUpperCase(), width / 2, height * 0.40);

      // Primary Line (Large, clear for Google Meet viewers)
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 38px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentStanza.line1, width / 2, height * 0.48);

      // Secondary Line
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '400 30px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentStanza.line2, width / 2, height * 0.56);

      // Subtle musical waveform indication at bottom of video
      if (isPlaying) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const wavePoints = 40;
        const waveWidth = width * 0.4;
        const waveStartX = (width - waveWidth) / 2;
        const timeNow = Date.now() / 200;

        for (let i = 0; i <= wavePoints; i++) {
          const x = waveStartX + (i / wavePoints) * waveWidth;
          const y = height * 0.70 + Math.sin(i * 0.4 + timeNow) * (8 + Math.sin(timeNow * 0.5) * 4);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentTime, duration, isPlaying, song]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Return button: discreet, auto-hides so it doesn't disturb Google Meet screen sharing */}
      <div
        className={`absolute top-4 left-4 z-20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/60 hover:bg-black/90 text-white/80 hover:text-white text-xs backdrop-blur-sm border border-white/10 transition-colors"
          title="Volver a la biblioteca"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la biblioteca</span>
        </button>
      </div>

      {/* Main Video Viewport (Occupy almost entire viewport) */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full max-h-screen object-contain"
          onClick={() => setIsPlaying(prev => !prev)}
        />
      </div>

      {/* Standard Playback Controls Bar: Play/Pause, Volume, Timeline, Fullscreen */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-mono tabular-nums text-slate-300 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
            />
            <span className="text-[12px] font-mono tabular-nums text-slate-400 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={() => setIsPlaying(prev => !prev)}
                className="p-2 text-white hover:text-blue-400 transition-colors rounded-full hover:bg-white/10"
                title={isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Volume & Mute */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(prev => !prev)}
                  className="p-2 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Activar sonido (M)' : 'Silenciar (M)'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={e => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                  title="Volumen"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Fullscreen control */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 text-slate-300 hover:text-white transition-colors rounded-md hover:bg-white/10"
                title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
