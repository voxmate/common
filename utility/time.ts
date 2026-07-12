export function timeFromNow(timestamp: string | number): string {
    const then = new Date(parseFloat(timestamp as any)).getTime();
    const secs = Math.round((Date.now() - then) / 1000);
    const ago = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;
    if (secs < 45) return "a few seconds ago";
    if (secs < 90) return "a minute ago";
    const mins = Math.round(secs / 60);
    if (mins < 45) return ago(mins, "minute");
    const hours = Math.round(mins / 60);
    if (hours < 24) return ago(hours, "hour");
    const days = Math.round(hours / 24);
    if (days < 30) return ago(days, "day");
    const months = Math.round(days / 30);
    if (months < 12) return ago(months, "month");
    return ago(Math.round(months / 12), "year");
}
