
// If the number ends in ".00", this will cut the numbers to the right of the zero for the sake of converting
// to a number. This is due to how Javascript is internally storing numbers. If ".00" should be preserved,
// it would have to remain as a string.
export const convertPriceToFloat = (price: string) => {
    const num = price.split("$")[1]
    return parseFloat(num)
}

export const formatImgString = (src: string) => {
    // Modifiying input isn't ideal here
    if(src.includes('?')){
        src = src.split('?')[0]
    }
    if(src.startsWith('//')){
        src = src.split('').slice(2).join('')
    }
    return src
}
