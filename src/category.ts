export const Category = {
    'Collectables': Symbol.for('Collectables'),
    'Electronics': Symbol.for('Electronics'),
    'Sportswear': Symbol.for('Sportswear'),
    'Unknown': Symbol.for('Unknown')
} as const;

export const getCategory = (sku: string) => {
    if (!sku || !sku.length) {
        throw new Error('Invalid sku provided');
    }

    if (sku.includes('CL')) {
        return Category.Collectables;
    } else if (sku.includes('EL')) {
        return Category.Electronics;
    } else if (sku.includes('SW')) {
        return Category.Sportswear;
    }

    return Category.Unknown;
}