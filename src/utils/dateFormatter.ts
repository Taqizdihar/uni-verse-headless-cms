export function formatActivityDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate start of today and yesterday
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (targetDate.getTime() === today.getTime()) {
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours} jam lalu`;
    }
    
    if (targetDate.getTime() === yesterday.getTime()) {
        return 'Kemarin';
    }
    
    // Older than yesterday
    const d = date.getDate();
    const m = date.toLocaleString('id-ID', { month: 'long' });
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    
    return `${d} ${m} ${y}, ${h}:${min}`;
}
