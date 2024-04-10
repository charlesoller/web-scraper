export const convertPriceToFloat = (price: string) => {
    const num = price.split("$")[1]
    return parseFloat(num)
}
