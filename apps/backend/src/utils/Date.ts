export class DateUtils {
    year: number;
    month: number;
    day: number;

    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    /**
     * Convert date to int
     * 将日期转换为整数
     *
     * Example:
     *   self.day = 3
     *   self.month = 5
     *   self.year = 2023
     *   to: 20230503
     */
    toInt() {
        return this.year * 10000 + this.month * 100 + this.day;
    }

    /**
     * Convert date to string
     * 将日期转换为字符串
     *
     * Example:
     *  self.day = 3
     *  self.month = 5
     *  self.year = 2023
     *  to: 03/05/2023
     */
    toString() {
        return `${this.day}/${this.month}/${this.year}`;
    }

    /**
     * 将当前日期转换为儒略日
     */
    toGregorianDays() {
        const a = Math.floor((14 - this.month) / 12);
        const m = this.month + 12 * a - 3;
        const y = this.year + 4800 - a;
        return (
            this.day +
            Math.floor((153 * m + 2) / 5) +
            y * 365 +
            Math.floor(y / 4) -
            Math.floor(y / 100) +
            Math.floor(y / 400) -
            2331205
        );
    }
    /**
     * Convert days to date
     * 将天数转换为日期
     */
    fromGregorianDays(days) {
        let a, b, c, d, e, m;
        a = days + 2331205;
        b = Math.floor((4 * a + 3) / 146097);
        c = Math.floor((-b * 146097) / 4 + a);
        d = Math.floor((4 * c + 3) / 1461);
        e = Math.floor((-1461 * d) / 4 + c);
        m = Math.floor((5 * e + 2) / 153);

        this.day = Math.ceil(-(153 * m + 2) / 5) + e + 1;
        this.month = Math.ceil(-m / 10) * 12 + m + 3;
        this.year = b * 100 + d - 4800 + Math.floor(m / 10);
    }
}
