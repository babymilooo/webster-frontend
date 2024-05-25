import React from 'react';
import {
    Carousel as ShadCarousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/shared/ui/carousel';
import CustomCard from './CustomCard';
import './Carousel.css';

const cards = [
    { imageSrc: '../src/public/carousel-logo.png', caption: 'Logo', dimensions: '500 x 500 px' },
    { imageSrc: '../src/public/carousel-whiteboard.png', caption: 'Whiteboard', dimensions: 'Unlimited' },
    { imageSrc: '../src/public/carousel-doc.png', caption: 'Doc', dimensions: 'Autosize' },
    { imageSrc: '../src/public/carousel-bookmark.png', caption: 'Bookmark', dimensions: '2 x 6 in' },
    { imageSrc: '../src/public/carousel-business-card.png', caption: 'Business Card', dimensions: '3.5 x 2 in' },
    { imageSrc: '../src/public/carousel-post.png', caption: 'Instagram Post', dimensions: '1080 x 1080 px' },
    { imageSrc: '../src/public/carousel-flyer.png', caption: 'Flyer A4', dimensions: '21 x 29.7 cm' },
    { imageSrc: '../src/public/carousel-postcard.png', caption: 'Postcard', dimensions: '148 x 105 mm' },
    { imageSrc: '../src/public/carousel-poster.png', caption: 'Posters', dimensions: '42 x 59.4 cm' },
    { imageSrc: '../src/public/carousel-cover-image.jpg', caption: 'Cover Image', dimensions: '2000 x 600 px' },
];

const Carousel: React.FC = () => {
    return (
        <div className="carousel-container">
            <ShadCarousel className="w-full relative">
                <CarouselContent className="flex">
                    {cards.map((card, index) => (
                        <CarouselItem key={index} className="carousel-item">
                            <CustomCard
                                imageSrc={card.imageSrc}
                                caption={card.caption}
                                dimensions={card.dimensions}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="carousel-arrow left-0" />
                <CarouselNext className="carousel-arrow right-0" />
            </ShadCarousel>
        </div>
    );
};

export default Carousel;
