const colorGroups = {
    red: [
        '#FF4B4B',
        '#FF5A36',
        '#FF6B35',
        '#F04438',
        '#E53935',
        '#FF7A59'
    ],

    yellow: [
        '#FFF176',
        '#FFD54F',
        '#FFC107',
        '#FFB300',
        '#D9A441',
        '#B8893C'
    ],

    green: [
        '#A7F3D0',
        '#6EE7B7',
        '#34D399',
        '#10B981',
        '#14B8A6',
        '#2DD4BF'
    ],

    blue: [
        '#93C5FD',
        '#60A5FA',
        '#3B82F6',
        '#2563EB',
        '#1D4ED8',
        '#38BDF8'
    ],

    purple: [
        '#DDD6FE',
        '#C4B5FD',
        '#A78BFA',
        '#8B5CF6',
        '#7C3AED',
        '#6D28D9'
    ],

    pink: [
        '#FBCFE8',
        '#F9A8D4',
        '#F472B6',
        '#EC4899',
        '#DB2777',
        '#E11D48'
    ]
};

function getRandomColor() {
    const colors = Object.keys(colorGroups);
    const color = colors[Math.floor(Math.random() * colors.length)];

    const shades = colorGroups[color];
    const shade = shades[Math.floor(Math.random() * shades.length)];

    return {
        color,
        shade
    }
}

export function getUniqueColor(milestones) {
    const lastThree = milestones.slice(-3);
    let isSameColor = true;
    let colorSet;

    while (isSameColor) {
        colorSet = getRandomColor();

        isSameColor = lastThree.some(milestone => {
            return milestone.colorSet.color === colorSet.color;
        });
    }

    return colorSet;
}