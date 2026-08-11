export function generateColors(n) {
    const colors = [];

    const startHue = Math.random() * 360;

    for (let i = 0; i < n; i++) {
        const hue = (startHue + (360 / n) * i) % 360;
        colors.push(`hsl(${hue}, 60%, 60%)`);
    }

    return colors;
}