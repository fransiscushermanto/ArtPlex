export function formatSlashDate(date) {
    const temp = new Date(date);

    return `${temp.getDate().toString().length > 1 ? "" : 0}${temp.getDate()}/${
        temp.getMonth().toString().length > 1 ? "" : 0
    }${temp.getMonth()}/${temp.getFullYear()}`;
}
