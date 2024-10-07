import BlogLayout from '@/components/blog/BlogLayout';

export default function BlogRootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            {modal}
            <BlogLayout>{children}</BlogLayout>
        </>
    );
}
