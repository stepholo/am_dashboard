import { cn } from "@/lib/utils";
import * as React from "react";

const TractorBackground = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    ({ className, ...props }, ref) => (
        <svg
            ref={ref}
            className={cn("w-full h-full", className)}
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="800" height="600" fill="#87CEEB" />
            <path d="M0 450 C 150 400, 250 500, 400 450 C 550 400, 650 500, 800 450 L 800 600 L 0 600 Z" fill="#6B8E23" />
            <path d="M0 500 C 100 480, 200 520, 300 500 C 400 480, 500 520, 600 500 C 700 480, 750 520, 800 500 L 800 600 L 0 600 Z" fill="#556B2F" />
            
            <circle cx="100" cy="100" r="40" fill="white" />
            <circle cx="120" cy="90" r="35" fill="#87CEEB" />

            <path d="M200 150 L 220 180 L 180 180 Z" fill="white" opacity="0.8"/>
            <path d="M250 120 L 280 160 L 220 160 Z" fill="white" opacity="0.7"/>
            <path d="M350 180 L 390 220 L 310 220 Z" fill="white" opacity="0.8"/>
            <path d="M450 140 L 500 190 L 400 190 Z" fill="white" opacity="0.7"/>
            <path d="M600 160 L 650 210 L 550 210 Z" fill="white" opacity="0.8"/>

            <path d="M0 600 L 800 600 L 800 520 L 0 520 Z" fill="#8B4513" />
            <path d="M0 520 L 800 520 L 800 515 L 0 515 Z" stroke="#5D2906" strokeWidth="2" />
            <path d="M0 535 L 800 535 L 800 530 L 0 530 Z" stroke="#5D2906" strokeWidth="2" />
            <path d="M0 550 L 800 550 L 800 545 L 0 545 Z" stroke="#5D2906" strokeWidth="2" />
            <path d="M0 565 L 800 565 L 800 560 L 0 560 Z" stroke="#5D2906" strokeWidth="2" />
            <path d="M0 580 L 800 580 L 800 575 L 0 575 Z" stroke="#5D2906" strokeWidth="2" />
            <path d="M0 595 L 800 595 L 800 590 L 0 590 Z" stroke="#5D2906" strokeWidth="2" />

            {/* Windmill */}
            <path d="M200 480 L 205 480 L 205 450 L 200 450 Z" fill="#A9A9A9" />
            <path d="M190 450 L 215 450 L 202.5 420 Z" fill="#A9A9A9" />
            <g transform="translate(202.5, 435) rotate(45)">
                <path d="M0 0 L 20 5 L 20 -5 Z" fill="white" stroke="grey" />
                <path d="M0 0 L -20 5 L -20 -5 Z" fill="white" stroke="grey" />
                <path d="M0 0 L 5 -20 L -5 -20 Z" fill="white" stroke="grey" />
                <path d="M0 0 L 5 20 L -5 20 Z" fill="white" stroke="grey" />
            </g>
            
            {/* Tractor */}
            <g transform="translate(550, 500)">
                <rect x="0" y="-40" width="80" height="30" fill="#E53935" />
                <rect x="10" y="-60" width="60" height="20" fill="#E53935" />
                <path d="M10 -60 L 0 -40 L 10 -40 Z" fill="#FF5252" />
                <rect x="20" y="-70" width="10" height="10" fill="#B71C1C" />
                <polygon points="15,-60 65,-60 75,-70 25,-70" fill="#64B5F6" />
                
                <circle cx="15" cy="0" r="18" fill="#333" />
                <circle cx="15" cy="0" r="10" fill="#555" />

                <circle cx="85" cy="0" r="30" fill="#333" />
                <circle cx="85" cy="0" r="18" fill="#555" />
                
                {/* Plough */}
                <path d="M100 -10 L 120 -10 L 120 -15 L 150 -15 L 150 -10 L 220 -10" stroke="black" strokeWidth="3" fill="none" />
                <path d="M130 -15 L 130 -5 L 125 0 Z" fill="grey" stroke="black" />
                <path d="M160 -15 L 160 -5 L 155 0 Z" fill="grey" stroke="black" />
                <path d="M190 -15 L 190 -5 L 185 0 Z" fill="grey" stroke="black" />
            </g>

        </svg>
    )
);
TractorBackground.displayName = "TractorBackground";
export default TractorBackground;
