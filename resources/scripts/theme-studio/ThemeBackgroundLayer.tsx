import React, { useEffect, useRef, useState } from 'react';
import { ThemeConfig } from '@/theme-studio/config';

interface Particle {
    id: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    drift: number;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

const buildParticles = (count: number): Particle[] =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        left: random(0, 100),
        size: random(2, 5),
        delay: random(0, 12),
        duration: random(8, 20),
        drift: random(4, 10),
    }));

const ThemeBackgroundLayer: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const countRef = useRef(0);

    const { background, effects } = theme;

    useEffect(() => {
        const count = effects.particles.enabled ? Math.round(effects.particles.density / 4) : 0;
        if (count !== countRef.current) {
            countRef.current = count;
            setParticles(count > 0 ? buildParticles(count) : []);
        }
    }, [effects.particles.enabled, effects.particles.density]);

    const videoUrl = background.type === 'video' && background.video.data ? background.video.data : '';

    const showVideo = videoUrl !== '';
    const showParticles = effects.particles.enabled && particles.length > 0;

    if (!showVideo && !showParticles) return null;

    return (
        <>
            {showVideo && (
                <video
                    className='pg-theme-bg-video'
                    src={videoUrl}
                    poster={background.video.poster || undefined}
                    loop={background.video.loop}
                    muted={background.video.muted}
                    playsInline
                    autoPlay
                    style={{
                        opacity: background.video.opacity / 100,
                        objectPosition: background.video.objectPosition || 'center',
                        animationDuration: `${Math.max(1, background.video.speed)}s`,
                    }}
                />
            )}
            {showParticles && (
                <div className='pg-theme-fx-layer' aria-hidden='true'>
                    {particles.map((particle) => (
                        <span
                            key={particle.id}
                            className='pg-theme-fx-particle'
                            style={{
                                left: `${particle.left}%`,
                                width: particle.size,
                                height: particle.size,
                                background: 'var(--pg-accent-400)',
                                opacity: Math.max(0.12, Math.min(0.6, effects.particles.density / 100)),
                                animation: `pg-particle-float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                                ['--pg-particle-drift' as string]: `${particle.drift}px`,
                            }}
                        />
                    ))}
                </div>
            )}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes pg-particle-float {
                            0%   { transform: translateY(0) translateX(0); opacity: 0; }
                            12%  { opacity: 0.5; }
                            88%  { opacity: 0.35; }
                            100% { transform: translateY(-120vh) translateX(var(--pg-particle-drift)); opacity: 0; }
                        }
                    `,
                }}
            />
        </>
    );
};

export default ThemeBackgroundLayer;
