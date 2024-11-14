import {
    format as timeagoFormat,
    register as timeagoRegister,
} from 'timeago.js';

timeagoRegister(
    'ko',
    (number, index) =>
        [
            ['방금', '곧'],
            ['%s초 전', '%s초 후'],
            ['1분 전', '1분 후'],
            ['%s분 전', '%s분 후'],
            ['1시간 전', '1시간 후'],
            ['%s시간 전', '%s시간 후'],
        ][index],
);

export function dateFormatter(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    const today = new Date();
    const isToday =
        parsedDate.getFullYear() === today.getFullYear() &&
        parsedDate.getMonth() === today.getMonth() &&
        parsedDate.getDate() === today.getDate();

    if (isToday) {
        return timeagoFormat(parsedDate, 'ko'); // 'ko' locale 사용
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
