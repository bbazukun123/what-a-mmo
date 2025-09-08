export function getRandomColor(seed: string) {
    const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (hash * 9301 + 49297) % 233280;
    const color = (random / 233280) * 0xffffff;
    return color;
}
