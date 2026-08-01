import ProductDetailPage from "./ProductDetailPage"

type Props = {
    params: Promise<{ slug: string }>
}

const page = async ({ params }: Props) => {
    const { slug } = await params;
    return (
        <>
            <ProductDetailPage productId={slug} />
        </>
    )
}

export default page