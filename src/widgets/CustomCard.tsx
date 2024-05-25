import React from 'react';
import { Card as ShadCard, CardContent as ShadCardContent } from '@/shared/ui/card';
import './CustomCard.css';

const CustomCard = ({ imageSrc, caption, dimensions }) => (
    <div className="p-1 custom-card">
        <ShadCard className="relative overflow-hidden w-full h-full">
            <ShadCardContent className="flex items-center justify-center p-6 relative w-full h-full gradient-background">
                <div className="w-full text-center">
                    <div className="image-container">
                        <img src={imageSrc} alt={caption} className="image" />
                    </div>
                    <div className="mt-2 text-sm">{caption}</div>
                    <div className="text-xs text-gray-500">{dimensions}</div>
                </div>
                <div className="overlay absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300">
                    <span className="text-white">Create blank</span>
                    <span className="text-white text-sm mt-1">{dimensions}</span>
                </div>
            </ShadCardContent>
        </ShadCard>
    </div>
);

export default CustomCard;
