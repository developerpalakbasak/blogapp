import axios from "axios";

export default async function sitemap() {

 const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'


  try {

    const response = await axios.get(`${siteUrl}/api/blog`);
    const { blogs } = response.data

    // Generate dynamic URLs for each blog
    const blogSitemap = blogs.map((blog) => ({
      url: `${siteUrl}/${blog.slug}`,
      lastModified: new Date(blog.date).toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [
      {
        url: `${siteUrl}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },

      ...blogSitemap

    ];



  } catch (error) {
    console.log(error);

  }
}