import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export default function SEO({ title, description, image, url }: SEOProps) {
    const siteTitle = "Cloud Nexus Platform";
    const fullTitle = `${title} | ${siteTitle}`;
    const defaultDescription = "Leader en solutions Cloud, Réseaux et Cybersécurité.";
    const siteUrl = window.location.origin;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <link rel="canonical" href={url || window.location.href} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || window.location.href} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            {image && <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url || window.location.href} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            {image && <meta name="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />}
        </Helmet>
    );
}
