
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

// Simple slideshow component fetching slides from Supabase "home_slides" table

interface Slide {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    order: number;
}

const Slideshow: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [current, setCurrent] = useState(0);
    const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            // Check if slideshow is enabled
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'slideshow_enabled')
                .single();

            const isSlideshowEnabled = settingsData ? settingsData.value === true : true;
            setIsEnabled(isSlideshowEnabled);

            if (isSlideshowEnabled) {
                const { data, error } = await supabase
                    .from('home_slides')
                    .select('*')
                    .order('order');
                if (!error && data) setSlides(data as Slide[]);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (isEnabled && slides.length > 0) {
            const timer = setInterval(() => {
                setCurrent((prev) => (slides.length ? (prev + 1) % slides.length : 0));
            }, 8000);
            return () => clearInterval(timer);
        }
    }, [slides, isEnabled]);

    if (isEnabled === false || !slides.length) return null;

    const slide = slides[current];
    if (!slide) return null;

    return (
        <section className="relative h-96 md:h-[32rem] overflow-hidden rounded-lg mb-12">
            <img
                src={slide.image_url}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-6 drop-shadow-md">{slide.subtitle}</p>
                {slide.button_text && slide.button_link && (
                    <a
                        href={slide.button_link}
                        className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
                    >
                        {slide.button_text}
                    </a>
                )}
            </div>
        </section>
    );
};

export default Slideshow;
