export const formatPrice = (value) => {
    if (value === 0) return "0";
    if (!value) return "";
    let newValue = value
    if (typeof value !== "string") newValue = value.toString()
    const number = parseFloat(newValue.replace(/,/g, ""));
    return number.toLocaleString("vi-VN");
};

export const getPrice = (data) => {
    if (!data) return 0;
    if (data === 0) return 0;
    return new Intl.NumberFormat("vi-VN").format(data).replace(/,/g, '.');
};

export const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export const formatDateTime = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}