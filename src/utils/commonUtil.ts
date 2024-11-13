import { format as timeagoFormat } from 'timeago.js';

export function dateFormatter(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();

    const isWithinOneMonth =
        now.getTime() - parsedDate.getTime() < ONE_MONTH_IN_MS;

    if (isWithinOneMonth) {
        return timeagoFormat(parsedDate, 'ko_KR');
    }

    return parsedDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function isObjEqual(
    obj1: Record<string, any>,
    obj2: Record<string, any>,
): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !isEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }

    return true;
}

function isObject(object: any): boolean {
    return object != null && typeof object === 'object';
}

const escapeMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#47;',
};

export function escapeSpecialChars(str: string): string {
    return str.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}

export function unescapeSpecialChars(str: string): string {
    return str.replace(/&amp;|&#47;|&lt;|&gt;|&quot;|&#39;/g, (entity) => {
        for (const [char, htmlEntity] of Object.entries(escapeMap)) {
            if (entity === htmlEntity) return char;
        }
        return entity;
    });
}
