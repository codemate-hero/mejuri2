export function findProductVariant(product, variantId) {
  if (!product || variantId === undefined || variantId === null) {
    return null;
  }

  const normalizedVariantId = String(variantId);

  return (product.variants || []).find((candidate) => {
    if (!candidate) return false;

    return (
      String(candidate?._id) === normalizedVariantId ||
      String(candidate?.shopifyVariantId) === normalizedVariantId
    );
  }) || null;
}

